// ===============================
// prescripciones.js
// Lógica de Prescripciones y Recetas
// ===============================

// Simulación de base de datos
let prescripciones = []; // Guarda prescripciones
let contadorFolio = 1;   // Folio único incremental

// -------------------------------
// CU6: Consultar Stock Disponible
// -------------------------------
document.getElementById("btnConsultar").addEventListener("click", function (e) {
  e.preventDefault();

  const medicamento = document.getElementById("buscarMedicamento").value.trim();
  const tolerancia = parseInt(document.getElementById("tolerancia").value);

  let resultado = "";

  if (medicamento === "") {
    resultado = "<p style='color:red'>⚠️ Ingrese un medicamento.</p>";
  } else {
    const stockSimulado = Math.floor(Math.random() * 100);
    const stockRequerido = 50;

    if (stockSimulado >= (stockRequerido * tolerancia) / 100) {
      resultado = `<p style='color:green'>✅ Stock suficiente: ${stockSimulado} unidades disponibles.</p>`;
    } else {
      resultado = `<p style='color:orange'>⚠️ Stock insuficiente (${stockSimulado} unidades). Considere alternativa.</p>`;
    }
  }

  document.getElementById("resultadoStock").innerHTML = resultado;
});

// -------------------------------
// CU7: Guardar Prescripción
// -------------------------------
document.getElementById("btnGuardar").addEventListener("click", function (e) {
  e.preventDefault();

  const rut = document.getElementById("rutPaciente").value.trim();
  const nombre = document.getElementById("nombrePaciente").value.trim();
  const medicamento = document.getElementById("medicamento").value.trim();
  const dosis = document.getElementById("dosis").value.trim();
  const frecuencia = document.getElementById("frecuencia").value.trim();
  const duracion = document.getElementById("duracion").value.trim();

  if (!rut || !nombre || !medicamento || !dosis || !frecuencia || !duracion) {
    document.getElementById("msgPrescripcion").innerHTML =
      "<p style='color:red'>⚠️ Complete todos los campos.</p>";
    return;
  }

  const duplicada = prescripciones.some(
    (p) => p.rut === rut && p.medicamento.toLowerCase() === medicamento.toLowerCase()
  );

  if (duplicada) {
    document.getElementById("msgPrescripcion").innerHTML =
      "<p style='color:red'>⚠️ Ya existe una prescripción de este medicamento para este paciente.</p>";
    return;
  }

  const nuevaPrescripcion = {
    rut,
    nombre,
    medicamento,
    dosis,
    frecuencia,
    duracion,
    fecha: new Date().toLocaleString(),
    folio: contadorFolio++
  };

  prescripciones.push(nuevaPrescripcion);

  document.getElementById("msgPrescripcion").innerHTML =
    `<p style='color:green'>✅ Prescripción guardada con folio #${nuevaPrescripcion.folio}.</p>`;

  document.getElementById("formPrescripcion").reset();
});

// -------------------------------
// CU8: Emitir Receta en PDF
// -------------------------------
document.getElementById("btnReceta").addEventListener("click", function (e) {
  e.preventDefault();

  const rutPaciente = document.getElementById("recetaPaciente").value.trim();
  const prescripcion = prescripciones.find((p) => p.rut === rutPaciente);

  if (!prescripcion) {
    document.getElementById("msgReceta").innerHTML =
      "<p style='color:red'>⚠️ No se encontró prescripción para este paciente.</p>";
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("CESFAM - Receta Médica", 20, 20);
  doc.setFontSize(11);
  doc.text(`Folio: ${prescripcion.folio}`, 20, 30);
  doc.text(`Fecha: ${prescripcion.fecha}`, 20, 40);
  doc.text(`Paciente: ${prescripcion.nombre} (${prescripcion.rut})`, 20, 50);

  doc.text("Medicamento:", 20, 70);
  doc.text(`${prescripcion.medicamento}`, 50, 70);

  doc.text("Dosis:", 20, 80);
  doc.text(`${prescripcion.dosis}`, 50, 80);

  doc.text("Frecuencia:", 20, 90);
  doc.text(`${prescripcion.frecuencia}`, 50, 90);

  doc.text("Duración:", 20, 100);
  doc.text(`${prescripcion.duracion}`, 50, 100);

  doc.text("________________________", 20, 130);
  doc.text("Firma Médico", 20, 140);

  doc.save(`Receta_${prescripcion.folio}.pdf`);

  document.getElementById("msgReceta").innerHTML =
    `<p style='color:green'>✅ Receta emitida en PDF (folio #${prescripcion.folio}).</p>`;
});

// -------------------------------
// Historial de Paciente
// -------------------------------
document.getElementById("btnHistorial").addEventListener("click", function (e) {
  e.preventDefault();

  const rut = document.getElementById("rutHistorial").value.trim();

  if (!rut) {
    document.getElementById("resultadoHistorial").innerHTML =
      "<p style='color:red'>⚠️ Ingrese un RUT para consultar el historial.</p>";
    return;
  }

  const historial = prescripciones.filter((p) => p.rut === rut);

  if (historial.length === 0) {
    document.getElementById("resultadoHistorial").innerHTML =
      "<p>No hay prescripciones registradas para este paciente.</p>";
    return;
  }

  let tabla = "<table border='1' cellpadding='5'><tr><th>Folio</th><th>Medicamento</th><th>Dosis</th><th>Frecuencia</th><th>Duración</th><th>Fecha</th></tr>";
  historial.forEach((p) => {
    tabla += `<tr>
      <td>${p.folio}</td>
      <td>${p.medicamento}</td>
      <td>${p.dosis}</td>
      <td>${p.frecuencia}</td>
      <td>${p.duracion}</td>
      <td>${p.fecha}</td>
    </tr>`;
  });
  tabla += "</table>";

  document.getElementById("resultadoHistorial").innerHTML = tabla;
});

