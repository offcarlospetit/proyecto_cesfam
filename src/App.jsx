import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Header from "./components/Header";

const MENU = [
  { to: "/", label: "Inicio" },
  { to: "/login", label: "Autenticación" },
  { to: "/stock", label: "Gestión de Stock" },
  { to: "/stock/agregar", label: "Agregar Stock" },
  { to: "/stock/bajas", label: "Bajas" },
  { to: "/prescripciones", label: "Prescripciones" },
  { to: "/prescripciones-pendientes", label: "Prescripciones Pendientes" },
  { to: "/informes", label: "Informes" },
  { to: "/reservas", label: "Reservas" },
  { to: "/recordatorios", label: "Recordatorios" },
  { to: "/reportes", label: "Reportes" },
  { to: "/ayuda", label: "Ayuda" },
];

// Carga diferida (lazy) — mantiene la idea de tu compañero
const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Stock = lazy(() => import("./pages/Stock.jsx"));
const StockAdd = lazy(() => import("./pages/StockAdd.jsx"));
const StockBajas = lazy(() => import("./pages/StockBajas.jsx"));
const Prescripciones = lazy(() => import("./pages/Prescripciones.jsx"));
const PrescripcionesPendientes = lazy(() => import("./pages/PrescripcionesPendientes.jsx"));
const Informes = lazy(() => import("./pages/Informes.jsx"));
const Reservas = lazy(() => import("./pages/Reservas.jsx"));
const Recordatorios = lazy(() => import("./pages/Recordatorios.jsx"));
const Reportes = lazy(() => import("./pages/Reportes.jsx"));
const Ayuda = lazy(() => import("./pages/Ayuda.jsx"));

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />
      <Navbar />

      <main className="container-page grow">
        <Suspense fallback={<div className="card">Cargando…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* Stock y subrutas */}
            <Route path="/stock" element={<Stock />} />
            <Route path="/stock/agregar" element={<StockAdd />} />
            <Route path="/stock/bajas" element={<StockBajas />} />

            {/* Otros módulos */}
            <Route path="/prescripciones" element={<Prescripciones />} />
            <Route path="/prescripciones-pendientes" element={<PrescripcionesPendientes />} />
            <Route path="/informes" element={<Informes />} />
            <Route path="/reservas" element={<Reservas />} />
            <Route path="/recordatorios" element={<Recordatorios />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/ayuda" element={<Ayuda />} />

            {/* Fallback */}
            <Route path="*" element={<div className="card">404</div>} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

