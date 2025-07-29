-- Script para insertar usuarios de prueba
-- Ejecutar después de crear las tablas

-- Insertar usuarios de prueba
INSERT INTO usuarios (username, email, password, nombre, apellido, telefono, activo) VALUES
('admin', 'admin@miropita.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador', 'Sistema', '555-0001', true),
('vendedor', 'vendedor@miropita.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Juan', 'Vendedor', '555-0002', true),
('inventario', 'inventario@miropita.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'María', 'Inventario', '555-0003', true),
('envios', 'envios@miropita.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Carlos', 'Envíos', '555-0004', true),
('devoluciones', 'devoluciones@miropita.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ana', 'Devoluciones', '555-0005', true),
('rrhh', 'rrhh@miropita.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Pedro', 'RRHH', '555-0006', true);

-- Asignar roles a los usuarios
-- Admin (todos los roles)
INSERT INTO usuarios_roles (usuario_id, role_id) VALUES
(1, 1); -- admin

-- Vendedor
INSERT INTO usuarios_roles (usuario_id, role_id) VALUES
(2, 2); -- vendedor

-- Inventario
INSERT INTO usuarios_roles (usuario_id, role_id) VALUES
(3, 3); -- inventario

-- Envíos
INSERT INTO usuarios_roles (usuario_id, role_id) VALUES
(4, 4); -- envios

-- Devoluciones
INSERT INTO usuarios_roles (usuario_id, role_id) VALUES
(5, 5); -- devoluciones

-- RRHH
INSERT INTO usuarios_roles (usuario_id, role_id) VALUES
(6, 6); -- rrhh

-- Nota: La contraseña para todos los usuarios es 'password123'
-- El hash $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi corresponde a 'password123' 