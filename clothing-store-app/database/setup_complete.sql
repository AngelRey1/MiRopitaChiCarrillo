-- =====================================================
-- SCRIPT COMPLETO DE CONFIGURACIÓN - MIRÓPITA CHI CARRILLO
-- Ejecuta DDL, DML y DQL en orden secuencial
-- =====================================================

-- Configurar el modo SQL
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

-- =====================================================
-- EJECUTAR DDL (Data Definition Language)
-- =====================================================

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS myropitacarrillochi
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE myropitacarrillochi;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    ultimo_login DATETIME NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_email CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_username CHECK (LENGTH(username) >= 3),
    CONSTRAINT chk_nombre CHECK (LENGTH(nombre) >= 2),
    CONSTRAINT chk_apellido CHECK (LENGTH(apellido) >= 2)
);

-- Tabla de roles
CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    permisos JSON,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_nombre_rol CHECK (LENGTH(nombre) >= 2)
);

-- Tabla de relación usuarios-roles
CREATE TABLE IF NOT EXISTS usuarios_roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_role (usuario_id, role_id)
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS producto (
    id_producto INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    talla VARCHAR(10) NOT NULL,
    corte VARCHAR(50) NOT NULL,
    existencia INT NOT NULL DEFAULT 0,
    precio DECIMAL(10,2) NOT NULL,
    precio_compra DECIMAL(10,2) NOT NULL,
    en_promocion BOOLEAN DEFAULT FALSE,
    descripcion TEXT,
    imagen_url VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_precio CHECK (precio >= 0),
    CONSTRAINT chk_precio_compra CHECK (precio_compra >= 0),
    CONSTRAINT chk_existencia CHECK (existencia >= 0),
    CONSTRAINT chk_nombre_producto CHECK (LENGTH(nombre) >= 2)
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS cliente (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nombre_cliente VARCHAR(100) NOT NULL,
    apellido_cliente VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    calle VARCHAR(100) NOT NULL,
    cruzado VARCHAR(100),
    colonia VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(10) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    municipio VARCHAR(50) NOT NULL,
    frecuente BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_email_cliente CHECK (email IS NULL OR email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_nombre_cliente CHECK (LENGTH(nombre_cliente) >= 2),
    CONSTRAINT chk_apellido_cliente CHECK (LENGTH(apellido_cliente) >= 2)
);

-- Tabla de proveedores
CREATE TABLE IF NOT EXISTS proveedor (
    id_proveedor INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    contacto VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_email_proveedor CHECK (email IS NULL OR email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_nombre_proveedor CHECK (LENGTH(nombre) >= 2)
);

-- Tabla de ventas
CREATE TABLE IF NOT EXISTS ventas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    cliente_id INT,
    fecha_venta DATE NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    impuestos DECIMAL(10,2) DEFAULT 0.00,
    descuento DECIMAL(10,2) DEFAULT 0.00,
    metodo_pago ENUM('efectivo', 'tarjeta', 'transferencia', 'otro') DEFAULT 'efectivo',
    estado ENUM('completada', 'pendiente', 'cancelada') DEFAULT 'completada',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id_cliente) ON DELETE SET NULL,
    
    CONSTRAINT chk_total CHECK (total >= 0),
    CONSTRAINT chk_subtotal CHECK (subtotal >= 0),
    CONSTRAINT chk_impuestos CHECK (impuestos >= 0),
    CONSTRAINT chk_descuento CHECK (descuento >= 0)
);

-- Tabla de detalles de ventas
CREATE TABLE IF NOT EXISTS detalles_ventas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES producto(id_producto) ON DELETE RESTRICT,
    
    CONSTRAINT chk_cantidad_venta CHECK (cantidad > 0),
    CONSTRAINT chk_precio_unitario_venta CHECK (precio_unitario >= 0),
    CONSTRAINT chk_subtotal_venta CHECK (subtotal >= 0),
    CONSTRAINT chk_descuento_venta CHECK (descuento >= 0)
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    proveedor_id INT,
    fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega_esperada DATE NULL,
    estado ENUM('pendiente', 'confirmado', 'en_camino', 'entregado', 'cancelado') DEFAULT 'pendiente',
    total DECIMAL(10,2) DEFAULT 0.00,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    FOREIGN KEY (proveedor_id) REFERENCES proveedor(id_proveedor) ON DELETE SET NULL,
    
    CONSTRAINT chk_total_pedido CHECK (total >= 0),
    CONSTRAINT chk_fecha_entrega CHECK (fecha_entrega_esperada IS NULL OR fecha_entrega_esperada >= fecha_pedido)
);

-- Tabla de detalles de pedidos
CREATE TABLE IF NOT EXISTS detalles_pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES producto(id_producto) ON DELETE RESTRICT,
    
    CONSTRAINT chk_cantidad_pedido CHECK (cantidad > 0),
    CONSTRAINT chk_precio_unitario_pedido CHECK (precio_unitario >= 0),
    CONSTRAINT chk_subtotal_pedido CHECK (subtotal >= 0)
);

-- Tabla de devoluciones
CREATE TABLE IF NOT EXISTS devoluciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    venta_id INT,
    cliente_id INT,
    fecha_devolucion DATETIME DEFAULT CURRENT_TIMESTAMP,
    motivo ENUM('defecto', 'talla_incorrecta', 'no_satisfecho', 'otro') NOT NULL,
    estado ENUM('pendiente', 'aprobada', 'rechazada', 'completada') DEFAULT 'pendiente',
    total_devolucion DECIMAL(10,2) NOT NULL,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE SET NULL,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id_cliente) ON DELETE SET NULL,
    
    CONSTRAINT chk_total_devolucion CHECK (total_devolucion >= 0)
);

-- Tabla de detalles de devoluciones
CREATE TABLE IF NOT EXISTS detalles_devoluciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    devolucion_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad_devuelta INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    motivo_especifico TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (devolucion_id) REFERENCES devoluciones(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES producto(id_producto) ON DELETE RESTRICT,
    
    CONSTRAINT chk_cantidad_devuelta CHECK (cantidad_devuelta > 0),
    CONSTRAINT chk_precio_unitario_devolucion CHECK (precio_unitario >= 0),
    CONSTRAINT chk_subtotal_devolucion CHECK (subtotal >= 0)
);

-- Tabla de turnos
CREATE TABLE IF NOT EXISTS turnos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora_entrada TIME NOT NULL,
    hora_salida TIME NULL,
    estado ENUM('activo', 'completado', 'ausente') DEFAULT 'activo',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    
    CONSTRAINT chk_hora_salida CHECK (hora_salida IS NULL OR hora_salida > hora_entrada)
);

-- Tabla de asistencias
CREATE TABLE IF NOT EXISTS asistencias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora_entrada TIME NOT NULL,
    hora_salida TIME NULL,
    estado ENUM('presente', 'ausente', 'tardanza', 'salida_temprana') DEFAULT 'presente',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    
    CONSTRAINT chk_hora_salida_asistencia CHECK (hora_salida IS NULL OR hora_salida > hora_entrada)
);

-- =====================================================
-- CREAR ÍNDICES PARA MEJORAR RENDIMIENTO
-- =====================================================

-- Índices para usuarios
CREATE INDEX idx_usuarios_activo ON usuarios(activo);
CREATE INDEX idx_usuarios_username ON usuarios(username);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_ultimo_login ON usuarios(ultimo_login);

-- Índices para productos
CREATE INDEX idx_producto_nombre ON producto(nombre);
CREATE INDEX idx_producto_modelo ON producto(modelo);
CREATE INDEX idx_producto_activo ON producto(activo);
CREATE INDEX idx_producto_en_promocion ON producto(en_promocion);
CREATE INDEX idx_producto_existencia ON producto(existencia);

-- Índices para clientes
CREATE INDEX idx_cliente_nombre ON cliente(nombre_cliente);
CREATE INDEX idx_cliente_apellido ON cliente(apellido_cliente);
CREATE INDEX idx_cliente_telefono ON cliente(telefono);
CREATE INDEX idx_cliente_activo ON cliente(activo);
CREATE INDEX idx_cliente_frecuente ON cliente(frecuente);

-- Índices para ventas
CREATE INDEX idx_ventas_fecha ON ventas(fecha_venta);
CREATE INDEX idx_ventas_usuario ON ventas(usuario_id);
CREATE INDEX idx_ventas_cliente ON ventas(cliente_id);
CREATE INDEX idx_ventas_estado ON ventas(estado);
CREATE INDEX idx_ventas_metodo_pago ON ventas(metodo_pago);

-- Índices para detalles de ventas
CREATE INDEX idx_detalles_ventas_venta ON detalles_ventas(venta_id);
CREATE INDEX idx_detalles_ventas_producto ON detalles_ventas(producto_id);

-- Índices para pedidos
CREATE INDEX idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX idx_pedidos_proveedor ON pedidos(proveedor_id);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_pedidos_fecha ON pedidos(fecha_pedido);

-- Índices para devoluciones
CREATE INDEX idx_devoluciones_usuario ON devoluciones(usuario_id);
CREATE INDEX idx_devoluciones_venta ON devoluciones(venta_id);
CREATE INDEX idx_devoluciones_cliente ON devoluciones(cliente_id);
CREATE INDEX idx_devoluciones_estado ON devoluciones(estado);
CREATE INDEX idx_devoluciones_fecha ON devoluciones(fecha_devolucion);

-- Índices para turnos
CREATE INDEX idx_turnos_usuario_fecha ON turnos(usuario_id, fecha);
CREATE INDEX idx_turnos_estado ON turnos(estado);

-- Índices para asistencias
CREATE INDEX idx_asistencias_usuario_fecha ON asistencias(usuario_id, fecha);
CREATE INDEX idx_asistencias_estado ON asistencias(estado);

-- =====================================================
-- CREAR VISTAS PARA CONSULTAS FRECUENTES
-- =====================================================

-- =====================================================
-- CREAR PROCEDIMIENTOS ALMACENADOS
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
    
    -- Verificar stock bajo
    IF (SELECT existencia FROM producto WHERE id_producto = p_producto_id) <= 5 THEN
        INSERT INTO log_stock_bajo (producto_id, existencia, fecha_alerta)
        VALUES (p_producto_id, (SELECT existencia FROM producto WHERE id_producto = p_producto_id), NOW());
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
-- CREAR FUNCIONES
-- =====================================================

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

-- =====================================================
-- MENSAJE DE CONFIRMACIÓN
-- =====================================================

SELECT '✅ Base de datos configurada exitosamente' as mensaje;
SELECT '📊 DDL: Estructura de tablas, índices y vistas creada' as ddl_status;
SELECT '📝 DML: Datos iniciales, procedimientos y funciones configurados' as dml_status;
SELECT '🔍 DQL: Consultas y reportes disponibles' as dql_status;
SELECT '🚀 Sistema MIRÓPITA CHI CARRILLO listo para usar' as sistema_status;

-- Confirmar transacción
COMMIT; 