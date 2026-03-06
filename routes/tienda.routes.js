const express = require('express');
const tiendaController = require('../controllers/tienda.controller');  // <-- IMPORTANTE

const router = express.Router();

// /tienda  → página principal
router.get('/', tiendaController.getTienda);

// /tienda/productos → JSON
router.get('/productos', tiendaController.getProductosJson);

// /tienda/checkout (GET) → forma
router.get('/checkout', tiendaController.getCheckout);

// /tienda/checkout (POST) → guarda pedido
router.post('/checkout', tiendaController.postCheckout);

// /tienda/pedidos → lista de pedidos
router.get('/pedidos', tiendaController.getPedidos);

module.exports = router;
