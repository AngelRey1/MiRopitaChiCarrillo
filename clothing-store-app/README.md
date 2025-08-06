# MiRopita - Sistema de Gestión de Tienda de Ropa

Sistema completo de gestión para una tienda de ropa que incluye ventas, inventario, pedidos, devoluciones, gestión de clientes y recursos humanos.

## 🚀 Características

- **Gestión de Ventas**: Crear, listar y gestionar ventas con múltiples productos
- **Gestión de Inventario**: Control de productos, stock y precios
- **Gestión de Pedidos**: Pedidos a proveedores con seguimiento de estado
- **Gestión de Devoluciones**: Proceso completo de devoluciones de productos
- **Gestión de Clientes**: Base de datos de clientes con información completa
- **Gestión de Usuarios**: Sistema de roles y permisos
- **RRHH**: Control de turnos y asistencias de empleados
- **Reportes y Estadísticas**: Dashboard con métricas del negocio
- **Procedimientos Almacenados**: Optimización de operaciones críticas con stored procedures

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js, Express.js, TypeScript
- **Base de Datos**: MySQL
- **Autenticación**: JWT (JSON Web Tokens)
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Encriptación**: bcryptjs para contraseñas

## 📋 Requisitos Previos

- Node.js (versión 14 o superior)
- MySQL (versión 5.7 o superior)
- npm o yarn

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd clothing-store-app
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar base de datos
```bash
# Ejecutar el script de configuración en MySQL
mysql -u root -p < setup_database.sql

# Instalar procedimientos almacenados
npm run setup-db
```

### 4. Configurar variables de entorno
```bash
# Copiar el archivo de ejemplo
cp env.example .env

# Editar .env con tus configuraciones
```

### 5. Variables de entorno necesarias
```env
NODE_ENV=development
PORT=4000
JWT_SECRET=tu-jwt-secret-super-seguro-aqui
JWT_EXPIRES_IN=24h
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu-password
DB_NAME=myropitacarrillochi
DB_PORT=3306
```

### 6. Ejecutar el servidor
```bash
npm start
```

### 7. Probar procedimientos almacenados (opcional)
```bash
npm run test-sp
```

## 🌐 Acceso al Sistema

- **URL**: http://localhost:4000
- **Login**: http://localhost:4000/login

### Credenciales de Prueba

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | password123 | Administrador |
| vendedor | password123 | Vendedor |
| inventario | password123 | Inventario |
| devoluciones | password123 | Devoluciones |
| rrhh | password123 | RRHH |

## 📁 Estructura del Proyecto

```
clothing-store-app/
├── src/
│   ├── config/
│   │   └── database.ts          # Configuración de base de datos
│   ├── controllers/
│   │   ├── index.ts             # Controladores principales
│   │   ├── ventaRepository.ts   # Lógica de ventas
│   │   ├── pedidoRepository.ts  # Lógica de pedidos
│   │   ├── devolucionRepository.ts # Lógica de devoluciones
│   │   ├── clientRepository.ts  # Lógica de clientes
│   │   ├── itemRepository.ts    # Lógica de productos
│   │   ├── userRepository.ts    # Lógica de usuarios
│   │   └── turnoRepository.ts   # Lógica de RRHH
│   ├── middleware/
│   │   └── auth.ts              # Middleware de autenticación
│   ├── routes/
│   │   ├── index.ts             # Rutas principales
│   │   ├── auth.ts              # Rutas de autenticación
│   │   ├── ventas.ts            # Rutas de ventas
│   │   ├── pedidos.ts           # Rutas de pedidos
│   │   ├── devoluciones.ts      # Rutas de devoluciones
│   │   └── turnos.ts            # Rutas de RRHH
│   ├── types/
│   │   └── index.ts             # Tipos TypeScript
│   └── app.ts                   # Aplicación principal
├── public/
│   ├── index.html               # Página principal
│   ├── login.html               # Página de login
│   ├── dashboard.html           # Dashboard
│   ├── ventas.html              # Gestión de ventas
│   ├── pedidos.html             # Gestión de pedidos
│   ├── devoluciones.html        # Gestión de devoluciones
│   ├── admin.html               # Administración
│   └── rrhh.html                # RRHH
├── setup_database.sql           # Script de configuración de BD
├── package.json                 # Dependencias del proyecto
├── tsconfig.json               # Configuración TypeScript
└── README.md                   # Este archivo
```

## 🔐 Sistema de Roles y Permisos

### Administrador
- Acceso completo a todas las funcionalidades
- Gestión de usuarios y roles
- Configuración del sistema

### Vendedor
- Crear y gestionar ventas
- Gestionar clientes
- Ver productos y precios

### Inventario
- Gestionar productos
- Crear pedidos a proveedores
- Control de stock

### Devoluciones
- Procesar devoluciones
- Ver historial de ventas
- Gestionar reembolsos

### RRHH
- Gestionar turnos de empleados
- Control de asistencias
- Reportes de personal

## 📊 Funcionalidades Principales

### Gestión de Ventas
- Crear ventas con múltiples productos
- Seleccionar cliente (opcional)
- Diferentes métodos de pago
- Cálculo automático de totales
- Historial completo de ventas

### Gestión de Pedidos
- Crear pedidos a proveedores
- Seguimiento de estado (pendiente, confirmado, en camino, entregado)
- Gestión de fechas de entrega
- Detalles de productos por pedido

### Gestión de Devoluciones
- Procesar devoluciones de productos
- Diferentes motivos de devolución
- Estados de aprobación
- Cálculo de montos a devolver

### Gestión de Clientes
- Base de datos completa de clientes
- Información de contacto y dirección
- Historial de compras
- Clientes frecuentes

### RRHH
- Control de turnos de empleados
- Registro de asistencias
- Estados de empleados (presente, ausente, tardanza)
- Reportes de personal

## 🚀 Comandos Disponibles

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar en modo producción
npm start

# Compilar TypeScript
npm run build

# Instalar procedimientos almacenados
npm run setup-db

# Probar procedimientos almacenados
npm run test-sp
```

## 🔧 Configuración de Desarrollo

### Base de Datos
El sistema utiliza MySQL. Asegúrate de tener:
- MySQL instalado y ejecutándose
- Base de datos `myropitacarrillochi` creada
- Usuario con permisos completos

### Variables de Entorno
Copia `env.example` a `.env` y configura:
- Credenciales de base de datos
- Secret para JWT
- Puerto del servidor

## 📝 Notas Importantes

- **Contraseñas**: Todos los usuarios de prueba usan `password123`
- **Base de datos**: Ejecuta `setup_database.sql` antes de usar el sistema
- **Procedimientos almacenados**: Ejecuta `npm run setup-db` para instalar los stored procedures
- **Puerto**: El servidor se ejecuta en el puerto 4000 por defecto
- **CORS**: Configurado para desarrollo local

## 🗄️ Procedimientos Almacenados

El sistema utiliza procedimientos almacenados para optimizar operaciones críticas:

### Principales Procedimientos
- **`sp_crear_venta_completa`**: Crear ventas con validación automática
- **`sp_actualizar_stock`**: Gestión automática de inventario con alertas
- **`sp_procesar_devolucion`**: Procesar devoluciones con actualización de estado

### Ventajas
- **Rendimiento**: Operaciones más rápidas al estar precompiladas
- **Consistencia**: Lógica centralizada en la base de datos
- **Seguridad**: Validaciones automáticas y transacciones seguras
- **Alertas**: Notificaciones automáticas de stock bajo

### Documentación Completa
Ver `docs/STORED_PROCEDURES.md` para documentación detallada de todos los procedimientos almacenados.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas sobre el sistema, contacta al equipo de desarrollo.

---

**MiRopita** - Sistema de Gestión de Tienda de Ropa