// =====================================================
// ARCHIVO: app.ts
// DESCRIPCIÓN: Punto de entrada principal de la aplicación Express
// FUNCIÓN: Configuración del servidor, middleware y rutas
// =====================================================

// Importaciones necesarias para el servidor Express
import express from 'express';                    // Framework web para Node.js
import routes from './routes';                    // Rutas API de la aplicación
import path from 'path';                         // Utilidad para manejo de rutas de archivos
import cors from 'cors';                         // Middleware para permitir peticiones cross-origin
import { testConnection } from './config/database'; // Función para probar conexión a BD

// Crear instancia de la aplicación Express
const app = express();
// Puerto del servidor (usa variable de entorno o 4000 por defecto)
const PORT = process.env.PORT || 4000;

// =====================================================
// CONFIGURACIÓN DE MIDDLEWARE
// =====================================================

// Habilitar CORS para permitir peticiones desde otros dominios
app.use(cors());
// Middleware para parsear JSON en las peticiones
app.use(express.json());

// Servir archivos estáticos desde la carpeta public
// Esto permite acceder a CSS, JS, imágenes, etc.
app.use(express.static(path.join(__dirname, '../public')));

// Probar conexión a la base de datos al iniciar el servidor
testConnection();

// =====================================================
// CONFIGURACIÓN DE RUTAS API
// =====================================================

// Montar todas las rutas API bajo el prefijo '/api'
// Ejemplo: /api/ventas, /api/productos, etc.
app.use('/api', routes);

// =====================================================
// RUTAS PARA PÁGINAS PRINCIPALES (SERVE-SIDE RENDERING)
// =====================================================

// Ruta principal - página de inicio
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Ruta de login - página de autenticación
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Ruta del dashboard - panel principal
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

// =====================================================
// RUTAS PARA GESTIÓN DE VENTAS
// =====================================================

// Página principal de ventas
app.get('/ventas', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/ventas.html'));
});

// Página para crear nueva venta
app.get('/ventas/nueva', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/ventas.html'));
});

// =====================================================
// RUTAS PARA GESTIÓN DE PEDIDOS
// =====================================================

// Página principal de pedidos
app.get('/pedidos', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pedidos.html'));
});

// Página para crear nuevo pedido
app.get('/pedidos/nuevo', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pedidos.html'));
});

// =====================================================
// RUTAS PARA GESTIÓN DE DEVOLUCIONES
// =====================================================

// Página principal de devoluciones
app.get('/devoluciones', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/devoluciones.html'));
});

// Página para crear nueva devolución
app.get('/devoluciones/nueva', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/devoluciones.html'));
});

// =====================================================
// RUTAS PARA GESTIÓN DE PRODUCTOS
// =====================================================

// Página principal de productos
app.get('/productos', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/productos.html'));
});

// Página para crear nuevo producto
app.get('/productos/nuevo', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/productos.html'));
});

// =====================================================
// RUTAS PARA GESTIÓN DE PROVEEDORES
// =====================================================

// Página principal de proveedores
app.get('/proveedores', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/proveedores.html'));
});

// Página para crear nuevo proveedor
app.get('/proveedores/nuevo', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/proveedores.html'));
});

// =====================================================
// RUTAS PARA RECURSOS HUMANOS (RRHH)
// =====================================================

// Página de gestión de turnos
app.get('/rrhh/turnos', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/rrhh.html'));
});

// Página de gestión de asistencias
app.get('/rrhh/asistencias', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/rrhh.html'));
});

// =====================================================
// RUTAS PARA ADMINISTRACIÓN DEL SISTEMA
// =====================================================

// Página de gestión de usuarios
app.get('/admin/usuarios', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin.html'));
});

// Página de gestión de roles
app.get('/admin/roles', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin.html'));
});

// =====================================================
// INICIAR SERVIDOR
// =====================================================

// Iniciar el servidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});