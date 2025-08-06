-- Procedimiento para crear un nuevo cliente
CREATE PROCEDURE sp_crear_cliente(
    IN p_nombre VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_telefono VARCHAR(20),
    IN p_direccion TEXT,
    IN p_fecha_nacimiento DATE
)
BEGIN
    INSERT INTO cliente (nombre, email, telefono, direccion, fecha_nacimiento, activo, created_at, updated_at)
    VALUES (p_nombre, p_email, p_telefono, p_direccion, p_fecha_nacimiento, TRUE, NOW(), NOW());
    
    SELECT LAST_INSERT_ID() as cliente_id;
END; 