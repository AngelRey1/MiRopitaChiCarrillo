-- Procedimiento para obtener un cliente por ID
CREATE PROCEDURE sp_obtener_cliente(
    IN p_id_cliente INT
)
BEGIN
    SELECT * FROM cliente 
    WHERE id_cliente = p_id_cliente 
    AND activo = TRUE;
END; 