const Producto = require('../models/producto.model');
const Pedido = require('../models/pedido.model');

// Página principal de la tiendita
exports.getTienda = (req, res, next) => {
  const productos = Producto.fetchAll();
  res.render('tienda', {titulo: 'Tiendita', productos: productos});
};

// JSON de productos (otra ruta)
exports.getProductosJson = (req, res, next) => {
  const productos = Producto.fetchAll();
  res.status(200).json(productos);
};

// Página de checkout (formulario)
exports.getCheckout = (req, res, next) => {
  res.render('checkout', {titulo: 'Checkout Tiendita'});
};

// POST checkout (crear pedido, guardar y redirigir)
exports.postCheckout = (req, res, next) => {
  const { nombre, producto, cantidad } = req.body;
  const pedido = new Pedido(nombre, producto, cantidad);
  pedido.save();
  res.redirect('/tienda/pedidos');
};

// Página que lista los pedidos
exports.getPedidos = (req, res, next) => {
  const pedidos = Pedido.fetchAll();
  res.render('pedidos', {
    titulo: 'Pedidos de la Tiendita',
    pedidos: pedidos
  });
};
