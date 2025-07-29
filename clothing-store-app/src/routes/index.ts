import { Router } from 'express';
import {
  getProducts,
  getProduct,
  postProduct,
  putProduct,
  deleteProductById,
  // postVenta, // Comentado - usando nuevas rutas
  // getVentasList, // Comentado - usando nuevas rutas
  // getVentaDetalle, // Comentado - usando nuevas rutas
  getClients,
  postClient,
  putClient,
  deleteClientById,
  getSuppliers,
  postSupplier,
  putSupplier,
  deleteSupplierById
} from '../controllers';
import authRoutes from './auth';
import turnosRoutes from './turnos';
import pedidosRoutes from './pedidos';
import ventasRoutes from './ventas';
import devolucionesRoutes from './devoluciones';
import productosRoutes from './productos';
import proveedoresRoutes from './proveedores';
import { authenticateToken, requireVentasPermission, requireInventarioPermission } from '../middleware/auth';

const router = Router();

// Rutas públicas (sin autenticación) - TEMPORAL
router.get('/clientes', getClients);
// router.get('/ventas', getVentasList); // Comentado - usando nuevas rutas
// router.get('/ventas/:id', getVentaDetalle); // Comentado - usando nuevas rutas

// router.post('/ventas', authenticateToken, requireVentasPermission, postVenta); // Comentado - usando nuevas rutas

router.post('/clientes', authenticateToken, requireVentasPermission, postClient);
router.put('/clientes/:id', authenticateToken, requireVentasPermission, putClient);
router.delete('/clientes/:id', authenticateToken, requireVentasPermission, deleteClientById);

// Rutas de autenticación y usuarios
router.use('/auth', authRoutes);

// Rutas de turnos y asistencias
router.use('/rrhh', turnosRoutes);

// Rutas de pedidos
router.use('/pedidos', pedidosRoutes);

// Rutas de ventas
router.use('/ventas', ventasRoutes);

// Rutas de devoluciones
router.use('/devoluciones', devolucionesRoutes);

// Rutas de productos
router.use('/productos', productosRoutes);

// Rutas de proveedores
router.use('/proveedores', proveedoresRoutes);

export default router;