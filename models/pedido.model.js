// models/pedido.model.js
const fs = require('fs');
const path = require('path');

const pedidosFile = path.join(__dirname, '..', 'data', 'pedidos_tiendita.txt');

module.exports = class Pedido {
  constructor(nombre, producto, cantidad) {
    this.nombre = nombre;
    this.producto = producto;
    this.cantidad = Number(cantidad);
    this.fecha = new Date().toISOString();
  }

  save() {
    const dir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.appendFileSync(pedidosFile, JSON.stringify(this) + '\n', 'utf8');
  }

  static fetchAll() {
    if (!fs.existsSync(pedidosFile)) return [];
    const contenido = fs.readFileSync(pedidosFile, 'utf8');
    if (!contenido.trim()) return [];
    return contenido.trim().split('\n').map((linea) => {
        try {
          return JSON.parse(linea);
        } catch {
          return null;
        }
      })
      .filter((p) => p);
  }
};
