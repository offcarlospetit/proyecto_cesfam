// src/pages/Reservas.jsx
import { useMemo, useState } from "react";
import {
  reservas, stock, nombrePaciente,
  crearReserva, marcarDisponibleReservas,
  avisarLlegada, marcarRetirada
} from "../data-demo";

function tone(estado){
  switch(estado){
    case "DISPONIBLE": return "pill";
    case "AVISADO":    return "pill pill-yellow";
    case "RETIRADA":   return "pill pill-green";
    case "CADUCADA":   return "pill pill-red";
    default:           return "pill pill-orange"; // ESPERA_STOCK
  }
}

export default function Reservas(){
  // form state
  const [rut, setRut] = useState("");
  const [medicamento, setMedicamento] = useState("");
  const [cantidad, setCantidad] = useState(30);
  const [canal, setCanal] = useState("");
  const [consent, setConsent] = useState("");

  // recalcula DISPONIBLE si hay stock ahora
  const disponiblesNuevas = marcarDisponibleReservas();

  const filas = useMemo(()=>{
    return reservas
      .slice()
      .sort((a,b)=> b.id - a.id)
      .map(r => ({
        ...r,
        paciente: nombrePaciente(r.rut),
        cls: tone(r.estado)
      }));
  }, [reservas, disponiblesNuevas]); // eslint-disable-line

  function registrar(e){
    e.preventDefault();
    if (!rut || !medicamento || !canal || consent!=="SI") {
      alert("Completa todos los campos y consentimiento.");
      return;
    }
    crearReserva({ rut, medicamento, cantidad, canal, consentimiento: true });
    // limpiar “medicamento” y cantidad, conserva RUT por flujo real
    setMedicamento(""); setCantidad(30); setCanal(""); setConsent("");
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
                     onChange={e=>setRut(e.target.value)}
                     placeholder="12345678-9" required />
            </div>

            <div className="form-field">
              <label>Medicamento</label>
              <select className="select" value={medicamento}
                      onChange={e=>setMedicamento(e.target.value)} required>
                <option value="">Seleccione…</option>
                {stock.map(s => <option key={s.medicamento} value={s.medicamento}>{s.medicamento}</option>)}
              </select>
            </div>

            <div className="form-field">
              <label>Cantidad</label>
              <input className="input" type="number" min="1"
                     value={cantidad} onChange={e=>setCantidad(+e.target.value)} />
            </div>

            <div className="form-field">
              <label>Canal de aviso</label>
              <select className="select" value={canal} onChange={e=>setCanal(e.target.value)} required>
                <option value="">Seleccione…</option>
                <option value="EMAIL">Correo</option>
                <option value="SMS">SMS</option>
              </select>
            </div>

            <div className="form-field">
              <label>Consentimiento</label>
              <select className="select" value={consent} onChange={e=>setConsent(e.target.value)} required>
                <option value="">Seleccione…</option>
                <option value="SI">Sí (contacto autorizado)</option>
                <option value="NO">No</option>
              </select>
              <small className="hint">Necesario para aviso por correo/SMS.</small>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-opcion" type="submit">Registrar reserva</button>
          </div>
        </form>
      </section>

      <section className="card">
        <h3>Reservas registradas</h3>

        <table className="tabla">
          <thead>
            <tr>
              <th>RUT</th><th>Paciente</th><th>Medicamento</th><th>Cant.</th>
              <th>Fecha</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filas.map(r => (
              <tr key={r.id}>
                <td>{r.rut}</td>
                <td>{r.paciente}</td>
                <td>{r.medicamento}</td>
                <td>{r.cantidad}</td>
                <td>{r.fechaReserva}</td>
                <td><span className={r.cls}>{r.estado}</span></td>
                <td>
                  <button className="btn-enviar"
                          disabled={r.estado!=="DISPONIBLE"}
                          onClick={()=>{ if(avisarLlegada(r.id)) alert("Aviso enviado."); }}>
                    Avisar llegada
                  </button>
                  {" "}
                  <button className="btn-opcion"
                          disabled={!(r.estado==="AVISADO" || r.estado==="DISPONIBLE")}
                          onClick={()=>{ if(marcarRetirada(r.id)) alert("Retiro registrado."); }}>
                    Marcar retirada
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
