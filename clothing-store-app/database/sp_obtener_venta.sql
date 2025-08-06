-- Procedimiento para obtener una venta con sus detalles
CREATE PROCEDURE sp_obtener_venta(
    IN p_id_venta INT
)
BEGIN
    -- Obtener información de la venta
    SELECT v.*, c.nombre as cliente_nombre, u.nombre as usuario_nombre
    FROM ventas v
    LEFT JOIN cliente c ON v.cliente_id = c.id_cliente
    LEFT JOIN usuario u ON v.usuario_id = u.id_usuario
    WHERE v.id = p_id_venta;
    
    -- Obtener detalles de la venta
    SELECT dv.*, p.nombre as producto_nombre, p.modelo, p.talla
    FROM detalles_ventas dv
    LEFT JOIN producto p ON dv.producto_id = p.id_producto
    WHERE dv.venta_id = p_id_venta;
END; 