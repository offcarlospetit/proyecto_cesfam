import { NavLink } from "react-router-dom";
import { cx } from "../utils/cx";

export default function SiteHeader({
    title = "CESFAM",
    subtitle = "Farmacia",
    rightText = "Sistema de Gestión de Medicamentos",
    menu = [],
}) {
    const linkClass = ({ isActive }) =>
        cx(
            "px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-100",
            isActive && "bg-slate-200"
        );

    return (
        <>
            {/* Header */}
            <header className="border-b bg-white">
                <div className="container-page flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-slate-200" aria-hidden />
                        <div className="leading-tight">
                            <div className="font-semibold">{title}</div>
                            <div className="text-xs text-slate-500">{subtitle}</div>
                        </div>
                    </div>
                    <div className="ml-auto text-sm text-slate-600">
                        {rightText}
                    </div>
                </div>
            </header>

            {/* Navbar */}
            <nav className="bg-white">
                <div className="container-page flex flex-wrap gap-1">
                    {menu.map((item) => (
                        <NavLink key={item.to} to={item.to} className={linkClass}>
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </>
    );
}
