export const PRESCRIPCIONES_MOCK = [
  {
    id: 1,
    folio: "PR-2025-00123",
    fecha: "2025-09-09T10:05:00-05:00",
    paciente: { id: "PAC-001", nombre: "Juan Pérez", doc: "12.345.678-9" },
    medico: { id: "MED-014", nombre: "Dra. R. Soto" },
    estado: "En preparación",
    items: [
      { articuloId: "A-001", nombre: "Paracetamol 500 mg", solicitado: 21, entregado: 0 },
      { articuloId: "A-002", nombre: "Ibuprofeno 400 mg", solicitado: 10, entregado: 0 }
    ]
  },
  {
    id: 2,
    folio: "PR-2025-00124",
    fecha: "2025-09-09T11:20:00-05:00",
    paciente: { id: "PAC-002", nombre: "María Loyola", doc: "9.876.543-2" },
    medico: { id: "MED-008", nombre: "Dr. L. Gómez" },
    estado: "Pendiente",
    items: [
      { articuloId: "A-003", nombre: "Amoxicilina 500 mg", solicitado: 21, entregado: 0 }
    ]
  },
  {
    id: 3,
    folio: "PR-2025-00125",
    fecha: "2025-09-09T12:15:00-05:00",
    paciente: { id: "PAC-003", nombre: "Carlos Díaz", doc: "7.654.321-0" },
    medico: { id: "MED-011", nombre: "Dra. M. Fuentes" },
    estado: "Parcial",
    items: [
      { articuloId: "A-004", nombre: "Metformina 850 mg", solicitado: 60, entregado: 30 },
      { articuloId: "A-005", nombre: "Glibenclamida 5 mg", solicitado: 60, entregado: 60 }
    ]
  },
  {
    id: 4,
    folio: "PR-2025-00126",
    fecha: "2025-09-09T12:45:00-05:00",
    paciente: { id: "PAC-004", nombre: "Ana Morales", doc: "5.321.987-1" },
    medico: { id: "MED-003", nombre: "Dr. P. Herrera" },
    estado: "Pendiente",
    items: [
      { articuloId: "A-006", nombre: "Losartán 50 mg", solicitado: 30, entregado: 0 }
    ]
  },
  {
    id: 5,
    folio: "PR-2025-00127",
    fecha: "2025-09-09T13:10:00-05:00",
    paciente: { id: "PAC-005", nombre: "Sofía Rivas", doc: "16.234.567-8" },
    medico: { id: "MED-020", nombre: "Dra. T. Salas" },
    estado: "En preparación",
    items: [
      { articuloId: "A-007", nombre: "Salbutamol Inhalador", solicitado: 1, entregado: 0 }
    ]
  }
];

// Utilidad opcional (a veces útil al crear nuevos registros en memoria)
export const nextPrescripcionId = (list = PRESCRIPCIONES_MOCK) =>
  list.reduce((max, p) => Math.max(max, p.id), 0) + 1;
