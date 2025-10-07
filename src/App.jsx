import { Routes, Route } from "react-router-dom";
import SiteHeader from "./components/SiteHeader.jsx";
import SiteFooter from "./components/SiteFooter.jsx";

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

const MENU = [
  { to: "/", label: "Inicio" },
  { to: "/login", label: "Autenticación" },
  { to: "/stock", label: "Gestión de Stock" },
  { to: "/prescripciones", label: "Prescripciones" },
  { to: "/prescripciones-pendientes", label: "Prescripciones Pendientes" },
  { to: "/informes", label: "Informes" },
  { to: "/reservas", label: "Reservas" },
  { to: "/recordatorios", label: "Recordatorios" },
  { to: "/reportes", label: "Reportes" },
  { to: "/ayuda", label: "Ayuda" },
];

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <SiteHeader menu={MENU} />

      <main className="container-page grow">
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

          {/* Fallback opcional */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <SiteFooter />
    </div>
  );
}

