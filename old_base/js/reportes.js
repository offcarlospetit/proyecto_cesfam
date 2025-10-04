// js/reportes.js
import { pacientes, prescripciones, reservas, stock, retirosRealizados, marcarDisponibleReservas} from "./data-demo.js";

const $ = (q) => document.querySelector(q);

function nombrePaciente(rut){
  return pacientes.find(p=>p.rut===rut)?.nombre ?? "—";
}
function diasEntre(hoyISO, fechaISO){
  const d1 = new Date(hoyISO), d2 = new Date(fechaISO);
  return Math.ceil((d2 - d1) / (1000*60*60*24));
}

function refrescarKPIs(){
  const hoy = new Date().toISOString().slice(0,10);
  const activos = prescripciones.filter(p=>p.estado==="ACTIVA" && p.proximoRetiro);
  const prox = activos.filter(p=>{ const d = diasEntre(hoy,p.proximoRetiro); return d>=0 && d<=3; }).length;
  const atra = activos.filter(p=>diasEntre(hoy,p.proximoRetiro)<0).length;
  const resv = reservas.filter(r=>r.estado==="ESPERA_STOCK").length;
  const crit = stock.filter(s=>s.disponible < s.critico).length;

  $("#kpi-prox").textContent = prox;
  $("#kpi-atra").textContent = atra;
  $("#kpi-resv").textContent = resv;
  $("#kpi-crit").textContent = crit;
}

function pintarDetalle(filtro=""){
  const hoy = new Date().toISOString().slice(0,10);
  const cuerpo = document.getElementById("tb-detalle");
  const datos = prescripciones
    .filter(p=>p.estado==="ACTIVA" && p.proximoRetiro)
    .filter(p=>{
      const txt = (p.rut + " " + p.medicamento).toLowerCase();
      return txt.includes(filtro.toLowerCase());
    })
    .map(p=>{
      const d = diasEntre(hoy,p.proximoRetiro);
      const clase = d < 0 ? "pill pill-red" : d === 0 ? "pill pill-yellow" : d <= 3 ? "pill pill-orange" : "pill";
      return `<tr>
        <td>${p.rut}</td><td>${nombrePaciente(p.rut)}</td><td>${p.medicamento}</td>
        <td>${p.proximoRetiro}</td><td><span class="${clase}">${d}</span></td>
      </tr>`;
    }).join("");
  cuerpo.innerHTML = datos || `<tr><td colspan="5">Sin resultados</td></tr>`;
}

function pintarStock(){
  const cuerpo = document.getElementById("tb-stock");
  cuerpo.innerHTML = stock.map(s=>{
    const estado = s.disponible === 0 ? "SIN STOCK" :
                   s.disponible < s.critico ? "BAJO CRÍTICO" : "OK";
    const clase = estado==="OK" ? "pill" : estado==="BAJO CRÍTICO" ? "pill pill-orange" : "pill pill-red";
    return `<tr>
      <td>${s.medicamento}</td>
      <td>${s.disponible}</td>
      <td>${s.reservado}</td>
      <td>${s.critico}</td>
      <td><span class="${clase}">${estado}</span></td>
    </tr>`;
  }).join("");
}

function pintarHistorial(){
  const cuerpo = document.getElementById("tb-historial");
  cuerpo.innerHTML = retirosRealizados
    .map(r => `
      <tr>
        <td>${r.rut}</td>
        <td>${nombrePaciente(r.rut)}</td>
        <td>${r.medicamento}</td>
        <td>${r.fecha}</td>
        <td>${r.cantidad}</td>
      </tr>
    `).join("");
}

document.getElementById("filtro").addEventListener("input", (e)=> {
  pintarDetalle(e.target.value);
});

function pintarReservas(){
  marcarDisponibleReservas(); // CU11
  const cuerpo = document.getElementById("tb-reservas-reportes");
  cuerpo.innerHTML = reservas.map(r=>{
    const cls = r.estado === "DISPONIBLE" ? "pill" :
                r.estado === "AVISADO"    ? "pill pill-yellow" :
                r.estado === "RETIRADA"   ? "pill pill-green" :
                r.estado === "CADUCADA"   ? "pill pill-red" : "pill pill-orange";
    const canAvisar = r.estado === "DISPONIBLE";
    return `<tr>
      <td>${r.rut}</td>
      <td>${(pacientes.find(p=>p.rut===r.rut)?.nombre)||"—"}</td>
      <td>${r.medicamento}</td>
      <td>${r.cantidad}</td>
      <td>${r.fechaReserva}</td>
      <td><span class="${cls}">${r.estado}</span></td>
      <td>
        <button class="btn-enviar" data-id="${r.id}" ${canAvisar?'':'disabled'}>Avisar</button>
      </td>
    </tr>`;
  }).join("");
}

document.addEventListener("click",(e)=>{
  const btn = e.target.closest("#tabla-reservas-reportes .btn-enviar");
  if(!btn) return;
  const id = Number(btn.dataset.id);
  const r = reservas.find(x=>x.id===id);
  if(!r) return;
  if(r.estado==="DISPONIBLE"){
    r.estado = "AVISADO"; // CU12
    alert(`Aviso enviado a ${r.rut} por ${r.medicamento}.`); // simple
    pintarReservas();
  }
});

pintarReservas();
refrescarKPIs();
pintarDetalle();
pintarStock();
pintarHistorial();