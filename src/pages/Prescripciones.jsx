import { useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import Table from "../components/Table";
import TableToolbar from "../components/TableToolbar";
import { toRows } from "../utils/inventoryStorage";
import { add, existsDuplicate, lastByRut, byRut } from "../utils/prescripcionesStorage";

export default function Prescripciones() {
  const [medBuscado, setMedBuscado] = useState("");
  const [tolerancia, setTolerancia] = useState(95);
  const [requerido, setRequerido] = useState(50);
  const [resultadoStock, setResultadoStock] = useState(null);

  function consultarStock(e) {
    e?.preventDefault?.();
    const med = medBuscado.trim().toLowerCase();
    if (!med) { setResultadoStock({ type: "error", msg: "⚠️ Ingrese un medicamento." }); return; }

    const items = toRows().filter(r =>
      String(r.descripcion || "").toLowerCase().includes(med) ||
      String(r.codigo || "").toLowerCase() === med
    );
    const disponible = items.reduce((a, r) => a + (r.disponible || 0), 0);
    const umbral = (requerido * Number(tolerancia)) / 100;

    if (disponible >= umbral) {
      setResultadoStock({ type: "ok", msg: `✅ Stock suficiente: ${disponible} unidades disponibles.` });
    } else {
      setResultadoStock({ type: "warn", msg: `⚠️ Stock insuficiente (${disponible} unidades). Considere alternativa.` });
    }
  }

  const [form, setForm] = useState({
    rut: "", nombre: "", medicamento: "", dosis: "", frecuencia: "", duracion: ""
  });
  const [msgPresc, setMsgPresc] = useState(null);

  function onChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function guardarPrescripcion(e) {
    e.preventDefault();
    const { rut, nombre, medicamento, dosis, frecuencia, duracion } = form;
    if ([rut, nombre, medicamento, dosis, frecuencia, duracion].some(v => !String(v).trim())) {
      setMsgPresc({ type: "error", msg: "⚠️ Complete todos los campos." }); return;
    }
    if (existsDuplicate(rut.trim(), medicamento.trim())) {
      setMsgPresc({ type: "error", msg: "⚠️ Ya existe una prescripción de este medicamento para este paciente." }); return;
    }
    const p = add({
      rut: rut.trim(),
      nombre: nombre.trim(),
      medicamento: medicamento.trim(),
      dosis: dosis.trim(),
      frecuencia: frecuencia.trim(),
      duracion: duracion.trim(),
    });
    setMsgPresc({ type: "ok", msg: `✅ Prescripción guardada con folio #${p.folio}.` });
    setForm({ rut: "", nombre: "", medicamento: "", dosis: "", frecuencia: "", duracion: "" });
  }

  const [rutPDF, setRutPDF] = useState("");
  const [msgPDF, setMsgPDF] = useState(null);

  function emitirPDF(e) {
    e.preventDefault();
    const presc = lastByRut(rutPDF.trim());
    if (!presc) {
      setMsgPDF({ type: "error", msg: "⚠️ No se encontró prescripción para este paciente." }); return;
    }
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("CESFAM - Receta Médica", 20, 20);
    doc.setFontSize(11);
    doc.text(`Folio: ${presc.folio}`, 20, 30);
    doc.text(`Fecha: ${presc.fecha}`, 20, 40);
    doc.text(`Paciente: ${presc.nombre} (${presc.rut})`, 20, 50);

    doc.text("Medicamento:", 20, 70); doc.text(`${presc.medicamento}`, 50, 70);
    doc.text("Dosis:", 20, 80); doc.text(`${presc.dosis}`, 50, 80);
    doc.text("Frecuencia:", 20, 90); doc.text(`${presc.frecuencia}`, 50, 90);
    doc.text("Duración:", 20, 100); doc.text(`${presc.duracion}`, 50, 100);

    doc.text("________________________", 20, 130);
    doc.text("Firma Médico", 20, 140);

    doc.save(`Receta_${presc.folio}.pdf`);
    setMsgPDF({ type: "ok", msg: `✅ Receta emitida en PDF (folio #${presc.folio}).` });
  }

  const [rutHist, setRutHist] = useState("");
  const historial = useMemo(() => rutHist.trim() ? byRut(rutHist.trim()) : [], [rutHist]);

  const colHist = [
    { key: "folio", header: "Folio" },
    { key: "medicamento", header: "Medicamento" },
    { key: "dosis", header: "Dosis" },
    { key: "frecuencia", header: "Frecuencia" },
    { key: "duracion", header: "Duración" },
    { key: "fecha", header: "Fecha" },
  ];

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Prescripciones Médicas</h2>
      <p className="text-sm text-slate-600">Gestione y revise las recetas médicas de los pacientes.</p>

      <div className="card">
        <h3 className="text-lg font-semibold mb-3">Revisar Stock Disponible</h3>
        <form onSubmit={consultarStock} className="grid gap-3 md:grid-cols-3 items-end">
          <div>
            <label className="block text-sm mb-1">Buscar medicamento</label>
            <input className="input" value={medBuscado} onChange={e => setMedBuscado(e.target.value)} placeholder="Ej: Paracetamol 500mg" />
          </div>
          <div>
            <label className="block text-sm mb-1">Tolerancia (%)</label>
            <input className="input" type="number" min={0} max={100} value={tolerancia} onChange={e => setTolerancia(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Cantidad requerida</label>
            <input className="input" type="number" min={1} value={requerido} onChange={e => setRequerido(e.target.value)} />
          </div>
          <div className="md:col-span-3"><button className="btn">Consultar</button></div>
        </form>
        {resultadoStock && (
          <p className={
            resultadoStock.type === "ok" ? "mt-3 text-green-700" :
              resultadoStock.type === "warn" ? "mt-3 text-orange-700" :
                "mt-3 text-red-700"
          }>
            {resultadoStock.msg}
          </p>
        )}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-3">Generar Nueva Receta</h3>
        <form onSubmit={guardarPrescripcion} className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">RUT Paciente</label>
            <input className="input" name="rut" value={form.rut} onChange={onChange}
              placeholder="Ej: 12345678-9" pattern="^\d{7,8}-[0-9Kk]$"
              title="Ingrese RUT sin puntos, con guion y dígito verificador (0-9 o K)" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Nombre Paciente</label>
            <input className="input" name="nombre" value={form.nombre} onChange={onChange} placeholder="Ej: Juan Pérez" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Medicamento</label>
            <input className="input" name="medicamento" value={form.medicamento} onChange={onChange} placeholder="Ej: Paracetamol 500mg" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Dosis</label>
            <input className="input" name="dosis" value={form.dosis} onChange={onChange} placeholder="Ej: 1 tableta" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Frecuencia</label>
            <input className="input" name="frecuencia" value={form.frecuencia} onChange={onChange} placeholder="Ej: cada 8 hrs" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Duración del tratamiento</label>
            <input className="input" name="duracion" value={form.duracion} onChange={onChange} placeholder="Ej: 7 días" required />
          </div>

          <div className="md:col-span-2 flex justify-end gap-2">
            <button className="btn">Guardar Prescripción</button>
          </div>
        </form>
        {msgPresc && (
          <p className={
            msgPresc.type === "ok" ? "mt-3 text-green-700" :
              "mt-3 text-red-700"
          }>
            {msgPresc.msg}
          </p>
        )}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-3">Emitir Receta</h3>
        <form onSubmit={emitirPDF} className="grid gap-3 md:grid-cols-2 items-end">
          <div>
            <label className="block text-sm mb-1">RUT Paciente</label>
            <input
              className="input"
              value={rutPDF}
              onChange={e => setRutPDF(e.target.value)}
              placeholder="Ej: 12345678-K"
              pattern="^\d{7,8}-[0-9Kk]$"
              title="Ingrese RUT sin puntos, con guion y dígito verificador (0-9 o K)"
              required
            />
          </div>
          <div className="flex gap-2">
            <button className="btn">Generar Receta PDF</button>
          </div>
        </form>
        {msgPDF && (
          <p className={
            msgPDF.type === "ok" ? "mt-3 text-green-700" :
              "mt-3 text-red-700"
          }>
            {msgPDF.msg}
          </p>
        )}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-3">Historial de Paciente</h3>
        <div className="flex flex-wrap items-end gap-2 mb-2">
          <div>
            <label className="block text-sm mb-1">RUT Paciente</label>
            <input className="input" value={rutHist} onChange={e => setRutHist(e.target.value)}
              placeholder="Ej: 12345678-K" pattern="^\d{7,8}-[0-9Kk]$"
              title="Ingrese RUT sin puntos, con guion y dígito verificador (0-9 o K)" />
          </div>
        </div>
        <Table columns={colHist} data={historial} rowKey={(r) => `${r.rut}-${r.folio}`} />
        {rutHist.trim() && historial.length === 0 && (
          <p className="mt-2 text-slate-600">No hay prescripciones registradas para este paciente.</p>
        )}
      </div>
    </section>
  );
}
