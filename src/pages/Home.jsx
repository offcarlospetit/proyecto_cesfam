export default function Home() {
    return (
        <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Bienvenido al Sistema de Farmacia CESFAM</h2>
            <p>Selecciona un módulo para comenzar.</p>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="card">
                    <h3 className="text-lg font-semibold">Recordatorios de Retiro (CU13)</h3>
                    <p>Programa avisos por correo/SMS antes del próximo retiro.</p>
                </div>
                <div className="card">
                    <h3 className="text-lg font-semibold">Reportes Transversales</h3>
                    <p>KPIs, atrasos, reservas y stock bajo crítico.</p>
                </div>
            </div>
        </section>
    );
}
