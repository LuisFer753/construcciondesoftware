const cargarDetallePedido = (pedidoId) => {
  const csrf = document.getElementById('_csrf').value;

  fetch('/tienda/pedidos/detalle-json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'csrf-token': csrf // csurf lo acepta como CSRF-Token/csrf-token header[web:92]
    },
    body: JSON.stringify({ pedido_id: pedidoId })
  })
    .then(result => {
      if (!result.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      return result.json();
    })
    .then(data => {
      const panel = document.getElementById('detalle-pedido-ajax');
      const contenido = document.getElementById('detalle-pedido-ajax-contenido');

      if (data.error) {
        contenido.innerHTML = `<p class="text-red-400">${data.error}</p>`;
      } else {
        contenido.innerHTML = `
          <p><strong>ID:</strong> ${data.id}</p>
          <p><strong>Cliente:</strong> ${data.nombre_cliente}</p>
          <p><strong>Producto ID:</strong> ${data.producto_id}</p>
          <p><strong>Cantidad:</strong> ${data.cantidad}</p>
          <p><strong>Fecha:</strong> ${data.fecha}</p>
        `;
      }

      panel.classList.remove('hidden');
    })
    .catch(err => {
      console.error(err);
      const panel = document.getElementById('detalle-pedido-ajax');
      const contenido = document.getElementById('detalle-pedido-ajax-contenido');
      contenido.innerHTML = `<p class="text-red-400">Ocurrió un error al cargar el detalle.</p>`;
      panel.classList.remove('hidden');
    });
};
