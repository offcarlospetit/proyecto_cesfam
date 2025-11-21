// src/pages/Reservas.jsx
import { useEffect, useMemo, useState } from "react";
import { listReservas, createReserva, setEstadoReserva, confirmarReserva } from "../utils/reservasApi";
import { listInventoryRows, hayStock } from "../utils/inventoryApi";

// Mapeo visual (UI) según estado real de backend + disponibilidad
function tone(uiEstado) {
  switch (uiEstado) {
    case "DISPONIBLE": return "pill";
    case "AVISADO": return "pill pill-yellow";
    case "RETIRADA": return "pill pill-green";
    case "CADUCADA": return "pill pill-red";
    default: return "pill pill-orange"; // ESPERA_STOCK
  }
}

// Derivar estado "UI" a partir del estado backend y disponibilidad
// - backend: pendiente | notificada | confirmada | cancelada
// - UI: ESPERA_STOCK | DISPONIBLE | AVISADO | RETIRADA | CADUCADA
function estadoUI(reserva, invRows) {
  if (reserva.estado === "confirmada") return "RETIRADA";
  if (reserva.estado === "cancelada") return "CADUCADA";
  if (reserva.estado === "notificada") return "AVISADO";
  // pendiente → chequear si hay stock suficiente
  const disponible = hayStock(invRows, reserva.codigo, reserva.cantidad);
  return disponible ? "DISPONIBLE" : "ESPERA_STOCK";
}

export default function Reservas() {
  // form
  const [rut, setRut] = useState("");
  const [codigo, setCodigo] = useState("");      // ahora trabajamos con CODIGO
  const [cantidad, setCantidad] = useState(30);
  const [canal, setCanal] = useState("");        // se usa para UI; backend no lo necesita
  const [consent, setConsent] = useState("");

  // data
  const [invRows, setInvRows] = useState([]);    // lista de inventario para el select
  const [rows, setRows] = useState([]);          // reservas desde API
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    const [inventario, reservas] = await Promise.all([
      listInventoryRows(),
      listReservas(), // puedes filtrar por rut/estado
    ]);
    setInvRows(inventario || []);
    setRows(reservas || []);
    setLoading(false);
  }

  useEffect(() => {
    void refresh();
  }, []);

  const filas = useMemo(() => {
    // Derivamos campos de presentación:
    // - paciente: si la API no lo trae, mostramos rut
    // - medicamento: tomamos la descripción desde inventario por código
    // - estado UI: a partir de estado backend + stock
    const byCodigo = new Map(invRows.map(r => [r.codigo, r]));
    return rows
      .slice()
      .sort((a, b) => new Date(b.createdAt || b.fechaReserva || 0) - new Date(a.createdAt || a.fechaReserva || 0))
      .map(r => {
        const info = byCodigo.get(r.codigo);
        const medDesc = info?.descripcion || r.codigo;
        const ui = estadoUI(r, invRows);
        return {
          ...r,
          paciente: r.nombre || r.rut,        // fallback si no hay nombre
          medicamentoDesc: medDesc,
          uiEstado: ui,
          cls: tone(ui),
          fechaReserva: (r.createdAt || r.fechaReserva || "").slice(0, 10),
        };
      });
  }, [rows, invRows]);

  async function registrar(e) {
    e.preventDefault();
    if (!rut || !codigo || !canal || consent !== "SI") {
      alert("Completa RUT, Medicamento, Canal y Consentimiento.");
      return;
    }
    try {
      await createReserva({ rut, codigo, cantidad });
      // Nota: Si deseas registrar notificación inmediata, puedes llamar:
      // await apiFetch("/notificaciones", { method:"POST", body:{ tipo:"aviso", destinatario: rut, mensaje: "Se registró su reserva" }})
      setCantidad(30); setCanal(""); setConsent("");
      await refresh();
      alert("Reserva registrada.");
    } catch (err) {
      alert(err.message || "Error creando reserva");
    }
  }

  async function onAvisarLlegada(id) {
    try {
      await setEstadoReserva(id, "notificada");
      await refresh();
      alert("Aviso de llegada marcado.");
    } catch (e) {
      alert(e.message || "Error al avisar");
    }
  }

  async function onMarcarRetirada(id) {
    console.log("Marcar retirada de reserva", id);
    try {
      await confirmarReserva(id);
      await refresh();
      alert("Retiro registrado.");
    } catch (e) {
      alert(e.message || "Error al confirmar retiro");
    }
  }

  return (
    <main className="main-container">
      <section className="card">
        <h2>Reservas de Medicamentos (CU10, CU11, CU12)</h2>

        <form onSubmit={registrar} noValidate>
          <div className="form-grid">
            <div className="form-field">
              <label>RUT Paciente</label>
              <input className="input" value={rut}
                onChange={e => setRut(e.target.value)}
                placeholder="12345678-9" required />
            </div>

            <div className="form-field">
              <label>Medicamento</label>
              <select className="select" value={codigo}
                onChange={e => setCodigo(e.target.value)} required>
                <option value="">Seleccione…</option>
                {invRows.map(it => (
                  <option key={it.codigo} value={it.codigo}>
                    {it.descripcion} ({it.codigo}) — Disp: {it.disponible ?? 0}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Cantidad</label>
              <input className="input" type="number" min="1"
                value={cantidad} onChange={e => setCantidad(+e.target.value || 1)} />
            </div>

            <div className="form-field">
              <label>Canal de aviso</label>
              <select className="select" value={canal} onChange={e => setCanal(e.target.value)} required>
                <option value="">Seleccione…</option>
                <option value="EMAIL">Correo</option>
                <option value="SMS">SMS</option>
              </select>
            </div>

            <div className="form-field">
              <label>Consentimiento</label>
              <select className="select" value={consent} onChange={e => setConsent(e.target.value)} required>
                <option value="">Seleccione…</option>
                <option value="SI">Sí (contacto autorizado)</option>
                <option value="NO">No</option>
              </select>
              <small className="hint">Necesario para aviso por correo/SMS.</small>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-opcion" type="submit" disabled={loading}>Registrar reserva</button>
          </div>
        </form>
      </section>

      <section className="card">
        <h3>Reservas registradas</h3>

        {loading ? (
          <div className="text-sm text-slate-500">Cargando…</div>
        ) : (
          <table className="tabla">
            <thead>
              <tr>
                <th>RUT</th><th>Paciente</th><th>Medicamento</th><th>Cant.</th>
                <th>Fecha</th><th>Estado</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filas.map(r => (
                <tr key={r._id || r.id}>
                  <td>{r.rut}</td>
                  <td>{r.paciente}</td>
                  <td>{r.medicamentoDesc}</td>
                  <td>{r.cantidad}</td>
                  <td>{r.fechaReserva || "—"}</td>
                  <td><span className={r.cls}>{r.uiEstado}</span></td>
                  <td>
                    <button className="btn-enviar"
                      disabled={r.uiEstado !== "DISPONIBLE"}
                      onClick={() => onAvisarLlegada(r._id)}>
                      Avisar llegada
                    </button>
                    {" "}
                    <button className="btn-enviar"
                      disabled={!(r.uiEstado === "AVISADO" || r.uiEstado === "DISPONIBLE")}
                      onClick={() => onMarcarRetirada(r._id)}>
                      Marcar retirada
                    </button>
                  </td>
                </tr>
              ))}
              {!filas.length && (
                <tr><td colSpan={7} className="text-center text-slate-500">Sin reservas</td></tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
