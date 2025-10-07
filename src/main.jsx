import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

if (import.meta.env.DEV) {
  import("./dev/seedInventory.js").then((m) => {
    // Ejecuta en consola del navegador:
    //   seedCESFAM()   -> carga datos demo
    //   clearCESFAM()  -> limpia datos
    window.seedCESFAM = m.seedInventoryDemo;
    window.clearCESFAM = m.clearInventoryDemo;
    console.log("Dev helpers:", { seedCESFAM: "seedCESFAM()", clearCESFAM: "clearCESFAM()" });
  });
}


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
