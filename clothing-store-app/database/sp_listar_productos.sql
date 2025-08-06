-- Procedimiento para listar todos los productos activos
CREATE PROCEDURE sp_listar_productos()
BEGIN
    SELECT * FROM producto 
    WHERE activo = TRUE 
    ORDER BY nombre, modelo;
END; 