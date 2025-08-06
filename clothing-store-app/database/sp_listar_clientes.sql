-- Procedimiento para listar todos los clientes activos
CREATE PROCEDURE sp_listar_clientes()
BEGIN
    SELECT * FROM cliente 
    WHERE activo = TRUE 
    ORDER BY nombre;
END; 