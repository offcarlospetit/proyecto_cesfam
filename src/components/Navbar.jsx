// src/components/Navbar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const navLink = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-100 ${isActive ? 'bg-slate-200' : ''}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white">
      <div className="container-page flex flex-wrap gap-1 items-center">
        <NavLink to="/" className={navLink} end>Inicio</NavLink>

        {!user && <NavLink to="/login" className={navLink}>Autenticación</NavLink>}

        {/* Módulos visibles sólo si hay sesión */}
        {user && (
          <>
            <NavLink to="/stock" className={navLink}>Gestión de Stock</NavLink>
            <NavLink to="/prescripciones" className={navLink}>Prescripciones</NavLink>
            <NavLink to="/prescripciones-pendientes" className={navLink}>Prescripciones Pendientes</NavLink>
            <NavLink to="/reservas" className={navLink}>Reservas</NavLink>
            <NavLink to="/recordatorios" className={navLink}>Recordatorios</NavLink>
            <NavLink to="/reportes" className={navLink}>Reportes</NavLink>
          </>
        )}

        <NavLink to="/ayuda" className={navLink}>Ayuda</NavLink>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-slate-600">Hola, <b>{user?.nombre || user?.email}</b></span>
              <button
                className="px-3 py-2 rounded-md text-sm font-medium bg-slate-900 text-white"
                onClick={() => { logout(); navigate('/login'); }}
              >
                Salir
              </button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
