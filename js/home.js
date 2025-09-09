// js/home.js
import { prescripciones, reservas, stock } from "./data-demo.js";

const proxEl = document.getElementById("kpi-home-prox");
const atraEl = document.getElementById("kpi-home-atra");
const resvEl = document.getElementById("kpi-home-resv");
const critEl = document.getElementById("kpi-home-crit");

function diasEntre(hoyISO, fechaISO){
  const d1 = new Date(hoyISO), d2 = new Date(fechaISO);
  return Math.ceil((d2 - d1) / (1000*60*60*24));
}

function refrescar(){
  const hoy = new Date().toISOString().slice(0,10);
  const activos = prescripciones.filter(p => p.estado === "ACTIVA" && p.proximoRetiro);

  const prox = activos.filter(p=>{ const d=diasEntre(hoy,p.proximoRetiro); return d>=0 && d<=3; }).length;
  const atra = activos.filter(p=>diasEntre(hoy,p.proximoRetiro) < 0).length;
  const resv = reservas.filter(r=>r.estado==="ESPERA_STOCK").length;
  const crit = stock.filter(s=>s.disponible < s.critico).length;

  if (proxEl) proxEl.textContent = prox;
  if (atraEl) atraEl.textContent = atra;
  if (resvEl) resvEl.textContent = resv;
  if (critEl) critEl.textContent = crit;
}

refrescar();