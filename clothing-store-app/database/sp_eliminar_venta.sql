-- Procedimiento para eliminar una venta (soft delete)
CREATE PROCEDURE sp_eliminar_venta(
    IN p_id_venta INT
)
BEGIN
    -- Marcar venta como cancelada
    UPDATE ventas 
    SET estado = 'cancelada',
        updated_at = NOW()
    WHERE id = p_id_venta;
    
    -- Restaurar stock de los productos
    UPDATE producto p
    JOIN detalles_ventas dv ON p.id_producto = dv.producto_id
    SET p.existencia = p.existencia + dv.cantidad,
        p.updated_at = NOW()
    WHERE dv.venta_id = p_id_venta;
    
    SELECT 'Venta eliminada correctamente' as mensaje;
END; 