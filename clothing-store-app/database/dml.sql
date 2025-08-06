-- =====================================================
-- DML (Data Manipulation Language) - MIRÓPITA CHI CARRILLO
-- Operaciones de inserción, actualización y eliminación
-- =====================================================

USE myropitacarrillochi;

-- =====================================================
-- DATOS INICIALES - ROLES
-- =====================================================

-- Insertar roles básicos del sistema
INSERT INTO roles (nombre, descripcion, permisos) VALUES
('admin', 'Administrador del sistema con acceso completo', '["*"]'),
('vendedor', 'Vendedor con acceso a ventas y clientes', '["ventas", "clientes", "productos"]'),
('inventario', 'Encargado de inventario y pedidos', '["productos", "pedidos", "proveedores"]'),
('envios', 'Encargado de envíos y logística', '["envios", "pedidos"]'),
('devoluciones', 'Encargado de devoluciones', '["devoluciones", "ventas"]'),
('rrhh', 'Recursos Humanos - gestión de empleados', '["usuarios", "asistencias", "turnos"]')
ON DUPLICATE KEY UPDATE 
    descripcion = VALUES(descripcion),
    permisos = VALUES(permisos),
    updated_at = CURRENT_TIMESTAMP;

-- =====================================================
-- DATOS INICIALES - USUARIOS
-- =====================================================

-- Insertar usuarios de prueba (password: password123)
INSERT INTO usuarios (username, email, password, nombre, apellido, telefono, activo) VALUES
('admin', 'admin@miropita.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador', 'Sistema', '555-0001', true),
('vendedor', 'vendedor@miropita.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Juan', 'Vendedor', '555-0002', true),
('inventario', 'inventario@miropita.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'María', 'Inventario', '555-0003', true),
('envios', 'envios@miropita.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Carlos', 'Envíos', '555-0004', true),
('devoluciones', 'devoluciones@miropita.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ana', 'Devoluciones', '555-0005', true),
('rrhh', 'rrhh@miropita.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Pedro', 'RRHH', '555-0006', true)
ON DUPLICATE KEY UPDATE 
    nombre = VALUES(nombre),
    apellido = VALUES(apellido),
    telefono = VALUES(telefono),
    updated_at = CURRENT_TIMESTAMP;

-- Asignar roles a usuarios
INSERT INTO usuarios_roles (usuario_id, role_id) VALUES
(1, 1), -- admin
(2, 2), -- vendedor
(3, 3), -- inventario
(4, 4), -- envios
(5, 5), -- devoluciones
(6, 6)  -- rrhh
ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP;

-- =====================================================
-- DATOS INICIALES - PRODUCTOS
-- =====================================================

-- Insertar productos de ejemplo
INSERT INTO producto (nombre, modelo, talla, corte, existencia, precio, precio_compra, en_promocion, descripcion) VALUES
('Blusa floral', 'BF001', 'M', 'Regular', 50, 150.00, 75.00, false, 'Blusa con estampado floral, perfecta para ocasiones casuales'),
('Pantalón negro', 'PN002', '32', 'Slim', 30, 250.00, 125.00, false, 'Pantalón negro de corte slim, ideal para oficina'),
('Vestido azul', 'VA003', 'S', 'Ajustado', 25, 350.00, 175.00, true, 'Vestido azul elegante, perfecto para eventos especiales'),
('Camisa blanca', 'CB004', 'L', 'Regular', 40, 180.00, 90.00, false, 'Camisa blanca clásica, versátil para cualquier ocasión'),
('Falda plisada', 'FP005', 'M', 'Ajustado', 35, 200.00, 100.00, false, 'Falda plisada negra, elegante y cómoda'),
('Chaqueta denim', 'CD006', 'L', 'Regular', 20, 400.00, 200.00, true, 'Chaqueta denim clásica, atemporal y versátil'),
('Top básico', 'TB007', 'S', 'Ajustado', 60, 120.00, 60.00, false, 'Top básico en varios colores, perfecto para combinar'),
('Pantalón cargo', 'PC008', '34', 'Regular', 15, 280.00, 140.00, false, 'Pantalón cargo cómodo y funcional')
ON DUPLICATE KEY UPDATE 
    existencia = VALUES(existencia),
    precio = VALUES(precio),
    precio_compra = VALUES(precio_compra),
    en_promocion = VALUES(en_promocion),
    descripcion = VALUES(descripcion),
    updated_at = CURRENT_TIMESTAMP;

-- =====================================================
-- DATOS INICIALES - CLIENTES
-- =====================================================

-- Insertar clientes de ejemplo
INSERT INTO cliente (nombre_cliente, apellido_cliente, telefono, email, calle, colonia, codigo_postal, estado, municipio) VALUES
('María', 'García', '555-1234', 'maria.garcia@email.com', 'Av. Principal 123', 'Centro', '12345', 'Estado de México', 'Toluca'),
('Pedro', 'Luna', '555-5678', 'pedro.luna@email.com', 'Calle Secundaria 456', 'Norte', '54321', 'Estado de México', 'Toluca'),
('Ana', 'Martínez', '555-9012', 'ana.martinez@email.com', 'Calle Juárez 789', 'Sur', '67890', 'Estado de México', 'Toluca'),
('Carlos', 'Rodríguez', '555-3456', 'carlos.rodriguez@email.com', 'Av. Reforma 321', 'Este', '13579', 'Estado de México', 'Toluca'),
('Laura', 'Hernández', '555-7890', 'laura.hernandez@email.com', 'Calle Morelos 654', 'Oeste', '24680', 'Estado de México', 'Toluca')
ON DUPLICATE KEY UPDATE 
    telefono = VALUES(telefono),
    email = VALUES(email),
    calle = VALUES(calle),
    colonia = VALUES(colonia),
    codigo_postal = VALUES(codigo_postal),
    updated_at = CURRENT_TIMESTAMP;

-- =====================================================
-- DATOS INICIALES - PROVEEDORES
-- =====================================================

-- Insertar proveedores de ejemplo
INSERT INTO proveedor (nombre, ciudad, telefono, email, direccion, contacto) VALUES
('Textiles del Norte', 'Monterrey', '81-1234-5678', 'contacto@textilesdelnorte.com', 'Av. Industrial 100', 'Lic. Roberto Sánchez'),
('Confecciones del Sur', 'Guadalajara', '33-9876-5432', 'ventas@confeccionesdelsur.com', 'Calle Comercial 200', 'Sra. Carmen López'),
('Moda Express', 'Puebla', '222-5555-1234', 'info@modaexpress.com', 'Blvd. Textil 300', 'Ing. Fernando Torres'),
('Distribuidora Central', 'Querétaro', '442-1111-9999', 'pedidos@distribuidoracentral.com', 'Zona Industrial 400', 'Lic. Patricia Morales')
ON DUPLICATE KEY UPDATE 
    telefono = VALUES(telefono),
    email = VALUES(email),
    direccion = VALUES(direccion),
    contacto = VALUES(contacto),
    updated_at = CURRENT_TIMESTAMP;

-- =====================================================
-- PROCEDIMIENTOS ALMACENADOS PARA OPERACIONES COMUNES
-- =====================================================

-- Procedimiento para crear una venta completa
DELIMITER //
CREATE PROCEDURE sp_crear_venta_completa(
    IN p_usuario_id INT,
    IN p_cliente_id INT,
    IN p_metodo_pago VARCHAR(20),
    IN p_observaciones TEXT
)
BEGIN
    DECLARE v_venta_id INT;
    DECLARE v_total DECIMAL(10,2) DEFAULT 0;
    DECLARE v_subtotal DECIMAL(10,2) DEFAULT 0;
    DECLARE v_impuestos DECIMAL(10,2) DEFAULT 0;
    DECLARE v_descuento DECIMAL(10,2) DEFAULT 0;
    
    -- Crear la venta
    INSERT INTO ventas (usuario_id, cliente_id, fecha_venta, total, subtotal, impuestos, descuento, metodo_pago, observaciones)
    VALUES (p_usuario_id, p_cliente_id, CURDATE(), v_total, v_subtotal, v_impuestos, v_descuento, p_metodo_pago, p_observaciones);
    
    SET v_venta_id = LAST_INSERT_ID();
    
    -- Retornar el ID de la venta creada
    SELECT v_venta_id as venta_id;
END //
DELIMITER ;

-- Procedimiento para actualizar stock de productos
DELIMITER //
CREATE PROCEDURE sp_actualizar_stock(
    IN p_producto_id INT,
    IN p_cantidad INT,
    IN p_tipo ENUM('venta', 'compra', 'devolucion')
)
BEGIN
    DECLARE v_existencia_actual INT;
    
    -- Obtener existencia actual
    SELECT existencia INTO v_existencia_actual 
    FROM producto 
    WHERE id_producto = p_producto_id;
    
    -- Actualizar stock según el tipo de operación
    IF p_tipo = 'venta' THEN
        UPDATE producto 
        SET existencia = existencia - p_cantidad,
            updated_at = CURRENT_TIMESTAMP
        WHERE id_producto = p_producto_id;
    ELSEIF p_tipo = 'compra' THEN
        UPDATE producto 
        SET existencia = existencia + p_cantidad,
            updated_at = CURRENT_TIMESTAMP
        WHERE id_producto = p_producto_id;
    ELSEIF p_tipo = 'devolucion' THEN
        UPDATE producto 
        SET existencia = existencia + p_cantidad,
            updated_at = CURRENT_TIMESTAMP
        WHERE id_producto = p_producto_id;
    END IF;
    
END //
DELIMITER ;

-- Procedimiento para procesar devolución
DELIMITER //
CREATE PROCEDURE sp_procesar_devolucion(
    IN p_usuario_id INT,
    IN p_venta_id INT,
    IN p_cliente_id INT,
    IN p_motivo VARCHAR(50),
    IN p_total_devolucion DECIMAL(10,2),
    IN p_observaciones TEXT
)
BEGIN
    DECLARE v_devolucion_id INT;
    
    -- Crear la devolución
    INSERT INTO devoluciones (usuario_id, venta_id, cliente_id, motivo, total_devolucion, observaciones)
    VALUES (p_usuario_id, p_venta_id, p_cliente_id, p_motivo, p_total_devolucion, p_observaciones);
    
    SET v_devolucion_id = LAST_INSERT_ID();
    
    -- Actualizar estado de la venta relacionada
    UPDATE ventas 
    SET estado = 'cancelada',
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_venta_id;
    
    -- Retornar el ID de la devolución creada
    SELECT v_devolucion_id as devolucion_id;
END //
DELIMITER ;

-- =====================================================
-- FUNCIONES ÚTILES
-- =====================================================

-- Función para calcular edad
DELIMITER //
CREATE FUNCTION fn_calcular_edad(fecha_nacimiento DATE)
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    RETURN YEAR(CURDATE()) - YEAR(fecha_nacimiento) - 
           (DATE_FORMAT(CURDATE(), '%m%d') < DATE_FORMAT(fecha_nacimiento, '%m%d'));
END //
DELIMITER ;

-- Función para obtener estado de stock
DELIMITER //
CREATE FUNCTION fn_estado_stock(p_producto_id INT)
RETURNS VARCHAR(20)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_existencia INT;
    
    SELECT existencia INTO v_existencia
    FROM producto
    WHERE id_producto = p_producto_id;
    
    IF v_existencia = 0 THEN
        RETURN 'SIN STOCK';
    ELSEIF v_existencia <= 5 THEN
        RETURN 'STOCK BAJO';
    ELSE
        RETURN 'STOCK NORMAL';
    END IF;
END //
DELIMITER ;

-- Función para calcular total de ventas por período
DELIMITER //
CREATE FUNCTION fn_total_ventas_periodo(fecha_inicio DATE, fecha_fin DATE)
RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_total DECIMAL(10,2);
    
    SELECT COALESCE(SUM(total), 0) INTO v_total
    FROM ventas
    WHERE fecha_venta BETWEEN fecha_inicio AND fecha_fin
    AND estado = 'completada';
    
    RETURN v_total;
END //
DELIMITER ; 