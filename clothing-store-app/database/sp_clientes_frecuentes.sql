-- Procedimiento para obtener clientes frecuentes
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
END; 