// src/components/Navbar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const navLink = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-100 ${
    isActive ? "bg-slate-200" : ""
  }`;

export default function Navbar() {
  return (
    <nav className="bg-white">
      <div className="container-page flex flex-wrap gap-1">
        <NavLink to="/" className={navLink} end>Inicio</NavLink>
        <NavLink to="/login" className={navLink}>Autenticación</NavLink>
        <NavLink to="/stock" className={navLink}>Gestión de Stock</NavLink>
        <NavLink to="/prescripciones" className={navLink}>Prescripciones</NavLink>
        <NavLink to="/prescripciones-pendientes" className={navLink}>Prescripciones Pendientes</NavLink>
        <NavLink to="/reservas" className={navLink}>Reservas</NavLink>
        <NavLink to="/recordatorios" className={navLink}>Recordatorios</NavLink>
        <NavLink to="/reportes" className={navLink}>Reportes</NavLink>
        <NavLink to="/ayuda" className={navLink}>Ayuda</NavLink>
      </div>
    </nav>
  );
}

