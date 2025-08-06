-- Procedimiento para actualizar un cliente
CREATE PROCEDURE sp_actualizar_cliente(
    IN p_id_cliente INT,
    IN p_nombre VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_telefono VARCHAR(20),
    IN p_direccion TEXT,
    IN p_fecha_nacimiento DATE
)
BEGIN
    UPDATE cliente 
    SET nombre = p_nombre,
        email = p_email,
        telefono = p_telefono,
        direccion = p_direccion,
        fecha_nacimiento = p_fecha_nacimiento,
        updated_at = NOW()
    WHERE id_cliente = p_id_cliente;
    
    SELECT 'Cliente actualizado correctamente' as mensaje;
END; 