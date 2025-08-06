-- Procedimiento para eliminar un cliente (soft delete)
CREATE PROCEDURE sp_eliminar_cliente(
    IN p_id_cliente INT
)
BEGIN
    -- Soft delete: marcar como inactivo en lugar de eliminar
    UPDATE cliente 
    SET activo = FALSE,
        updated_at = NOW()
    WHERE id_cliente = p_id_cliente;
    
    SELECT 'Cliente eliminado correctamente' as mensaje;
END; 