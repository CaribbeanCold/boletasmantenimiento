let mantenimientos = [];

// Al cargar la página, muestra el número de boleta guardado
window.addEventListener("DOMContentLoaded", () => {
  // Si no existe el contador, inicialízalo en 1
  if (!localStorage.getItem("numeroBoleta")) {
    localStorage.setItem("numeroBoleta", "1");
  }
  mostrarNumeroBoleta();
  establecerFechaLocal();
  setInterval(establecerFechaLocal, 60000); // Actualiza cada minuto
});

// Carga el número de boleta desde localStorage y lo muestra
function cargarNumeroBoleta() {
  let num = parseInt(localStorage.getItem("numeroBoleta")) || 1;
  mostrarNumeroBoleta(num);
}

// Muestra el número de boleta en el formulario
function mostrarNumeroBoleta(n) {
  const el = document.getElementById("numeroBoleta");
  const num = parseInt(localStorage.getItem("numeroBoleta")) || 1;
  if (el) el.textContent = String(num).padStart(4, "0");
}

// Incrementa el número de boleta en localStorage y lo muestra
function incrementarNumeroBoleta() {
  let num = parseInt(localStorage.getItem("numeroBoleta")) || 1;
  num++;
  localStorage.setItem("numeroBoleta", num);
  mostrarNumeroBoleta(num);
}

// Establece la fecha actual en el campo correspondiente (GMT-6)
function establecerFechaLocal() {
  const ahora = new Date();
  const fechaGMT6 = ahora.toLocaleDateString('en-CA', {
    timeZone: 'America/Belize'
  });
  const campoFecha = document.getElementById("fecha");
  if (campoFecha) campoFecha.value = fechaGMT6;
}

// Validación de campos obligatorios
function validarCamposObligatorios() {
  const campos = [
    { id: "cliente", nombre: "Cliente" },
    { id: "direccion", nombre: "Dirección" },
    { id: "telefono", nombre: "Teléfono" }
  ];
  let faltantes = [];
  campos.forEach(campo => {
    const input = document.getElementById(campo.id);
    if (!input || !input.value.trim()) {
      faltantes.push(campo.nombre);
      if (input) input.style.border = "2px solid red";
    } else {
      input.style.border = ""; // Quita el rojo si está bien
    }
  });
  if (faltantes.length > 0) {
    alert("Por favor completa los siguientes campos:\n\n" + faltantes.join("\n"));
    return false;
  }
  return true;
}

// Guardar e imprimir boleta
function guardarFormulario() {
  if (!validarCamposObligatorios()) return;

  window.print(); // Imprime la boleta

  // Incrementa el contador y actualiza el número
  let num = parseInt(localStorage.getItem("numeroBoleta")) || 1;
  num++;
  localStorage.setItem("numeroBoleta", num);
  mostrarNumeroBoleta();

  limpiarFormulario(); // Limpia el formulario para la siguiente boleta
}

// Limpia los campos del formulario
function limpiarFormulario() {
  const campos = ["cliente", "direccion", "telefono", "factura", "marca", "modeloEvap", "serieEvap", "modeloCond", "serieCond", "observaciones"];
  campos.forEach(id => {
    const campo = document.getElementById(id);
    if (campo) campo.value = "";
  });

  // Desmarca todos los checkboxes
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);

  // Limpia las filas de voltaje y deja solo la primera
  const tabla = document.getElementById("tablaVoltajes")?.querySelector("tbody");
  if (tabla) {
    while (tabla.rows.length > 1) {
      tabla.deleteRow(1);
    }
    // Limpia los inputs de la primera fila
    Array.from(tabla.rows[0].querySelectorAll('input')).forEach(input => input.value = "");
  }
}

// Agregar mantenimiento a la lista
function agregarMantenimiento() {
  const equipo = document.getElementById("equipo")?.value;
  const fecha = document.getElementById("fecha")?.value;

  if (equipo && fecha) {
    mantenimientos.push({ equipo, fecha, hecho: false });
    mostrarMantenimientos();
    const eq = document.getElementById("equipo");
    const fe = document.getElementById("fecha");
    if (eq) eq.value = "";
    if (fe) fe.value = "";
  } else {
    alert("Por favor completa equipo y fecha.");
  }
}

function mostrarMantenimientos() {
  const lista = document.getElementById("listaMantenimientos");
  if (!lista) return;
  lista.innerHTML = "";
  mantenimientos.forEach((m, idx) => {
    const item = document.createElement("div");
    item.className = "mantenimiento-item";
    item.innerHTML = `
      <span>${m.equipo} — ${m.fecha}</span>
      <button onclick="toggleHecho(${idx})">${m.hecho ? "Deshacer" : "Hecho"}</button>
      <button onclick="eliminar(${idx})">Eliminar</button>
    `;
    lista.appendChild(item);
  });
}

function toggleHecho(i) {
  mantenimientos[i].hecho = !mantenimientos[i].hecho;
  mostrarMantenimientos();
}

function eliminar(i) {
  mantenimientos.splice(i, 1);
  mostrarMantenimientos();
}

// Agrega una fila de voltaje a la tabla
function agregarFilaVoltaje() {
  const tabla = document.getElementById("tablaVoltajes")?.querySelector("tbody");
  if (!tabla) return;
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td><input type="text" placeholder="Lectura"></td>
    <td><input type="text" placeholder="Placas"></td>
    <td><input type="text" placeholder="Voltaje control"></td>
    <td><button type="button" onclick="eliminarFila(this)">➖</button></td>
  `;
  tabla.appendChild(fila);
}

// Elimina una fila de la tabla de voltajes
function eliminarFila(boton) {
  boton.closest("tr").remove();
}

incrementarNumeroBoleta();
