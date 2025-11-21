// src/utils/inventoryApi.js
import { apiFetch } from "./apiClient";

// Mantengo las mismas firmas que el storage local para no tocar las páginas.
// Referencia implementación original localStorage: upsertIngreso, registrarBaja,
// confirmarDesecho, resumenTotales, toRows. :contentReference[oaicite:5]{index=5}

export function ensureInit() {
  // Ya no es necesario con API, pero dejamos no-op para compatibilidad.
  return true;
}

export async function all() {
  // no la tenías pública; si la necesitas, rows ya es tu vista plana
  const rows = await toRows();
  return rows;
}

export async function upsertIngreso(payload) {
  // POST /inventory/ingresos
  // payload: { codigo, descripcion, fabricante, tipo, contenido, partida, vencimiento, cantidad }
  return apiFetch("/inventory/ingresos", { method: "POST", body: payload });
}

export async function registrarBaja({ codigo, motivo, cantidad, obs }) {
  // POST /inventory/bajas
  return apiFetch("/inventory/bajas", {
    method: "POST",
    body: { codigo, motivo, cantidad, obs },
  });
}

export async function confirmarDesecho(codigo) {
  // POST /inventory/:codigo/confirmar-desecho
  const res = await apiFetch(
    `/inventory/${encodeURIComponent(codigo)}/confirmar-desecho`,
    {
      method: "POST",
    }
  );
  // Para mantener compatibilidad con el front que espera un número,
  // devolvemos la cantidad descontada si viene, o 0.
  return res?.descontado ?? 0;
}

export async function resumenTotales() {
  // GET /inventory/resumen
  // { totalDisp, totalResv, totalPend, totalFis }
  return apiFetch("/inventory/resumen");
}

export async function toRows({ tolerancia } = {}) {
  // GET /inventory/rows  o /inventory/rows-xt?t=...
  const path =
    typeof tolerancia === "number"
      ? `/inventory/rows-xt?t=${tolerancia}`
      : "/inventory/rows";
  return apiFetch(path);
}

export async function listInventoryRows() {
  return apiFetch("/inventory/rows");
}

export function findByCodigo(rows, codigo) {
  return rows.find(r => r.codigo === codigo);
}

// Helper: ¿hay stock suficiente para {codigo, cantidad}?
export function hayStock(rows, codigo, cantidad = 1) {
  const it = rows.find((r) => r.codigo === codigo);
  return !!(it && Number(it.disponible || 0) >= Number(cantidad || 1));
}
