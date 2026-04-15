
CREATE PROCEDURE sp_crear_pedido_con_stock(
  IN p_nombre_cliente VARCHAR(100),
  IN p_producto_id INT,
  IN p_cantidad INT
)
BEGIN
  DECLARE v_existencias INT;
  DECLARE v_nuevo_stock INT;

  -- Iniciar transacción explícita
  START TRANSACTION;

  -- Leer existencias del producto (y bloquear la fila)
  SELECT existencias
  INTO v_existencias
  FROM productos
  WHERE id = p_producto_id
  FOR UPDATE;

  -- Validar que exista el producto
  IF v_existencias IS NULL THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Producto no encontrado';
  END IF;

  -- Validar stock suficiente
  IF v_existencias < p_cantidad THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Stock insuficiente';
  END IF;

  -- Calcular nuevo stock
  SET v_nuevo_stock = v_existencias - p_cantidad;

  -- Insertar pedido
  INSERT INTO pedidos (nombre_cliente, producto_id, cantidad, fecha)
  VALUES (p_nombre_cliente, p_producto_id, p_cantidad, NOW());

  -- Actualizar existencias
  UPDATE productos
  SET existencias = v_nuevo_stock
  WHERE id = p_producto_id;

  -- Confirmar la transacción
  COMMIT;
END //

DELIMITER ;