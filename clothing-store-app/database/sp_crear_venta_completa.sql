-- Procedimiento para crear una venta completa
CREATE PROCEDURE sp_crear_venta_completa(
    IN p_usuario_id INT,
    IN p_cliente_id INT,
    IN p_metodo_pago VARCHAR(20),
    IN p_observaciones TEXT
)
BEGIN
    DECLARE v_venta_id INT;
    DECLARE v_total DECIMAL(10,2) DEFAULT 0;
    DECLARE v_subtotal DECIMAL(10,2) DEFAULT 0;
    DECLARE v_impuestos DECIMAL(10,2) DEFAULT 0;
    DECLARE v_descuento DECIMAL(10,2) DEFAULT 0;
    
    -- Crear la venta
    INSERT INTO ventas (usuario_id, cliente_id, fecha_venta, total, subtotal, impuestos, descuento, metodo_pago, observaciones)
    VALUES (p_usuario_id, p_cliente_id, CURDATE(), v_total, v_subtotal, v_impuestos, v_descuento, p_metodo_pago, p_observaciones);
    
    SET v_venta_id = LAST_INSERT_ID();
    
    -- Retornar el ID de la venta creada
    SELECT v_venta_id as venta_id;
END; 