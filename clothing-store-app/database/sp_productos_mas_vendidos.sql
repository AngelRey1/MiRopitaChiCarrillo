-- Procedimiento para obtener productos más vendidos
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
END; 