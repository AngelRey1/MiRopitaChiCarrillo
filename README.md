# 🛍️ MiRopitaChiCarrillo - Sistema de Gestión de Tienda de Ropa

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.21+-black.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

## 📋 Descripción

MiRopitaChiCarrillo es un sistema completo de gestión para tiendas de ropa desarrollado con tecnologías modernas. Permite administrar productos, clientes, proveedores y ventas de manera eficiente y con una interfaz web intuitiva.

## ✨ Características Principales

### 🛍️ Gestión de Productos
- ✅ Agregar, editar y eliminar productos
- ✅ Control de inventario y stock
- ✅ Gestión de precios y promociones
- ✅ Categorización por talla, corte y modelo
- ✅ Estadísticas de productos en tiempo real

### 👥 Gestión de Clientes
- ✅ Registro completo de clientes
- ✅ Información de contacto y dirección
- ✅ Clasificación de clientes frecuentes
- ✅ Historial de compras
- ✅ Gestión de datos personales

### 🚛 Gestión de Proveedores
- ✅ Registro de proveedores
- ✅ Descripción de productos ofrecidos
- ✅ Información de contacto
- ✅ Seguimiento de relaciones comerciales

### 📊 Dashboard y Estadísticas
- ✅ Estadísticas en tiempo real
- ✅ Contadores de productos, clientes y proveedores
- ✅ Interfaz moderna y responsive
- ✅ Navegación intuitiva por pestañas

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **TypeScript** - Tipado estático
- **MySQL** - Base de datos relacional
- **CORS** - Middleware para comunicación entre dominios

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos y responsive
- **JavaScript ES6+** - Funcionalidad dinámica
- **Font Awesome** - Iconografía
- **Gradientes y animaciones** - Diseño atractivo

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- MySQL 8.0+
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/MiRopitaChiCarrillo.git
cd MiRopitaChiCarrillo
```

2. **Instalar dependencias**
```bash
cd clothing-store-app
npm install
```

3. **Configurar la base de datos**
```sql
-- Crear la base de datos
CREATE DATABASE myropitacarrillochi;

-- Usar la base de datos
USE myropitacarrillochi;

-- Las tablas se crearán automáticamente al ejecutar el sistema
```

4. **Configurar variables de entorno**
```bash
# Editar src/controllers/itemRepository.ts
# Actualizar las credenciales de MySQL:
# - host: 'localhost'
# - user: 'root'
# - password: 'tu-contraseña'
# - database: 'myropitacarrillochi'
# - port: 3306
```

5. **Ejecutar el servidor**
```bash
npm start
```

6. **Acceder a la aplicación**
```
http://localhost:4000
```

## 🗄️ Estructura de la Base de Datos

### Tabla `producto`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_producto` | INT | ID único (auto-increment) |
| `nombre` | VARCHAR(100) | Nombre del producto |
| `modelo` | VARCHAR(50) | Modelo del producto |
| `talla` | VARCHAR(10) | Talla del producto |
| `corte` | VARCHAR(50) | Tipo de corte |
| `existencia` | INT | Cantidad en stock |
| `precio` | DECIMAL(10,2) | Precio del producto |
| `en_promocion` | TINYINT(1) | Estado de promoción |

### Tabla `cliente`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_cliente` | INT | ID único (auto-increment) |
| `nombre_cliente` | VARCHAR(100) | Nombre del cliente |
| `apellido_cliente` | VARCHAR(100) | Apellido del cliente |
| `telefono` | VARCHAR(20) | Número de teléfono |
| `calle` | VARCHAR(100) | Dirección - calle |
| `cruzado` | VARCHAR(100) | Dirección - cruzado |
| `colonia` | VARCHAR(100) | Dirección - colonia |
| `codigo_postal` | VARCHAR(10) | Código postal |
| `estado` | VARCHAR(50) | Estado |
| `municipio` | VARCHAR(50) | Municipio |
| `frecuente` | TINYINT(1) | Cliente frecuente |

### Tabla `proveedor`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_proveedor` | INT | ID único (auto-increment) |
| `nombre` | VARCHAR(100) | Nombre del proveedor |
| `productos_ofrecidos` | TEXT | Descripción de productos |

## 🚀 Uso

### Navegación
1. **Pestaña Productos**: Gestionar inventario de ropa
2. **Pestaña Clientes**: Administrar base de datos de clientes
3. **Pestaña Proveedores**: Gestionar proveedores

### Funciones Principales

#### Agregar Producto
1. Ir a la pestaña "Productos"
2. Llenar el formulario con los datos del producto
3. Hacer clic en "Guardar Producto"

#### Editar Producto
1. En la lista de productos, hacer clic en "Editar"
2. Modificar los datos en el modal
3. Hacer clic en "Guardar Cambios"

#### Agregar Cliente
1. Ir a la pestaña "Clientes"
2. Completar el formulario con todos los datos
3. Marcar "Cliente Frecuente" si aplica
4. Hacer clic en "Guardar Cliente"

#### Agregar Proveedor
1. Ir a la pestaña "Proveedores"
2. Ingresar nombre y descripción de productos
3. Hacer clic en "Guardar Proveedor"

## 📁 Estructura del Proyecto

```
MiRopitaChiCarrillo/
├── clothing-store-app/
│   ├── src/
│   │   ├── app.ts                 # Servidor principal
│   │   ├── controllers/           # Lógica de negocio
│   │   │   ├── index.ts          # Controladores principales
│   │   │   ├── itemRepository.ts # CRUD de productos
│   │   │   ├── clientRepository.ts # CRUD de clientes
│   │   │   ├── supplierRepository.ts # CRUD de proveedores
│   │   │   └── salesRepository.ts # Gestión de ventas
│   │   ├── routes/
│   │   │   └── index.ts          # Definición de rutas API
│   │   └── types/
│   │       └── index.ts          # Interfaces TypeScript
│   ├── public/
│   │   └── index.html            # Interfaz web
│   ├── package.json              # Dependencias y scripts
│   └── tsconfig.json            # Configuración TypeScript
└── README.md                    # Este archivo
```

## 🔌 APIs Disponibles

### Productos
- `GET /api/productos` - Listar todos los productos
- `GET /api/productos/:id` - Obtener producto específico
- `POST /api/productos` - Crear nuevo producto
- `PUT /api/productos/:id` - Actualizar producto
- `DELETE /api/productos/:id` - Eliminar producto

### Clientes
- `GET /api/clientes` - Listar todos los clientes
- `GET /api/clientes/:id` - Obtener cliente específico
- `POST /api/clientes` - Crear nuevo cliente
- `PUT /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Eliminar cliente

### Proveedores
- `GET /api/proveedores` - Listar todos los proveedores
- `GET /api/proveedores/:id` - Obtener proveedor específico
- `POST /api/proveedores` - Crear nuevo proveedor
- `PUT /api/proveedores/:id` - Actualizar proveedor
- `DELETE /api/proveedores/:id` - Eliminar proveedor

### Ventas
- `POST /api/ventas` - Crear nueva venta
- `GET /api/ventas` - Listar todas las ventas
- `GET /api/ventas/:id` - Obtener venta específica

## 🎨 Características de la Interfaz

### Diseño Moderno
- 🎨 Gradientes y colores atractivos
- 📱 Diseño responsive para móviles
- ⚡ Animaciones suaves
- 🎯 Interfaz intuitiva

### Funcionalidades
- 📊 Dashboard con estadísticas
- 🔍 Búsqueda y filtros
- ✏️ Edición en tiempo real
- 🗑️ Eliminación con confirmación
- 📝 Formularios validados

## 🛡️ Seguridad

- ✅ Validación de datos en frontend y backend
- ✅ Sanitización de inputs
- ✅ Manejo de errores robusto
- ✅ Confirmaciones para acciones destructivas

## 🚀 Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm start

# Compilar TypeScript
npm run build

# Iniciar servidor con recarga automática
npm run dev
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**MiRopitaChiCarrillo Team**

- 📧 Email: contacto@miropitachicarrillo.com
- 🌐 Website: https://miropitachicarrillo.com
- 📱 Teléfono: +52 999 123 4567

## 🙏 Agradecimientos

- Express.js por el framework web
- MySQL por la base de datos
- Font Awesome por los iconos
- La comunidad de desarrolladores

## 📞 Soporte

Si tienes alguna pregunta o necesitas ayuda:

- 📧 Email: soporte@miropitachicarrillo.com
- 💬 Issues: [GitHub Issues](https://github.com/tu-usuario/MiRopitaChiCarrillo/issues)
- 📖 Documentación: [Wiki del proyecto](https://github.com/tu-usuario/MiRopitaChiCarrillo/wiki)

---

⭐ **¡No olvides darle una estrella al proyecto si te gusta!** ⭐ 