import { Link } from "react-router-dom";

export default function Stock() {
    return (
        <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Gestión de Stock</h2>
            <p className="text-sm text-slate-600">Seleccione una acción para continuar.</p>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="card">
                    <h3 className="text-lg font-semibold mb-2">Ingreso de Medicamentos</h3>
                    <p className="text-sm text-slate-600">Registre nuevas partidas (lotes) y cantidades que ingresan a bodega.</p>
                    <div className="mt-3">
                        <Link to="/stock/agregar" className="btn">Ir a Agregar Stock</Link>
                    </div>
                </div>
                <div className="card">
                    <h3 className="text-lg font-semibold mb-2">Bajas de Stock</h3>
                    <p className="text-sm text-slate-600">Registre vencimientos, mal estado u otros motivos de baja.</p>
                    <div className="mt-3">
                        <Link to="/stock/bajas" className="btn">Ir a Bajas</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
