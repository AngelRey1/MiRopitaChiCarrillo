-- Procedimiento para actualizar un producto
CREATE PROCEDURE sp_actualizar_producto(
    IN p_id_producto INT,
    IN p_nombre VARCHAR(100),
    IN p_modelo VARCHAR(50),
    IN p_talla VARCHAR(10),
    IN p_corte VARCHAR(50),
    IN p_existencia INT,
    IN p_precio DECIMAL(10,2),
    IN p_en_promocion BOOLEAN,
    IN p_descripcion TEXT
)
BEGIN
    DECLARE v_existencia_actual INT;
    DECLARE v_diferencia INT;
    
    -- Obtener existencia actual
    SELECT existencia INTO v_existencia_actual 
    FROM producto 
    WHERE id_producto = p_id_producto;
    
    -- Calcular diferencia
    SET v_diferencia = p_existencia - v_existencia_actual;
    
    -- Actualizar producto
    UPDATE producto 
    SET nombre = p_nombre,
        modelo = p_modelo,
        talla = p_talla,
        corte = p_corte,
        existencia = p_existencia,
        precio = p_precio,
        en_promocion = p_en_promocion,
        descripcion = p_descripcion,
        updated_at = NOW()
    WHERE id_producto = p_id_producto;
    
    -- Si hay diferencia en existencia, registrar el cambio
    IF v_diferencia != 0 THEN
        INSERT INTO log_stock_bajo (producto_id, existencia, fecha_alerta)
        VALUES (p_id_producto, p_existencia, NOW());
    END IF;
    
    SELECT 'Producto actualizado correctamente' as mensaje;
END; 