// src/components/Header.jsx
import React from "react";
import logo from "../assets/telesalud-dark.svg"; // SVG antiguo

export default function Header() {
  return (
    <header className="bg-[#0D4B78] text-white">
      <div className="container-page flex items-center gap-4 py-3">
        {/* Logo */}
        <img
          src={logo}
          alt="TeleSalud"
          className="h-15 w-auto select-none"
          draggable="false"
        />

        {/* Texto CESFAM / Farmacia */}
        <div className="leading-tight">
          <div className="text-lg font-semibold tracking-wide">CESFAM</div>
          <div className="text-sm/4 opacity-90">Farmacia</div>
        </div>

        {/* Título a la derecha */}
        <div className="ml-auto text-sm sm:text-base opacity-95">
          Sistema de Gestión de Medicamentos
        </div>
      </div>
    </header>
  );
}


