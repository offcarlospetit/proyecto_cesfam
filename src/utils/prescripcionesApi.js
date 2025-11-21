import { apiFetch } from "./apiClient";

export async function add({
  rut,
  nombre,
  medicamento,
  dosis,
  frecuencia,
  duracion,
}) {
  return apiFetch("/prescripciones", {
    method: "POST",
    body: { rut, nombre, medicamento, dosis, frecuencia, duracion },
  });
}

export async function byRut(rut) {
  return apiFetch(`/prescripciones/by-rut?rut=${encodeURIComponent(rut)}`);
}

export async function lastByRut(rut) {
  return apiFetch(`/prescripciones/last-by-rut?rut=${encodeURIComponent(rut)}`);
}

export async function existsDuplicate(rut, medicamento) {
  const list = await byRut(rut);
  const target = String(medicamento).toLowerCase();
  return list.some((p) => String(p.medicamento).toLowerCase() === target);
}

function normalize(doc) {
  const id = doc._id || doc.id;
  const fecha = doc.createdAt || doc.fecha || new Date().toISOString();
  const paciente = doc.paciente
    ? doc.paciente
    : doc.rut
    ? {
        id: doc.pacienteId || doc.rut,
        nombre: doc.nombre || doc.pacienteNombre || doc.rut,
        doc: doc.rut,
      }
    : undefined;
  const medico = doc.medico
    ? doc.medico
    : doc.medicoNombre
    ? { id: doc.medicoId, nombre: doc.medicoNombre }
    : undefined;
  const estado = doc.estado || "Pendiente";

  let items = Array.isArray(doc.items) ? doc.items : [];
  if (!items.length && (doc.medicamento || doc.codigo)) {
    items = [
      {
        articuloId: doc.codigo || "SIN-COD",
        nombre: doc.medicamento || doc.descripcion || "Ítem",
        solicitado: doc.cantidad || 1,
        entregado: 0,
      },
    ];
  }

  return {
    id,
    folio: doc.folio || doc.seq || doc.folioNumero || "—",
    fecha,
    paciente,
    medico,
    estado,
    items,
  };
}

export async function listPrescripciones({ estado, q } = {}) {
  const qs = new URLSearchParams();
  if (estado && estado !== "Todos") qs.set("estado", estado);
  if (q && q.trim()) qs.set("q", q.trim());
  const url = `/prescripciones${qs.toString() ? `?${qs}` : ""}`;
  const data = await apiFetch(url).catch(async (e) => {
    if (String(e).includes("404")) return [];
    throw e;
  });
  return Array.isArray(data) ? data.map(normalize) : [];
}

export async function updatePrescripcionEstado(id, estado) {
  try {
    return await apiFetch(`/prescripciones/${id}`, {
      method: "PATCH",
      body: { estado },
    });
  } catch {
    return apiFetch(`/prescripciones/${id}/estado`, {
      method: "POST",
      body: { estado },
    });
  }
}
