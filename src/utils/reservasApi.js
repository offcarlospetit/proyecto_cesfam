// src/utils/reservasApi.js
import { apiFetch } from "./apiClient";

// GET /reservas  (opcionalmente con filtros via query: ?estado=...&rut=...)
export async function listReservas({ estado, rut } = {}) {
  const qs = new URLSearchParams();
  if (estado) qs.set("estado", estado);
  if (rut) qs.set("rut", rut);
  const q = qs.toString();
  return apiFetch(`/reservas${q ? `?${q}` : ""}`);
}

// POST /reservas  body: { rut, codigo, cantidad }
export async function createReserva({ rut, codigo, cantidad }) {
  return apiFetch("/reservas", {
    method: "POST",
    body: { rut, codigo, cantidad: Number(cantidad) || 1 },
  });
}

// POST /reservas/:id/estado  body: { estado: "notificada" | "cancelada" | ... }
export async function setEstadoReserva(id, estado) {
  return apiFetch(`/reservas/${id}/estado`, {
    method: "POST",
    body: { estado },
  });
}

// POST /reservas/:id/confirmar  (mueve a confirmada y descuenta stock)
export async function confirmarReserva(id) {
  return apiFetch(`/reservas/${id}/confirmar`, { method: "POST" });
}

