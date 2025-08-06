-- Procedimiento para obtener estadísticas de ventas
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
END; 