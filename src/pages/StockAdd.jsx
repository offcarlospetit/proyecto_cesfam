export default function StockAdd() {
  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: Integrar con lógica/servicio (equivalente a CESFAMStock.bindIngreso + render)
    //       De momento, sólo placeholder.
    alert("Ingreso registrado (demo).");
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Ingreso de Medicamentos</h2>
      <p className="text-sm text-slate-600">Registra nuevas partidas y cantidades que ingresan a bodega.</p>

      <form onSubmit={onSubmit} className="card grid gap-3 md:grid-cols-2">
        <div>
          <label className="block text-sm mb-1">Código</label>
          <input className="input" placeholder="Ej: PARA-500" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Descripción</label>
          <input className="input" placeholder="Paracetamol 500 mg" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Fabricante</label>
          <input className="input" placeholder="ACME Labs" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Tipo</label>
          <input className="input" placeholder="Tabletas" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Contenido / Gramaje</label>
          <input className="input" placeholder="500 mg" required />
        </div>

        <div className="md:col-span-2"><hr className="border-border" /></div>

        <div>
          <label className="block text-sm mb-1">N° Lote / Partida</label>
          <input className="input" placeholder="L2301" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Fecha de Vencimiento</label>
          <input type="date" className="input" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Cantidad</label>
          <input type="number" min={1} defaultValue={1} className="input" required />
        </div>

        <div className="md:col-span-2 flex gap-2">
          <button type="submit" className="btn">Ingresar</button>
        </div>
      </form>

      {/* Inventario (placeholder tabla) */}
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
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-slate-50">
                <td className="td">—</td><td className="td">—</td><td className="td">—</td>
                <td className="td">—</td><td className="td">—</td><td className="td">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
