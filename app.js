const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

const rutasTienda = require('./routes/tienda.routes');
app.use('/tienda', rutasTienda);

const rutasPaginas = require('./routes/paginas.routes');
app.use('/', rutasPaginas);

app.use((request, response, next)=>{
    response.status(404).render('404', {titulo: 'Página no encontrada', rutaActual: request.url});
});

app.listen(3000);