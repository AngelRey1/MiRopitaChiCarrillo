-- Script simple para configurar el sistema de usuarios
-- Solo crea las tablas básicas sin dependencias externas

-- 1. Crear tabla de usuarios
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

-- 2. Crear tabla de roles
CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    permisos JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Crear tabla de usuarios_roles
CREATE TABLE IF NOT EXISTS usuarios_roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    UNIQUE KEY unique_usuario_role (usuario_id, role_id)
);

-- 4. Crear tabla de turnos
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

-- 5. Crear tabla de asistencias
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

-- 6. Insertar roles básicos
INSERT IGNORE INTO roles (nombre, descripcion, permisos) VALUES
('admin', 'Administrador del sistema con acceso completo', '["*"]'),
('vendedor', 'Vendedor con acceso a ventas y clientes', '["ventas", "clientes", "productos"]'),
('inventario', 'Encargado de inventario y pedidos', '["productos", "pedidos", "proveedores"]'),
('envios', 'Encargado de envíos y logística', '["envios", "pedidos"]'),
('devoluciones', 'Encargado de devoluciones', '["devoluciones", "ventas"]'),
('rrhh', 'Recursos Humanos - gestión de empleados', '["usuarios", "asistencias", "turnos"]');

-- 7. Crear índices básicos
CREATE INDEX idx_usuarios_activo ON usuarios(activo);
CREATE INDEX idx_turnos_usuario_fecha ON turnos(usuario_id, fecha);
CREATE INDEX idx_asistencias_usuario_fecha ON asistencias(usuario_id, fecha); 