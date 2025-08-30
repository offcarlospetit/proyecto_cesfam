//DEMO: Prescripciones.js
//IMPORTANTE: SI EJECUTA ESTE CÓDIGO PARA USAR EL DEMO CON LA DESCARGA DEL PDF DEBE SER EN UN LOCALHOTS
// CHROME NO PERMITE DESCARGAR IMÁGENES DESDE EL SISTEMA DE ARCHIVOS DIRECTAMENTE POR SEGURIDAD,
// USE LIVE SERVER O SIMILAR.

// Validar RUT chileno: 7 u 8 dígitos, guion y dígito verificador (0-9 o K)
function validarRut(rut) {
  const regex = /^\d{7,8}-[0-9Kk]$/;
  return regex.test(rut);
}

// CU6: Consultar stock
document.getElementById("btnConsultar").addEventListener("click", function(e){
  e.preventDefault();
  const med = document.getElementById("buscarMedicamento").value.trim();
  const result = document.getElementById("resultadoStock");
  if(med){
    result.innerHTML = `<p><strong>${med}</strong> - Stock disponible: 120 unidades</p>`;
  } else {
    result.innerHTML = "<p style='color:red;'>Ingrese un medicamento para consultar stock.</p>";
  }
});

// CU7: Guardar prescripción
document.getElementById("btnGuardar").addEventListener("click", function(e){
  e.preventDefault();
  const rut = document.getElementById("rutPaciente").value.trim().toUpperCase();
  const med = document.getElementById("medicamento").value.trim();
  const dosis = document.getElementById("dosis").value.trim();
  const duracion = document.getElementById("duracion").value.trim();
  const msg = document.getElementById("msgPrescripcion");

  if(!validarRut(rut)){
    msg.innerHTML = "<p style='color:red;'>Ingrese un RUT válido (sin puntos, con guion y dígito verificador 0-9 o K).</p>";
    return;
  }

  if(rut && med && dosis && duracion){
    msg.innerHTML = `<p style="color:green;">Prescripción guardada para paciente <strong>${rut}</strong> con medicamento <strong>${med}</strong>.</p>`;
  } else {
    msg.innerHTML = "<p style='color:red;'>Complete todos los campos antes de guardar.</p>";
  }
});

// CU8: Generar receta PDF con logo y título debajo del logo
document.getElementById("btnReceta").addEventListener("click", function(e){
  e.preventDefault();

  const rut = document.getElementById("recetaPaciente").value.trim().toUpperCase();
  const msg = document.getElementById("msgReceta");

  const med = document.getElementById("medicamento").value.trim();
  const dosis = document.getElementById("dosis").value.trim();
  const duracion = document.getElementById("duracion").value.trim();

  if(!validarRut(rut)){
    msg.innerHTML = "<p style='color:red;'>Ingrese un RUT válido (sin puntos, con guion y dígito verificador 0-9 o K).</p>";
    return;
  }

  if(!med || !dosis || !duracion){
    msg.innerHTML = "<p style='color:red;'>Complete los datos de la prescripción antes de generar la receta.</p>";
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Bordes
  doc.setDrawColor(0, 102, 204);
  doc.setLineWidth(1.5);
  doc.rect(10, 10, 190, 277);

  // Nuevo logo PNG
  const img = new Image();
  img.src = './image/telesalud cesfam farmacia.png';
  
  img.onload = function() {
    const logoWidth = 100;
    const aspectRatio = img.height / img.width;
    const logoHeight = logoWidth * aspectRatio;

    // Logo esquina superior izquierda
    doc.addImage(img, 'PNG', 15, 15, logoWidth, logoHeight);

    // Título DEBAJO del logo
    doc.setFontSize(16);
    doc.setTextColor(0, 51, 102);
    const titleY = 15 + logoHeight + 10; // margen después del logo
    doc.text("Receta Médica CESFAM", 105, titleY, null, null, "center");

    // Datos de prescripción debajo del título
    doc.setFontSize(12);
    doc.setTextColor(0,0,0);
    const startY = titleY + 15;
    doc.text(`Paciente: ${rut}`, 20, startY);
    doc.text(`Medicamento: ${med}`, 20, startY + 10);
    doc.text(`Dosis: ${dosis}`, 20, startY + 20);
    doc.text(`Duración del tratamiento: ${duracion}`, 20, startY + 30);

    // Pie de página
    doc.setFontSize(10);
    doc.text("Sistema CESFAM Farmacia - Ministerio de Salud - Chile", 105, 285, null, null, "center");

    // Guardar PDF
    doc.save(`Receta_${rut}.pdf`);
    msg.innerHTML = `<p style="color:green;">Receta PDF generada para paciente <strong>${rut}</strong>.</p>`;
  };

  img.onerror = function() {
    msg.innerHTML = "<p style='color:red;'>No se pudo cargar el logo, use formato PNG y verifique la ruta.</p>";
  };
});