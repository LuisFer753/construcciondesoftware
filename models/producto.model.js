const db = require('../util/database');

module.exports = class Producto {
  constructor(nombre, precio, descripcion, max_unidades, id = null) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.descripcion = descripcion;
    this.max_unidades = max_unidades;
  }

  // Inserta un producto nuevo
  save() {
    return db.execute(
      'INSERT INTO productos (nombre, precio, descripcion, max_unidades) VALUES (?, ?, ?, ?)',
      [this.nombre, this.precio, this.descripcion, this.max_unidades]
    );
  }

  // Consulta que devuelve varios registros
  static fetchAll() {
    return db.execute('SELECT * FROM productos');
  }

  // Consulta que devuelve un solo registro
  static fetchById(id) {
    return db.execute('SELECT * FROM productos WHERE id = ?', [id]);
  }

  // Edición de un registro (ejemplo: actualizar precio y max_unidades)
  update() {
    return db.execute(
      'UPDATE productos SET nombre = ?, precio = ?, descripcion = ?, max_unidades = ? WHERE id = ?',
      [this.nombre, this.precio, this.descripcion, this.max_unidades, this.id]
    );
  }
};
