-- Procedimiento para procesar devolución
CREATE PROCEDURE sp_procesar_devolucion(
    IN p_usuario_id INT,
    IN p_venta_id INT,
    IN p_cliente_id INT,
    IN p_motivo VARCHAR(50),
    IN p_total_devolucion DECIMAL(10,2),
    IN p_observaciones TEXT
)
BEGIN
    DECLARE v_devolucion_id INT;
    
    -- Crear la devolución
    INSERT INTO devoluciones (usuario_id, venta_id, cliente_id, motivo, total_devolucion, observaciones)
    VALUES (p_usuario_id, p_venta_id, p_cliente_id, p_motivo, p_total_devolucion, p_observaciones);
    
    SET v_devolucion_id = LAST_INSERT_ID();
    
    -- Actualizar estado de la venta relacionada
    UPDATE ventas 
    SET estado = 'cancelada',
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_venta_id;
    
    -- Retornar el ID de la devolución creada
    SELECT v_devolucion_id as devolucion_id;
END; 