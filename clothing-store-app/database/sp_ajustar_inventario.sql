-- Procedimiento para ajustar inventario
CREATE PROCEDURE sp_ajustar_inventario(
    IN p_producto_id INT,
    IN p_cantidad_ajuste INT,
    IN p_motivo VARCHAR(100),
    IN p_usuario_id INT
)
BEGIN
    DECLARE v_existencia_actual INT;
    DECLARE v_nueva_existencia INT;
    
    -- Obtener existencia actual
    SELECT existencia INTO v_existencia_actual 
    FROM producto 
    WHERE id_producto = p_producto_id;
    
    -- Calcular nueva existencia
    SET v_nueva_existencia = v_existencia_actual + p_cantidad_ajuste;
    
    -- Actualizar producto
    UPDATE producto 
    SET existencia = v_nueva_existencia,
        updated_at = CURRENT_TIMESTAMP
    WHERE id_producto = p_producto_id;
    
    -- Registrar el ajuste
    INSERT INTO ajustes_inventario (producto_id, cantidad_ajuste, motivo, usuario_id, existencia_anterior, existencia_nueva)
    VALUES (p_producto_id, p_cantidad_ajuste, p_motivo, p_usuario_id, v_existencia_actual, v_nueva_existencia);
    
    -- Verificar stock bajo después del ajuste
    IF v_nueva_existencia <= 5 THEN
        INSERT INTO log_stock_bajo (producto_id, existencia, fecha_alerta)
        VALUES (p_producto_id, v_nueva_existencia, NOW());
    END IF;
END; 