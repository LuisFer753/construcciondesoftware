const express = require('express');
const pagesController = require('../controllers/paginas.controller');

const router = express.Router();

router.get('/', pagesController.getHome);
router.get('/acerca', pagesController.getAcerca);
router.get('/contacto', pagesController.getContacto);

module.exports = router;
