export default function Login() {
    return (
        <section className="max-w-sm mx-auto">
            <h2 className="text-xl font-semibold mb-2">Iniciar Sesión</h2>
            <p className="text-sm text-slate-600 mb-4">Ingrese sus credenciales para acceder al sistema.</p>

            <form className="card space-y-3">
                <div>
                    <label className="block text-sm mb-1">Usuario</label>
                    <input className="w-full rounded border border-slate-300 px-3 py-2" />
                </div>
                <div>
                    <label className="block text-sm mb-1">Contraseña</label>
                    <input type="password" className="w-full rounded border border-slate-300 px-3 py-2" />
                </div>
                <button className="btn w-full">Ingresar</button>
                <div className="text-danger text-sm"> {/* mensajes de error aquí */}</div>
            </form>
        </section>
    );
}
