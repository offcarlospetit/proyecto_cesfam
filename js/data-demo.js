// js/data-demo.js
export const pacientes = [
  { rut:"12345678-9", nombre:"Ana Pérez", tutor:null, contacto:{email:"ana@example.com", fono:"+56 9 1111 1111"} },
  { rut:"9876543-2", nombre:"Juan Soto", tutor:"María Soto", contacto:{email:"maria@example.com", fono:"+56 9 2222 2222"} }
];

export const prescripciones = [
  // Tratamientos largos -> retiros periódicos
  { rut:"12345678-9", medicamento:"Losartán 50mg", dosis:"1-0-1", frecuencia:"cada 12h",
    duracionDias:90, retiroCadaDias:30, proximoRetiro:"2025-09-05", requiereControl:false, estado:"ACTIVA" },
  { rut:"9876543-2", medicamento:"Metformina 850mg", dosis:"1-1-1", frecuencia:"cada 8h",
    duracionDias:180, retiroCadaDias:30, proximoRetiro:"2025-08-30", requiereControl:true, estado:"ACTIVA" }
];

export const reservas = [
  // Espera de stock (cuando llegue, avisar)
  { rut:"12345678-9", medicamento:"Atorvastatina 20mg", fechaReserva:"2025-08-20", estado:"ESPERA_STOCK" }
];

export const stock = [
  { medicamento:"Losartán 50mg", disponible:120, reservado:20, critico:50 },
  { medicamento:"Metformina 850mg", disponible:40, reservado:10, critico:30 },
  { medicamento:"Atorvastatina 20mg", disponible:0, reservado:5, critico:20 }
];

// Historial de entregas / Detalle de entregas realizadas.
export const retirosRealizados = [
  { rut:"12345678-9", medicamento:"Paracetamol 500mg", fecha:"2025-08-01", cantidad:20 },
  { rut:"9876543-2", medicamento:"Metformina 850mg", fecha:"2025-07-28", cantidad:30 },
  { rut:"12345678-9", medicamento:"Losartán 50mg", fecha:"2025-07-15", cantidad:30 }
];