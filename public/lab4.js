// lab4.js

// =======================
// EJERCICIO 1
// =======================
// Entrada: número con prompt.
// Salida: tabla 1..n con cuadrados y cubos usando document.write().

function tablaCuadradosCubos(n) {
    const numero = Number(n);
    if (!Number.isInteger(numero) || numero <= 0) {
        throw new Error("El número debe ser un entero positivo");
    }

    // document.write escribe en el documento:
    document.write("<h2>Tabla de cuadrados y cubos</h2>");
    document.write("<table border='1' cellpadding='4'>");
    document.write("<tr><th>Número</th><th>Cuadrado</th><th>Cubo</th></tr>");

    for (let i = 1; i <= numero; i++) {
        document.write(
            "<tr><td>" + i + "</td><td>" + (i * i) + "</td><td>" + (i * i * i) + "</td></tr>"
        );
    }

    document.write("</table>");
}

// Pruebas con console.assert (se prueban los valores generados de forma indirecta)
(function pruebasEj1() {
    console.assert(typeof tablaCuadradosCubos === "function", "tablaCuadradosCubos debe existir");
})();

// Botón para lanzar el ejercicio 1
document.getElementById("btn-ej1").addEventListener("click", function () {
    const n = prompt("Ejercicio 1: Escribe un número entero positivo:");
    try {
        tablaCuadradosCubos(n);
    } catch (e) {
        alert(e.message);
    }
});

// =======================
// EJERCICIO 2
// =======================
// Prompt con suma aleatoria y medir tiempo de respuesta.

function ejercicioSumaAleatoria() {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    const correcto = a + b;

    const inicio = performance.now();
    const respuesta = prompt(`Ejercicio 2: ¿Cuánto es ${a} + ${b}?`);
    const fin = performance.now();

    const tiempoMs = (fin - inicio).toFixed(2);
    const respuestaNumero = Number(respuesta);
    const esCorrecto = respuestaNumero === correcto;

    const mensaje =
        `Números: ${a} + ${b} = ${correcto}\n` +
        `Tu respuesta: ${respuestaNumero}\n` +
        `Resultado: ${esCorrecto ? "CORRECTO" : "INCORRECTO"}\n` +
        `Tiempo: ${tiempoMs} ms`;

    const contenedor = document.getElementById("resultado-ej2");
    contenedor.textContent = mensaje;

    return { esCorrecto, tiempoMs: Number(tiempoMs), correcto, respuestaNumero };
}

(function pruebasEj2() {
    console.assert(typeof ejercicioSumaAleatoria === "function", "ejercicioSumaAleatoria debe existir");
})();

document.getElementById("btn-ej2").addEventListener("click", function () {
    ejercicioSumaAleatoria();
});

