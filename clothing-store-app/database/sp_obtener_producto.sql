-- Procedimiento para obtener un producto por ID
CREATE PROCEDURE sp_obtener_producto(
    IN p_id_producto INT
)
BEGIN
    SELECT * FROM producto 
    WHERE id_producto = p_id_producto 
    AND activo = TRUE;
END; 