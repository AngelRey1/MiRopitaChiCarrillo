-- Procedimiento para listar todas las ventas
CREATE PROCEDURE sp_listar_ventas(
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT v.*, c.nombre as cliente_nombre, u.nombre as usuario_nombre
    FROM ventas v
    LEFT JOIN cliente c ON v.cliente_id = c.id_cliente
    LEFT JOIN usuario u ON v.usuario_id = u.id_usuario
    ORDER BY v.fecha_venta DESC, v.id DESC
    LIMIT p_limit OFFSET p_offset;
END; 