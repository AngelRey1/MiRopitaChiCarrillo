-- =====================================================
-- SISTEMA MIRÓPITA - CONFIGURACIÓN COMPLETA DE BASE DE DATOS
-- =====================================================

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS myropitacarrillochi;
USE myropitacarrillochi;

-- =====================================================
-- TABLAS PRINCIPALES DEL SISTEMA
-- =====================================================

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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de roles
CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    permisos JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de relación usuarios-roles
CREATE TABLE IF NOT EXISTS usuarios_roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
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
    en_promocion BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS cliente (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nombre_cliente VARCHAR(100) NOT NULL,
    apellido_cliente VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    calle VARCHAR(100) NOT NULL,
    cruzado VARCHAR(100),
    colonia VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(10) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    municipio VARCHAR(50) NOT NULL,
    frecuente BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de proveedores
CREATE TABLE IF NOT EXISTS proveedor (
    id_proveedor INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ventas
CREATE TABLE IF NOT EXISTS ventas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    cliente_id INT,
    fecha_venta DATE NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    metodo_pago ENUM('efectivo', 'tarjeta', 'transferencia', 'otro') DEFAULT 'efectivo',
    estado ENUM('completada', 'pendiente', 'cancelada') DEFAULT 'completada',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (cliente_id) REFERENCES cliente(id_cliente)
);

-- Tabla de detalles de ventas
CREATE TABLE IF NOT EXISTS detalles_ventas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (venta_id) REFERENCES ventas(id),
    FOREIGN KEY (producto_id) REFERENCES producto(id_producto)
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
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (proveedor_id) REFERENCES proveedor(id_proveedor)
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
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (producto_id) REFERENCES producto(id_producto)
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
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (venta_id) REFERENCES ventas(id),
    FOREIGN KEY (cliente_id) REFERENCES cliente(id_cliente)
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
    FOREIGN KEY (devolucion_id) REFERENCES devoluciones(id),
    FOREIGN KEY (producto_id) REFERENCES producto(id_producto)
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
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
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
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar roles básicos
INSERT INTO roles (nombre, descripcion, permisos) VALUES
('admin', 'Administrador del sistema con acceso completo', '["*"]'),
('vendedor', 'Vendedor con acceso a ventas y clientes', '["ventas", "clientes", "productos"]'),
('inventario', 'Encargado de inventario y pedidos', '["productos", "pedidos", "proveedores"]'),
('envios', 'Encargado de envíos y logística', '["envios", "pedidos"]'),
('devoluciones', 'Encargado de devoluciones', '["devoluciones", "ventas"]'),
('rrhh', 'Recursos Humanos - gestión de empleados', '["usuarios", "asistencias", "turnos"]');

-- Insertar usuarios de prueba
INSERT INTO usuarios (username, email, password, nombre, apellido, telefono, activo) VALUES
('admin', 'admin@miropita.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador', 'Sistema', '555-0001', true),
('vendedor', 'vendedor@miropita.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Juan', 'Vendedor', '555-0002', true),
('inventario', 'inventario@miropita.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'María', 'Inventario', '555-0003', true),
('envios', 'envios@miropita.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Carlos', 'Envíos', '555-0004', true),
('devoluciones', 'devoluciones@miropita.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ana', 'Devoluciones', '555-0005', true),
('rrhh', 'rrhh@miropita.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Pedro', 'RRHH', '555-0006', true);

-- Asignar roles a usuarios
INSERT INTO usuarios_roles (usuario_id, role_id) VALUES
(1, 1), -- admin
(2, 2), -- vendedor
(3, 3), -- inventario
(4, 4), -- envios
(5, 5), -- devoluciones
(6, 6); -- rrhh

-- Insertar productos de ejemplo
INSERT INTO producto (nombre, modelo, talla, corte, existencia, precio, en_promocion) VALUES
('Blusa floral', 'BF001', 'M', 'Regular', 50, 150.00, false),
('Pantalón negro', 'PN002', '32', 'Slim', 30, 250.00, false),
('Vestido azul', 'VA003', 'S', 'Ajustado', 25, 350.00, true),
('Camisa blanca', 'CB004', 'L', 'Regular', 40, 180.00, false);

-- Insertar clientes de ejemplo
INSERT INTO cliente (nombre_cliente, apellido_cliente, telefono, calle, colonia, codigo_postal, estado, municipio) VALUES
('María', 'García', '555-1234', 'Av. Principal 123', 'Centro', '12345', 'Estado de México', 'Toluca'),
('Pedro', 'Luna', '555-5678', 'Calle Secundaria 456', 'Norte', '54321', 'Estado de México', 'Toluca');

-- Insertar proveedores de ejemplo
INSERT INTO proveedor (nombre, ciudad) VALUES
('Textiles del Norte', 'Monterrey'),
('Confecciones del Sur', 'Guadalajara');

-- =====================================================
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- =====================================================

CREATE INDEX idx_usuarios_activo ON usuarios(activo);
CREATE INDEX idx_usuarios_username ON usuarios(username);
CREATE INDEX idx_producto_nombre ON producto(nombre);
CREATE INDEX idx_cliente_nombre ON cliente(nombre_cliente);
CREATE INDEX idx_ventas_fecha ON ventas(fecha_venta);
CREATE INDEX idx_ventas_usuario ON ventas(usuario_id);
CREATE INDEX idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_devoluciones_usuario ON devoluciones(usuario_id);
CREATE INDEX idx_turnos_usuario_fecha ON turnos(usuario_id, fecha);
CREATE INDEX idx_asistencias_usuario_fecha ON asistencias(usuario_id, fecha);

-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================

-- Contraseña para todos los usuarios de prueba: password123
-- El hash $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi corresponde a 'password123'

-- Para usar el sistema:
-- 1. Ejecutar este script en MySQL
-- 2. Configurar las variables de entorno en .env
-- 3. Ejecutar npm install
-- 4. Ejecutar npm start
-- 5. Acceder a http://localhost:4000 