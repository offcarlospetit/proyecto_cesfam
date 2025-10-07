// js/data-demo.js
export const pacientes = [
  { rut:"12345678-9", nombre:"Ana Pérez", tutor:null, contacto:{email:"ana@example.com", fono:"+56 9 1111 1111"} },
  { rut:"9876543-2", nombre:"Juan Soto", tutor:"María Soto", contacto:{email:"maria@example.com", fono:"+56 9 2222 2222"} }
];

export const prescripciones = [
  // Tratamientos largos -> retiros periódicos
  { rut:"12345678-9", medicamento:"Losartán 50mg", dosis:"1-0-1", frecuencia:"cada 12h",
    duracionDias:90, retiroCadaDias:30, proximoRetiro:"2025-11-05", requiereControl:false, estado:"ACTIVA" },
  { rut:"9876543-2", medicamento:"Metformina 850mg", dosis:"1-1-1", frecuencia:"cada 8h",
    duracionDias:180, retiroCadaDias:30, proximoRetiro:"2025-11-30", requiereControl:true, estado:"ACTIVA" }
];

export const reservas = [
  // Espera de stock (cuando llegue, avisar)
  { rut:"12345678-9", medicamento:"Atorvastatina 20mg", fechaReserva:"2025-10-20", estado:"ESPERA_STOCK" }
];

export const stock = [
  { medicamento:"Losartán 50mg", disponible:120, reservado:20, critico:50 },
  { medicamento:"Metformina 850mg", disponible:40, reservado:10, critico:30 },
  { medicamento:"Atorvastatina 20mg", disponible:0, reservado:5, critico:20 }
];

// Historial de entregas / Detalle de entregas realizadas.
export const retirosRealizados = [
  { rut:"12345678-9", medicamento:"Paracetamol 500mg", fecha:"2025-11-01", cantidad:20 },
  { rut:"9876543-2", medicamento:"Metformina 850mg", fecha:"2025-10-28", cantidad:30 },
  { rut:"12345678-9", medicamento:"Losartán 50mg", fecha:"2025-11-15", cantidad:30 }
];

/*// GENE
export function hayStockPara(medicamento, cantidad=1){
  const item = stock.find(s => s.medicamento === medicamento);
  return item && item.disponible >= cantidad;
}

export function marcarDisponibleReservas(){
  reservas.forEach(r => {
    if(r.estado === "ESPERA_STOCK" && hayStockPara(r.medicamento, r.cantidad)){
      r.estado = "DISPONIBLE"; // CU11: llegada confirmada
    }
  });
}*/

// --- Helpers compartidos ---
export function nombrePaciente(rut){
  return pacientes.find(p=>p.rut===rut)?.nombre ?? "—";
}

export function hayStockPara(medicamento, cantidad=1){
  const item = stock.find(s => s.medicamento === medicamento);
  return !!(item && item.disponible >= cantidad);
}

// Generador de id - Solo para demo
let _rid = reservas.reduce((m,r)=>Math.max(m,r.id), 1);
const nextId = () => ++_rid;

// Persistencia simple en localStorage (opcional)
function saveReservas(){ localStorage.setItem("reservas", JSON.stringify(reservas)); }
(function hydrate(){
  try{
    const saved = JSON.parse(localStorage.getItem("reservas")||"null");
    if (Array.isArray(saved)) {
      reservas.splice(0, reservas.length, ...saved);
      _rid = reservas.reduce((m,r)=>Math.max(m,r.id), 1);
    }
  }catch{}
})();

// --- CU10: crear reserva ---
export function crearReserva({ rut, medicamento, cantidad, canal, consentimiento }){
  const nueva = {
    id: nextId(),
    rut, medicamento, cantidad: Number(cantidad)||1,
    fechaReserva: new Date().toISOString().slice(0,10),
    canal,
    consentimiento: !!consentimiento,
    estado: hayStockPara(medicamento, cantidad) ? "DISPONIBLE" : "ESPERA_STOCK"
  };
  reservas.push(nueva);
  saveReservas();
  return nueva;
}

// --- CU11: marcar DISPONIBLE cuando llega stock ---
export function marcarDisponibleReservas(){
  let cambios = 0;
  reservas.forEach(r=>{
    if (r.estado === "ESPERA_STOCK" && hayStockPara(r.medicamento, r.cantidad)) {
      r.estado = "DISPONIBLE";
      cambios++;
    }
  });
  if (cambios) saveReservas();
  return cambios;
}

// Avisar llegada (simulado)
export function avisarLlegada(id){
  const r = reservas.find(x=>x.id===id);
  if (!r) return false;
  if (r.estado === "DISPONIBLE") {
    r.estado = "AVISADO";
    r.fechaAviso = new Date().toISOString();
    saveReservas();
    return true;
  }
  return false;
}

// --- CU12: marcar retirada ---
export function marcarRetirada(id){
  const r = reservas.find(x=>x.id===id);
  if (!r) return false;
  if (r.estado === "AVISADO" || r.estado === "DISPONIBLE") {
    r.estado = "RETIRADA";
    r.fechaRetiro = new Date().toISOString().slice(0,10);
    saveReservas();
    return true;
  }
  return false;
}

// Caducar reservas - Después de "X" días sin retiro tras aviso
export function caducarReservas(dias = 15){
  const now = Date.now(), ms = dias*24*60*60*1000;
  let cambios = 0;
  reservas.forEach(r=>{
    if (r.estado === "AVISADO" && r.fechaAviso) {
      if ((now - new Date(r.fechaAviso).getTime()) > ms) {
        r.estado = "CADUCADA";
        cambios++;
      }
    }
  });
  if (cambios) saveReservas();
  return cambios;
}