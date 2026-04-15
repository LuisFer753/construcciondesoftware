const db = require('../util/database');
const { runInTransaction } = require('../util/transaction');

module.exports = class Pedido {
  constructor(nombre_cliente, producto_id, cantidad, id = null) {
    this.id = id;
    this.nombre_cliente = nombre_cliente;
    this.producto_id = producto_id;
    this.cantidad = cantidad;
    this.fecha = new Date();
  }

  // Usando stored procedure
  saveWithSP() {
    return db.execute(
      'CALL sp_crear_pedido(?, ?, ?)',
      [this.nombre_cliente, this.producto_id, this.cantidad]
    );
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
  static fetchByIdWithSP(id) {
    return db.execute('CALL sp_detalle_pedido(?)', [id]);
}

  // Edición de un registro: actualizar cantidad
  static updateCantidadWithSP(id, nuevaCantidad) {
    return db.execute('CALL sp_actualizar_cantidad_pedido(?, ?)', [id, nuevaCantidad])}

  // Crear pedido y actualizar stock en una misma transacción
  static async crearConTransaccion(nombre_cliente, producto_id, cantidad) {
    return runInTransaction(async (conn) => {
      // 1) Leer stock actual
      const [productos] = await conn.execute(
        'SELECT existencias FROM productos WHERE id = ? FOR UPDATE',
        [producto_id]
      );

      if (productos.length === 0) {
        throw new Error('Producto no encontrado');
      }

      const stockActual = productos[0].existencias;
      if (stockActual < cantidad) {
        throw new Error('Stock insuficiente');
      }

      // 2) Insertar pedido
      const [insertResult] = await conn.execute(
        'INSERT INTO pedidos (nombre_cliente, producto_id, cantidad, fecha) VALUES (?, ?, ?, ?)',
        [nombre_cliente, producto_id, cantidad, new Date()]
      );

      const nuevoPedidoId = insertResult.insertId;

      // 3) Actualizar stock
      const nuevoStock = stockActual - cantidad;
      await conn.execute(
        'UPDATE productos SET existencias = ? WHERE id = ?',
        [nuevoStock, producto_id]
      );

      // Devolvemos info útil
      return { pedidoId: nuevoPedidoId, stockAntes: stockActual, stockDespues: nuevoStock };
    });
  }
  static crearConSPTransaccional(nombre_cliente, producto_id, cantidad) {
  return db.execute(
    'CALL sp_crear_pedido_con_stock(?, ?, ?)',
    [nombre_cliente, producto_id, cantidad]
  );
}
};
