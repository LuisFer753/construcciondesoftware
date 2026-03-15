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
};
