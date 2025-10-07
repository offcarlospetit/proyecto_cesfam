import { useEffect, useMemo, useState } from "react";
import Table from "../components/Table";
import TableToolbar from "../components/TableToolbar";
import { ensureInit, toRows } from "../utils/inventoryStorage";
import { toCsv, downloadCsv } from "../utils/csv";

const FILTERS = [
  { id: "all", label: "Todos" },
  { id: "disp", label: "Con disponible" },
  { id: "pend", label: "Con pendiente de desecho" },
  { id: "res", label: "Con reservado" },
  { id: "crit", label: "Bajo crítico" },
];

export default function Informes() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [crit, setCrit] = useState(10); // umbral crítico por defecto

  useEffect(() => { ensureInit(); setRows(toRows()); }, []);

  const columns = useMemo(() => [
    { key: "codigo", header: "Código" },
    { key: "descripcion", header: "Descripción" },
    { key: "disponible", header: "Disponible" },
    { key: "reservado", header: "Reservado" },
    { key: "pendienteDesecho", header: "Pend. Desecho" },
    { key: "fisico", header: "Stock Físico" },
  ], []);

  const filtered = rows
    .filter(r => !q || [r.codigo, r.descripcion].some(x => String(x).toLowerCase().includes(q.toLowerCase())))
    .filter(r => {
      if (filter === "all") return true;
      if (filter === "disp") return (r.disponible || 0) > 0;
      if (filter === "pend") return (r.pendienteDesecho || 0) > 0;
      if (filter === "res") return (r.reservado || 0) > 0;
      if (filter === "crit") return (r.disponible || 0) <= Number(crit);
      return true;
    });

  const onExport = () => {
    const csv = toCsv(filtered, columns);
    downloadCsv("informe-stock.csv", csv);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Informes de Stock</h2>
      <TableToolbar onSearch={setQ} placeholder="Buscar por código o descripción…">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input">
          {FILTERS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
        </select>
        {filter === "crit" && (
          <div className="flex items-center gap-2"><span className="text-sm">Umbral</span>
            <input type="number" className="input w-24" value={crit} min={0} onChange={(e) => setCrit(e.target.value)} />
          </div>
        )}
        <button className="btn" onClick={onExport}>Exportar CSV</button>
      </TableToolbar>

      <Table columns={columns} data={filtered} rowKey={(r) => r.codigo} />
    </section>
  );
}