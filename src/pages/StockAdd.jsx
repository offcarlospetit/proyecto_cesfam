import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";                 // 👈 nuevo
import TableToolbar from "../components/TableToolbar";
import { Table } from "../components/Table";
import { ensureInit, upsertIngreso, resumenTotales, toRows } from "../utils/inventoryStorage.js";

export default function StockAdd() {
  const [tot, setTot] = useState({ totalDisp: 0, totalResv: 0, totalPend: 0, totalFis: 0 });
  const [rows, setRows] = useState([]);

  useEffect(() => { ensureInit(); refresh(); }, []);
  const refresh = () => { setTot(resumenTotales()); setRows(toRows()); };

  const columns = useMemo(() => [
    { key: "codigo", header: "Código" },
    { key: "descripcion", header: "Descripción" },
    { key: "disponible", header: "Disponible" },
    { key: "reservado", header: "Reservado" },
    { key: "pendienteDesecho", header: "Pend. Desecho" },
    { key: "fisico", header: "Stock Físico" },
  ], []);

  function onSubmit(e) {
    e.preventDefault();
    const f = (name) => e.target[name].value.trim();
    const payload = {
      codigo: f("codigo"),
      descripcion: f("descripcion"),
      fabricante: f("fabricante"),
      tipo: f("tipo"),
      contenido: f("contenido"),
      partida: f("partida"),
      vencimiento: e.target["vencimiento"].value,
      cantidad: parseInt(e.target["cantidad"].value, 10) || 0,
    };
    if (Object.values(payload).some(v => v === "" || v === null) || payload.cantidad <= 0) {
      alert("Completa todos los campos.");
      return;
    }
    upsertIngreso(payload);
    e.target.reset();
    alert("Ingreso registrado.");
    refresh();
  }

  const [q, setQ] = useState("");
  const filtered = rows.filter(r =>
    !q || [r.codigo, r.descripcion].some(x => String(x).toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <section className="space-y-4">
      {/* Back / breadcrumb */}
      <div className="flex items-center justify-between">
        <Link to="/stock" className="btn-secondary">← Volver a Gestión de Stock</Link>
      </div>

      <h2 className="text-2xl font-semibold">Ingreso de Medicamentos</h2>

      <form onSubmit={onSubmit} className="card grid gap-3 md:grid-cols-2">
        <div><label className="block text-sm mb-1">Código</label><input name="codigo" className="input" required /></div>
        <div><label className="block text-sm mb-1">Descripción</label><input name="descripcion" className="input" required /></div>
        <div><label className="block text-sm mb-1">Fabricante</label><input name="fabricante" className="input" required /></div>
        <div><label className="block text-sm mb-1">Tipo</label><input name="tipo" className="input" required /></div>
        <div><label className="block text-sm mb-1">Contenido / Gramaje</label><input name="contenido" className="input" required /></div>
        <div className="md:col-span-2"><hr className="border-border" /></div>
        <div><label className="block text-sm mb-1">N° Lote / Partida</label><input name="partida" className="input" required /></div>
        <div><label className="block text-sm mb-1">Fecha de Vencimiento</label><input name="vencimiento" type="date" className="input" required /></div>
        <div><label className="block text-sm mb-1">Cantidad</label><input name="cantidad" type="number" min={1} defaultValue={1} className="input" required /></div>

        <div className="md:col-span-2 flex gap-2 justify-end">
          <Link to="/stock" className="btn-secondary">Cancelar</Link>
          <button className="btn">Ingresar</button>
        </div>
      </form>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Inventario</h3>
        <div className="text-sm text-slate-600">
          Totales — Disponible: {tot.totalDisp} · Reservado: {tot.totalResv} · Pend. Desecho: {tot.totalPend} · Físico: {tot.totalFis}
        </div>
        <TableToolbar onSearch={setQ} placeholder="Buscar por código o descripción…" />
        <Table columns={columns} data={filtered} rowKey={(r) => r.codigo} />
      </div>
    </section>
  );
}
