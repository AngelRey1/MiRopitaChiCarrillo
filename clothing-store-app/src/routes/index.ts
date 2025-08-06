// =====================================================
// ARCHIVO: index.ts
// DESCRIPCIÓN: Archivo principal de rutas que organiza todas las rutas de la API
// FUNCIÓN: Define la estructura de endpoints y aplica middleware de autenticación
// =====================================================

// Importar Router de Express para crear rutas modulares
import { Router } from 'express';

// =====================================================
// IMPORTACIONES DE CONTROLADORES
// =====================================================

// Importar controladores principales para operaciones CRUD básicas
import {
  getProducts,           // Obtener todos los productos
  getProduct,            // Obtener producto por ID
  postProduct,           // Crear nuevo producto
  putProduct,            // Actualizar producto
  deleteProductById,     // Eliminar producto
  getClients,            // Obtener todos los clientes
  postClient,            // Crear nuevo cliente
  putClient,             // Actualizar cliente
  deleteClientById,      // Eliminar cliente
  getSuppliers,          // Obtener todos los proveedores
  postSupplier,          // Crear nuevo proveedor
  putSupplier,           // Actualizar proveedor
  deleteSupplierById     // Eliminar proveedor
} from '../controllers';

// =====================================================
// IMPORTACIONES DE RUTAS MODULARES
// =====================================================

// Importar rutas específicas para cada módulo del sistema
import authRoutes from './auth';              // Rutas de autenticación
import turnosRoutes from './turnos';          // Rutas de turnos y asistencias
import pedidosRoutes from './pedidos';        // Rutas de pedidos a proveedores
import ventasRoutes from './ventas';          // Rutas de ventas
import devolucionesRoutes from './devoluciones'; // Rutas de devoluciones
import productosRoutes from './productos';    // Rutas de gestión de productos
import proveedoresRoutes from './proveedores'; // Rutas de gestión de proveedores

// =====================================================
// IMPORTACIONES DE MIDDLEWARE
// =====================================================

// Importar middleware de autenticación y autorización
import { 
  authenticateToken,           // Verificar token JWT
  requireVentasPermission,     // Requerir permisos de ventas
  requireInventarioPermission  // Requerir permisos de inventario
} from '../middleware/auth';

// =====================================================
// CONFIGURACIÓN DEL ROUTER PRINCIPAL
// =====================================================

// Crear instancia del router principal
const router = Router();

// =====================================================
// RUTAS PÚBLICAS (SIN AUTENTICACIÓN)
// =====================================================

// Ruta para obtener clientes (temporalmente pública para desarrollo)
// GET /api/clientes
router.get('/clientes', getClients);

// =====================================================
// RUTAS PROTEGIDAS CON AUTENTICACIÓN
// =====================================================

// Rutas para gestión de clientes (requieren permisos de ventas)
// POST /api/clientes - Crear nuevo cliente
router.post('/clientes', authenticateToken, requireVentasPermission, postClient);

// PUT /api/clientes/:id - Actualizar cliente existente
router.put('/clientes/:id', authenticateToken, requireVentasPermission, putClient);

// DELETE /api/clientes/:id - Eliminar cliente
router.delete('/clientes/:id', authenticateToken, requireVentasPermission, deleteClientById);

// =====================================================
// MONTAR RUTAS MODULARES
// =====================================================

// Montar rutas de autenticación bajo /api/auth
// Incluye: login, logout, registro, gestión de usuarios
router.use('/auth', authRoutes);

// Montar rutas de RRHH bajo /api/rrhh
// Incluye: turnos, asistencias, gestión de empleados
router.use('/rrhh', turnosRoutes);

// Montar rutas de pedidos bajo /api/pedidos
// Incluye: crear pedidos, gestionar pedidos, detalles de pedidos
router.use('/pedidos', pedidosRoutes);

// Montar rutas de ventas bajo /api/ventas
// Incluye: crear ventas, gestionar ventas, detalles de ventas
router.use('/ventas', ventasRoutes);

// Montar rutas de devoluciones bajo /api/devoluciones
// Incluye: procesar devoluciones, gestionar devoluciones
router.use('/devoluciones', devolucionesRoutes);

// Montar rutas de productos bajo /api/productos
// Incluye: CRUD completo de productos, gestión de inventario
router.use('/productos', productosRoutes);

// Montar rutas de proveedores bajo /api/proveedores
// Incluye: CRUD completo de proveedores
router.use('/proveedores', proveedoresRoutes);

// =====================================================
// EXPORTAR ROUTER CONFIGURADO
// =====================================================

// Exportar el router configurado para ser usado en app.ts
export default router;