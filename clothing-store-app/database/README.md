# Base de Datos - MIRÓPITA CHI CARRILLO

## 📋 Descripción General

Este directorio contiene la configuración completa de la base de datos para el sistema MIRÓPITA CHI CARRILLO, organizada según los estándares de SQL:

- **DDL (Data Definition Language)**: Definición de estructura
- **DML (Data Manipulation Language)**: Operaciones de datos
- **DQL (Data Query Language)**: Consultas y reportes

## 🗂️ Estructura de Archivos

```
database/
├── ddl.sql              # Definición de tablas, índices y vistas
├── dml.sql              # Datos iniciales, procedimientos y funciones
├── dql.sql              # Consultas y reportes de análisis
├── setup_complete.sql   # Script completo de configuración
└── README.md           # Esta documentación
```

## 🏗️ DDL (Data Definition Language)

### Tablas Principales

#### 1. **usuarios**
- Gestión de usuarios del sistema
- Campos: id, username, email, password, nombre, apellido, telefono, ultimo_login, activo
- Constraints: validación de email, longitud mínima de nombres

#### 2. **roles**
- Definición de roles y permisos
- Campos: id, nombre, descripcion, permisos (JSON), activo
- Permisos almacenados en formato JSON

#### 3. **producto**
- Catálogo de productos
- Campos: id_producto, nombre, modelo, talla, corte, existencia, precio, precio_compra, en_promocion
- Constraints: precios positivos, existencia no negativa

#### 4. **cliente**
- Información de clientes
- Campos: id_cliente, nombre_cliente, apellido_cliente, telefono, email, dirección completa
- Soporte para clientes frecuentes

#### 5. **ventas**
- Registro de ventas
- Campos: id, usuario_id, cliente_id, fecha_venta, total, subtotal, impuestos, descuento, metodo_pago, estado
- Estados: completada, pendiente, cancelada

#### 6. **devoluciones**
- Gestión de devoluciones
- Campos: id, usuario_id, venta_id, cliente_id, fecha_devolucion, motivo, estado, total_devolucion
- Motivos: defecto, talla_incorrecta, no_satisfecho, otro

### Índices Optimizados

- **Usuarios**: activo, username, email, ultimo_login
- **Productos**: nombre, modelo, activo, en_promocion, existencia
- **Ventas**: fecha_venta, usuario_id, cliente_id, estado, metodo_pago
- **Devoluciones**: usuario_id, venta_id, cliente_id, estado, fecha_devolucion

### Vistas Predefinidas

1. **v_ventas_completas**: Ventas con información de usuario y cliente
2. **v_productos_stock_bajo**: Productos con stock bajo o sin stock
3. **v_devoluciones_completas**: Devoluciones con información completa
4. **v_estadisticas_ventas_diarias**: Estadísticas diarias de ventas

## 📝 DML (Data Manipulation Language)

### Datos Iniciales

#### Roles del Sistema
- **admin**: Acceso completo al sistema
- **vendedor**: Gestión de ventas y clientes
- **inventario**: Gestión de productos y pedidos
- **envios**: Gestión de envíos
- **devoluciones**: Gestión de devoluciones
- **rrhh**: Gestión de empleados

#### Usuarios de Prueba
- Todos los usuarios tienen password: `password123`
- Hash: `$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi`

#### Productos de Ejemplo
- 8 productos con diferentes características
- Precios de venta y compra definidos
- Algunos productos en promoción

### Procedimientos Almacenados

#### 1. **sp_crear_venta_completa**
```sql
CALL sp_crear_venta_completa(
    p_usuario_id INT,
    p_cliente_id INT,
    p_metodo_pago VARCHAR(20),
    p_observaciones TEXT
);
```

#### 2. **sp_actualizar_stock**
```sql
CALL sp_actualizar_stock(
    p_producto_id INT,
    p_cantidad INT,
    p_tipo ENUM('venta', 'compra', 'devolucion')
);
```

#### 3. **sp_procesar_devolucion**
```sql
CALL sp_procesar_devolucion(
    p_usuario_id INT,
    p_venta_id INT,
    p_cliente_id INT,
    p_motivo VARCHAR(50),
    p_total_devolucion DECIMAL(10,2),
    p_observaciones TEXT
);
```

### Funciones Útiles

#### 1. **fn_estado_stock**
```sql
SELECT fn_estado_stock(producto_id) as estado;
-- Retorna: 'SIN STOCK', 'STOCK BAJO', 'STOCK NORMAL'
```

#### 2. **fn_total_ventas_periodo**
```sql
SELECT fn_total_ventas_periodo('2024-01-01', '2024-01-31') as total;
```

## 🔍 DQL (Data Query Language)

### Consultas Básicas

1. **Productos con stock bajo**
2. **Productos en promoción**
3. **Top 10 productos más vendidos**
4. **Clientes más frecuentes**

### Reportes de Ventas

5. **Ventas por día del mes actual**
6. **Ventas por método de pago**
7. **Rendimiento de vendedores**

### Reportes de Inventario

8. **Valor total del inventario**
9. **Productos por categoría (talla)**
10. **Productos por corte**

### Reportes de Devoluciones

11. **Devoluciones por motivo**
12. **Devoluciones por estado**
13. **Productos con más devoluciones**

### Reportes de Clientes

14. **Clientes por ubicación**
15. **Clientes sin compras recientes**

### Reportes de Empleados

18. **Asistencia de empleados por mes**
19. **Turnos de empleados**

### Análisis Avanzado

20. **Análisis de tendencias de ventas (12 meses)**
21. **Análisis de rentabilidad por producto**
22. **Análisis de estacionalidad**

### Consultas de Mantenimiento

23. **Productos sin movimiento (90 días)**
24. **Usuarios inactivos (30 días)**
25. **Clientes sin actividad reciente**

## 🚀 Instalación

### Requisitos
- MySQL 8.0 o superior
- Usuario con permisos de administrador
- Acceso a la línea de comandos

### Pasos de Instalación

1. **Navegar al directorio del proyecto**
```bash
cd clothing-store-app
```

2. **Ejecutar el script completo**
```bash
# En PowerShell
Get-Content database/setup_complete.sql | mysql -u root -p[password]

# En Linux/Mac
mysql -u root -p[password] < database/setup_complete.sql
```

3. **Verificar la instalación**
```sql
USE myropitacarrillochi;
SHOW TABLES;
SELECT COUNT(*) FROM usuarios;
SELECT COUNT(*) FROM producto;
```

### Configuración de Variables de Entorno

Crear archivo `.env` en el directorio raíz:

```env
# Configuración del servidor
NODE_ENV=development
PORT=4000

# Configuración de JWT
JWT_SECRET=tu-jwt-secret-super-seguro-aqui
JWT_EXPIRES_IN=24h

# Configuración de base de datos MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=J4flores24
DB_NAME=myropitacarrillochi
DB_PORT=3306
```

## 📊 Características Avanzadas

### Integridad Referencial
- Foreign keys con CASCADE y RESTRICT según corresponda
- Constraints de validación para emails, precios, cantidades
- Validación de datos a nivel de aplicación

### Optimización de Rendimiento
- Índices estratégicos en campos frecuentemente consultados
- Vistas materializadas para consultas complejas
- Procedimientos almacenados para operaciones comunes

### Seguridad
- Validación de datos a nivel de base de datos
- Encriptación de contraseñas con bcrypt
- Control de acceso basado en roles

### Escalabilidad
- Estructura normalizada para evitar redundancia
- Campos de auditoría (created_at, updated_at)
- Soporte para soft deletes (campo activo)

## 🔧 Mantenimiento

### Backup
```bash
mysqldump -u root -p myropitacarrillochi > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore
```bash
mysql -u root -p myropitacarrillochi < backup_file.sql
```

### Monitoreo
```sql
-- Verificar tablas
SHOW TABLES;

-- Verificar usuarios
SELECT COUNT(*) FROM usuarios WHERE activo = TRUE;

-- Verificar productos
SELECT COUNT(*) FROM producto WHERE activo = TRUE;

-- Verificar stock bajo
SELECT * FROM v_productos_stock_bajo;
```

## 📈 Mejoras Futuras

1. **Particionamiento**: Para tablas grandes como ventas y devoluciones
2. **Replicación**: Para alta disponibilidad
3. **Compresión**: Para optimizar espacio en disco
4. **Cache**: Para consultas frecuentes
5. **Backup automático**: Con scripts programados

## 🐛 Solución de Problemas

### Error: "Table doesn't exist"
```bash
# Ejecutar script completo
Get-Content database/setup_complete.sql | mysql -u root -p[password]
```

### Error: "Access denied"
```bash
# Verificar permisos de usuario
mysql -u root -p -e "SHOW GRANTS FOR 'root'@'localhost';"
```

### Error: "Connection refused"
```bash
# Verificar servicio MySQL
sudo systemctl status mysql
sudo systemctl start mysql
```

## 📞 Soporte

Para problemas técnicos o consultas sobre la base de datos:

1. Revisar logs de MySQL: `/var/log/mysql/`
2. Verificar configuración: `SHOW VARIABLES;`
3. Consultar documentación oficial de MySQL
4. Contactar al equipo de desarrollo

---

**Versión**: 1.0.0  
**Última actualización**: Enero 2024  
**Autor**: Equipo de Desarrollo MIRÓPITA CHI CARRILLO 