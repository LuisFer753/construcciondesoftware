const express = require('express');
const tiendaController = require('../controllers/tienda.controller');
const isAuth = require('../is-auth');
const hasPermiso = require('../has-permiso');

const router = express.Router();

// /tienda → ver tienda (necesita ver_tienda)
router.get('/', isAuth, hasPermiso(['ver_tienda']), tiendaController.getTienda);

// JSON de productos (podría ser público o protegido)
router.get('/productos', tiendaController.getProductosJson);
router.get('/productos/:producto_id', tiendaController.getProducto);

// Checkout y creación de pedido
router.get('/checkout', isAuth, hasPermiso(['hace_pedido']), tiendaController.getCheckout);
router.post('/checkout', isAuth, hasPermiso(['hace_pedido']), tiendaController.postCheckout);

// Ver pedidos (lista)
router.get('/pedidos', isAuth, hasPermiso(['ver_pedidos']), tiendaController.getPedidos);

// Ver un pedido concreto
router.get('/pedidos/:pedido_id', isAuth, hasPermiso(['ver_pedidos']), tiendaController.getPedido);

// Editar pedido (solo admin u otro rol con editar_pedido)
router.post('/pedidos/editar', isAuth, hasPermiso(['editar_pedido']), tiendaController.postEditarPedido);

// Admin: editar producto (form + POST)
router.get('/admin/productos', isAuth, hasPermiso(['editar_pedido']), tiendaController.getAdminProductos);
router.post('/admin/productos', isAuth, hasPermiso(['editar_pedido']), tiendaController.postAdminProducto);

module.exports = router;
