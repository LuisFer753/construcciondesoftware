
CREATE DATABASE tiendita;
USE tiendita;

CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  descripcion VARCHAR(255),
  max_unidades INT NOT NULL
);

INSERT INTO productos (nombre, precio, descripcion, max_unidades) VALUES
('Pulparindots', 10.00, 'Dulces enchilosos', 10),
('Violin peruano', 1499.00, '40 años de uso', 2),
('Peluche de Dodo Original', 200199.00, 'El mejor amigo', 8);

CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_cliente VARCHAR(100) NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  fecha DATETIME NOT NULL,
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  nombre VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL
);

USE tiendita;
-- Roles del sistema
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Permisos (acciones atómicas)
CREATE TABLE permisos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion VARCHAR(255)
);

-- Asignación usuario–rol
CREATE TABLE usuario_roles (
  usuario_id INT NOT NULL,
  rol_id INT NOT NULL,
  PRIMARY KEY (usuario_id, rol_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Asignación rol–permiso
CREATE TABLE rol_permisos (
  rol_id INT NOT NULL,
  permiso_id INT NOT NULL,
  PRIMARY KEY (rol_id, permiso_id),
  FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permiso_id) REFERENCES permisos(id) ON DELETE CASCADE
);

INSERT INTO roles (nombre) VALUES
('cliente'),
('admin');

INSERT INTO permisos (nombre, descripcion) VALUES
('ver_tienda', 'Ver listado de productos'),
('hace_pedido', 'Crear pedidos'),
('ver_pedidos', 'Ver lista de pedidos'),
('editar_pedido', 'Editar pedidos'),
('admin_roles', 'Gestionar roles y permisos básicos');

-- Cliente básico
INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT r.id, p.id FROM roles r, permisos p
WHERE r.nombre = 'cliente' AND p.nombre IN ('ver_tienda', 'hace_pedido', 'ver_pedidos');

-- Admin
INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT r.id, p.id FROM roles r, permisos p
WHERE r.nombre = 'admin' AND p.nombre IN ('ver_tienda', 'hace_pedido', 'ver_pedidos', 'editar_pedido', 'admin_roles');


-- hacer admin al usuario con id = 6
INSERT INTO usuario_roles (usuario_id, rol_id)
SELECT 6, id FROM roles WHERE nombre = 'admin';

use tiendita;
ALTER TABLE productos
ADD COLUMN imagen VARCHAR(255) NULL;

-- Asignar permiso editar_pedido al rol admin
INSERT IGNORE INTO rol_permisos (rol_id, permiso_id)
SELECT r.id, p.id FROM roles r, permisos p
WHERE r.nombre = 'admin' AND p.nombre = 'editar_pedido';

DELIMITER //
CREATE PROCEDURE sp_crear_pedido(IN p_nombre_cliente VARCHAR(100), IN p_producto_id INT, IN p_cantidad INT)
BEGIN
  INSERT INTO pedidos (nombre_cliente, producto_id, cantidad, fecha)
  VALUES (p_nombre_cliente, p_producto_id, p_cantidad, NOW());
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_detalle_pedido(IN p_pedido_id INT)
BEGIN
  SELECT p.id, p.nombre_cliente, p.cantidad, p.fecha, prod.id AS producto_id, prod.nombre AS nombre_producto, prod.precio
  FROM pedidos p
  JOIN productos prod ON p.producto_id = prod.id
  WHERE p.id = p_pedido_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_actualizar_cantidad_pedido(IN p_pedido_id INT, IN p_nueva_cantidad INT)
BEGIN
  IF p_nueva_cantidad <= 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'La cantidad debe ser mayor que cero';
  ELSE
    UPDATE pedidos
    SET cantidad = p_nueva_cantidad
    WHERE id = p_pedido_id;
  END IF;
END //
DELIMITER ;

/*
Materiales(Clave, Descripción, Costo, Impuesto)
Proveedores(RFC, RazonSocial)
Proyectos(Numero, Denominacion)
Entregan(Clave, RFC, Numero, Fecha, Cantidad)
*/

