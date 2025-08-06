-- Crear tabla log_stock_bajo si no existe
CREATE TABLE IF NOT EXISTS log_stock_bajo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    existencia INT NOT NULL,
    fecha_alerta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES producto(id_producto)
);

-- Crear tabla ajustes_inventario si no existe
CREATE TABLE IF NOT EXISTS ajustes_inventario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    cantidad_ajuste INT NOT NULL,
    motivo VARCHAR(100) NOT NULL,
    usuario_id INT NOT NULL,
    existencia_anterior INT NOT NULL,
    existencia_nueva INT NOT NULL,
    fecha_ajuste TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES producto(id_producto),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id_usuario)
);

-- Agregar columna updated_at a la tabla producto si no existe
ALTER TABLE producto ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Agregar columna updated_at a la tabla ventas si no existe
ALTER TABLE ventas ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Agregar columna updated_at a la tabla cliente si no existe
ALTER TABLE cliente ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP; 