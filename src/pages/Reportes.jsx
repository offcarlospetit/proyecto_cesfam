// src/pages/Reportes.jsx
import { useEffect, useMemo, useState } from "react";
import { listInventoryRows, findByCodigo } from "../utils/inventoryApi";
import { listReservas } from "../utils/reservasApi";
import { listEntregasAllSafe } from "../utils/entregasApi";

const CRITICO_THRESHOLD = 10;      // si no tienes campo "critico" en inventario, usamos umbral
const NOTIF_DAYS_LIMIT = 3;        // para KPI de “notificada ≤ 3 días”

const diasEntre = (h, f) =>
  Math.ceil((new Date(f) - new Date(h)) / (1000 * 60 * 60 * 24));

function pillClass(kind) {
  switch (kind) {
    case "OK": return "pill";
    case "BAJO": return "pill pill-orange";
    case "SIN STOCK": return "pill pill-red";
    default: return "pill";
  }
}

export default function Reportes() {
  const hoy = new Date().toISOString().slice(0, 10);

  const [loading, setLoading] = useState(true);
  const [invRows, setInvRows] = useState([]);     // /inventory/rows
  const [reservas, setReservas] = useState([]);   // /reservas
  const [entregas, setEntregas] = useState([]);   // /entregas (si existe)

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [inv, resv, ent] = await Promise.all([
        listInventoryRows(),
        listReservas(),           // sin filtros: todas
        listEntregasAllSafe(),    // si no existe, []
      ]);
      setInvRows(inv || []);
      setReservas(resv || []);
      setEntregas(ent || []);
      setLoading(false);
    })();
  }, []);

  // KPI: 
  // - prox: reservas "notificada" con updatedAt/createdAt en los últimos 3 días
  // - atra: reservas "notificada" con antigüedad > 3 días (no confirmadas)
  // - resv: reservas en “pendiente” (espera de stock / sin avisar)
  // - crit: items de inventario con disponible == 0 o <= CRITICO_THRESHOLD
  const kpi = useMemo(() => {
    let prox = 0, atra = 0, resv = 0, crit = 0;

    const now = new Date();
    const daysDiff = (d) =>
      Math.ceil((now - new Date(d)) / (1000 * 60 * 60 * 24));

    reservas.forEach(r => {
      const state = r.estado; // pendiente | notificada | confirmada | cancelada
      const refDate = r.updatedAt || r.createdAt;
      if (state === "pendiente") resv++;
      if (state === "notificada" && refDate) {
        const dd = daysDiff(refDate);
        if (dd <= NOTIF_DAYS_LIMIT) prox++;
        else atra++;
      }
    });

    invRows.forEach(item => {
      const disp = Number(item.disponible || 0);
      if (disp === 0 || disp <= CRITICO_THRESHOLD) crit++;
    });

    return { prox, atra, resv, crit };
  }, [reservas, invRows]);

  // Detalle “próximos / atrasados” basado en notificaciones de reserva (mientras
  // el backend no exponga proximoRetiro de prescripciones).
  const detalle = useMemo(() => {
    // Mostramos solo notificados (pendientes de retiro), partiendo de lo más reciente
    const arr = reservas
      .filter(r => r.estado === "notificada")
      .slice()
      .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
      .map(r => {
        const when = (r.updatedAt || r.createdAt || "").slice(0, 10);
        const d = diasEntre(when, hoy) * -1; // invertimos para “días restantes” (visual)
        // badge por cercanía: <=3 amarillo, pasado rojo, resto normal
        const cls =
          d < 0 ? "pill pill-red" :
            d === 0 ? "pill pill-yellow" :
              d <= 3 ? "pill pill-orange" : "pill";

        // Buscar descripción del medicamento por codigo
        const info = findByCodigo(invRows, r.codigo);
        const medDesc = info?.descripcion || r.codigo;

        return {
          rut: r.rut,
          paciente: r.nombre || r.rut,
          medicamento: medDesc,
          proximoRetiro: when, // aquí usamos la fecha de notificación como "objetivo"
          dias: d,
          cls,
        };
      });

    return arr;
  }, [reservas, invRows, hoy]);

  // Tabla de stock (estado por umbral local)
  const stockRows = useMemo(() => {
    return invRows.map(s => {
      const disp = Number(s.disponible || 0);
      const label =
        disp === 0 ? "SIN STOCK" :
          disp <= CRITICO_THRESHOLD ? "BAJO" : "OK";
      return {
        ...s,
        estadoLabel: label,
        cls: pillClass(label),
      };
    });
  }, [invRows]);

  // Historial de retiros (si tu API expone GET /entregas)
  // Espera campos: rut, codigo, cantidad, createdAt (o fecha)
  const historial = useMemo(() => {
    if (!entregas.length) return [];
    const byCodigo = new Map(invRows.map(r => [r.codigo, r]));
    return entregas
      .slice()
      .sort((a, b) => new Date(b.createdAt || b.fecha) - new Date(a.createdAt || a.fecha))
      .map(e => ({
        rut: e.rut,
        paciente: e.quienRetira || e.rut,
        medicamento: byCodigo.get(e.codigo)?.descripcion || e.codigo,
        fecha: (e.createdAt || e.fecha || "").slice(0, 10),
        cantidad: e.cantidad,
      }));
  }, [entregas, invRows]);

  return (
    <div className="main-container" id="reportes-container">
      <section className="card">
        <h2>Reportes Transversales</h2>
        <div className="kpi-grid">
          <div className="kpi"><h3>Retiros ≤3 días</h3><div className="kpi-num">{kpi.prox}</div></div>
          <div className="kpi"><h3>Retiros atrasados</h3><div className="kpi-num">{kpi.atra}</div></div>
          <div className="kpi"><h3>Reservas en espera</h3><div className="kpi-num">{kpi.resv}</div></div>
          <div className="kpi"><h3>Items bajo crítico</h3><div className="kpi-num">{kpi.crit}</div></div>
        </div>
        {loading && <div className="text-sm text-slate-500 mt-2">Cargando datos…</div>}
      </section>

      <section className="card">
        <h3>Detalle de retiros (basado en notificaciones)</h3>
        <table className="tabla" id="tabla-detalle">
          <thead>
            <tr><th>RUT</th><th>Paciente</th><th>Medicamento</th><th>Próx. retiro</th><th>Días</th></tr>
          </thead>
          <tbody>
            {detalle.map((r, i) => (
              <tr key={i}>
                <td>{r.rut}</td>
                <td>{r.paciente}</td>
                <td>{r.medicamento}</td>
                <td>{r.proximoRetiro || "—"}</td>
                <td><span className={r.cls}>{r.dias}</span></td>
              </tr>
            ))}
            {!detalle.length && (
              <tr><td colSpan={5} className="text-center text-slate-500">Sin registros</td></tr>
            )}
          </tbody>
        </table>
        <small className="text-xs text-slate-500">
          Nota: si deseas un “próximo retiro” real desde prescripciones, expongamos <code>proximoRetiro</code> en backend (CU6–CU8 extendido).
        </small>
      </section>

      <section className="card">
        <h3>Stock</h3>
        <table className="tabla" id="tabla-stock">
          <thead>
            <tr><th>Código</th><th>Descripción</th><th>Disp.</th><th>Reserv.</th><th>Físico</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {stockRows.map((s, i) => (
              <tr key={i}>
                <td>{s.codigo}</td>
                <td>{s.descripcion}</td>
                <td>{s.disponible ?? 0}</td>
                <td>{s.reservado ?? 0}</td>
                <td>{s.fisico ?? 0}</td>
                <td><span className={s.cls}>{s.estadoLabel}</span></td>
              </tr>
            ))}
            {!stockRows.length && (
              <tr><td colSpan={6} className="text-center text-slate-500">Sin datos de inventario</td></tr>
            )}
          </tbody>
        </table>
        <small className="text-xs text-slate-500">
          Umbral crítico usado: {CRITICO_THRESHOLD} (ajústalo en <code>CRITICO_THRESHOLD</code>).
        </small>
      </section>

      <section className="card">
        <h3>Historial de Retiros</h3>
        <table className="tabla" id="tabla-historial">
          <thead>
            <tr><th>RUT</th><th>Paciente</th><th>Medicamento</th><th>Fecha retiro</th><th>Cantidad</th></tr>
          </thead>
          <tbody>
            {historial.map((r, i) => (
              <tr key={i}>
                <td>{r.rut}</td>
                <td>{r.paciente}</td>
                <td>{r.medicamento}</td>
                <td>{r.fecha || "—"}</td>
                <td>{r.cantidad}</td>
              </tr>
            ))}
            {!historial.length && (
              <tr><td colSpan={5} className="text-center text-slate-500">
                Sin entregas o endpoint <code>GET /entregas</code> no disponible.
              </td></tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
