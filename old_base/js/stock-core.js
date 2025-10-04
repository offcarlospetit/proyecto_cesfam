// js/stock-core.js
// Estado mínimo de inventario en localStorage compartido por las vistas de stock.
(function (global) {
  const KEY = "inventarioCESFAM";
  const $id = (id) => document.getElementById(id);

  const api = {
    init() {
      // si no existe, crea un arreglo vacío
      const data = localStorage.getItem(KEY);
      if (!data) localStorage.setItem(KEY, "[]");
    },
    _load() {
      return JSON.parse(localStorage.getItem(KEY) || "[]");
    },
    _save(data) {
      localStorage.setItem(KEY, JSON.stringify(data));
    },
    _findByCodigo(data, codigo) {
      return data.find(p => p.codigo.toLowerCase() === codigo.toLowerCase());
    },
    bindIngreso(formId, msgId) {
      const form = $id(formId);
      const msg = $id(msgId);
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const f = (name) => form.querySelector("#" + name).value.trim();
        const codigo = f("codigo");
        const descripcion = f("descripcion");
        const fabricante = f("fabricante");
        const tipo = f("tipo");
        const contenido = f("contenido");
        const partida = f("partida");
        const vencimiento = form.querySelector("#vencimiento").value;
        const cantidad = parseInt(form.querySelector("#cantidad").value, 10) || 0;

        if (!codigo || !descripcion || !fabricante || !tipo || !contenido || !partida || !vencimiento || cantidad <= 0) {
          if (msg) msg.innerHTML = "<p style='color:red'>Completa todos los campos.</p>";
          return;
        }

        const data = api._load();
        let prod = api._findByCodigo(data, codigo);
        if (!prod) {
          prod = {
            codigo, descripcion, fabricante, tipo, contenido,
            disponible: 0, reservado: 0, pendienteDesecho: 0, fisico: 0,
            partidas: [], bajas: []
          };
          data.push(prod);
        }

        prod.partidas.push({ partida, vencimiento, cantidad, estado: "disponible" });
        prod.disponible += cantidad;
        prod.fisico += cantidad;

        api._save(data);
        form.reset();
        if (msg) msg.innerHTML = "<p style='color:green'>Ingreso registrado.</p>";
        // Actualiza vistas si existen
        api.renderResumenTabla("totales", "tablaInventario");
      });
    },
    bindBaja(formId, msgId) {
      const form = $id(formId);
      const msg = $id(msgId);
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const f = (name) => form.querySelector("#" + name).value.trim();
        const codigo = f("bajaCodigo");
        const motivo = form.querySelector("#bajaMotivo").value;
        const cantidad = parseInt(form.querySelector("#bajaCantidad").value, 10) || 0;
        const obs = f("bajaObs");

        const data = api._load();
        const prod = api._findByCodigo(data, codigo);
        if (!prod) { if (msg) msg.innerHTML = "<p style='color:red'>Producto no encontrado.</p>"; return; }
        if (cantidad <= 0) { if (msg) msg.innerHTML = "<p style='color:red'>Cantidad inválida.</p>"; return; }
        if ((prod.disponible || 0) < cantidad) { if (msg) msg.innerHTML = "<p style='color:red'>Stock disponible insuficiente.</p>"; return; }

        prod.disponible -= cantidad;
        prod.pendienteDesecho = (prod.pendienteDesecho || 0) + cantidad;
        prod.bajas.push({ fecha: new Date().toLocaleString(), motivo, cantidad, obs });

        api._save(data);
        form.reset();
        if (msg) msg.innerHTML = "<p style='color:orange'>Baja registrada. Pendiente de desecho físico.</p>";
        api.renderResumenTabla("totales", "tablaInventario", true);
      });
    },
    renderResumenTabla(totalesId, tablaId, conAccionDesecho=false) {
      const data = api._load();
      const totalDisp = data.reduce((a,p)=>a+(p.disponible||0),0);
      const totalResv = data.reduce((a,p)=>a+(p.reservado||0),0);
      const totalPend = data.reduce((a,p)=>a+(p.pendienteDesecho||0),0);
      const totalFis  = data.reduce((a,p)=>a+(p.fisico||0),0);

      const tot = $id(totalesId);
      if (tot) {
        tot.innerHTML = `<p><b>Totales</b> — Disponible: ${totalDisp} · Reservado: ${totalResv} · Pend. Desecho: ${totalPend} · Físico: ${totalFis}</p>`;
      }

      const table = $id(tablaId);
      if (!table) return;
      const tbody = table.querySelector("tbody");
      tbody.innerHTML = "";
      data.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${p.codigo}</td>
          <td>${p.descripcion}</td>
          <td>${p.disponible || 0}</td>
          <td>${p.reservado || 0}</td>
          <td>${p.pendienteDesecho || 0}</td>
          <td>${p.fisico || 0}</td>
          ${conAccionDesecho ? `<td>${(p.pendienteDesecho||0)>0 ? `<button class="btn-desechar" data-cod="${p.codigo}">Confirmar desecho</button>` : `<span style="color:#888">—</span>`}</td>` : ""}
        `;
        tbody.appendChild(tr);
      });

      if (conAccionDesecho) {
        tbody.querySelectorAll(".btn-desechar").forEach(btn => {
          btn.addEventListener("click", function(){
            const cod = this.getAttribute("data-cod");
            const data = api._load();
            const prod = api._findByCodigo(data, cod);
            if (!prod) return;
            const cant = prod.pendienteDesecho || 0;
            prod.fisico = Math.max(0, (prod.fisico || 0) - cant);
            prod.pendienteDesecho = 0;
            api._save(data);
            api.renderResumenTabla(totalesId, tablaId, true);
            alert(`Desecho confirmado para ${cod}. Se descontó ${cant} del stock físico.`);
          });
        });
      }
    }
  };

  // expone API simple
  global.CESFAMStock = api;
})(window);
