const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class Usuario {
  constructor(email, nombre, password, id = null) {
    this.id = id;
    this.email = email;
    this.nombre = nombre;
    this.password = password;
  }

  save() {
    return bcrypt.hash(this.password, 12).then(hashedPassword => {
      return db.execute(
        'INSERT INTO usuarios (email, nombre, password) VALUES (?, ?, ?)',
        [this.email, this.nombre, hashedPassword]
      );
    });
  }

  static findByEmail(email) {
    return db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
  }
  static findById(id) {
    return db.execute('SELECT * FROM usuarios WHERE id = ?', [id]);
  }

  // Recuperar roles y permisos del usuario
  static fetchRolesAndPermisos(usuarioId) {
    const sql = `
      SELECT DISTINCT r.nombre AS rol, p.nombre AS permiso
      FROM usuarios u
      JOIN usuario_roles ur ON u.id = ur.usuario_id
      JOIN roles r ON ur.rol_id = r.id
      JOIN rol_permisos rp ON r.id = rp.rol_id
      JOIN permisos p ON rp.permiso_id = p.id
      WHERE u.id = ?
    `;
    return db.execute(sql, [usuarioId]);
  }
};
