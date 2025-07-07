// --- DECLARACIÓN DE CONSTANTES Y VARIABLES GLOBALES ---
const TASA_INTERES_ANUAL_BASE = 0.60;
const COMISION_APERTURA = 0.02;
const MIN_MONTO_PRESTAMO = 10000;
const MAX_MONTO_PRESTAMO = 500000;
const MIN_PLAZO_MESES = 6;
const MAX_PLAZO_MESES = 60;

// Array para almacenar los préstamos. Ahora será un array de OBJETOS.
let historialPrestamos = [];

// --- REFERENCIAS A ELEMENTOS DEL DOM ---
const inputMonto = document.getElementById('monto');
const inputPlazo = document.getElementById('plazo');
const btnCalcular = document.getElementById('btnCalcular');
const btnLimpiarHistorial = document.getElementById('btnLimpiarHistorial');
const spanCuotaMensual = document.getElementById('cuotaMensual');
const spanMontoTotalDevolver = document.getElementById('montoTotalDevolver');
const divHistorialLista = document.getElementById('historialLista');

// --- FUNCIONES PARA LA LÓGICA DEL SIMULADOR ---

// Carga el historial desde LocalStorage al iniciar la aplicación
function cargarHistorialDesdeStorage() {
    const historialGuardado = localStorage.getItem('historialPrestamos');
    if (historialGuardado) {
        historialPrestamos = JSON.parse(historialGuardado);
    }
    mostrarHistorialEnDOM(); // Muestra el historial cargado
}

// Guarda el historial actual en LocalStorage
function guardarHistorialEnStorage() {
    localStorage.setItem('historialPrestamos', JSON.stringify(historialPrestamos));
}

// Valida los datos ingresados por el usuario
function validarEntradas(monto, plazo) {
    if (isNaN(monto) || monto < MIN_MONTO_PRESTAMO || monto > MAX_MONTO_PRESTAMO) {
        alert("Por favor, ingresá un monto válido entre $" + MIN_MONTO_PRESTAMO + " y $" + MAX_MONTO_PRESTAMO + ".");
        return false;
    }
    if (isNaN(plazo) || plazo < MIN_PLAZO_MESES || plazo > MAX_PLAZO_MESES) {
        alert("Por favor, ingresá un plazo válido entre " + MIN_PLAZO_MESES + " y " + MAX_PLAZO_MESES + " meses.");
        return false;
    }
    return true;
}

// Calcula la cuota mensual de un préstamo y el total a devolver
function calcularCuotaPrestamo(monto, plazo) {
    let tasaMensual = TASA_INTERES_ANUAL_BASE / 12;

    if (plazo > 36) {
        tasaMensual += 0.005; // Ajuste por plazo extendido
    }

    let interesTotal = monto * tasaMensual * plazo;
    let comision = monto * COMISION_APERTURA;

    let montoTotalAPagar = monto + interesTotal + comision;
    let cuotaMensual = montoTotalAPagar / plazo;

    return {
        cuota: cuotaMensual,
        total: montoTotalAPagar
    }; // Ahora retorna un objeto
}

// Muestra los resultados del cálculo en el DOM
function mostrarResultadosEnDOM(cuota, total) {
    spanCuotaMensual.textContent = "$" + cuota.toFixed(2);
    spanMontoTotalDevolver.textContent = "$" + total.toFixed(2);
}

// Agrega un nuevo cálculo al historial y lo muestra en el DOM
function agregarAlHistorial(monto, plazo, cuota, total) {
    const fechaActual = new Date();
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Meses son 0-11
    const anio = fechaActual.getFullYear();
    const fechaFormateada = dia + '/' + mes + '/' + anio;

    const nuevoPrestamo = {
        id: historialPrestamos.length > 0 ? historialPrestamos[historialPrestamos.length - 1].id + 1 : 1, // ID simple
        monto: monto,
        plazo: plazo,
        cuota: cuota,
        total: total,
        fecha: fechaFormateada
    };
    historialPrestamos.push(nuevoPrestamo);
    guardarHistorialEnStorage(); // Guarda el historial actualizado
    mostrarHistorialEnDOM(); // Vuelve a renderizar el historial
}

// Muestra todo el historial de préstamos en el DOM
function mostrarHistorialEnDOM() {
    divHistorialLista.innerHTML = ''; // Limpiamos el contenido actual

    if (historialPrestamos.length === 0) {
        divHistorialLista.innerHTML = '<p class="no-history-msg">Aún no hay cálculos en el historial.</p>';
        return;
    }

    // Usamos for...of para iterar sobre los objetos del historial
    for (const prestamo of historialPrestamos) {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('history-item');
        itemDiv.innerHTML = `
            <strong>Préstamo #${prestamo.id} (${prestamo.fecha}):</strong><br>
            Monto: $${prestamo.monto.toFixed(2)}<br>
            Plazo: ${prestamo.plazo} meses<br>
            Cuota: $${prestamo.cuota.toFixed(2)}<br>
            Total: $${prestamo.total.toFixed(2)}
        `;
        divHistorialLista.appendChild(itemDiv);
    }
}

// --- MANEJADORES DE EVENTOS ---

// Función que se ejecuta cuando el usuario hace clic en "Calcular Préstamo"
function handleCalcularClick() {
    // 1. Capturar entradas
    const monto = parseFloat(inputMonto.value);
    const plazo = parseInt(inputPlazo.value);

    // 2. Validar entradas
    if (!validarEntradas(monto, plazo)) {
        return; // Si la validación falla, salimos de la función
    }

    // 3. Procesar datos
    const resultados = calcularCuotaPrestamo(monto, plazo);

    // 4. Mostrar resultados en el DOM
    mostrarResultadosEnDOM(resultados.cuota, resultados.total);

    // 5. Guardar en historial y mostrar
    agregarAlHistorial(monto, plazo, resultados.cuota, resultados.total);
}

// Función que se ejecuta cuando el usuario hace clic en "Limpiar Historial"
function handleLimpiarHistorialClick() {
    const confirmar = confirm("¿Estás seguro de que quieres limpiar todo el historial de préstamos?");
    if (confirmar) {
        historialPrestamos = []; // Vacía el array
        guardarHistorialEnStorage(); // Guarda el array vacío en LocalStorage
        mostrarHistorialEnDOM(); // Actualiza el DOM para que se vea vacío
        alert("El historial ha sido limpiado.");
    }
}


// --- INICIALIZACIÓN DE LA APLICACIÓN (EVENT LISTENERS) ---

// Escuchamos el evento 'click' del botón de calcular
btnCalcular.addEventListener('click', handleCalcularClick);

// Escuchamos el evento 'click' del botón de limpiar historial
btnLimpiarHistorial.addEventListener('click', handleLimpiarHistorialClick);

// Al cargar la página, intentamos cargar el historial desde LocalStorage
// y lo mostramos inmediatamente.
document.addEventListener('DOMContentLoaded', cargarHistorialDesdeStorage);