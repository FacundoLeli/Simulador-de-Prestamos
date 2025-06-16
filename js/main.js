// --- DECLARACIÓN DE VARIABLES Y CONSTANTES ---
var TASA_INTERES_ANUAL_BASE = 0.60; // Tasa de interés anual del 60% (ejemplo)
var COMISION_APERTURA = 0.02; // 2% de comisión sobre el monto del préstamo
var MIN_MONTO_PRESTAMO = 10000;
var MAX_MONTO_PRESTAMO = 500000;
var MIN_PLAZO_MESES = 6;
var MAX_PLAZO_MESES = 60; // Hasta 5 años

// Historial: Cada elemento será un array simple [monto, plazo, cuota, total]
var historialPrestamos = [];

// --- FUNCIONES DEL SIMULADOR ---

// Función para solicitar al usuario los datos del préstamo y validar las entradas.
function solicitarDatosPrestamo() {
    var montoPrestamoStr = prompt("Ingrese el monto del préstamo deseado (entre $" + MIN_MONTO_PRESTAMO + " y $" + MAX_MONTO_PRESTAMO + "):");
    var montoPrestamo = parseFloat(montoPrestamoStr);

    // Validación del monto
    if (isNaN(montoPrestamo) || montoPrestamo < MIN_MONTO_PRESTAMO || montoPrestamo > MAX_MONTO_PRESTAMO) {
        alert("Monto inválido. Por favor, ingrese un número entre $" + MIN_MONTO_PRESTAMO + " y $" + MAX_MONTO_PRESTAMO + ".");
        console.error("Monto de préstamo inválido o fuera de rango.");
        return [0, 0]; // Retorna un array con valores inválidos
    }

    var plazoMesesStr = prompt("Ingrese el plazo en meses (entre " + MIN_PLAZO_MESES + " y " + MAX_PLAZO_MESES + "):");
    var plazoMeses = parseInt(plazoMesesStr);

    // Validación del plazo
    if (isNaN(plazoMeses) || plazoMeses < MIN_PLAZO_MESES || plazoMeses > MAX_PLAZO_MESES) {
        alert("Plazo inválido. Por favor, ingrese un número de meses entre " + MIN_PLAZO_MESES + " y " + MAX_PLAZO_MESES + ".");
        console.error("Plazo en meses inválido o fuera de rango.");
        return [0, 0]; // Retorna un array con valores inválidos
    }

    return [montoPrestamo, plazoMeses]; // Retorna un array con el monto y el plazo
}

// Función para calcular la cuota mensual de un préstamo (simplificado).
// Incluye una comisión de apertura y ajuste de tasa por plazo.
function calcularCuotaPrestamo(monto, plazo) {
    // Calculamos la tasa mensual a partir de la anual
    var tasaMensual = TASA_INTERES_ANUAL_BASE / 12;

    // Ajuste de tasa: Un pequeño aumento si el plazo es largo (ejemplo de condicional)
    if (plazo > 36) { // Si el plazo es mayor a 3 años
        tasaMensual = tasaMensual + 0.005; // Aumentamos la tasa mensual un 0.5%
        console.log("Se aplicó un pequeño aumento de tasa por plazo extendido.");
    }

    // Interés total simple (para simplificar)
    var interesTotal = monto * tasaMensual * plazo;
    var comision = monto * COMISION_APERTURA;

    var montoTotalAPagar = monto + interesTotal + comision;
    var cuotaMensual = montoTotalAPagar / plazo;

    return [cuotaMensual, montoTotalAPagar]; // Retorna un array con la cuota y el total
}

// Función para mostrar los resultados del cálculo del préstamo al usuario.
function mostrarResultadosPrestamo(monto, plazo, cuota, total) {
    var mensaje =
        "--- RESUMEN DE TU PRÉSTAMO ---" + "\n\n" +
        "Monto solicitado: $" + monto.toFixed(2) + "\n" +
        "Plazo: " + plazo + " meses" + "\n\n" +
        "Cuota mensual aproximada: $" + cuota.toFixed(2) + "\n" +
        "Monto total a devolver: $" + total.toFixed(2) + "\n\n" +
        "¡Recuerda que este es un cálculo aproximado!";

    alert(mensaje);
    console.log("--- DETALLES DEL PRÉSTAMO ---");
    console.log("Monto Solicitado: " + monto);
    console.log("Plazo (meses): " + plazo);
    console.log("Tasa de Interés Anual Base: " + (TASA_INTERES_ANUAL_BASE * 100).toFixed(2) + "%");
    console.log("Cuota Mensual Calculada: " + cuota.toFixed(2));
    console.log("Monto Total a Devolver: " + total.toFixed(2));
    console.log("-----------------------------" + "\n");

    // Guarda el préstamo en el historial como un array simple
    historialPrestamos[historialPrestamos.length] = [monto, plazo, cuota, total];
}

// Función para mostrar el historial de préstamos calculados.
function mostrarHistorial() {
    if (historialPrestamos.length === 0) {
        alert("Aún no se han calculado préstamos.");
        console.log("Historial de préstamos vacío.");
        return;
    }

    var mensajeHistorial = "--- HISTORIAL DE PRÉSTAMOS ---" + "\n\n";
    console.log("\n--- HISTORIAL DE PRÉSTAMOS ---");
    
    // Ciclo for tradicional para recorrer el array historialPrestamos
    for (var i = 0; i < historialPrestamos.length; i++) {
        var prestamo = historialPrestamos[i]; // Cada 'prestamo' es un array [monto, plazo, cuota, total]
        
        mensajeHistorial = mensajeHistorial +
            "Préstamo #" + (i + 1) + ":" + "\n" +
            "  Monto: $" + prestamo[0].toFixed(2) + "\n" +
            "  Plazo: " + prestamo[1] + " meses" + "\n" +
            "  Cuota: $" + prestamo[2].toFixed(2) + "\n" +
            "  Total: $" + prestamo[3].toFixed(2) + "\n\n";
        
        console.log("Préstamo #" + (i + 1) + ":");
        console.log("  Monto: $" + prestamo[0].toFixed(2));
        console.log("  Plazo: " + prestamo[1] + " meses");
        console.log("  Cuota: $" + prestamo[2].toFixed(2));
        console.log("  Total: $" + prestamo[3].toFixed(2));
    }
    alert(mensajeHistorial);
    console.log("-----------------------------" + "\n");
}


// --- ALGORITMO PRINCIPAL DEL SIMULADOR (Bucle de Interacción) ---
var ejecutarSimulador = true;

// Ciclo while para mantener el simulador en ejecución hasta que el usuario decida salir
while (ejecutarSimulador) {
    var opcion = prompt(
        "--- SIMULADOR DE PRÉSTAMOS ---" + "\n" +
        "1. Calcular nuevo préstamo" + "\n" +
        "2. Ver historial de cálculos" + "\n" +
        "3. Salir" + "\n\n" +
        "Ingrese el número de su opción:"
    );

    // Condicional switch para manejar las opciones del menú
    switch (opcion) {
        case "1":
            var datosIngresados = solicitarDatosPrestamo();
            // Verificar si los datos son válidos (no [0, 0] que indica error)
            if (datosIngresados[0] > 0 && datosIngresados[1] > 0) {
                var resultados = calcularCuotaPrestamo(datosIngresados[0], datosIngresados[1]);
                mostrarResultadosPrestamo(datosIngresados[0], datosIngresados[1], resultados[0], resultados[1]);
            }
            break;
        case "2":
            mostrarHistorial();
            break;
        case "3":
            var confirmarSalida = confirm("¿Estás seguro de que quieres salir del simulador?");
            if (confirmarSalida) {
                ejecutarSimulador = false;
                alert("Saliendo del simulador de préstamos. ¡Hasta la próxima!");
                console.log("El usuario decidió salir del simulador.");
            } else {
                console.log("El usuario canceló la salida y continúa en el simulador.");
            }
            break;
        default:
            alert("Opción inválida. Por favor, seleccione 1, 2 o 3.");
            console.warn("Opción de menú inválida ingresada por el usuario.");
            break;
    }
}

console.log("Simulador de Préstamos finalizado.");