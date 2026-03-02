const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const pedidosFile = path.join(__dirname, '..', 'data', 'pedidos_tiendita.txt');

// Función auxiliar para leer pedidos como arreglo
function leerPedidos() {
  if (!fs.existsSync(pedidosFile)) return [];
  const contenido = fs.readFileSync(pedidosFile, 'utf8');
  if (!contenido.trim()) return [];
  return contenido
    .trim()
    .split('\n')
    .map((linea) => {
      try {
        return JSON.parse(linea);
      } catch {
        return null;
      }
    })
    .filter((p) => p);
}

// Página principal de la tiendita (antes era tu lab5.html)
router.get('/', (req, res, next) => {
  const productos = [
    { id: 1, nombre: 'Pulparindots', precio: 10, descripcion: 'Dulces enchilosos', max: 10 },
    { id: 2, nombre: 'Violin peruano', precio: 1499, descripcion: '40 años de uso', max: 2 },
    { id: 3, nombre: 'Peluche de Dodo Original', precio: 200199, descripcion: 'El mejor amigo', max: 8 }
  ];

  res.status(200).render('tienda', {
    titulo: 'Tiendita de Luis',
    productos: productos
  });
});

// Info JSON (otra ruta más)
router.get('/productos', (req, res, next) => {
  const productos = [
    { id: 1, nombre: 'Pulparindots', precio: 10 },
    { id: 2, nombre: 'Violin peruano', precio: 1499 },
    { id: 3, nombre: 'Peluche de Dodo Original', precio: 200199 }
  ];
  res.status(200).json(productos);
});

// Formulario de checkout
router.get('/checkout', (req, res, next) => {
  res.status(200).render('checkout', {
    titulo: 'Checkout Tiendita'
  });
});

// Procesar checkout (POST) y guardar en archivo
router.post('/checkout', (req, res, next) => {
  const { nombre, producto, cantidad } = req.body;

  const pedido = {
    nombre: nombre,
    producto: producto,
    cantidad: Number(cantidad),
    fecha: new Date().toISOString()
  };

  fs.mkdirSync(path.join(__dirname, '..', 'data'), { recursive: true });

  fs.appendFile(pedidosFile, JSON.stringify(pedido) + '\n', (err) => {
    if (err) {
      console.error('Error al guardar el pedido:', err);
      return res.status(500).send('Error del servidor al guardar el pedido.');
    }

    // Redirigimos a la página de pedidos para "mejorar" la app
    res.status(302).redirect('/tienda/pedidos');
  });
});

// Página que muestra los pedidos leídos del archivo
router.get('/pedidos', (req, res, next) => {
  const pedidos = leerPedidos();
  res.status(200).render('pedidos', {
    titulo: 'Pedidos de la Tiendita',
    pedidos: pedidos
  });
});

module.exports = router;
