const productos = [
  { id: 1, nombre: 'Pulparindots', precio: 10, descripcion: 'Dulces enchilosos', max: 10 },
  { id: 2, nombre: 'Violin peruano', precio: 1499, descripcion: '40 años de uso', max: 2 },
  { id: 3, nombre: 'Peluche de Dodo Original', precio: 200199, descripcion: 'El mejor amigo', max: 8 }
];

module.exports = class Producto {
  constructor(nombre, precio, descripcion, max) {
    this.nombre = nombre;
    this.precio = precio;
    this.descripcion = descripcion;
    this.max = max;
  }

  save() {
    productos.push(this);
  }

  static fetchAll() {
    return productos;
  }
};
