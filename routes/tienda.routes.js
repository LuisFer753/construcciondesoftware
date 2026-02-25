const express=require('express');
const path=require('path');
const fs=require('fs');
const router=express.Router();


router.get('/', (request, response, next)=>{
    const filepath=path.join(__dirname, '..', 'lab6.html');
    response.status(200).sendFile(filepath);
});

router.get('/info', (request, response, next)=>{
    response.status(200).json({nombre: 'La mejor tiendita', iva: '16%', mensaje: 'Las mejores cosas que verás jamás!!'});
});

router.get('/productos', (request, response, next) => {
    const productos=[
        {id: 1, nombre: 'Pulparindots', precio: 10},
        {id: 2, nombre: 'Violín peruano', precio: 1499},
        {id: 3, nombre: 'Peluche de Dodo Original', precio: 200199}
    ];
    response.status(200).json(roductos);
});

router.get('/checkout', (request, response, next) => {
    const htmlform = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Checkout Tiendita</title>
    </head>
    <body>
      <h1>Checkout - Tiendita</h1>
      <form action="/tienda/checkout" method="POST">
        <label>Nombre del cliente:
          <input type="text" name="nombre" required>
        </label>
        <br>
        <label>Producto:
          <select name="producto">
            <option value="Pulparindots">Pulparindots</option>
            <option value="Violin peruano">Violin peruano</option>
            <option value="Peluche de Dodo Original">Peluche de Dodo Original</option>
          </select>
        </label>
        <br>
        <label>Cantidad:
          <input type="number" name="cantidad" min="1" max="10" required>
        </label>
        <br>
        <button type="submit">Enviar pedido</button>
      </form>
      <p><a href="/tienda">Volver a la tiendita</a></p>
    </body>
    </html>`;
    response.status(200).send(htmlform);
});

router.post('/checkout', (request, response, next) => {
    const {nombre, producto, cantidad} = request.body;
    const linea = `Cliente: ${nombre}, Producto: ${producto}, Cantidad: ${cantidad}\n`;
    const filepath = path.join(__dirname, '..', 'pedidos_tiendita.txt');
    response.status(201).send(`<h1>Pedido recibido</h1>
        <p>Gracias, ${nombre}. Guardamos tu pedido de ${cantidad} x ${producto}.</p>
        <p><a href="/tienda">Volver a la tiendita</a></p>`);
});

module.exports=router;
