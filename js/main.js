// --- DECLARACIÓN DE VARIABLES Y CONSTANTES ---
const TASA_INTERES_ANUAL_BASE = 0.60; // Tasa de interés anual del 60% (ejemplo)
const COMISION_APERTURA = 0.02; // 2% de comisión sobre el monto del préstamo
const MIN_MONTO_PRESTAMO = 10000;
const MAX_MONTO_PRESTAMO = 500000;
const MIN_PLAZO_MESES = 6;
const MAX_PLAZO_MESES = 60; // Hasta 5 años

let historialPrestamos = []; // Array para almacenar los cálculos realizados

// --- FUNCIONES DEL SIMULADOR ---

/**
 * Solicita al usuario los datos del préstamo y valida las entradas.
 * @returns {object|null} Un objeto con monto y plazo, o null si se cancela o hay errores.
 */
function solicitarDatosPrestamo() {
    let montoPrestamoStr = prompt(`Ingrese el monto del préstamo deseado (entre $${MIN_MONTO_PRESTAMO} y $${MAX_MONTO_PRESTAMO}):`);
    let montoPrestamo = parseFloat(montoPrestamoStr);

    // Validación del monto
    if (isNaN(montoPrestamo) || montoPrestamo < MIN_MONTO_PRESTAMO || montoPrestamo > MAX_MONTO_PRESTAMO) {
        alert(`Monto inválido. Por favor, ingrese un número entre $${MIN_MONTO_PRESTAMO} y $${MAX_MONTO_PRESTAMO}.`);
        console.error("Monto de préstamo inválido o fuera de rango.");
        return null;
    }

    let plazoMesesStr = prompt(`Ingrese el plazo en meses (entre ${MIN_PLAZO_MESES} y ${MAX_PLAZO_MESES}):`);
    let plazoMeses = parseInt(plazoMesesStr);

    // Validación del plazo
    if (isNaN(plazoMeses) || plazoMeses < MIN_PLAZO_MESES || plazoMeses > MAX_PLAZO_MESES) {
        alert(`Plazo inválido. Por favor, ingrese un número de meses entre ${MIN_PLAZO_MESES} y ${MAX_PLAZO_MESES}.`);
        console.error("Plazo en meses inválido o fuera de rango.");
        return null;
    }

    return {
        monto: montoPrestamo,
        plazo: plazoMeses
    };
}

/**
 * Calcula la cuota mensual de un préstamo (simplificado).
 * Incluye una comisión de apertura y ajuste de tasa por plazo.
 * @param {number} monto - Monto principal del préstamo.
 * @param {number} plazo - Plazo en meses.
 * @returns {object} Un objeto con la cuota mensual y el monto total a pagar.
 */
function calcularCuotaPrestamo(monto, plazo) {
    // Calculamos la tasa mensual a partir de la anual
    let tasaMensual = TASA_INTERES_ANUAL_BASE / 12;

    // Ajuste de tasa: Un pequeño aumento si el plazo es largo (ejemplo de condicional)
    if (plazo > 36) { // Si el plazo es mayor a 3 años
        tasaMensual += 0.005; // Aumentamos la tasa mensual un 0.5%
        console.log("Se aplicó un pequeño aumento de tasa por plazo extendido.");
    }

    // Interés total simple (para simplificar)
    let interesTotal = monto * tasaMensual * plazo;
    let comision = monto * COMISION_APERTURA;

    let montoTotalAPagar = monto + interesTotal + comision;
    let cuotaMensual = montoTotalAPagar / plazo;

    return {
        cuota: cuotaMensual,
        total: montoTotalAPagar
    };
}

/**
 * Muestra los resultados del cálculo del préstamo al usuario.
 * @param {object} datosPrestamo - Objeto con monto y plazo del préstamo.
 * @param {object} resultadosCalculo - Objeto con cuota y total a pagar.
 */
function mostrarResultadosPrestamo(datosPrestamo, resultadosCalculo) {
    let mensaje =
        "--- RESUMEN DE TU PRÉSTAMO ---\n\n" +
        `Monto solicitado: $${datosPrestamo.monto.toFixed(2)}\n` +
        `Plazo: ${datosPrestamo.plazo} meses\n\n` +
        `Cuota mensual aproximada: $${resultadosCalculo.cuota.toFixed(2)}\n` +
        `Monto total a devolver: $${resultadosCalculo.total.toFixed(2)}\n\n` +
        "¡Recuerda que este es un cálculo aproximado!";

    alert(mensaje);
    console.log("--- DETALLES DEL PRÉSTAMO ---");
    console.log("Monto Solicitado:", datosPrestamo.monto);
    console.log("Plazo (meses):", datosPrestamo.plazo);
    console.log("Tasa de Interés Anual Base:", (TASA_INTERES_ANUAL_BASE * 100).toFixed(2) + "%");
    console.log("Cuota Mensual Calculada:", resultadosCalculo.cuota.toFixed(2));
    console.log("Monto Total a Devolver:", resultadosCalculo.total.toFixed(2));
    console.log("-----------------------------\n");

    // Guarda el préstamo en el historial
    historialPrestamos.push({
        monto: datosPrestamo.monto,
        plazo: datosPrestamo.plazo,
        cuota: resultadosCalculo.cuota,
        total: resultadosCalculo.total,
        fecha: new Date().toLocaleDateString()
    });
}

/**
 * Muestra el historial de préstamos calculados.
 */
function mostrarHistorial() {
    if (historialPrestamos.length === 0) {
        alert("Aún no se han calculado préstamos.");
        console.log("Historial de préstamos vacío.");
        return;
    }

    let mensajeHistorial = "--- HISTORIAL DE PRÉSTAMOS ---\n\n";
    console.log("\n--- HISTORIAL DE PRÉSTAMOS ---");
    // Ciclo for para recorrer el array historialPrestamos
    for (let i = 0; i < historialPrestamos.length; i++) {
        const prestamo = historialPrestamos[i];
        mensajeHistorial +=
            `Préstamo #${i + 1} (Fecha: ${prestamo.fecha}):\n` +
            `  Monto: $${prestamo.monto.toFixed(2)}\n` +
            `  Plazo: ${prestamo.plazo} meses\n` +
            `  Cuota: $${prestamo.cuota.toFixed(2)}\n` +
            `  Total: $${prestamo.total.toFixed(2)}\n\n`;
        
        console.log(`Préstamo #${i + 1} (Fecha: ${prestamo.fecha}):`);
        console.log(`  Monto: $${prestamo.monto.toFixed(2)}`);
        console.log(`  Plazo: ${prestamo.plazo} meses`);
        console.log(`  Cuota: $${prestamo.cuota.toFixed(2)}`);
        console.log(`  Total: $${prestamo.total.toFixed(2)}`);
    }
    alert(mensajeHistorial);
    console.log("-----------------------------\n");
}


// --- ALGORITMO PRINCIPAL DEL SIMULADOR (Bucle de Interacción) ---
let ejecutarSimulador = true;

// Ciclo while para mantener el simulador en ejecución hasta que el usuario decida salir
while (ejecutarSimulador) {
    let opcion = prompt(
        "--- SIMULADOR DE PRÉSTAMOS ---\n" +
        "1. Calcular nuevo préstamo\n" +
        "2. Ver historial de cálculos\n" +
        "3. Salir\n\n" +
        "Ingrese el número de su opción:"
    );

    // Condicional switch para manejar las opciones del menú
    switch (opcion) {
        case "1":
            const datosIngresados = solicitarDatosPrestamo();
            if (datosIngresados) { // Solo si se obtuvieron datos válidos
                const resultados = calcularCuotaPrestamo(datosIngresados.monto, datosIngresados.plazo);
                mostrarResultadosPrestamo(datosIngresados, resultados);
            }
            break;
        case "2":
            mostrarHistorial();
            break;
        case "3":
            ejecutarSimulador = false;
            alert("Saliendo del simulador de préstamos. ¡Hasta la próxima!");
            console.log("El usuario decidió salir del simulador.");
            break;
        default:
            alert("Opción inválida. Por favor, seleccione 1, 2 o 3.");
            console.warn("Opción de menú inválida ingresada por el usuario.");
            break;
    }
}

console.log("Simulador de Préstamos finalizado.");