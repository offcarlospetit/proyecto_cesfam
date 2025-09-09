const prescripciones = [
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

function formatFecha(iso) {
  try {
    const d = new Date(iso);
    const pad = n => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch { return iso; }
}

function getInventario() {
  if (!window.CESFAMStock) return [];
  return JSON.parse(localStorage.getItem("inventarioCESFAM") || "[]");
}
function saveInventario(arr) {
  localStorage.setItem("inventarioCESFAM", JSON.stringify(arr));
}

function buscarProductoPorNombre(nombre) {
  const inv = getInventario();
  const n = nombre.toLowerCase().replace(/\s+/g, " ").trim();
  let prod = inv.find(p => (p.descripcion || "").toLowerCase().startsWith(n));
  if (prod) return prod;
  prod = inv.find(p => (p.descripcion || "").toLowerCase().includes(n));
  return prod || null;
}

function reservarParaItem(item) {
  const prod = buscarProductoPorNombre(item.nombre);
  if (!prod) return { reservado: 0, motivo: "sin_producto" };

  const disponible = prod.disponible || 0;
  const yaEntregado = item.entregado || 0;
  const requerido = Math.max(0, (item.solicitado || 0) - yaEntregado);

  if (requerido <= 0) return { reservado: 0, motivo: "nada_requerido" };
  if (disponible <= 0) return { reservado: 0, motivo: "sin_disponible" };

  const aReservar = Math.min(requerido, disponible);
  prod.disponible -= aReservar;
  prod.reservado = (prod.reservado || 0) + aReservar;

  const inv = getInventario();
  const idx = inv.findIndex(p => p.codigo === prod.codigo);
  if (idx >= 0) { inv[idx] = prod; saveInventario(inv); }

  return { reservado: aReservar, motivo: aReservar === requerido ? "completo" : "parcial" };
}

function prepararPrescripcion(prescripcion) {
  let sumReservado = 0;
  let todosCompletos = true;
  let algunoReservado = false;

  prescripcion.items.forEach(it => {
    const res = reservarParaItem(it);
    sumReservado += res.reservado;
    if (res.reservado > 0) algunoReservado = true;
    if (res.motivo !== "completo") todosCompletos = false;
    it.reservado = (it.reservado || 0) + res.reservado;
  });

  if (todosCompletos && prescripcion.items.length > 0) prescripcion.estado = "En preparación";
  else if (algunoReservado) prescripcion.estado = "Parcial";
  else prescripcion.estado = "Pendiente";

  return sumReservado;
}

function renderFila(p) {
  const tr = document.createElement('tr');

  const tdId = document.createElement('td'); tdId.textContent = p.id;
  const tdFolio = document.createElement('td'); tdFolio.textContent = p.folio;
  const tdFecha = document.createElement('td'); tdFecha.textContent = formatFecha(p.fecha);
  const tdPaciente = document.createElement('td'); tdPaciente.innerHTML = `<strong>${p.paciente.nombre}</strong>`;
  const tdMedico = document.createElement('td'); tdMedico.textContent = p.medico.nombre;
  const tdItems = document.createElement('td'); tdItems.textContent = `${p.items.length} ${p.items.length === 1 ? 'ítem' : 'ítems'}`;

  const tdEstado = document.createElement('td');
  const chip = document.createElement('span');
  chip.className = 'chip';
  chip.setAttribute('data-estado', p.estado);
  chip.textContent = p.estado;
  tdEstado.appendChild(chip);

  const tdAcc = document.createElement('td'); tdAcc.className = 'col-actions';
  const actions = document.createElement('div'); actions.className = 'btn-row';
  const btnPrep = document.createElement('button'); btnPrep.className = 'btn-mini'; btnPrep.textContent = 'Preparar';
  btnPrep.addEventListener('click', () => {
    openDetalle(p);
  });
  const btnVer = document.createElement('button'); btnVer.className = 'btn-mini'; btnVer.textContent = 'Ver';
  btnVer.addEventListener('click', () => openDetalle(p));
  actions.append(btnPrep, btnVer);
  tdAcc.appendChild(actions);

  tr.append(tdId, tdFolio, tdFecha, tdPaciente, tdMedico, tdItems, tdEstado, tdAcc);
  return tr;
}

function renderTabla() {
  const tbody = document.getElementById('tbody-prescripciones');
  const empty = document.getElementById('empty-state');
  tbody.innerHTML = '';
  if (!prescripciones.length) { empty.hidden = false; return; }
  empty.hidden = true;
  prescripciones.forEach(p => tbody.appendChild(renderFila(p)));
}

let lastFocus = null;
const drawer = document.getElementById('detalle-drawer');
const backdrop = drawer?.querySelector('.backdrop');
const btnClose = drawer?.querySelector('#btn-cerrar-drawer');
const btnIrPreparar = drawer?.querySelector('#btn-ir-preparar');

function pintarDetalle(p) {
  document.getElementById('det-id').textContent = p.id;
  document.getElementById('det-folio').textContent = p.folio;
  document.getElementById('det-fecha').textContent = formatFecha(p.fecha);
  document.getElementById('det-paciente').textContent = p.paciente?.nombre ?? '';
  document.getElementById('det-medico').textContent = p.medico?.nombre ?? '';
  const chip = document.getElementById('det-estado');
  chip.textContent = p.estado;
  chip.setAttribute('data-estado', p.estado);

  const tbody = document.getElementById('det-tbody-items');
  tbody.innerHTML = '';
  (p.items || []).forEach(it => {
    const tr = document.createElement('tr');
    const tdA = document.createElement('td'); tdA.textContent = it.nombre;
    const tdS = document.createElement('td'); tdS.textContent = it.solicitado;
    const tdE = document.createElement('td'); tdE.textContent = it.entregado ?? 0;
    tr.append(tdA, tdS, tdE);
    tbody.appendChild(tr);
  });
}

function openDetalle(p) {
  if (!drawer) return;
  lastFocus = document.activeElement;
  pintarDetalle(p);
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');

  if (btnIrPreparar) {
    btnIrPreparar.disabled = false;
    btnIrPreparar.onclick = () => {
      const reservado = prepararPrescripcion(p);
      pintarDetalle(p);
      renderTabla(); // refresca chips en la lista
      alert(reservado > 0
        ? `Se reservaron ${reservado} unidades en inventario. Estado: ${p.estado}.`
        : `No fue posible reservar. Estado: ${p.estado}.`);
    };
  }

  btnClose?.focus();
}

function closeDetalle() {
  if (!drawer) return;
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
}

backdrop?.addEventListener('click', closeDetalle);
btnClose?.addEventListener('click', closeDetalle);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && drawer?.classList.contains('open')) {
    e.preventDefault(); closeDetalle();
  }
});

document.addEventListener('DOMContentLoaded', renderTabla);
