# Sistema de Usuarios y Roles - MiRopitaChiCarrillo

## Descripción

Este sistema implementa un control de acceso basado en roles para la tienda de ropa MiRopitaChiCarrillo. Permite dividir las responsabilidades entre diferentes tipos de usuarios y controlar el acceso a las diferentes funcionalidades del sistema.

## Roles Implementados

### 1. **Admin** (Administrador)
- **Permisos**: Acceso completo a todas las funcionalidades
- **Responsabilidades**: 
  - Gestión de usuarios y roles
  - Configuración del sistema
  - Supervisión general

### 2. **Vendedor**
- **Permisos**: Ventas, clientes, productos (solo lectura)
- **Responsabilidades**:
  - Realizar ventas
  - Gestionar clientes
  - Consultar productos

### 3. **Inventario**
- **Permisos**: Productos, pedidos, proveedores
- **Responsabilidades**:
  - Gestionar inventario
  - Crear y gestionar pedidos a proveedores
  - Administrar proveedores

### 4. **Envíos**
- **Permisos**: Envíos, pedidos
- **Responsabilidades**:
  - Gestionar envíos
  - Seguimiento de pedidos

### 5. **Devoluciones**
- **Permisos**: Devoluciones, ventas
- **Responsabilidades**:
  - Procesar devoluciones
  - Gestionar reembolsos

### 6. **RRHH** (Recursos Humanos)
- **Permisos**: Usuarios, asistencias, turnos
- **Responsabilidades**:
  - Gestión de empleados
  - Control de asistencias
  - Administración de turnos

## Configuración Inicial

### 1. Ejecutar el script de base de datos

```sql
-- Ejecutar el archivo database_setup.sql en MySQL
mysql -u root -p myropitacarrillochi < database_setup.sql
```

### 2. Instalar dependencias

```bash
cd clothing-store-app
npm install
```

### 3. Configurar variables de entorno (opcional)

Crear un archivo `.env` en la raíz del proyecto:

```env
JWT_SECRET=tu-clave-secreta-muy-segura
```

## Endpoints de Autenticación

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "usuario",
  "password": "contraseña"
}
```

**Respuesta exitosa:**
```json
{
  "token": "jwt-token-aqui",
  "user": {
    "id": 1,
    "username": "usuario",
    "email": "usuario@ejemplo.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "roles": [
      {
        "id": 1,
        "nombre": "admin",
        "descripcion": "Administrador del sistema",
        "permisos": ["*"]
      }
    ]
  }
}
```

## Endpoints por Módulo

### Gestión de Usuarios y Roles
```http
GET    /api/auth/users                    # Listar usuarios (RRHH)
GET    /api/auth/users/:id               # Obtener usuario específico
GET    /api/auth/roles                   # Listar roles (Admin)
POST   /api/auth/users/:id/roles         # Asignar rol a usuario
DELETE /api/auth/users/:id/roles         # Remover rol de usuario
PATCH  /api/auth/users/:id/status        # Activar/desactivar usuario
```

### Turnos y Asistencias
```http
GET    /api/rrhh/turnos                  # Listar turnos
GET    /api/rrhh/turnos/user/:userId     # Turnos de un usuario
POST   /api/rrhh/turnos                  # Crear turno
PUT    /api/rrhh/turnos/:id              # Actualizar turno

GET    /api/rrhh/asistencias             # Listar asistencias
GET    /api/rrhh/asistencias/user/:userId # Asistencias de un usuario
POST   /api/rrhh/asistencias             # Crear asistencia
PUT    /api/rrhh/asistencias/:id         # Actualizar asistencia
```

### Pedidos y Devoluciones
```http
GET    /api/inventario/pedidos           # Listar pedidos
GET    /api/inventario/pedidos/user/:userId # Pedidos de un usuario
POST   /api/inventario/pedidos           # Crear pedido
PUT    /api/inventario/pedidos/:id       # Actualizar pedido

GET    /api/inventario/pedidos/:pedidoId/detalles # Detalles de pedido
POST   /api/inventario/pedidos/detalles  # Crear detalle de pedido

GET    /api/inventario/devoluciones      # Listar devoluciones
GET    /api/inventario/devoluciones/user/:userId # Devoluciones de un usuario
POST   /api/inventario/devoluciones      # Crear devolución
PUT    /api/inventario/devoluciones/:id  # Actualizar devolución
```

## Uso del Token

Para acceder a endpoints protegidos, incluir el token en el header:

```http
Authorization: Bearer <token-jwt>
```

## Ejemplos de Uso

### 1. Login de Usuario
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'password123'
  })
});

const data = await response.json();
localStorage.setItem('token', data.token);
```

### 2. Crear Turno
```javascript
const response = await fetch('/api/rrhh/turnos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    usuario_id: 1,
    fecha: '2024-01-15',
    hora_entrada: '08:00:00',
    estado: 'activo'
  })
});
```

### 3. Crear Pedido
```javascript
const response = await fetch('/api/inventario/pedidos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    usuario_id: 1,
    proveedor_id: 1,
    fecha_entrega_esperada: '2024-01-20',
    observaciones: 'Pedido urgente'
  })
});
```

## Seguridad

- **JWT Tokens**: Autenticación basada en tokens JWT
- **Roles y Permisos**: Control granular de acceso por funcionalidad
- **Último Login**: Registro del último inicio de sesión
- **Estado de Usuario**: Posibilidad de activar/desactivar usuarios

## Notas Importantes

1. **Usuarios Existentes**: El sistema utiliza los usuarios ya registrados en la base de datos
2. **Campo Nuevo**: Se agregó el campo `ultimo_login` a la tabla de usuarios
3. **Roles**: Los roles se asignan a través de la tabla `usuarios_roles`
4. **Permisos**: Cada rol tiene permisos específicos definidos en JSON

## Próximos Pasos

1. Crear interfaz de usuario para login
2. Implementar dashboard por rol
3. Agregar reportes de asistencias
4. Implementar notificaciones
5. Agregar auditoría de acciones 