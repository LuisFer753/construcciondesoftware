const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');

// GET /signup
exports.getSignup = (req, res, next) => {
  const mensaje = req.flash('error');
  res.render('signup', {
    titulo: 'Registro',
    errorMessage: mensaje.length > 0 ? mensaje[0] : null
  });
};

// POST /signup
exports.postSignup = (req, res, next) => {
  let { email, nombre, password } = req.body;
  email = email.trim().toLowerCase();

  Usuario.findByEmail(email)
    .then(([rows]) => {
      if (rows.length > 0) {
        req.flash('error', 'Ese correo ya está registrado.');
        return res.redirect('/signup');
      }

      const nuevoUsuario = new Usuario(email, nombre, password);
      return nuevoUsuario.save();
    })
    .then(() => {
      res.redirect('/login');
    })
    .catch(err => console.log(err));
};

// GET /login
exports.getLogin = (req, res, next) => {
  const mensaje = req.flash('error');
  res.render('login', {
    titulo: 'Iniciar sesión',
    errorMessage: mensaje.length > 0 ? mensaje[0] : null
  });
};

// POST /login
exports.postLogin = (req, res, next) => {
  let { email, password } = req.body;
  email = email.trim().toLowerCase();

  Usuario.findByEmail(email)
    .then(([rows]) => {
      console.log('Buscando email:', email);
      console.log('Encontrado:', rows);

      if (rows.length === 0) {
        req.flash('error', 'Usuario o contraseña incorrectos.');
        return res.redirect('/login');
      }

      const user = rows[0];

      console.log('Password introducido:', password);
      console.log('Hash en BD:', user.password);

      return bcrypt.compare(password, user.password).then(doMatch => {
        console.log('doMatch:', doMatch);

        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = {
            id: user.id,
            email: user.email,
            nombre: user.nombre
          };
          return req.session.save(err => {
            res.redirect('/tienda');
          });
        }
        req.flash('error', 'Usuario o contraseña incorrectos.');
        res.redirect('/login');
      });
    })
    .catch(err => {
      console.log(err);
      res.redirect('/login');
    });
};

// POST /logout
exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    res.redirect('/login');
  });
};
