const Producto = require('../models/producto.model');
const Pedido = require('../models/pedido.model');

// Página principal de la tiendita
exports.getTienda = (req, res, next) => {
  const productos = Producto.fetchAll();

  // Leer mensaje flash (si existe)
  const mensaje = req.flash('info');

  // Leer cookie de nombre (si existe)
  let nombreCliente = null;
  const cookieHeader = req.get('Cookie'); // ejemplo de uso directo del header
  if (cookieHeader) {
    // Buscar cookie nombre_cliente=...
    const partes = cookieHeader.split(';').map(p => p.trim());
    const parNombre = partes.find(p => p.startsWith('nombre_cliente='));
    if (parNombre) {
      nombreCliente = decodeURIComponent(parNombre.split('=')[1]);
    }
  }

  res.render('tienda', {
    titulo: 'Tiendita',
    productos: productos,
    mensaje: mensaje.length > 0 ? mensaje[0] : null,
    nombreCliente: nombreCliente
  });
};

// JSON de productos
exports.getProductosJson = (req, res, next) => {
  const productos = Producto.fetchAll();
  res.status(200).json(productos);
};

// Página de checkout (formulario)
exports.getCheckout = (req, res, next) => {
  // Si tenemos nombre guardado en sesión, lo prellenamos
  const nombreSesion = req.session.nombreCliente || '';

  res.render('checkout', {
    titulo: 'Checkout Tiendita',
    nombreGuardado: nombreSesion
  });
};

// POST checkout (crear pedido, guardar y redirigir)
exports.postCheckout = (req, res, next) => {
  const { nombre, producto, cantidad } = req.body;

  const pedido = new Pedido(nombre, producto, cantidad);
  pedido.save();

  // Guardar en sesión el nombre del cliente (para usarlo en otras rutas)
  req.session.nombreCliente = nombre;

  // Ejemplo de cookie segura / HttpOnly
  res.setHeader(
    'Set-Cookie',
    `nombre_cliente=${encodeURIComponent(nombre)}; HttpOnly`
  );

  // Mensaje flash que se mostrará solo en la siguiente petición
  req.flash('info', `Gracias por tu pedido, ${nombre}!`);

  // También podríamos guardar el último pedido en sesión
  req.session.ultimoPedido = {
    producto,
    cantidad
  };

  res.redirect('/tienda/pedidos');
};

// Página que lista los pedidos
exports.getPedidos = (req, res, next) => {
  const pedidos = Pedido.fetchAll();

  // Leer datos de sesión (ejemplo de uso)
  const nombreSesion = req.session.nombreCliente || null;
  const ultimoPedido = req.session.ultimoPedido || null;

  res.render('pedidos', {
    titulo: 'Pedidos de la Tiendita',
    pedidos: pedidos,
    nombreCliente: nombreSesion,
    ultimoPedido: ultimoPedido
  });
};
