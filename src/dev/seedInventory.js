// src/dev/seedInventory.js
import {
  ensureInit,
  upsertIngreso,
  registrarBaja,
} from "../utils/inventoryStorage.js";

/**
 * Carga datos demo en localStorage (clave: inventarioCESFAM)
 * - Agrega productos con partidas/lotes
 * - Aplica una baja para mostrar "Pend. Desecho"
 */
export function seedInventoryDemo() {
  ensureInit();

  // Paracetamol 500 mg — dos partidas
  upsertIngreso({
    codigo: "PARA500",
    descripcion: "Paracetamol 500 mg",
    fabricante: "SaludPlus",
    tipo: "Tabletas",
    contenido: "500 mg",
    partida: "L2025-09",
    vencimiento: "2026-03-31",
    cantidad: 180,
  });
  upsertIngreso({
    codigo: "PARA500",
    descripcion: "Paracetamol 500 mg",
    fabricante: "SaludPlus",
    tipo: "Tabletas",
    contenido: "500 mg",
    partida: "L2026-01",
    vencimiento: "2027-01-31",
    cantidad: 120,
  });

  upsertIngreso({
    codigo: "IBU400",
    descripcion: "Ibuprofeno 400 mg",
    fabricante: "PharmaChile",
    tipo: "Cápsulas",
    contenido: "400 mg",
    partida: "L2025-01",
    vencimiento: "2026-09-30",
    cantidad: 90,
  });

  // Amoxicilina 500 mg — una partida
  upsertIngreso({
    codigo: "AMOX500",
    descripcion: "Amoxicilina 500 mg",
    fabricante: "BioMed",
    tipo: "Cápsulas",
    contenido: "500 mg",
    partida: "L2025-07",
    vencimiento: "2026-12-31",
    cantidad: 60,
  });

  // Omeprazol 20 mg — una partida
  upsertIngreso({
    codigo: "OME20",
    descripcion: "Omeprazol 20 mg",
    fabricante: "GastroLab",
    tipo: "Cápsulas",
    contenido: "20 mg",
    partida: "L2025-05",
    vencimiento: "2027-05-31",
    cantidad: 75,
  });

  // Enalapril 10 mg — una partida
  upsertIngreso({
    codigo: "ENA10",
    descripcion: "Enalapril 10 mg",
    fabricante: "CardioCare",
    tipo: "Tabletas",
    contenido: "10 mg",
    partida: "L2025-03",
    vencimiento: "2026-11-30",
    cantidad: 50,
  });

  // Registrar una baja para que se vea "Pend. Desecho" en la tabla
  registrarBaja({
    codigo: "IBU400",
    motivo: "vencimiento",
    cantidad: 5,
    obs: "Lote L2025-01",
  });

  alert("✅ Inventario demo cargado. Ir a /stock o /informes para verlo.");
}

export function clearInventoryDemo() {
  localStorage.removeItem("inventarioCESFAM");
  alert("🧹 Inventario demo limpiado.");
}
