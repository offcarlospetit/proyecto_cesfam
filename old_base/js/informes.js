(function () {
  const KEY = "inventarioCESFAM";
  const $ = (id) => document.getElementById(id);

  function getData() {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  }

  function filtrar(data) {
    const q = $("q").value.trim().toLowerCase();
    const estado = $("estado").value;

    return data.filter(p => {
      const matchQ = !q || p.codigo.toLowerCase().includes(q) || p.descripcion.toLowerCase().includes(q);
      let matchE = true;
      if (estado === "disponible") matchE = (p.disponible || 0) > 0;
      if (estado === "pendiente")  matchE = (p.pendienteDesecho || 0) > 0;
      if (estado === "sin_stock")  matchE = (p.disponible || 0) === 0;
      return matchQ && matchE;
    });
  }

  function resumen(data) {
    const d = data.reduce((a,p)=>({ 
      disp:a.disp+(p.disponible||0),
      resv:a.resv+(p.reservado||0),
      pend:a.pend+(p.pendienteDesecho||0),
      fis:a.fis+(p.fisico||0)
    }), {disp:0,resv:0,pend:0,fis:0});
    $("resumen").innerHTML = `<p><b>Totales en informe →</b> Disponible: ${d.disp} · Reservado: ${d.resv} · Pend. Desecho: ${d.pend} · Físico: ${d.fis}</p>`;
  }

  function render() {
    const data = filtrar(getData());
    resumen(data);
    const tbody = $("tabla").querySelector("tbody");
    tbody.innerHTML = "";
    data.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.codigo}</td>
        <td>${p.descripcion}</td>
        <td>${p.disponible || 0}</td>
        <td>${p.reservado || 0}</td>
        <td>${p.pendienteDesecho || 0}</td>
        <td>${p.fisico || 0}</td>`;
      tbody.appendChild(tr);
    });
  }

  function toCSV(data) {
    const header = ["codigo","descripcion","disponible","reservado","pendienteDesecho","fisico"];
    const rows = data.map(p => [p.codigo, p.descripcion, p.disponible||0, p.reservado||0, p.pendienteDesecho||0, p.fisico||0]);
    const csv = [header.join(","), ...rows.map(r=>r.join(","))].join("\n");
    const blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "informe_stock.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  $("btnFiltrar").addEventListener("click", (e)=>{ e.preventDefault(); render(); });
  $("btnImprimir").addEventListener("click", (e)=>{ e.preventDefault(); window.print(); });
  $("btnCSV").addEventListener("click", (e)=>{ 
    e.preventDefault(); 
    const data = filtrar(getData());
    toCSV(data);
  });

  render();
})();
