export default function StockBajas() {
    const onSubmit = (e) => {
        e.preventDefault();
        // TODO: Integrar con lógica/servicio (equivalente a CESFAMStock.bindBaja + render)
        alert("Baja registrada (demo).");
    };

    return (
        <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Bajas de Stock</h2>

            <form onSubmit={onSubmit} className="card grid gap-3 md:grid-cols-2">
                <div>
                    <label className="block text-sm mb-1">Código producto</label>
                    <input className="input" placeholder="Ej: PARA-500" required />
                </div>
                <div>
                    <label className="block text-sm mb-1">Motivo</label>
                    <select className="input">
                        <option value="vencimiento">Fecha de vencimiento</option>
                        <option value="mal_estado">Mal estado</option>
                        <option value="envase_roto">Envase roto</option>
                        <option value="otro">Otro</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm mb-1">Cantidad a dar de baja</label>
                    <input type="number" min={1} defaultValue={1} className="input" required />
                </div>
                <div>
                    <label className="block text-sm mb-1">Observaciones (opcional)</label>
                    <input className="input" placeholder="Observación" />
                </div>

                <div className="md:col-span-2 flex gap-2">
                    <button type="submit" className="btn">Registrar baja</button>
                </div>

                <p className="md:col-span-2 text-xs text-slate-600">
                    Nota: la baja descuenta el <b>stock disponible</b> y mueve esa cantidad a <b>pendiente de desecho</b>.
                    El <b>stock físico</b> se ajusta al confirmar el desecho.
                </p>
            </form>

            {/* Inventario (placeholder tabla + acciones) */}
            <div className="panel">
                <div className="panel-header">
                    <h3 className="text-lg font-semibold">Inventario</h3>
                    <div className="text-sm text-slate-500">Totales (demo)</div>
                </div>
                <div className="overflow-auto">
                    <table className="table">
                        <thead className="thead">
                            <tr>
                                <th className="th">Código</th>
                                <th className="th">Descripción</th>
                                <th className="th">Disponible</th>
                                <th className="th">Reservado</th>
                                <th className="th">Pend. Desecho</th>
                                <th className="th">Stock Físico</th>
                                <th className="th">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="hover:bg-slate-50">
                                <td className="td">—</td><td className="td">—</td><td className="td">—</td>
                                <td className="td">—</td><td className="td">—</td><td className="td">—</td>
                                <td className="td"><div className="inline-flex gap-2">
                                    <button className="btn-secondary">Confirmar desecho</button>
                                </div></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
