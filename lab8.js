// =======================
// 1) Promedio de un arreglo
// =======================
function promedio(arreglo) {
  if (!Array.isArray(arreglo) || arreglo.length === 0) {
    return 0;
  }
  const suma = arreglo.reduce((acc, num) => acc + num, 0);
  return suma / arreglo.length;
}

const nums = [10, 8, 9, 7, 6];
console.log("Arreglo:", nums);
console.log("Promedio:", promedio(nums));


// =======================
// 2) Escribir un string en un archivo (fs)
// =======================
const fs = require("fs");

function escribirTextoEnArchivo(nombreArchivo, texto) {
    fs.writeFileSync(nombreArchivo, texto, "utf8");
    console.log(`Archivo '${nombreArchivo}' escrito correctamente.`);
}

escribirTextoEnArchivo("lab8.txt", "Hola muy buenas tardes!");


// =======================
// 3) Problema suma de números primos hasta N
// =======================

function esPrimo(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function sumaPrimosHastaN(N) {
  let suma = 0;
  for (let i = 2; i <= N; i++) {
    if (esPrimo(i)) suma += i;
  }
  return suma;
}

const limite = 100;
console.log(`Suma de primos hasta ${limite}:`, sumaPrimosHastaN(limite));


// =======================
// 4) Servidor web básico con Node
// =======================
const http = require("http");
const path = require("path");

const port = 3000;

// Lee tu HTML (el que pegaste) y lo devuelve al cliente
const server = http.createServer((request, response) => {
  console.log("Petición recibida:", request.url);

  // Solo vamos a servir una página principal
  if (request.url === "/" || request.url === "/lab6") {
    const rutaHtml = path.join(__dirname, "lab6.html"); // ajusta nombre si es distinto
    fs.readFile(rutaHtml, "utf8", (err, data) => {
      if (err) {
        response.statusCode = 500;
        response.setHeader("Content-Type", "text/plain; charset=utf-8");
        response.end("Error interno al leer el HTML");
        return;
      }
      response.statusCode = 200;
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      response.end(data);
    });
  } else {
    // 404 simple
    response.statusCode = 404;
    response.setHeader("Content-Type", "text/plain; charset=utf-8");
    response.end("404 - No encontrado");
  }
});

server.listen(port, () => {
  console.log(`Server en http://localhost:${port}`);
});






//console.log("Alô");
//
//const filesystem=require("fs");
//filesystem.writeFileSync('klk.txt', 'Q pasa locoooo');
//
//const http=require("http");
//const server=http.createServer((request, resonse)=>{
//    console.log(request);
//    console.log(request.url);
//    console.log(request);
//    response.setHeader('Content-Type', 'text/html');
//    response.write('');
//    response.end();
//})



//const html=`...mi sitio web html...`;
//server.listen(3000);
