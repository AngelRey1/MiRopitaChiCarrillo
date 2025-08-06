-- Procedimiento para obtener alertas de stock
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
    WHERE p.existencia <= 5
    ORDER BY p.existencia ASC;
END; 