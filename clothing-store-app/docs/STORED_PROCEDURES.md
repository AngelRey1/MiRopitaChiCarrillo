# Procedimientos Almacenados - MiRopitaChiCarrillo

## Descripción General

Este documento describe los procedimientos almacenados implementados en la base de datos para optimizar las operaciones del sistema de gestión de la tienda de ropa.

## Procedimientos Implementados

### 1. `sp_crear_venta_completa`

**Propósito**: Crear una venta completa con todos sus componentes.

**Parámetros**:
- `p_usuario_id` (INT): ID del usuario que realiza la venta
- `p_cliente_id` (INT): ID del cliente
- `p_metodo_pago` (VARCHAR(20)): Método de pago utilizado
- `p_observaciones` (TEXT): Observaciones adicionales

**Retorna**: ID de la venta creada

**Uso en la API**:
```javascript
POST /api/sp/ventas/completa
{
  "cliente_id": 1,
  "metodo_pago": "efectivo",
  "observaciones": "Cliente frecuente",
  "detalles": [
    {
      "producto_id": 1,
      "cantidad": 2,
      "precio_unitario": 150.00
    }
  ]
}
```

### 2. `sp_actualizar_stock`

**Propósito**: Actualizar el stock de productos según el tipo de operación.

**Parámetros**:
- `p_producto_id` (INT): ID del producto
- `p_cantidad` (INT): Cantidad a ajustar
- `p_tipo` (ENUM): Tipo de operación ('venta', 'compra', 'devolucion')

**Funcionalidades**:
- Reduce stock en ventas
- Aumenta stock en compras
- Aumenta stock en devoluciones
- Genera alertas automáticas cuando el stock es bajo (≤5)

**Uso en la API**:
```javascript
POST /api/sp/stock/actualizar
{
  "producto_id": 1,
  "cantidad": 5,
  "tipo": "compra"
}
```

### 3. `sp_procesar_devolucion`

**Propósito**: Procesar una devolución completa.

**Parámetros**:
- `p_usuario_id` (INT): ID del usuario que procesa la devolución
- `p_venta_id` (INT): ID de la venta a devolver
- `p_cliente_id` (INT): ID del cliente
- `p_motivo` (VARCHAR(50)): Motivo de la devolución
- `p_total_devolucion` (DECIMAL(10,2)): Total a devolver
- `p_observaciones` (TEXT): Observaciones adicionales

**Funcionalidades**:
- Crea la devolución
- Actualiza el estado de la venta a 'cancelada'
- Retorna el ID de la devolución creada

**Uso en la API**:
```javascript
POST /api/sp/devoluciones/procesar
{
  "venta_id": 1,
  "cliente_id": 1,
  "motivo": "Producto defectuoso",
  "total_devolucion": 300.00,
  "observaciones": "Cliente insatisfecho",
  "detalles": [
    {
      "producto_id": 1,
      "cantidad_devuelta": 2,
      "precio_unitario": 150.00,
      "motivo_especifico": "Talla incorrecta"
    }
  ]
}
```

## Procedimientos Adicionales

### 4. `sp_estadisticas_ventas`

**Propósito**: Obtener estadísticas de ventas en un rango de fechas.

**Parámetros**:
- `p_fecha_inicio` (DATE): Fecha de inicio
- `p_fecha_fin` (DATE): Fecha de fin

**Retorna**: Estadísticas de ventas, ingresos, promedio, vendedores activos y clientes únicos.

### 5. `sp_productos_mas_vendidos`

**Propósito**: Obtener los productos más vendidos.

**Parámetros**:
- `p_limite` (INT): Número máximo de productos a retornar

**Retorna**: Lista de productos ordenados por cantidad vendida.

### 6. `sp_alertas_stock`

**Propósito**: Obtener productos con stock bajo.

**Retorna**: Lista de productos con stock ≤5 unidades.

### 7. `sp_ajustar_inventario`

**Propósito**: Ajustar manualmente el inventario de un producto.

**Parámetros**:
- `p_producto_id` (INT): ID del producto
- `p_cantidad_ajuste` (INT): Cantidad a ajustar (positiva o negativa)
- `p_motivo` (VARCHAR(100)): Motivo del ajuste
- `p_usuario_id` (INT): ID del usuario que realiza el ajuste

### 8. `sp_marcar_cliente_frecuente`

**Propósito**: Marcar un cliente como frecuente.

**Parámetros**:
- `p_cliente_id` (INT): ID del cliente

### 9. `sp_clientes_frecuentes`

**Propósito**: Obtener información de clientes frecuentes.

**Retorna**: Lista de clientes frecuentes con estadísticas de compras.

## Endpoints de la API

### Ventas
- `POST /api/sp/ventas/completa` - Crear venta usando procedimiento almacenado

### Stock
- `POST /api/sp/stock/actualizar` - Actualizar stock
- `POST /api/sp/stock/compra` - Actualizar stock por compra
- `GET /api/sp/stock/bajo` - Obtener productos con stock bajo
- `GET /api/sp/stock/log-bajo` - Obtener log de alertas de stock

### Devoluciones
- `POST /api/sp/devoluciones/procesar` - Procesar devolución usando procedimiento almacenado

### Estadísticas
- `GET /api/sp/stats/stock` - Estadísticas de stock

## Configuración

### Instalación de Procedimientos Almacenados

1. **Ejecutar el script de configuración**:
```bash
npm run setup-db
```

2. **Verificar la instalación**:
El script mostrará todos los procedimientos almacenados creados exitosamente.

### Variables de Entorno

Asegúrate de tener configuradas las siguientes variables de entorno:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=J4flores24
DB_NAME=myropitacarrillochi
DB_PORT=3306
```

## Ventajas de los Procedimientos Almacenados

1. **Rendimiento**: Ejecución más rápida al estar precompilados
2. **Consistencia**: Lógica centralizada en la base de datos
3. **Seguridad**: Validaciones y reglas de negocio en el servidor de BD
4. **Mantenibilidad**: Cambios centralizados sin modificar código de aplicación
5. **Transacciones**: Manejo automático de transacciones complejas

## Logs y Alertas

### Log de Stock Bajo

El sistema automáticamente registra alertas cuando un producto tiene stock bajo (≤5 unidades):

```sql
INSERT INTO log_stock_bajo (producto_id, existencia, fecha_alerta)
VALUES (producto_id, existencia_actual, NOW());
```

### Ajustes de Inventario

Todos los ajustes de inventario se registran en la tabla `ajustes_inventario`:

```sql
INSERT INTO ajustes_inventario (producto_id, cantidad_ajuste, motivo, usuario_id, existencia_anterior, existencia_nueva)
VALUES (producto_id, cantidad_ajuste, motivo, usuario_id, existencia_anterior, existencia_nueva);
```

## Monitoreo

### Verificar Procedimientos Almacenados

```sql
SELECT ROUTINE_NAME 
FROM INFORMATION_SCHEMA.ROUTINES 
WHERE ROUTINE_TYPE = 'PROCEDURE' 
AND ROUTINE_SCHEMA = 'myropitacarrillochi';
```

### Verificar Alertas de Stock

```sql
SELECT * FROM log_stock_bajo ORDER BY fecha_alerta DESC;
```

### Verificar Ajustes de Inventario

```sql
SELECT * FROM ajustes_inventario ORDER BY created_at DESC;
``` 