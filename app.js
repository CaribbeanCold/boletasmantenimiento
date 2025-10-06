let mantenimientos = [];

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

// Inicializa número de boleta y fecha al cargar
window.addEventListener("DOMContentLoaded", () => {
  cargarNumeroBoleta();
  establecerFechaLocal();
  setInterval(establecerFechaLocal, 60000); // Actualiza cada minuto
});

// Muestra el número de boleta en el formulario
function mostrarNumeroBoleta(n) {
  const el = document.getElementById("numeroBoleta");
  if (el) el.textContent = String(n).padStart(4, "0");
}

// Carga el número de boleta desde localStorage
function cargarNumeroBoleta() {
  let num = parseInt(localStorage.getItem("numeroBoleta")) || 1;
  mostrarNumeroBoleta(num);
}

// Establece la fecha actual en el campo correspondiente
function establecerFechaLocal() {
  const ahora = new Date();
  const fechaGMT6 = ahora.toLocaleDateString('en-CA', {
    timeZone: 'America/Belize'
  });
  const campoFecha = document.getElementById("fecha");
  if (campoFecha) campoFecha.value = fechaGMT6;
}

// Agrega una fila de voltaje a la tabla
function agregarFilaVoltaje() {
  const tabla = document.getElementById("tablaVoltajes").querySelector("tbody");
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

// Ejemplo de uso en tu botón Guardar
function guardarFormulario() {
  if (!validarCamposObligatorios()) return;
  // Aquí va el resto de tu lógica para guardar el formulario
  alert("Formulario guardado correctamente.");
}
