const express = require('express');
const tiendaController = require('../controllers/tienda.controller');
const isAuth = require('../is-auth');

const router = express.Router();

// /tienda
router.get('/', tiendaController.getTienda);

// /tienda/productos (JSON)
router.get('/productos', tiendaController.getProductosJson);

// /tienda/productos/:producto_id (detalle de producto - 1 registro)
router.get('/productos/:producto_id', tiendaController.getProducto);

// /tienda/checkout
router.get('/checkout', isAuth, tiendaController.getCheckout);
router.post('/checkout', isAuth, tiendaController.postCheckout);

// /tienda/pedidos (lista)
router.get('/pedidos', isAuth, tiendaController.getPedidos);

// /tienda/pedidos/:pedido_id (detalle de 1 pedido)
router.get('/pedidos/:pedido_id', isAuth, tiendaController.getPedido);

// /tienda/pedidos/editar (POST para update cantidad)
router.post('/pedidos/editar', isAuth, tiendaController.postEditarPedido);

module.exports = router;
