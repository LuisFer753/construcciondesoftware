const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');
const db = require('../util/database');

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
      if (rows.length === 0) {
        req.flash('error', 'Usuario o contraseña incorrectos.');
        return res.redirect('/login');
      }

      const user = rows[0];

      return bcrypt.compare(password, user.password).then(doMatch => {
        if (!doMatch) {
          req.flash('error', 'Usuario o contraseña incorrectos.');
          return res.redirect('/login');
        }

        req.session.isLoggedIn = true;
        req.session.user = {
          id: user.id,
          email: user.email,
          nombre: user.nombre
        };

        // Cargar roles y permisos desde la BD
        return Usuario.fetchRolesAndPermisos(user.id)
          .then(([rowsPerms]) => {
            const roles = new Set();
            const permisos = new Set();
            for (const row of rowsPerms) {
              if (row.rol) roles.add(row.rol);
              if (row.permiso) permisos.add(row.permiso);
            }

            req.session.roles = Array.from(roles);
            req.session.permisos = Array.from(permisos);

            return req.session.save(err => {
              res.redirect('/tienda');
            });
          });
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

// GET /admin/usuarios (lista usuarios y roles)
exports.getAdminUsuarios = (req, res, next) => {
  const sql = `
    SELECT u.id, u.email, u.nombre, GROUP_CONCAT(r.nombre) AS roles
    FROM usuarios u
    LEFT JOIN usuario_roles ur ON u.id = ur.usuario_id
    LEFT JOIN roles r ON ur.rol_id = r.id
    GROUP BY u.id
  `;
  db.execute(sql)
    .then(([rows]) => {
      res.render('admin-usuarios', {
        titulo: 'Administrar usuarios',
        usuarios: rows
      });
    })
    .catch(err => console.log(err));
};

// POST /admin/usuarios/roles (asignar rol simple)
exports.postAsignarRol = (req, res, next) => {
  const { usuario_id, rol_nombre } = req.body;

  const sql = `
    INSERT IGNORE INTO usuario_roles (usuario_id, rol_id)
    SELECT ?, r.id FROM roles r WHERE r.nombre = ?
  `;
  db.execute(sql, [usuario_id, rol_nombre])
    .then(() => {
      res.redirect('/admin/usuarios');
    })
    .catch(err => console.log(err));
};