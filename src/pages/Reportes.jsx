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

export default function Reportes(){
  const hoy = new Date().toISOString().slice(0,10);
  const activos = prescripciones.filter(p=>p.estado==="ACTIVA" && p.proximoRetiro);
  const kpi = {
    prox: activos.filter(p=>{const d=diasEntre(hoy,p.proximoRetiro); return d>=0 && d<=3;}).length,
    atra: activos.filter(p=>diasEntre(hoy,p.proximoRetiro)<0).length,
    resv: 0,
    crit: stock.filter(s=>s.disponible < s.critico).length
  };

  const detalle = activos.map(p=>{
    const d = diasEntre(hoy,p.proximoRetiro);
    const cls = d<0 ? "pill pill-red" : d===0 ? "pill pill-yellow" : d<=3 ? "pill pill-orange" : "pill";
    return {...p, paciente:nombrePaciente(p.rut), dias:d, cls};
  });

  const stockRows = stock.map(s=>{
    const cls = s.disponible===0 ? "pill pill-red" : (s.disponible < s.critico ? "pill pill-orange" : "pill");
    const label = s.disponible===0 ? "SIN STOCK" : (s.disponible < s.critico ? "BAJO" : "OK");
    return {...s, cls, label};
  });

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
      </section>

      <section className="card">
        <h3>Detalle de retiros</h3>
        <table className="tabla" id="tabla-detalle">
          <thead><tr><th>RUT</th><th>Paciente</th><th>Medicamento</th><th>Próx. retiro</th><th>Días</th></tr></thead>
          <tbody>
            {detalle.map((r,i)=>(
              <tr key={i}>
                <td>{r.rut}</td><td>{r.paciente}</td><td>{r.medicamento}</td><td>{r.proximoRetiro}</td>
                <td><span className={r.cls}>{r.dias}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h3>Stock</h3>
        <table className="tabla" id="tabla-stock">
          <thead><tr><th>Medicamento</th><th>Disp.</th><th>Reserv.</th><th>Crítico</th><th>Estado</th></tr></thead>
          <tbody>
            {stockRows.map((s,i)=>(
              <tr key={i}>
                <td>{s.medicamento}</td><td>{s.disponible}</td><td>{s.reservado}</td><td>{s.critico}</td>
                <td><span className={s.cls}>{s.label}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h3>Historial de Retiros</h3>
        <table className="tabla" id="tabla-historial">
          <thead><tr><th>RUT</th><th>Paciente</th><th>Medicamento</th><th>Fecha retiro</th><th>Cantidad</th></tr></thead>
          <tbody>
            {retirosRealizados.map((r,i)=>(
              <tr key={i}>
                <td>{r.rut}</td><td>{nombrePaciente(r.rut)}</td><td>{r.medicamento}</td><td>{r.fecha}</td><td>{r.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
