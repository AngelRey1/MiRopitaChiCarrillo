-- Procedimiento para marcar cliente como frecuente
CREATE PROCEDURE sp_marcar_cliente_frecuente(
    IN p_cliente_id INT
)
BEGIN
    UPDATE cliente 
    SET frecuente = TRUE,
        updated_at = CURRENT_TIMESTAMP
    WHERE id_cliente = p_cliente_id;
    
    SELECT 'Cliente marcado como frecuente' as mensaje;
END; 