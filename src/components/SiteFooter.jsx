export default function SiteFooter({
    lines = [
        "Desarrollado por Equipo Caso 17 “Automatización Libreta de Medicamentos CESFAM”",
        "© 2025 - Sistema CESFAM Farmacia - Ministerio de Salud - Chile",
    ],
    className = "",
}) {
    return (
        <footer className={`mt-auto border-t bg-white ${className}`}>
            <div className="container-page text-xs text-slate-500 space-y-1">
                {lines.map((t, i) => (<p key={i}>{t}</p>))}
            </div>
        </footer>
    );
}