const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));

// Sesiones
app.use(session({
  secret: 'string_super_super_super_secreto_y_muy_muy_muy_largo_y_secreto',
  resave: false,
  saveUninitialized: false,
}));

// Flash (usa la sesión)
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));

const rutasTienda = require('./routes/tienda.routes');
app.use('/tienda', rutasTienda);

const rutasPaginas = require('./routes/paginas.routes');
app.use('/', rutasPaginas);

app.use((request, response, next)=>{
    response.status(404).render('404', {titulo: 'Página no encontrada', rutaActual: request.url});
});

app.listen(3000);