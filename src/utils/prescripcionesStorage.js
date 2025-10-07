// Clave y contador de folio en localStorage
const KEY = "prescripcionesCESFAM";
const FOLIO_KEY = "prescFolioCESFAM";

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
function save(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

function loadFolio() {
  const n = parseInt(localStorage.getItem(FOLIO_KEY) || "1", 10);
  return isNaN(n) ? 1 : n;
}
function bumpFolio() {
  const next = loadFolio() + 1;
  localStorage.setItem(FOLIO_KEY, String(next));
}

export function all() {
  return load();
}
export function byRut(rut) {
  return load().filter((p) => p.rut === rut);
}
export function lastByRut(rut) {
  const list = byRut(rut);
  return list.length ? list[list.length - 1] : null;
}

export function existsDuplicate(rut, medicamento) {
  const med = String(medicamento).toLowerCase();
  return load().some(
    (p) => p.rut === rut && String(p.medicamento).toLowerCase() === med
  );
}

export function add({ rut, nombre, medicamento, dosis, frecuencia, duracion }) {
  const list = load();
  const folio = loadFolio();
  const nueva = {
    rut,
    nombre,
    medicamento,
    dosis,
    frecuencia,
    duracion,
    fecha: new Date().toLocaleString(),
    folio,
  };
  list.push(nueva);
  save(list);
  bumpFolio();
  return nueva;
}
