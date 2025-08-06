-- Procedimiento para eliminar un producto (soft delete)
CREATE PROCEDURE sp_eliminar_producto(
    IN p_id_producto INT
)
BEGIN
    -- Soft delete: marcar como inactivo en lugar de eliminar
    UPDATE producto 
    SET activo = FALSE,
        updated_at = NOW()
    WHERE id_producto = p_id_producto;
    
    SELECT 'Producto eliminado correctamente' as mensaje;
END; 