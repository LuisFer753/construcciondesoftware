const express = require('express');
const usuarioController = require('../controllers/usuario.controller');

const router = express.Router();

// Registro
router.get('/signup', usuarioController.getSignup);
router.post('/signup', usuarioController.postSignup);

// Login / Logout
router.get('/login', usuarioController.getLogin);
router.post('/login', usuarioController.postLogin);
router.post('/logout', usuarioController.postLogout);

module.exports = router;
