const express = require('express');
const usuarioController = require('../controllers/usuario.controller');
const isAuth = require('../is-auth');
const hasPermiso = require('../has-permiso');
const router = express.Router();

// Registro
router.get('/signup', usuarioController.getSignup);
router.post('/signup', usuarioController.postSignup);

// Login / Logout
router.get('/login', usuarioController.getLogin);
router.post('/login', usuarioController.postLogin);
router.post('/logout', usuarioController.postLogout);

router.get('/admin/usuarios',
  isAuth,
  hasPermiso(['admin_roles']),
  usuarioController.getAdminUsuarios
);

router.post('/admin/usuarios/roles',
  isAuth,
  hasPermiso(['admin_roles']),
  usuarioController.postAsignarRol
);

module.exports = router;
