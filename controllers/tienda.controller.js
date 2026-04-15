const Producto = require('../models/producto.model');
const Pedido = require('../models/pedido.model');

// Página principal (lista de productos desde BD)
exports.getTienda = (req, res, next) => {
  const mensaje = req.flash('info');
  let nombreCliente = null;

  const cookieHeader = req.get('Cookie');
  if (cookieHeader) {
    const partes = cookieHeader.split(';').map(p => p.trim());
    const parNombre = partes.find(p => p.startsWith('nombre_cliente='));
    if (parNombre) {
      nombreCliente = decodeURIComponent(parNombre.split('=')[1]);
    }
  }

  Producto.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('tienda', {
        titulo: 'Tiendita',
        productos: rows,
        mensaje: mensaje.length > 0 ? mensaje[0] : null,
        nombreCliente: nombreCliente
      });
    })
    .catch(err => console.log(err));
};

// JSON de productos (varios registros)
exports.getProductosJson = (req, res, next) => {
  Producto.fetchAll()
    .then(([rows, fieldData]) => {
      res.status(200).json(rows);
    })
    .catch(err => console.log(err));
};

// Detalle de un producto (1 registro) usando parámetro en ruta
exports.getProducto = (req, res, next) => {
  const prodId = req.params.producto_id;

  Producto.fetchById(prodId)
    .then(([rows, fieldData]) => {
      if (rows.length === 0) {
        return res.status(404).render('404', {
          titulo: 'Producto no encontrado',
          rutaActual: req.url
        });
      }
      const producto = rows[0];
      res.render('producto-detalle', {
        titulo: `Producto: ${producto.nombre}`,
        producto: producto
      });
    })
    .catch(err => console.log(err));
};

// Página de checkout (form)
exports.getCheckout = (req, res, next) => {
  const nombreSesion = req.session.nombreCliente || '';

  // necesitamos productos para un <select> real desde BD
  Producto.fetchAll()
    .then(([rows]) => {
      res.render('checkout', {
        titulo: 'Checkout Tiendita',
        nombreGuardado: nombreSesion,
        productos: rows
      });
    })
    .catch(err => console.log(err));
};

// POST checkout (inserción de pedido)
exports.postCheckout = (req, res, next) => {
  const { nombre, producto_id, cantidad } = req.body;
  const cantidadNum = parseInt(cantidad, 10) || 0;

  Pedido.crearConSPTransaccional(nombre, producto_id, cantidadNum)
    .then(() => {
      req.session.nombreCliente = nombre;

      res.setHeader(
        'Set-Cookie',
        `nombre_cliente=${encodeURIComponent(nombre)}; HttpOnly`
      );

      req.flash('info', `Gracias por tu pedido, ${nombre}!`);
      req.session.ultimoPedido = { producto_id, cantidad: cantidadNum };

      res.redirect('/tienda/pedidos');
    })
    .catch(err => {
      console.error('Error en SP transaccional:', err.message);
      req.flash('info', 'No se pudo completar el pedido (stock insuficiente o error).');
      res.redirect('/tienda/checkout');
    });
};

// Lista de pedidos (varios registros)
exports.getPedidos = (req, res, next) => {
  const nombreSesion = req.session.nombreCliente || null;
  const ultimoPedido = req.session.ultimoPedido || null;

  Pedido.fetchAll().then(([rows]) => {
      res.render('pedidos', {
        titulo: 'Pedidos de la Tiendita',
        pedidos: rows,
        nombreCliente: nombreSesion,
        ultimoPedido: ultimoPedido
      });
    })
    .catch(err => console.log(err));
};

// Obtener 1 pedido por id
exports.getPedido = (req, res, next) => {
  const pedidoId = req.params.pedido_id;

  Pedido.fetchByIdWithSP(pedidoId)
    .then(([rows]) => {
      // Cuando llamas CALL, mysql2 te regresa rows[0] como el resultado real
      const resultRows = rows[0] || rows; 
      if (resultRows.length === 0) {
        return res.status(404).render('404', {
          titulo: 'Pedido no encontrado',
          rutaActual: req.url
        });
      }
      const pedido = resultRows[0];
      res.render('pedido-detalle', {
        titulo: `Pedido #${pedido.id}`,
        pedido: pedido
      });
    })
    .catch(err => console.log(err));
};

// Editar cantidad de un pedido (ejemplo de UPDATE)
exports.postEditarPedido = (req, res, next) => {
  const pedidoId = req.body.pedido_id;
  const nuevaCantidad = req.body.nueva_cantidad;

  Pedido.updateCantidadWithSP(pedidoId, nuevaCantidad)
    .then(() => {
      req.flash('info', 'Cantidad actualizada correctamente');
      res.redirect('/tienda/pedidos/' + pedidoId);
    })
    .catch(err => {
      console.log(err);
      req.flash('info', 'No se pudo actualizar la cantidad (verifica el valor).');
      res.redirect('/tienda/pedidos/' + pedidoId);
    });
};

// Mostrar formulario para administrar productos (incluye imagen)
exports.getAdminProductos = (req, res, next) => {
  Producto.fetchAll()
    .then(([rows]) => {
      res.render('admin-productos', {
        titulo: 'Administrar productos',
        productos: rows
      });
    })
    .catch(err => console.log(err));
};

// Procesar edición/imagen de producto
exports.postAdminProducto = (req, res, next) => {
  const { id, nombre, precio, descripcion, max_unidades, imagen_actual } = req.body;
  const file = req.file;

  let rutaImagen = imagen_actual; // valor por defecto

  if (file) {
    rutaImagen = '/' + file.path.replace(/\\/g, '/');
  }

  Producto.fetchById(id)
    .then(([rows]) => {
      if (rows.length === 0) {
        return res.redirect('/tienda/admin/productos');
      }

      const prodRow = rows[0];
      const producto = new Producto(
        nombre,
        precio,
        descripcion,
        max_unidades,
        rutaImagen,
        prodRow.id
      );

      return producto.update();
    })
    .then(() => {
      res.redirect('/tienda/admin/productos');
    })
    .catch(err => console.log(err));
};

exports.postDetallePedidoAjax = (req, res, next) => {
  const pedidoId = req.body.pedido_id;

  if (!pedidoId) {
    return res.status(400).json({ error: 'Falta pedido_id' });
  }

  Pedido.fetchByIdWithSP(pedidoId)
    .then(([rows]) => {
      const resultRows = rows[0] || rows; // igual que en getPedido

      if (!resultRows || resultRows.length === 0) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }

      const pedido = resultRows[0];
      res.status(200).json({
        id: pedido.id,
        nombre_cliente: pedido.nombre_cliente,
        producto_id: pedido.producto_id,
        cantidad: pedido.cantidad,
        fecha: pedido.fecha
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Error en el servidor' });
    });
};
