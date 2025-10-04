import { pacientes, reservas, stock, marcarDisponibleReservas } from "./data-demo.js";

const $ = (q) => document.querySelector(q);
const form = $("#frm-reserva");
const msg  = $("#msg");
const tb   = $("#tb-reservas");

function nombrePaciente(rut){
  return pacientes.find(p=>p.rut===rut)?.nombre ?? "—";
}

function toast(ok, text){
  msg.textContent = text;
  msg.className = "alert " + (ok ? "alert-ok" : "alert-error");
  setTimeout(()=>{ msg.textContent=""; msg.className="alert"; }, 2500);
}

function pintar(){
  marcarDisponibleReservas(); // CU11: si hay stock, pasa a DISPONIBLE
  tb.innerHTML = reservas.map(r=>{
    const cls = r.estado === "DISPONIBLE" ? "pill" :
                r.estado === "AVISADO"    ? "pill pill-yellow" :
                r.estado === "RETIRADA"   ? "pill pill-green" :
                r.estado === "CADUCADA"   ? "pill pill-red" : "pill pill-orange";
    // Acciones: avisar si DISPONIBLE; marcar retirada si AVISADO
    const canAvisar = r.estado === "DISPONIBLE";
    const puedeRetirar = r.estado === "AVISADO";
    return `<tr>
      <td>${r.rut}</td>
      <td>${nombrePaciente(r.rut)}</td>
      <td>${r.medicamento}</td>
      <td>${r.cantidad}</td>
      <td>${r.fechaReserva}</td>
      <td><span class="${cls}">${r.estado}</span></td>
      <td>
        <button class="btn-enviar" data-id="${r.id}" data-acc="avisar" ${canAvisar?'':'disabled'}>Avisar llegada</button>
        <button class="btn-enviar" data-id="${r.id}" data-acc="retirar" ${puedeRetirar?'':'disabled'}>Marcar retirada</button>
      </td>
    </tr>`;
  }).join("");
}

tb.addEventListener("click", (e)=>{
  const btn = e.target.closest(".btn-enviar");
  if(!btn) return;
  const id = Number(btn.dataset.id);
  const acc = btn.dataset.acc;
  const r = reservas.find(x=>x.id===id);
  if(!r) return;

  if(acc==="avisar" && r.estado==="DISPONIBLE"){
    r.estado = "AVISADO"; // CU12: enviamos aviso (simulado)
    toast(true, `Aviso enviado a ${r.rut} por ${r.medicamento}.`);
  } else if(acc==="retirar" && r.estado==="AVISADO"){
    r.estado = "RETIRADA";
    // Opcional: descontar del stock simulado
    const item = stock.find(s=>s.medicamento===r.medicamento);
    if(item) item.disponible = Math.max(0, item.disponible - r.cantidad);
    toast(true, `Reserva retirada por ${r.rut}.`);
  }
  pintar();
});

form.addEventListener("submit", (e)=>{
  e.preventDefault();
  const rut = $("#rut").value.trim();
  const med = $("#med").value.trim();
  const cant = parseInt($("#cant").value, 10);
  const canal = $("#canal").value;
  const consent = $("#consent").value;

  if(!rut || !med || !cant || !canal || !consent) return toast(false,"Completa todos los campos.");
  if(consent!=="SI") return toast(false,"Sin consentimiento no podemos contactar al paciente.");

  const id = Math.max(0, ...reservas.map(x=>x.id||0)) + 1;
  const hoy = new Date().toISOString().slice(0,10);
  reservas.push({ id, rut, medicamento:med, cantidad:cant, fechaReserva:hoy, estado:"ESPERA_STOCK", canal });
  toast(true, `Reserva registrada (#${id}).`);
  form.reset();
  pintar();
});

pintar();

