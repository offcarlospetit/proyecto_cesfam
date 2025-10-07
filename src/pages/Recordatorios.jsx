import { useEffect, useMemo, useState } from "react";

import {
  pacientes,
  prescripciones,
  stock,
  reservas,
  retirosRealizados,
  hayStockPara,
  marcarDisponibleReservas
} from "../data-demo";
const nombrePaciente = rut => pacientes.find(p=>p.rut===rut)?.nombre ?? "—";
const diasEntre = (h,f)=> Math.ceil((new Date(f)-new Date(h))/(1000*60*60*24));

export default function Recordatorios(){
  const [rut,setRut] = useState("");
  const [diasAviso,setDiasAviso] = useState(3);
  const [canal,setCanal] = useState("");
  const [consent,setConsent] = useState("");

  useEffect(()=>{
    const cfg = JSON.parse(localStorage.getItem("cfgRecordatorios")||"{}");
    if(cfg[rut]){ setDiasAviso(cfg[rut].diasAviso); setCanal(cfg[rut].canal); }
  },[rut]);

  const filas = useMemo(()=>{
    const hoy = new Date().toISOString().slice(0,10);
    return prescripciones.filter(p=>p.estado==="ACTIVA" && p.proximoRetiro).map(p=>{
      const d = diasEntre(hoy,p.proximoRetiro);
      const tone = d<0 ? "pill pill-red" : d===0 ? "pill pill-yellow" : d<=3 ? "pill pill-orange" : "pill";
      return {...p, paciente:nombrePaciente(p.rut), dias:d, cls:tone};
    });
  },[]);

  function programar(e){
    e.preventDefault();
    if(!rut || !diasAviso || !canal || consent!=="SI") return alert("Completa datos y consentimiento.");
    const cfg = JSON.parse(localStorage.getItem("cfgRecordatorios")||"{}");
    cfg[rut] = { diasAviso, canal, fechaAlta:new Date().toISOString() };
    localStorage.setItem("cfgRecordatorios", JSON.stringify(cfg));
    alert(`Recordatorio para ${rut} programado (${diasAviso} días antes, vía ${canal}).`);
  }

  return (
    <div className="main-container" id="recordatorios-container">
      <section className="card">
        <h2>Programar Recordatorios de Retiro (CU13)</h2>
        <form onSubmit={programar} noValidate>
          <div className="form-grid">
            <div className="form-field">
              <label>RUT Paciente</label>
              <input
                className="input"
                value={rut}
                onChange={e=>setRut(e.target.value)}
                placeholder="12345678-9"
                pattern="^\d{7,8}-[0-9Kk]$"
                required
              />
              <small className="hint">Formato sin puntos, con guión.</small>
            </div>

            <div className="form-field">
              <label>Avisar antes (días)</label>
              <input
                type="number"
                min="1"
                className="input"
                value={diasAviso}
                onChange={e=>setDiasAviso(+e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label>Canal</label>
              <select
                className="select"
                value={canal}
                onChange={e=>setCanal(e.target.value)}
                required
              >
                <option value="">Seleccione…</option>
                <option value="EMAIL">Correo</option>
                <option value="SMS">SMS</option>
              </select>
            </div>

            <div className="form-field">
              <label>Consentimiento contacto</label>
              <select
                className="select"
                value={consent}
                onChange={e=>setConsent(e.target.value)}
                required
              >
                <option value="">Seleccione…</option>
                <option value="SI">Sí</option>
                <option value="NO">No</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-opcion">Programar</button>
          </div>
        </form>
      </section>

      <section className="card">
        <h3>Próximos retiros (simulado)</h3>
        <table className="tabla">
          <thead><tr><th>RUT</th><th>Paciente</th><th>Medicamento</th><th>Próx. retiro</th><th>Días</th></tr></thead>
          <tbody>
            {filas.map((r,i)=>(
              <tr key={i}>
                <td>{r.rut}</td><td>{r.paciente}</td><td>{r.medicamento}</td><td>{r.proximoRetiro}</td>
                <td><span className={r.cls}>{r.dias}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
