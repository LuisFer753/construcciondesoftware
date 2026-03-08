const db = require('../util/database');

module.exports = class Pedido {
  constructor(nombre_cliente, producto_id, cantidad, id = null) {
    this.id = id;
    this.nombre_cliente = nombre_cliente;
    this.producto_id = producto_id;
    this.cantidad = cantidad;
    this.fecha = new Date();
  }

  // Inserción de un registro
  save() {
    return db.execute(
      'INSERT INTO pedidos (nombre_cliente, producto_id, cantidad, fecha) VALUES (?, ?, ?, ?)',
      [this.nombre_cliente, this.producto_id, this.cantidad, this.fecha]
    );
  }

  // Varios registros (con JOIN para mostrar nombre de producto)
  static fetchAll() {
    return db.execute(
      `SELECT p.id, p.nombre_cliente, p.cantidad, p.fecha,
              prod.nombre AS nombre_producto
       FROM pedidos p
       JOIN productos prod ON p.producto_id = prod.id
       ORDER BY p.fecha DESC`
    );
  }

  // Un solo registro por id
  static fetchById(id) {
    return db.execute(
      `SELECT p.id, p.nombre_cliente, p.cantidad, p.fecha,
              prod.id AS producto_id, prod.nombre AS nombre_producto
       FROM pedidos p
       JOIN productos prod ON p.producto_id = prod.id
       WHERE p.id = ?`,
      [id]
    );
  }

  // Edición de un registro: actualizar cantidad
  static updateCantidad(id, nuevaCantidad) {
    return db.execute(
      'UPDATE pedidos SET cantidad = ? WHERE id = ?',
      [nuevaCantidad, id]
    );
  }
};
