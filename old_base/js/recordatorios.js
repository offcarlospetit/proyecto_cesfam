// js/recordatorios.js
import { pacientes, prescripciones } from "./data-demo.js";

const $ = (q) => document.querySelector(q);
const $$ = (q) => document.querySelectorAll(q);

const tbl = $("#tb-proximos");
const msg = $("#msg");
const form = $("#frm-recordatorio");

function diasEntre(hoyISO, fechaISO){
  const d1 = new Date(hoyISO), d2 = new Date(fechaISO);
  const diff = Math.ceil((d2 - d1) / (1000*60*60*24));
  return diff;
}

function nombrePaciente(rut){
  return pacientes.find(p=>p.rut===rut)?.nombre ?? "—";
}

function pintarTabla(){
  const hoy = new Date().toISOString().slice(0,10);
  tbl.innerHTML = prescripciones
    .filter(p => p.estado==="ACTIVA" && p.proximoRetiro)
    .map(p => {
      const d = diasEntre(hoy, p.proximoRetiro);
      const clase = d < 0 ? "pill pill-red" : d === 0 ? "pill pill-yellow" : d <= 3 ? "pill pill-orange" : "pill";
      return `<tr>
        <td>${p.rut}</td>
        <td>${nombrePaciente(p.rut)}</td>
        <td>${p.medicamento}</td>
        <td>${p.proximoRetiro}</td>
        <td><span class="${clase}">${d}</span></td>
        <td>
          <button class="btn-enviar" data-rut="${p.rut}" data-med="${p.medicamento}">Enviar recordatorio</button>
        </td>
      </tr>`;
    }).join("");
}

function toast(ok, texto){
  msg.textContent = texto;
  msg.className = "alert " + (ok ? "alert-ok" : "alert-error");
  setTimeout(()=>{ msg.textContent=""; msg.className="alert"; }, 2500);
}

tbl.addEventListener("click", (e)=>{
  const btn = e.target.closest(".btn-enviar");
  if(!btn) return;
  const { rut, med } = btn.dataset;
  // Simular envío
  toast(true, `Recordatorio enviado a ${rut} por ${med}.`);
  btn.disabled = true;
  setTimeout(()=>{ btn.disabled = false; }, 3000);
});

form.addEventListener("submit",(e)=>{
  e.preventDefault();
  const rut = $("#rut").value.trim();
  const diasAviso = parseInt($("#diasAviso").value, 10);
  const canal = $("#canal").value;
  const consent = $("#consent").value;

  if(!rut || !diasAviso || !canal || !consent){
    return toast(false,"Completa todos los campos.");
  }
  if(consent!=="SI"){
    return toast(false,"No hay consentimiento. No se puede programar el envío.");
  }
  const cfg = JSON.parse(localStorage.getItem("cfgRecordatorios")||"{}");
  cfg[rut] = { diasAviso, canal, fechaAlta: new Date().toISOString() };
  localStorage.setItem("cfgRecordatorios", JSON.stringify(cfg));
  toast(true, `Recordatorio para ${rut} programado (${diasAviso} días antes, vía ${canal}).`);
  form.reset();
});

pintarTabla();