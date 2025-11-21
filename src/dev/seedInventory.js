// src/dev/seedAllDemo.js
//
// Carga datos DEMO en TODOS los módulos del backend CESFAM.
// Usa la API desplegada en Vercel por defecto.
// Cambia BASE si quieres apuntar a tu ambiente local.
//
// Requisitos backend ya implementados:
// - POST   /api/users/register
// - POST   /api/auth/login
// - POST   /api/inventory/ingresos
// - POST   /api/inventory/bajas
// - POST   /api/inventory/:codigo/confirmar-desecho   (opcional)
// - POST   /api/prescripciones
// - PATCH  /api/prescripciones/:id
// - POST   /api/prescripciones/:id/estado
// - POST   /api/prescripciones/:id/preparar
// - POST   /api/entregas
// - GET    /api/entregas/by-rut?rut=...
// - POST   /api/reservas
// - POST   /api/reservas/:id/estado
// - GET    /api/reservas
// - POST   /api/notificaciones
// - PATCH  /api/notificaciones/:id
// - GET    /api/notificaciones
//
const BASE = "https://api-cesfam.vercel.app/api";
// const BASE = 'http://localhost:3001/api'; // <- alterna a local si quieres

async function api(path, { method = "GET", json, headers } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body: json ? JSON.stringify(json) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `${method} ${path} -> ${res.status} ${res.statusText} ${text}`
    );
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

// ========== 1) USUARIOS DEMO ==========
async function seedUsers() {
  const users = [
    { email: "admin@cesfam.cl", password: "1234", nombre: "Admin Demo" },
    {
      email: "ventanilla@cesfam.cl",
      password: "1234",
      nombre: "Ventanilla Demo",
    },
  ];
  const created = [];
  for (const u of users) {
    try {
      const r = await api("/users/register", { method: "POST", json: u });
      created.push(r);
    } catch (e) {
      // si ya existe, no detiene
      console.warn("users.register warn:", e.message);
    }
  }
  // login (opcional, si quieres validar credenciales)
  try {
    const login = await api("/auth/login", {
      method: "POST",
      json: { email: "admin@cesfam.cl", password: "1234" },
    });
    return { created, login };
  } catch (e) {
    console.warn("auth.login warn:", e.message);
    return { created, login: null };
  }
}

// ========== 2) INVENTARIO DEMO ==========
async function seedInventory() {
  const ingresos = [
    {
      codigo: "PARA500",
      descripcion: "Paracetamol 500 mg",
      fabricante: "SaludPlus",
      tipo: "Tabletas",
      contenido: "500 mg",
      partida: "L2025-09",
      vencimiento: "2026-03-31",
      cantidad: 180,
    },
    {
      codigo: "PARA500",
      descripcion: "Paracetamol 500 mg",
      fabricante: "SaludPlus",
      tipo: "Tabletas",
      contenido: "500 mg",
      partida: "L2026-01",
      vencimiento: "2027-01-31",
      cantidad: 120,
    },
    {
      codigo: "IBU400",
      descripcion: "Ibuprofeno 400 mg",
      fabricante: "PharmaChile",
      tipo: "Cápsulas",
      contenido: "400 mg",
      partida: "L2025-01",
      vencimiento: "2026-09-30",
      cantidad: 90,
    },
    {
      codigo: "AMOX500",
      descripcion: "Amoxicilina 500 mg",
      fabricante: "BioMed",
      tipo: "Cápsulas",
      contenido: "500 mg",
      partida: "L2025-07",
      vencimiento: "2026-12-31",
      cantidad: 60,
    },
    {
      codigo: "OME20",
      descripcion: "Omeprazol 20 mg",
      fabricante: "GastroLab",
      tipo: "Cápsulas",
      contenido: "20 mg",
      partida: "L2025-05",
      vencimiento: "2027-05-31",
      cantidad: 75,
    },
    {
      codigo: "ENA10",
      descripcion: "Enalapril 10 mg",
      fabricante: "CardioCare",
      tipo: "Tabletas",
      contenido: "10 mg",
      partida: "L2025-03",
      vencimiento: "2026-11-30",
      cantidad: 50,
    },
  ];

  const created = [];
  for (const ing of ingresos) {
    const r = await api("/inventory/ingresos", { method: "POST", json: ing });
    created.push(r);
  }

  // registrar una baja para que se vea "Pend. Desecho"
  const baja = await api("/inventory/bajas", {
    method: "POST",
    json: {
      codigo: "IBU400",
      motivo: "vencimiento",
      cantidad: 5,
      obs: "Lote L2025-01",
    },
  });

  // (opcional) confirmar desecho físico para mostrar el flujo completo
  // await api('/inventory/IBU400/confirmar-desecho', { method: 'POST' });

  return { created, baja };
}

// ========== 3) PRESCRIPCIONES DEMO ==========
async function seedPrescripciones() {
  // Creamos prescripciones simples (DTO básico) y luego las enriquecemos con items/estado
  const base = [
    {
      rut: "12345678-9",
      nombre: "Ana Pérez",
      medicamento: "Paracetamol 500 mg",
      dosis: "1 tableta",
      frecuencia: "cada 8 hrs",
      duracion: "5 días",
    },
    {
      rut: "9876543-2",
      nombre: "Juan Soto",
      medicamento: "Amoxicilina 500 mg",
      dosis: "1 cápsula",
      frecuencia: "cada 12 hrs",
      duracion: "7 días",
    },
    {
      rut: "12345678-9",
      nombre: "Ana Pérez",
      medicamento: "Ibuprofeno 400 mg",
      dosis: "1 cápsula",
      frecuencia: "cada 8 hrs",
      duracion: "3 días",
    },
  ];

  const created = [];
  for (const p of base) {
    const doc = await api("/prescripciones", { method: "POST", json: p });
    created.push(doc);
  }

  // Enriquecer con items y estados de ejemplo
  // - A la 1°: En preparación, con items (PARA500)
  // - A la 2°: Pendiente con item (AMOX500)
  // - A la 3°: Parcial con items (IBU400)
  const updates = [];
  if (created[0]?._id) {
    updates.push(
      api(`/prescripciones/${created[0]._id}`, {
        method: "PATCH",
        json: {
          items: [{ nombre: "PARA500", solicitado: 21, entregado: 0 }],
          estado: "En preparación",
        },
      })
    );
    // opcional: transición con endpoint dedicado
    updates.push(
      api(`/prescripciones/${created[0]._id}/preparar`, { method: "POST" })
    );
  }
  if (created[1]?._id) {
    updates.push(
      api(`/prescripciones/${created[1]._id}`, {
        method: "PATCH",
        json: {
          items: [{ nombre: "AMOX500", solicitado: 14, entregado: 0 }],
          estado: "Pendiente",
        },
      })
    );
  }
  if (created[2]?._id) {
    updates.push(
      api(`/prescripciones/${created[2]._id}`, {
        method: "PATCH",
        json: {
          items: [{ nombre: "IBU400", solicitado: 10, entregado: 6 }],
          estado: "Parcial",
        },
      })
    );
  }
  const patched = updates.length ? await Promise.allSettled(updates) : [];

  return { created, patched };
}

// ========== 4) ENTREGAS (VENTANILLA) DEMO ==========
async function seedEntregas(prescripciones) {
  // Usamos una de las prescripciones de Ana (si existe) para registrar una entrega de PARA500
  const ana = prescripciones?.created?.find((p) => p?.rut === "12345678-9");
  if (!ana?._id) {
    return {
      created: null,
      note: "No hay prescripción de Ana para demo de entrega.",
    };
  }

  // Registrar 2 unidades de PARA500
  const entrega = await api("/entregas", {
    method: "POST",
    json: {
      prescripcionId: ana._id,
      rut: "12345678-9",
      quienRetira: "Ana Pérez",
      docId: "CI-11111111-1",
      codigo: "PARA500",
      partida: "L2026-01",
      cantidad: 2,
    },
  });

  // Traza por RUT
  const trazas = await api("/entregas/by-rut?rut=12345678-9");
  return { entrega, trazas };
}

// ========== 5) RESERVAS DEMO ==========
async function seedReservas() {
  // Crear dos reservas; una de Atorvastatina quedará en espera (no la cargamos en inventario)
  const r1 = await api("/reservas", {
    method: "POST",
    json: { rut: "12345678-9", codigo: "OME20", cantidad: 2 },
  });
  const r2 = await api("/reservas", {
    method: "POST",
    json: { rut: "9876543-2", codigo: "ATV20", cantidad: 1 }, // código no existente para simular ESPERA
  });

  // Marcar una como notificada
  try {
    await api(`/reservas/${r1._id}/estado`, {
      method: "POST",
      json: { estado: "notificada" },
    });
  } catch (e) {
    console.warn("reservas.estado warn:", e.message);
  }

  // Listado total para que el front tenga algo que mostrar
  const list = await api("/reservas");
  return { created: [r1, r2], list };
}

// ========== 6) NOTIFICACIONES DEMO ==========
async function seedNotificaciones() {
  const n1 = await api("/notificaciones", {
    method: "POST",
    json: {
      tipo: "aviso",
      destinatario: "12345678-9",
      mensaje: "Su reserva de OME20 está disponible para retiro",
      meta: { canal: "sms" },
    },
  });
  const n2 = await api("/notificaciones", {
    method: "POST",
    json: {
      tipo: "recordatorio",
      destinatario: "9876543-2",
      mensaje: "Recordatorio de control médico",
      meta: { canal: "email" },
    },
  });

  // Pequeña edición de n2
  try {
    await api(`/notificaciones/${n2._id}`, {
      method: "PATCH",
      json: {
        mensaje: "Recordatorio actualizado: control mañana 9:00",
        meta: { canal: "email" },
      },
    });
  } catch (e) {
    console.warn("notificaciones.patch warn:", e.message);
  }

  const list = await api("/notificaciones");
  return { created: [n1, n2], list };
}

// ========== ORQUESTADOR ==========
export async function seedAllDemo() {
  const startedAt = Date.now();
  try {
    const users = await seedUsers();
    const inv = await seedInventory();
    const presc = await seedPrescripciones();
    const entregas = await seedEntregas(presc);
    const reservas = await seedReservas();
    const notifs = await seedNotificaciones();

    const ms = Date.now() - startedAt;
    console.log("✅ DEMO completa en", ms, "ms");
    console.log({ users, inv, presc, entregas, reservas, notifs });
    alert(
      "✅ Datos DEMO cargados.\nRevisa: Stock, Prescripciones, Entregas, Reservas y Notificaciones."
    );
    return { users, inv, presc, entregas, reservas, notifs, ms };
  } catch (e) {
    console.error("❌ Error cargando DEMO:", e);
    alert("❌ Error cargando DEMO: " + e.message);
    throw e;
  }
}

// (opcional) limpiadores suaves del front: solo afectan localStorage/UI,
// NO eliminan del backend. Para un wipe real, crea endpoints /dev/wipe.
export function clearLocalDemo() {
  try {
    localStorage.removeItem("inventarioCESFAM");
    localStorage.removeItem("reservas");
    alert("🧹 Limpieza local realizada (solo front).");
  } catch {}
}
