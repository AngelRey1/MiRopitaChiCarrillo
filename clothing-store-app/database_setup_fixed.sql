-- Script para configurar el sistema de usuarios y roles
-- Ejecutar estos comandos en MySQL para agregar las funcionalidades necesarias

-- 1. Crear tabla de usuarios si no existe
CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    ultimo_login DATETIME NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Agregar campos si no existen (usando procedimiento)
DELIMITER //
CREATE PROCEDURE AddColumnsIfNotExist()
BEGIN
    -- Agregar ultimo_login si no existe
    IF NOT EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = 'myropitacarrillochi' 
        AND TABLE_NAME = 'usuarios' 
        AND COLUMN_NAME = 'ultimo_login'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN ultimo_login DATETIME NULL;
    END IF;
    
    -- Agregar activo si no existe
    IF NOT EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = 'myropitacarrillochi' 
        AND TABLE_NAME = 'usuarios' 
        AND COLUMN_NAME = 'activo'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN activo BOOLEAN DEFAULT TRUE;
    END IF;
END //
DELIMITER ;

CALL AddColumnsIfNotExist();
DROP PROCEDURE AddColumnsIfNotExist;

-- 3. Crear tabla de roles si no existe
CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    permisos JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Crear tabla de usuarios_roles para asignar roles a usuarios
CREATE TABLE IF NOT EXISTS usuarios_roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    UNIQUE KEY unique_usuario_role (usuario_id, role_id)
);

-- 5. Crear tabla de turnos
CREATE TABLE IF NOT EXISTS turnos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora_entrada TIME NOT NULL,
    hora_salida TIME NULL,
    estado ENUM('activo', 'completado', 'ausente') DEFAULT 'activo',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- 6. Crear tabla de asistencias
CREATE TABLE IF NOT EXISTS asistencias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora_entrada TIME NOT NULL,
    hora_salida TIME NULL,
    estado ENUM('presente', 'ausente', 'tardanza') DEFAULT 'presente',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- 7. Crear tabla de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    proveedor_id INT NOT NULL,
    fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega_esperada DATE NULL,
    estado ENUM('pendiente', 'en_proceso', 'entregado', 'cancelado') DEFAULT 'pendiente',
    total DECIMAL(10,2) DEFAULT 0.00,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
);

-- 8. Crear tabla de detalles de pedidos
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

-- 9. Crear tabla de devoluciones
CREATE TABLE IF NOT EXISTS devoluciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    venta_id INT NOT NULL,
    usuario_id INT NOT NULL,
    fecha_devolucion DATETIME DEFAULT CURRENT_TIMESTAMP,
    motivo TEXT NOT NULL,
    estado ENUM('pendiente', 'aprobada', 'rechazada', 'completada') DEFAULT 'pendiente',
    monto_devolucion DECIMAL(10,2) NOT NULL,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (venta_id) REFERENCES ventas(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- 10. Insertar roles básicos (ignorar si ya existen)
INSERT IGNORE INTO roles (nombre, descripcion, permisos) VALUES
('admin', 'Administrador del sistema con acceso completo', '["*"]'),
('vendedor', 'Vendedor con acceso a ventas y clientes', '["ventas", "clientes", "productos"]'),
('inventario', 'Encargado de inventario y pedidos', '["productos", "pedidos", "proveedores"]'),
('envios', 'Encargado de envíos y logística', '["envios", "pedidos"]'),
('devoluciones', 'Encargado de devoluciones', '["devoluciones", "ventas"]'),
('rrhh', 'Recursos Humanos - gestión de empleados', '["usuarios", "asistencias", "turnos"]');

-- 11. Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_usuarios_activo ON usuarios(activo);
CREATE INDEX IF NOT EXISTS idx_turnos_usuario_fecha ON turnos(usuario_id, fecha);
CREATE INDEX IF NOT EXISTS idx_asistencias_usuario_fecha ON asistencias(usuario_id, fecha);
CREATE INDEX IF NOT EXISTS idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_devoluciones_usuario ON devoluciones(usuario_id); 