import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom"; // 👈 nuevo
import Table from "../components/Table";
import TableToolbar from "../components/TableToolbar";
import {
    ensureInit,
    registrarBaja,
    confirmarDesecho,
    resumenTotales,
    toRows,
} from "../utils/inventoryApi.js";

export default function StockBajas() {
    const [tot, setTot] = useState({ totalDisp: 0, totalResv: 0, totalPend: 0, totalFis: 0 });
    const [rows, setRows] = useState([]);
    const refresh = () => { setTot(resumenTotales()); setRows(toRows()); };

    useEffect(() => { ensureInit(); refresh(); }, []);

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
        const f = (n) => e.target[n].value.trim();
        try {
            registrarBaja({
                codigo: f("bajaCodigo"),
                motivo: e.target["bajaMotivo"].value,
                cantidad: parseInt(e.target["bajaCantidad"].value, 10) || 0,
                obs: f("bajaObs"),
            });
            e.target.reset();
            alert("Baja registrada. Pendiente de desecho físico.");
            refresh();
        } catch (err) {
            alert(err.message || "Error en baja");
        }
    }

    const [q, setQ] = useState("");
    const filtered = rows.filter(r =>
        !q || [r.codigo, r.descripcion].some(x => String(x).toLowerCase().includes(q.toLowerCase()))
    );

    return (
        <section className="space-y-4">
            {/* Back / breadcrumb */}
            <div className="flex items-center justify-between">
                <Link to="/stock" className="btn">← Volver a Gestión de Stock</Link>
            </div>

            <h2 className="text-2xl font-semibold">Bajas de Stock</h2>

            <form onSubmit={onSubmit} className="card grid gap-3 md:grid-cols-2">
                <div>
                    <label className="block text-sm mb-1">Código producto</label>
                    <input name="bajaCodigo" className="input" required />
                </div>
                <div>
                    <label className="block text-sm mb-1">Motivo</label>
                    <select name="bajaMotivo" className="input">
                        <option value="vencimiento">Fecha de vencimiento</option>
                        <option value="mal_estado">Mal estado</option>
                        <option value="envase_roto">Envase roto</option>
                        <option value="otro">Otro</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm mb-1">Cantidad a dar de baja</label>
                    <input name="bajaCantidad" type="number" min={1} defaultValue={1} className="input" required />
                </div>
                <div>
                    <label className="block text-sm mb-1">Observaciones (opcional)</label>
                    <input name="bajaObs" className="input" />
                </div>

                <div className="md:col-span-2 text-xs text-slate-600">
                    Nota: la baja descuenta el <b>stock disponible</b> y mueve esa cantidad a <b>pendiente de desecho</b>.
                    El <b>stock físico</b> se ajusta al confirmar el desecho.
                </div>

                <div className="md:col-span-2 flex gap-2 justify-end">
                    <Link to="/stock" className="btn-danger">Cancelar</Link>
                    <button type="submit" className="btn">Registrar baja</button>
                </div>
            </form>

            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Inventario</h3>
                <div className="text-sm text-slate-600">
                    Totales — Disponible: {tot.totalDisp} · Reservado: {tot.totalResv} · Pend. Desecho: {tot.totalPend} · Físico: {tot.totalFis}
                </div>

                <TableToolbar onSearch={setQ} placeholder="Buscar por código o descripción…" />

                <Table
                    columns={columns}
                    data={filtered}
                    rowKey={(r) => r.codigo}
                    rowActions={(r) =>
                        (r.pendienteDesecho || 0) > 0 ? (
                            <button
                                className="btn-secondary"
                                onClick={() => {
                                    const descontado = confirmarDesecho(r.codigo);
                                    alert(`Desecho confirmado para ${r.codigo}. Se descontó ${descontado} del stock físico.`);
                                    refresh();
                                }}
                            >
                                Confirmar desecho
                            </button>
                        ) : (
                            <span className="text-slate-400">—</span>
                        )
                    }
                />
            </div>
        </section>
    );
}
