/* test bc */
import { NavLink, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home.jsx";

// Carga diferida: si un módulo rompe, no cae toda la app
const Login = lazy(()=>import("./pages/Login.jsx"));
const Stock = lazy(()=>import("./pages/Stock.jsx"));
const StockAdd = lazy(()=>import("./pages/StockAdd.jsx"));
const StockBajas = lazy(()=>import("./pages/StockBajas.jsx"));
const Prescripciones = lazy(()=>import("./pages/Prescripciones.jsx"));
const PrescripcionesPendientes = lazy(()=>import("./pages/PrescripcionesPendientes.jsx"));
const Informes = lazy(()=>import("./pages/Informes.jsx")); // o elimínalo si ya no lo usas
const Reservas = lazy(()=>import("./pages/Reservas.jsx"));
const Recordatorios = lazy(()=>import("./pages/Recordatorios.jsx"));
const Reportes = lazy(()=>import("./pages/Reportes.jsx"));
const Ayuda = lazy(()=>import("./pages/Ayuda.jsx"));

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <Navbar />

      <main className="container-page">
        <Suspense fallback={<div className="card">Cargando…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
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
            <Route path="*" element={<div className="card">404</div>} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}