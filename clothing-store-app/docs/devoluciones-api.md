# API de Devoluciones - MIRÓPITA CHI CARRILLO

## 📋 Descripción

El sistema de devoluciones permite procesar devoluciones de productos vendidos. Ahora incluye funcionalidades para seleccionar ventas disponibles y obtener detalles completos antes de crear una devolución.

## 🔐 Autenticación

Todos los endpoints requieren autenticación con JWT y permisos de devoluciones.

```bash
Authorization: Bearer <token>
```

## 📊 Endpoints Disponibles

### 1. Obtener Ventas Disponibles para Devolución

**GET** `/api/devoluciones/ventas-disponibles`

Obtiene todas las ventas que están disponibles para devolución (no tienen devoluciones aprobadas).

**Respuesta:**
```json
[
  {
    "id": 1,
    "fecha_venta": "2024-01-15",
    "total": 500.00,
    "metodo_pago": "efectivo",
    "estado": "completada",
    "cliente": {
      "id": 1,
      "nombre": "María",
      "apellido": "García",
      "telefono": "555-1234"
    },
    "vendedor": {
      "nombre": "Juan",
      "apellido": "Vendedor"
    },
    "total_productos": 3,
    "total_unidades": 5
  }
]
```

### 2. Obtener Detalles de una Venta para Devolución

**GET** `/api/devoluciones/venta/:ventaId/detalles`

Obtiene los detalles completos de una venta específica para poder seleccionar qué productos devolver.

**Parámetros:**
- `ventaId`: ID de la venta

**Respuesta:**
```json
{
  "venta": {
    "id": 1,
    "fecha_venta": "2024-01-15",
    "total": 500.00,
    "metodo_pago": "efectivo",
    "estado": "completada",
    "cliente": {
      "id": 1,
      "nombre": "María",
      "apellido": "García",
      "telefono": "555-1234"
    },
    "vendedor": {
      "nombre": "Juan",
      "apellido": "Vendedor"
    }
  },
  "detalles": [
    {
      "id": 1,
      "venta_id": 1,
      "producto_id": 1,
      "cantidad": 2,
      "precio_unitario": 150.00,
      "subtotal": 300.00,
      "producto_nombre": "Blusa floral",
      "modelo": "BF001",
      "talla": "M",
      "corte": "Regular",
      "stock_actual": 48
    }
  ]
}
```

### 3. Crear Nueva Devolución

**POST** `/api/devoluciones`

Crea una nueva devolución basada en una venta existente.

**Body:**
```json
{
  "venta_id": 1,
  "cliente_id": 1,
  "fecha_devolucion": "2024-01-20",
  "motivo": "talla_incorrecta",
  "observaciones": "El cliente pidió talla L pero se le dio M",
  "detalles": [
    {
      "producto_id": 1,
      "cantidad_devuelta": 1,
      "precio_unitario": 150.00,
      "motivo_especifico": "Talla incorrecta"
    }
  ]
}
```

**Respuesta:**
```json
{
  "id": 1,
  "usuario_id": 5,
  "venta_id": 1,
  "cliente_id": 1,
  "fecha_devolucion": "2024-01-20T00:00:00.000Z",
  "motivo": "talla_incorrecta",
  "estado": "pendiente",
  "total_devolucion": 150.00,
  "observaciones": "El cliente pidió talla L pero se le dio M",
  "created_at": "2024-01-20T10:30:00.000Z",
  "cliente": {
    "nombre": "María",
    "apellido": "García"
  },
  "usuario": {
    "nombre": "Ana",
    "apellido": "Devoluciones"
  }
}
```

### 4. Obtener Todas las Devoluciones

**GET** `/api/devoluciones`

Obtiene todas las devoluciones del sistema.

### 5. Obtener Devoluciones del Usuario Actual

**GET** `/api/devoluciones/my-devoluciones`

Obtiene las devoluciones creadas por el usuario autenticado.

### 6. Obtener Devolución por ID

**GET** `/api/devoluciones/:id`

Obtiene una devolución específica por su ID.

### 7. Obtener Detalles de una Devolución

**GET** `/api/devoluciones/:id/detalles`

Obtiene los detalles de productos de una devolución específica.

### 8. Actualizar Estado de Devolución

**PUT** `/api/devoluciones/:id`

Actualiza el estado de una devolución.

**Body:**
```json
{
  "estado": "aprobada",
  "observaciones": "Devolución aprobada por el gerente"
}
```

### 9. Obtener Devoluciones por Venta

**GET** `/api/devoluciones/venta/:ventaId`

Obtiene todas las devoluciones relacionadas con una venta específica.

### 10. Obtener Estadísticas de Devoluciones

**GET** `/api/devoluciones/stats/overview`

Obtiene estadísticas generales de devoluciones.

## 🔄 Flujo de Trabajo para Devoluciones

### Paso 1: Seleccionar Venta
```bash
GET /api/devoluciones/ventas-disponibles
```

### Paso 2: Ver Detalles de la Venta
```bash
GET /api/devoluciones/venta/1/detalles
```

### Paso 3: Crear Devolución
```bash
POST /api/devoluciones
{
  "venta_id": 1,
  "cliente_id": 1,
  "fecha_devolucion": "2024-01-20",
  "motivo": "talla_incorrecta",
  "observaciones": "Talla incorrecta",
  "detalles": [
    {
      "producto_id": 1,
      "cantidad_devuelta": 1,
      "precio_unitario": 150.00,
      "motivo_especifico": "Talla incorrecta"
    }
  ]
}
```

### Paso 4: Actualizar Estado (Opcional)
```bash
PUT /api/devoluciones/1
{
  "estado": "aprobada",
  "observaciones": "Devolución aprobada"
}
```

## 📝 Tipos de Motivos

- `defecto`: Producto con defecto de fabricación
- `talla_incorrecta`: Talla no corresponde
- `no_satisfecho`: Cliente no satisfecho con el producto
- `otro`: Otros motivos

## 📊 Estados de Devolución

- `pendiente`: Devolución creada, pendiente de revisión
- `aprobada`: Devolución aprobada
- `rechazada`: Devolución rechazada
- `completada`: Devolución procesada completamente

## 🔧 Características del Sistema

### ✅ **Validaciones Automáticas**
- Solo ventas completadas pueden ser devueltas
- No se pueden devolver productos de ventas ya devueltas
- Validación de stock antes de devolución

### ✅ **Actualización de Inventario**
- Al crear una devolución, el stock se actualiza automáticamente
- Los productos devueltos regresan al inventario

### ✅ **Trazabilidad Completa**
- Registro de quién creó la devolución
- Historial de cambios de estado
- Relación con venta original

## 🚨 Casos de Error

### Venta No Encontrada
```json
{
  "error": "Venta no encontrada o no disponible para devolución"
}
```

### Sin Permisos
```json
{
  "error": "Token de acceso requerido"
}
```

### Error de Validación
```json
{
  "error": "Error al crear devolución",
  "details": "Stock insuficiente para este producto"
}
```

## 📈 Ejemplos de Uso

### Ejemplo 1: Devolución Completa
```bash
# 1. Obtener ventas disponibles
curl -H "Authorization: Bearer <token>" \
     http://localhost:4000/api/devoluciones/ventas-disponibles

# 2. Ver detalles de venta
curl -H "Authorization: Bearer <token>" \
     http://localhost:4000/api/devoluciones/venta/1/detalles

# 3. Crear devolución
curl -X POST -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{
       "venta_id": 1,
       "cliente_id": 1,
       "fecha_devolucion": "2024-01-20",
       "motivo": "talla_incorrecta",
       "observaciones": "Talla incorrecta",
       "detalles": [
         {
           "producto_id": 1,
           "cantidad_devuelta": 1,
           "precio_unitario": 150.00,
           "motivo_especifico": "Talla incorrecta"
         }
       ]
     }' \
     http://localhost:4000/api/devoluciones
```

### Ejemplo 2: Devolución Parcial
```bash
# Devolver solo algunos productos de la venta
curl -X POST -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{
       "venta_id": 1,
       "cliente_id": 1,
       "fecha_devolucion": "2024-01-20",
       "motivo": "defecto",
       "observaciones": "Producto con defecto",
       "detalles": [
         {
           "producto_id": 2,
           "cantidad_devuelta": 1,
           "precio_unitario": 250.00,
           "motivo_especifico": "Defecto en costura"
         }
       ]
     }' \
     http://localhost:4000/api/devoluciones
```

---

**Versión**: 2.0.0  
**Última actualización**: Enero 2024  
**Autor**: Equipo de Desarrollo MIRÓPITA CHI CARRILLO 