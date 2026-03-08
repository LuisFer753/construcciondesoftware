const express = require('express');
const tiendaController = require('../controllers/tienda.controller');

const router = express.Router();

// /tienda
router.get('/', tiendaController.getTienda);

// /tienda/productos (JSON)
router.get('/productos', tiendaController.getProductosJson);

// /tienda/productos/:producto_id (detalle de producto - 1 registro)
router.get('/productos/:producto_id', tiendaController.getProducto);

// /tienda/checkout
router.get('/checkout', tiendaController.getCheckout);
router.post('/checkout', tiendaController.postCheckout);

// /tienda/pedidos (lista)
router.get('/pedidos', tiendaController.getPedidos);

// /tienda/pedidos/:pedido_id (detalle de 1 pedido)
router.get('/pedidos/:pedido_id', tiendaController.getPedido);

// /tienda/pedidos/editar (POST para update cantidad)
router.post('/pedidos/editar', tiendaController.postEditarPedido);

module.exports = router;
