-- =====================================================
-- PROCEDIMIENTOS ALMACENADOS PARA OPERACIONES COMUNES
-- =====================================================

-- Procedimiento para crear una venta completa
DELIMITER //
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
END //
DELIMITER ;

-- Procedimiento para actualizar stock de productos
DELIMITER //
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
        SET existencia = existencia - p_cantidad,
            updated_at = CURRENT_TIMESTAMP
        WHERE id_producto = p_producto_id;
    ELSEIF p_tipo = 'compra' THEN
        UPDATE producto 
        SET existencia = existencia + p_cantidad,
            updated_at = CURRENT_TIMESTAMP
        WHERE id_producto = p_producto_id;
    ELSEIF p_tipo = 'devolucion' THEN
        UPDATE producto 
        SET existencia = existencia + p_cantidad,
            updated_at = CURRENT_TIMESTAMP
        WHERE id_producto = p_producto_id;
    END IF;
    
    -- Verificar stock bajo
    IF (SELECT existencia FROM producto WHERE id_producto = p_producto_id) <= 5 THEN
        INSERT INTO log_stock_bajo (producto_id, existencia, fecha_alerta)
        VALUES (p_producto_id, (SELECT existencia FROM producto WHERE id_producto = p_producto_id), NOW());
    END IF;
END //
DELIMITER ;

-- Procedimiento para procesar devolución
DELIMITER //
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
END //
DELIMITER ;

-- =====================================================
-- PROCEDIMIENTOS ADICIONALES PARA REPORTES
-- =====================================================

-- Procedimiento para obtener estadísticas de ventas
DELIMITER //
CREATE PROCEDURE sp_estadisticas_ventas(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE
)
BEGIN
    SELECT 
        COUNT(*) as total_ventas,
        SUM(total) as total_ingresos,
        AVG(total) as promedio_venta,
        COUNT(DISTINCT usuario_id) as vendedores_activos,
        COUNT(DISTINCT cliente_id) as clientes_unicos
    FROM ventas 
    WHERE fecha_venta BETWEEN p_fecha_inicio AND p_fecha_fin
    AND estado = 'completada';
END //
DELIMITER ;

-- Procedimiento para obtener productos más vendidos
DELIMITER //
CREATE PROCEDURE sp_productos_mas_vendidos(
    IN p_limite INT
)
BEGIN
    SELECT 
        p.id_producto,
        p.nombre,
        p.modelo,
        p.talla,
        SUM(dv.cantidad) as total_vendido,
        SUM(dv.subtotal) as total_ingresos
    FROM producto p
    JOIN detalles_ventas dv ON p.id_producto = dv.producto_id
    JOIN ventas v ON dv.venta_id = v.id
    WHERE v.estado = 'completada'
    GROUP BY p.id_producto, p.nombre, p.modelo, p.talla
    ORDER BY total_vendido DESC
    LIMIT p_limite;
END //
DELIMITER ;

-- Procedimiento para obtener alertas de stock
DELIMITER //
CREATE PROCEDURE sp_alertas_stock()
BEGIN
    SELECT 
        p.id_producto,
        p.nombre,
        p.modelo,
        p.talla,
        p.existencia,
        p.precio,
        CASE 
            WHEN p.existencia = 0 THEN 'SIN STOCK'
            WHEN p.existencia <= 5 THEN 'STOCK BAJO'
            ELSE 'STOCK NORMAL'
        END as estado_stock
    FROM producto p
    WHERE p.existencia <= 5 AND p.activo = TRUE
    ORDER BY p.existencia ASC;
END //
DELIMITER ;

-- =====================================================
-- PROCEDIMIENTOS PARA GESTIÓN DE INVENTARIO
-- =====================================================

-- Procedimiento para ajustar inventario
DELIMITER //
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
END //
DELIMITER ;

-- =====================================================
-- PROCEDIMIENTOS PARA GESTIÓN DE CLIENTES
-- =====================================================

-- Procedimiento para marcar cliente como frecuente
DELIMITER //
CREATE PROCEDURE sp_marcar_cliente_frecuente(
    IN p_cliente_id INT
)
BEGIN
    UPDATE cliente 
    SET frecuente = TRUE,
        updated_at = CURRENT_TIMESTAMP
    WHERE id_cliente = p_cliente_id;
    
    SELECT 'Cliente marcado como frecuente' as mensaje;
END //
DELIMITER ;

-- Procedimiento para obtener clientes frecuentes
DELIMITER //
CREATE PROCEDURE sp_clientes_frecuentes()
BEGIN
    SELECT 
        c.*,
        COUNT(v.id) as total_compras,
        SUM(v.total) as total_gastado
    FROM cliente c
    LEFT JOIN ventas v ON c.id_cliente = v.cliente_id
    WHERE c.frecuente = TRUE
    GROUP BY c.id_cliente
    ORDER BY total_gastado DESC;
END //
DELIMITER ; 