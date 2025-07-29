-- Script para crear tablas adicionales para pedidos, devoluciones y ventas
USE myropitacarrillochi;

-- 1. Crear tabla de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    proveedor_id INT,
    fecha_pedido DATE NOT NULL,
    fecha_entrega_esperada DATE,
    estado ENUM('pendiente', 'confirmado', 'en_camino', 'entregado', 'cancelado') DEFAULT 'pendiente',
    total DECIMAL(10,2) DEFAULT 0.00,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (proveedor_id) REFERENCES proveedor(id)
);

-- 2. Crear tabla de detalles de pedidos
CREATE TABLE IF NOT EXISTS detalles_pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (producto_id) REFERENCES producto(id)
);

-- 3. Crear tabla de devoluciones
CREATE TABLE IF NOT EXISTS devoluciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    venta_id INT,
    cliente_id INT,
    fecha_devolucion DATE NOT NULL,
    motivo ENUM('defecto', 'talla_incorrecta', 'no_satisfecho', 'otro') NOT NULL,
    estado ENUM('pendiente', 'aprobada', 'rechazada', 'completada') DEFAULT 'pendiente',
    total_devolucion DECIMAL(10,2) DEFAULT 0.00,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (venta_id) REFERENCES venta(id),
    FOREIGN KEY (cliente_id) REFERENCES cliente(id)
);

-- 4. Crear tabla de detalles de devoluciones
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
    FOREIGN KEY (producto_id) REFERENCES producto(id)
);

-- 5. Crear tabla de ventas (si no existe)
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
    FOREIGN KEY (cliente_id) REFERENCES cliente(id)
);

-- 6. Crear tabla de detalles de ventas (si no existe)
CREATE TABLE IF NOT EXISTS detalles_ventas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (venta_id) REFERENCES ventas(id),
    FOREIGN KEY (producto_id) REFERENCES producto(id)
);

-- 7. Crear índices para mejorar rendimiento
CREATE INDEX idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX idx_pedidos_proveedor ON pedidos(proveedor_id);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_detalles_pedidos_pedido ON detalles_pedidos(pedido_id);
CREATE INDEX idx_devoluciones_usuario ON devoluciones(usuario_id);
CREATE INDEX idx_devoluciones_venta ON devoluciones(venta_id);
CREATE INDEX idx_devoluciones_estado ON devoluciones(estado);
CREATE INDEX idx_detalles_devoluciones_devolucion ON detalles_devoluciones(devolucion_id);
CREATE INDEX idx_ventas_usuario ON ventas(usuario_id);
CREATE INDEX idx_ventas_cliente ON ventas(cliente_id);
CREATE INDEX idx_detalles_ventas_venta ON detalles_ventas(venta_id);

-- 8. Insertar datos de prueba para ventas
INSERT IGNORE INTO ventas (usuario_id, cliente_id, fecha_venta, total, metodo_pago, estado) VALUES
(2, 1, CURDATE(), 150.00, 'efectivo', 'completada'),
(2, 2, CURDATE(), 200.00, 'tarjeta', 'completada'),
(2, 3, CURDATE(), 75.50, 'efectivo', 'completada');

-- 9. Insertar datos de prueba para devoluciones
INSERT IGNORE INTO devoluciones (usuario_id, venta_id, cliente_id, fecha_devolucion, motivo, estado, total_devolucion) VALUES
(5, 1, 1, CURDATE(), 'talla_incorrecta', 'aprobada', 50.00),
(5, 2, 2, CURDATE(), 'defecto', 'pendiente', 75.00);

-- 10. Insertar datos de prueba para pedidos
INSERT IGNORE INTO pedidos (usuario_id, proveedor_id, fecha_pedido, fecha_entrega_esperada, estado, total) VALUES
(3, 1, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY), 'confirmado', 500.00),
(3, 2, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 5 DAY), 'pendiente', 300.00);

-- 11. Insertar detalles de ventas de prueba
INSERT IGNORE INTO detalles_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 2, 75.00, 150.00),
(2, 2, 1, 200.00, 200.00),
(3, 3, 1, 75.50, 75.50);

-- 12. Insertar detalles de devoluciones de prueba
INSERT IGNORE INTO detalles_devoluciones (devolucion_id, producto_id, cantidad_devuelta, precio_unitario, subtotal, motivo_especifico) VALUES
(1, 1, 1, 50.00, 50.00, 'Talla M muy pequeña'),
(2, 2, 1, 75.00, 75.00, 'Defecto en la costura');

-- 13. Insertar detalles de pedidos de prueba
INSERT IGNORE INTO detalles_pedidos (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 10, 50.00, 500.00),
(2, 2, 5, 60.00, 300.00); 