import { NavLink, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Stock from "./pages/Stock.jsx";
import StockAdd from "./pages/StockAdd.jsx";
import StockBajas from "./pages/StockBajas.jsx";
import Prescripciones from "./pages/Prescripciones.jsx";
import PrescripcionesPendientes from "./pages/PrescripcionesPendientes.jsx";
import Informes from "./pages/Informes.jsx";
import Reservas from "./pages/Reservas.jsx";
import Recordatorios from "./pages/Recordatorios.jsx";
import Reportes from "./pages/Reportes.jsx";
import Ayuda from "./pages/Ayuda.jsx";

const navLink = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-100 ${isActive ? "bg-slate-200" : ""}`;

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container-page flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded bg-slate-200" />
            <div className="leading-tight">
              <div className="font-semibold">CESFAM</div>
              <div className="text-xs text-slate-500">Farmacia</div>
            </div>
          </div>
          <div className="ml-auto text-sm text-slate-600">
            Sistema de Gestión de Medicamentos
          </div>
        </div>
      </header>

      {/* Navbar */}
      <nav className="bg-white">
        <div className="container-page flex flex-wrap gap-1">
          <NavLink to="/" className={navLink}>Inicio</NavLink>
          <NavLink to="/login" className={navLink}>Autenticación</NavLink>
          <NavLink to="/stock" className={navLink}>Gestión de Stock</NavLink>
          <NavLink to="/prescripciones" className={navLink}>Prescripciones</NavLink>
          <NavLink to="/prescripciones-pendientes" className={navLink}>Prescripciones Pendientes</NavLink>
          <NavLink to="/informes" className={navLink}>Informes</NavLink>
          <NavLink to="/reservas" className={navLink}>Reservas</NavLink>
          <NavLink to="/recordatorios" className={navLink}>Recordatorios</NavLink>
          <NavLink to="/reportes" className={navLink}>Reportes</NavLink>
          <NavLink to="/ayuda" className={navLink}>Ayuda</NavLink>
        </div>
      </nav>

      {/* Rutas */}
      <main className="container-page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Stock y subrutas */}
          <Route path="/stock" element={<Stock />} />
          <Route path="/stock/agregar" element={<StockAdd />} />
          <Route path="/stock/bajas" element={<StockBajas />} />

          <Route path="/prescripciones" element={<Prescripciones />} />
          <Route path="/prescripciones-pendientes" element={<PrescripcionesPendientes />} />
          <Route path="/informes" element={<Informes />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/recordatorios" element={<Recordatorios />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/ayuda" element={<Ayuda />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="container-page text-xs text-slate-500">
          <p>Desarrollado por Equipo Caso 17 “Automatización Libreta de Medicamentos CESFAM”</p>
          <p>© 2025 - Sistema CESFAM Farmacia - Ministerio de Salud - Chile</p>
        </div>
      </footer>
    </div>
  );
}
