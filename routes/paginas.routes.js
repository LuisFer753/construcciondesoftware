const express=require('express');
const path=require('path');
const router=express.Router();

router.get('/', (request, response, next) => {
    response.status(302).redirect('/tienda');
});

router.get('/acerca', (request, response, next) => {
    response.status(200).send('<h1>Acerca de la Tiendita</h1><p>Proyecto con Node y Express.</p>');
});

router.get('/contacto', (request, resonse, next) => {
    response.status(200).send('<h1>Contacto</h1><p>Escríbe a: a01708712@tec.mx</p>');
});

module.exports=router;
