// lab3.js

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

// =======================
// EJERCICIO 3: contador
// =======================
// Parámetro: arreglo de números.
// Regresa: {negativos, ceros, positivos}

function contador(arreglo) {
    let negativos = 0;
    let ceros = 0;
    let positivos = 0;

    for (let i = 0; i < arreglo.length; i++) {
        const valor = arreglo[i];
        if (valor < 0) {
            negativos++;
        } else if (valor === 0) {
            ceros++;
        } else {
            positivos++;
        }
    }
    return { negativos, ceros, positivos };
}

// Pruebas ejercicio 3
(function pruebasEj3() {
    const r1 = contador([-1, 0, 2, -5, 0, 3]);
    console.assert(r1.negativos === 2, "Ej3: negativos incorrectos");
    console.assert(r1.ceros === 2, "Ej3: ceros incorrectos");
    console.assert(r1.positivos === 2, "Ej3: positivos incorrectos");
})();

// =======================
// EJERCICIO 4: promedios
// =======================
// Parámetro: matriz (arreglo de arreglos).
// Regresa: arreglo con los promedios por renglón.

function promedios(matriz) {
    const resultado = [];

    for (let i = 0; i < matriz.length; i++) {
        const fila = matriz[i];
        if (fila.length === 0) {
            resultado.push(0);
            continue;
        }
        let suma = 0;
        for (let j = 0; j < fila.length; j++) {
            suma += fila[j];
        }
        resultado.push(suma / fila.length);
    }

    return resultado;
}

// Pruebas ejercicio 4
(function pruebasEj4() {
    const m1 = [
        [1, 2, 3],
        [4, 5, 6],
        [10, 10]
    ];
    const res = promedios(m1);
    console.assert(res[0] === 2, "Ej4: promedio fila 0 incorrecto");
    console.assert(res[1] === 5, "Ej4: promedio fila 1 incorrecto");
    console.assert(res[2] === 10, "Ej4: promedio fila 2 incorrecto");
})();

// =======================
// EJERCICIO 5: inverso
// =======================
// Parámetro: número.
// Regresa: número con sus dígitos en orden inverso.

function inverso(num) {
    const esNegativo = num < 0;
    const texto = Math.abs(num).toString().split("").reverse().join("");
    const resultado = Number(texto);
    return esNegativo ? -resultado : resultado;
}

// Pruebas ejercicio 5
(function pruebasEj5() {
    console.assert(inverso(1234) === 4321, "Ej5: inverso(1234) incorrecto");
    console.assert(inverso(100) === 1, "Ej5: inverso(100) incorrecto");
    console.assert(inverso(-789) === -987, "Ej5: inverso(-789) incorrecto");
})();

// Mostrar resultados de 3,4,5 en el HTML
(function mostrarEj345() {
    const arr = [-2, -1, 0, 0, 5, 10];
    const matriz = [
        [1, 2, 3],
        [4, 6],
        [10, 0]
    ];
    const num = 123450;

    const rContador = contador(arr);
    const rPromedios = promedios(matriz);
    const rInverso = inverso(num);

    const texto =
        "Ejercicio 3 - contador([-2, -1, 0, 0, 5, 10]):\n" +
        JSON.stringify(rContador, null, 2) + "\n\n" +
        "Ejercicio 4 - promedios([[1,2,3],[4,6],[10,0]]):\n" +
        JSON.stringify(rPromedios, null, 2) + "\n\n" +
        "Ejercicio 5 - inverso(123450):\n" +
        rInverso;

    document.getElementById("resultado-ej345").textContent = texto;
})();

// =======================
// EJERCICIO 6
// =======================
// Problema elegido: gestionar partidas de videojuegos
// Objeto con constructor y al menos 2 métodos.

function Partida(nombre, horas, dificultad) {
    this.nombre = nombre;
    this.horas = horas;
    this.dificultad = dificultad; // "fácil", "media", "difícil"
}

// Método 1: descripción
Partida.prototype.descripcion = function () {
    return `${this.nombre} - ${this.horas} hora(s) - dificultad: ${this.dificultad}`;
};

// Método 2: aumentar horas
Partida.prototype.aumentarHoras = function (extra) {
    if (extra > 0) {
        this.horas += extra;
    }
};

// Objeto gestor de partidas
function GestorPartidas() {
    this.partidas = [];
}

GestorPartidas.prototype.agregarPartida = function (partida) {
    this.partidas.push(partida);
};

// Método: total de horas
GestorPartidas.prototype.totalHoras = function () {
    return this.partidas.reduce((acc, p) => acc + p.horas, 0);
};

// Método: filtrar por dificultad
GestorPartidas.prototype.filtrarPorDificultad = function (dificultad) {
    return this.partidas.filter(p => p.dificultad === dificultad);
};

// Pruebas ejercicio 6
(function pruebasEj6() {
    const p1 = new Partida("ARK: Survival", 10, "difícil");
    const p2 = new Partida("Overwatch", 5, "fácil");
    const p3 = new Partida("Satisfactory", 12, "media");

    const gestor = new GestorPartidas();
    gestor.agregarPartida(p1);
    gestor.agregarPartida(p2);
    gestor.agregarPartida(p3);

    console.assert(gestor.totalHoras() === 18, "Ej6: totalHoras incorrecto");

    const dif = gestor.filtrarPorDificultad("difícil");
    console.assert(dif.length === 2, "Ej6: filtrarPorDificultad incorrecto");
})();

// Mostrar resultados del ejercicio 6 en el HTML
(function mostrarEj6() {
    const p1 = new Partida("ARK: Survival", 10, "difícil");
    const p2 = new Partida("Overwatch", 5, "fácil");
    const p3 = new Partida("Satisfactory", 12, "media");

    const gestor = new GestorPartidas();
    gestor.agregarPartida(p1);
    gestor.agregarPartida(p2);
    gestor.agregarPartida(p3);

    // Aumentamos horas de una partida como ejemplo
    p1.aumentarHoras(2);

    let salida = "Listado de partidas:\n";
    gestor.partidas.forEach(p => {
        salida += "- " + p.descripcion() + "\n";
    });

    salida += "\nTotal de horas jugadas: " + gestor.totalHoras() + "\n";
    salida += "Partidas en dificultad 'difícil':\n";
    gestor.filtrarPorDificultad("difícil").forEach(p => {
        salida += "  * " + p.nombre + "\n";
    });

    document.getElementById("resultado-ej6").textContent = salida;
})();
