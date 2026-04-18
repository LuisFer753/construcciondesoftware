use tiendita;

ALTER TABLE productos
ADD COLUMN total_pedidos INT NOT NULL DEFAULT 0;

DELIMITER //

CREATE TRIGGER trg_pedidos_after_insert
AFTER INSERT ON pedidos
FOR EACH ROW
BEGIN
  UPDATE productos
  SET total_pedidos = total_pedidos + NEW.cantidad
  WHERE id = NEW.producto_id;
END //

DELIMITER ;

CREATE TABLE pedidos_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  cantidad_antes INT NOT NULL,
  cantidad_despues INT NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);

DELIMITER //

CREATE TRIGGER trg_pedidos_after_update
AFTER UPDATE ON pedidos
FOR EACH ROW
BEGIN
  -- Solo registramos si cambia la cantidad
  IF OLD.cantidad <> NEW.cantidad THEN
    INSERT INTO pedidos_log (pedido_id, cantidad_antes, cantidad_despues)
    VALUES (OLD.id, OLD.cantidad, NEW.cantidad);
  END IF;
END //

DELIMITER ;