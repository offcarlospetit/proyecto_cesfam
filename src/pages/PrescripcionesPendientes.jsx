import { useMemo, useRef, useState } from "react";
import { PRESCRIPCIONES_MOCK, nextPrescripcionId } from "../data/prescripciones.mock";
import { DrawerDetallePrescripciones } from "../components/DrawerDetallePrescripciones";
import { formatFecha } from "../utils/dates";
import "../assets/prescripciones-pendientes.css";

/** ======== Utilidades ======== */
const toCSV = (rows) => {
  const header = ["ID", "Folio", "Fecha", "Paciente", "Médico", "Ítems", "Estado"];
  const body = rows.map((p) => [
    p.id,
    p.folio,
    formatFecha(p.fecha),
    p.paciente?.nombre ?? "",
    p.medico?.nombre ?? "",
    p.items?.length ?? 0,
    p.estado,
  ]);
  return [header, ...body].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
};
const download = (filename, text) => {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

function Fila({ p, onVer }) {
  return (
    <tr>
      <td>{p.id}</td>
      <td>{p.folio}</td>
      <td>{formatFecha(p.fecha)}</td>
      <td><strong>{p.paciente?.nombre}</strong></td>
      <td>{p.medico?.nombre}</td>
      <td>{p.items?.length ?? 0} {p.items?.length === 1 ? "ítem" : "ítems"}</td>
      <td><span className="chip" data-estado={p.estado}>{p.estado}</span></td>
      <td className="col-actions">
        <div className="btn-row">
          <button className="btn-mini" disabled>Preparar</button>
          <button className="btn-mini" onClick={() => onVer(p)}>Ver</button>
        </div>
      </td>
    </tr>
  );
}

/** ======== Página ======== */
export default function PrescripcionesPendientes() {
  // Clonado profundo para poder mutar localmente sin tocar el mock original
  const [data, setData] = useState(() =>
    (typeof structuredClone === "function")
      ? structuredClone(PRESCRIPCIONES_MOCK)
      : JSON.parse(JSON.stringify(PRESCRIPCIONES_MOCK))
  );

  const [query, setQuery] = useState("");
  const [estado, setEstado] = useState("Todos");
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const lastFocus = useRef(null);

  const agregarDemo = () => {
    setData(prev => ([
      ...prev,
      {
        id: nextPrescripcionId(prev),
        folio: "PR-2025-00999",
        fecha: new Date().toISOString(),
        paciente: { id: "PAC-999", nombre: "Paciente Demo", doc: "11.111.111-1" },
        medico: { id: "MED-000", nombre: "Dr. Demo" },
        estado: "Pendiente",
        items: [{ articuloId: "A-999", nombre: "Demo 1", solicitado: 1, entregado: 0 }]
      }
    ]));
  };
  
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter(p => {
      const matchQuery = !q || [p.folio, p.paciente?.nombre, p.medico?.nombre]
        .some(v => (v ?? "").toLowerCase().includes(q));
      const matchEstado = (estado === "Todos") || p.estado === estado;
      return matchQuery && matchEstado;
    });
  }, [data, query, estado]);

  const onVer = (p) => { lastFocus.current = document.activeElement; setSelected(p); setOpen(true); };
  const onClose = () => { setOpen(false); if (lastFocus.current?.focus) lastFocus.current.focus(); };

  const exportCSV = () => download("prescripciones.csv", toCSV(filtered));

  return (
    <>
      {/* Encabezado + nav no se incluyen aquí; en tu layout global puedes renderizarlos. 
          Esta vista renderiza el <main> y el drawer según tu HTML.  */}
      <main className="container">
        <section className="toolbar" aria-label="Herramientas">
          <input
            type="search"
            className="input input--search"
            placeholder="Buscar por paciente, folio o médico"
            aria-label="Buscar"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <select
            className="input input--estado"
            aria-label="Filtrar por estado"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          >
            <option>Todos</option>
            <option>Pendiente</option>
            <option>En preparación</option>
            <option>Parcial</option>
          </select>

          <button className="btn btn--export" onClick={exportCSV}>
            Exportar CSV
          </button>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Cola de prescripciones</h2>
          </div>
          <div className="table-wrap">
            <table className="table" aria-describedby="tabla-ayuda">
              <caption id="tabla-ayuda" className="sr-only">
                Lista de prescripciones con acciones de preparar y ver detalle.
              </caption>
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Folio</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Paciente</th>
                  <th scope="col">Médico</th>
                  <th scope="col">Ítems</th>
                  <th scope="col">Estado</th>
                  <th scope="col" className="col-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => <Fila key={p.id} p={p} onVer={onVer} />)}
              </tbody>
            </table>
          </div>
          <div className="empty" id="empty-state" hidden={filtered.length !== 0}>
            No hay prescripciones para mostrar.
          </div>
        </section>
      </main>

      <DrawerDetallePrescripciones open={open} onClose={onClose} presc={selected} />
    </>
  );
}
