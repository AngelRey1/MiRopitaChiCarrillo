-- Procedimiento para crear un nuevo producto
CREATE PROCEDURE sp_crear_producto(
    IN p_nombre VARCHAR(100),
    IN p_modelo VARCHAR(50),
    IN p_talla VARCHAR(10),
    IN p_corte VARCHAR(50),
    IN p_existencia INT,
    IN p_precio DECIMAL(10,2),
    IN p_en_promocion BOOLEAN,
    IN p_descripcion TEXT
)
BEGIN
    INSERT INTO producto (nombre, modelo, talla, corte, existencia, precio, en_promocion, descripcion, activo, created_at, updated_at)
    VALUES (p_nombre, p_modelo, p_talla, p_corte, p_existencia, p_precio, p_en_promocion, p_descripcion, TRUE, NOW(), NOW());
    
    SELECT LAST_INSERT_ID() as producto_id;
END; 