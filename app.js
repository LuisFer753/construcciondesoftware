const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const csrf = require('csurf');
const multer = require('multer');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// Parseo de JSON para peticiones AJAX
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 2) multer (después de bodyParser)
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');  // carpeta donde se subirán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('imagen')); 
// 'imagen' será el name del input file

// 3) estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
  res.locals.roles = req.session.roles || [];
  res.locals.permisos = req.session.permisos || [];
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
