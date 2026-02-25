const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname));

const rutasTienda = require('./routes/tienda.routes');
app.use('/tienda', rutasTienda);

const rutasPaginas = require('./routes/paginas.routes');
app.use('/', rutasPaginas);

app.use((request, response, next)=>{
    response.status(404).send('<h1>404 - Esta ruta no existe en la tiendita</h1>');
});

app.listen(3000);