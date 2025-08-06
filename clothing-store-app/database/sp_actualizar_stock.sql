-- Procedimiento para actualizar stock de productos
CREATE PROCEDURE sp_actualizar_stock(
    IN p_producto_id INT,
    IN p_cantidad INT,
    IN p_tipo ENUM('venta', 'compra', 'devolucion')
)
BEGIN
    DECLARE v_existencia_actual INT;
    
    -- Obtener existencia actual
    SELECT existencia INTO v_existencia_actual 
    FROM producto 
    WHERE id_producto = p_producto_id;
    
    -- Actualizar stock según el tipo de operación
    IF p_tipo = 'venta' THEN
        UPDATE producto 
        SET existencia = existencia - p_cantidad
        WHERE id_producto = p_producto_id;
    ELSEIF p_tipo = 'compra' THEN
        UPDATE producto 
        SET existencia = existencia + p_cantidad
        WHERE id_producto = p_producto_id;
    ELSEIF p_tipo = 'devolucion' THEN
        UPDATE producto 
        SET existencia = existencia + p_cantidad
        WHERE id_producto = p_producto_id;
    END IF;
    
    -- Verificar stock bajo
    IF (SELECT existencia FROM producto WHERE id_producto = p_producto_id) <= 5 THEN
        INSERT INTO log_stock_bajo (producto_id, existencia, fecha_alerta)
        VALUES (p_producto_id, (SELECT existencia FROM producto WHERE id_producto = p_producto_id), NOW());
    END IF;
END; 