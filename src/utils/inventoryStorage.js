const KEY = "inventarioCESFAM";

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function ensureInit() {
  if (!localStorage.getItem(KEY)) localStorage.setItem(KEY, "[]");
}

export function all() {
  return load();
}

export function upsertIngreso({
  codigo,
  descripcion,
  fabricante,
  tipo,
  contenido,
  partida,
  vencimiento,
  cantidad,
}) {
  const data = load();
  let prod = data.find((p) => p.codigo.toLowerCase() === codigo.toLowerCase());
  if (!prod) {
    prod = {
      codigo,
      descripcion,
      fabricante,
      tipo,
      contenido,
      disponible: 0,
      reservado: 0,
      pendienteDesecho: 0,
      fisico: 0,
      partidas: [],
      bajas: [],
    };
    data.push(prod);
  }
  prod.partidas.push({ partida, vencimiento, cantidad, estado: "disponible" });
  prod.disponible += cantidad;
  prod.fisico += cantidad;
  save(data);
  return prod;
}

export function registrarBaja({ codigo, motivo, cantidad, obs }) {
  const data = load();
  const prod = data.find(
    (p) => p.codigo.toLowerCase() === codigo.toLowerCase()
  );
  if (!prod) throw new Error("Producto no encontrado");
  if (cantidad <= 0) throw new Error("Cantidad inválida");
  if ((prod.disponible || 0) < cantidad)
    throw new Error("Stock disponible insuficiente");
  prod.disponible -= cantidad;
  prod.pendienteDesecho = (prod.pendienteDesecho || 0) + cantidad;
  prod.bajas.push({
    fecha: new Date().toLocaleString(),
    motivo,
    cantidad,
    obs,
  });
  save(data);
  return prod;
}

export function confirmarDesecho(codigo) {
  const data = load();
  const prod = data.find(
    (p) => p.codigo.toLowerCase() === codigo.toLowerCase()
  );
  if (!prod) return 0;
  const cant = prod.pendienteDesecho || 0;
  prod.fisico = Math.max(0, (prod.fisico || 0) - cant);
  prod.pendienteDesecho = 0;
  save(data);
  return cant;
}

export function resumenTotales() {
  const data = load();
  const totalDisp = data.reduce((a, p) => a + (p.disponible || 0), 0);
  const totalResv = data.reduce((a, p) => a + (p.reservado || 0), 0);
  const totalPend = data.reduce((a, p) => a + (p.pendienteDesecho || 0), 0);
  const totalFis = data.reduce((a, p) => a + (p.fisico || 0), 0);
  return { totalDisp, totalResv, totalPend, totalFis };
}

export function toRows() {
  return load().map((p) => ({
    codigo: p.codigo,
    descripcion: p.descripcion,
    fabricante: p.fabricante,
    tipo: p.tipo,
    contenido: p.contenido,
    disponible: p.disponible || 0,
    reservado: p.reservado || 0,
    pendienteDesecho: p.pendienteDesecho || 0,
    fisico: p.fisico || 0,
  }));
}
