(function () {
  const KEY = "inventarioCESFAM";
  const $ = (id) => document.getElementById(id);

  const load = () => JSON.parse(localStorage.getItem(KEY) || "[]");
  const save = (data) => localStorage.setItem(KEY, JSON.stringify(data));

  let inventario = load();

  const find = (codigo) =>
    inventario.find((p) => p.codigo.toLowerCase() === codigo.toLowerCase());

  function render() {
    const totalDisp = inventario.reduce((a, p) => a + (p.disponible || 0), 0);
    const totalResv = inventario.reduce((a, p) => a + (p.reservado || 0), 0);
    const totalPend = inventario.reduce(
      (a, p) => a + (p.pendienteDesecho || 0),
      0
    );
    const totalFis = inventario.reduce((a, p) => a + (p.fisico || 0), 0);

    $(
      "totales"
    ).innerHTML = `<p><b>Totales</b> — Disponible: ${totalDisp} · Reservado: ${totalResv} · Pend. Desecho: ${totalPend} · Físico: ${totalFis}</p>`;

    const tbody = $("tablaInventario").querySelector("tbody");
    tbody.innerHTML = "";
    inventario.forEach((p) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.codigo}</td>
        <td>${p.descripcion}</td>
        <td>${p.disponible || 0}</td>
        <td>${p.reservado || 0}</td>
        <td>${p.pendienteDesecho || 0}</td>
        <td>${p.fisico || 0}</td>
        <td>${
          (p.pendienteDesecho || 0) > 0
            ? `<button class="btn-desechar" data-cod="${p.codigo}">Confirmar desecho</button>`
            : `<span style="color:#888">—</span>`
        }</td>`;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll(".btn-desechar").forEach((btn) => {
      btn.addEventListener("click", function () {
        const cod = this.getAttribute("data-cod");
        const prod = find(cod);
        if (!prod) return;
        const cant = prod.pendienteDesecho || 0;
        prod.fisico = Math.max(0, (prod.fisico || 0) - cant);
        prod.pendienteDesecho = 0;
        save(inventario);
        render();
        alert(
          `Desecho confirmado para ${cod}. Se descontó ${cant} del stock físico.`
        );
      });
    });
  }

  $("formIngreso").addEventListener("submit", function (e) {
    e.preventDefault();
    const codigo = $("codigo").value.trim();
    const descripcion = $("descripcion").value.trim();
    const fabricante = $("fabricante").value.trim();
    const tipo = $("tipo").value.trim();
    const contenido = $("contenido").value.trim();
    const partida = $("partida").value.trim();
    const vencimiento = $("vencimiento").value;
    const cantidad = parseInt($("cantidad").value, 10) || 0;

    if (
      !codigo ||
      !descripcion ||
      !fabricante ||
      !tipo ||
      !contenido ||
      !partida ||
      !vencimiento ||
      cantidad <= 0
    ) {
      $("msgIngreso").innerHTML =
        "<p style='color:red'>Completa todos los campos.</p>";
      return;
    }

    let prod = find(codigo);
    if (!prod) {
      prod = {
        codigo,
        descripcion,
        fabricante,
        tipo,
        contenido,
        disponible: 0,
        reservado: 0,
        pendienteDesecho: 0,
        fisico: 0,
        partidas: [],
        bajas: [],
      };
      inventario.push(prod);
    }

    prod.partidas.push({
      partida,
      vencimiento,
      cantidad,
      estado: "disponible",
    });
    prod.disponible += cantidad;
    prod.fisico += cantidad;

    save(inventario);
    render();
    this.reset();
    $("msgIngreso").innerHTML =
      "<p style='color:green'>Ingreso registrado.</p>";
  });

  $("formBaja").addEventListener("submit", function (e) {
    e.preventDefault();
    const codigo = $("bajaCodigo").value.trim();
    const motivo = $("bajaMotivo").value;
    const cantidad = parseInt($("bajaCantidad").value, 10) || 0;
    const obs = $("bajaObs").value.trim();

    const prod = find(codigo);
    if (!prod) {
      $("msgBaja").innerHTML =
        "<p style='color:red'>Producto no encontrado.</p>";
      return;
    }
    if (cantidad <= 0) {
      $("msgBaja").innerHTML = "<p style='color:red'>Cantidad inválida.</p>";
      return;
    }
    if ((prod.disponible || 0) < cantidad) {
      $("msgBaja").innerHTML =
        "<p style='color:red'>Stock disponible insuficiente.</p>";
      return;
    }

    prod.disponible -= cantidad;
    prod.pendienteDesecho = (prod.pendienteDesecho || 0) + cantidad;
    prod.bajas.push({
      fecha: new Date().toLocaleString(),
      motivo,
      cantidad,
      obs,
    });

    save(inventario);
    render();
    this.reset();
    $("msgBaja").innerHTML =
      "<p style='color:orange'>Baja registrada. Pendiente de desecho físico.</p>";
  });

  render();
})();
