const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const csrf = require('csurf');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// 1) Sesión
app.use(session({
  secret: 'string_super_secreto_y_largo_de_luis',
  resave: false,
  saveUninitialized: false,
}));

// 2) Flash
app.use(flash());

// 3) CSRF (después de la sesión)
const csrfProtection = csrf();
app.use(csrfProtection);

// 4) Locals para TODAS las vistas
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.usuarioActual = req.session.user || null;
  next();
});

// 5) Rutas después de todo lo anterior
const tiendaRoutes = require('./routes/tienda.routes');
const pagesRoutes  = require('./routes/paginas.routes');
const usuarioRoutes = require('./routes/usuario.routes');

app.use('/tienda', tiendaRoutes);
app.use(usuarioRoutes);
app.use('/', pagesRoutes);

// 6) 404
app.use((request, response, next)=>{
    response.status(404).render('404', {titulo: 'Página no encontrada', rutaActual: request.url});
});

app.listen(3000);
