const express = require('express');

const router = express.Router();

// Home → redirige a la tiendita
router.get('/', (req, res, next) => {
  res.status(302).redirect('/tienda');
});

// Acerca de
router.get('/acerca', (req, res, next) => {
  res.status(200).render('acerca', {
    titulo: 'Acerca de la Tiendita'
  });
});

// Contacto
router.get('/contacto', (req, res, next) => {
  res.status(200).render('contacto', {
    titulo: 'Contacto'
  });
});

module.exports = router;
