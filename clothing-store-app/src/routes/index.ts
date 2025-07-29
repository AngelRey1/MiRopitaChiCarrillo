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
import { authenticateToken, requireVentasPermission, requireInventarioPermission } from '../middleware/auth';

const router = Router();

// Rutas públicas (sin autenticación) - TEMPORAL
router.get('/productos', getProducts);
router.get('/productos/:id', getProduct);
router.get('/clientes', getClients);
router.get('/proveedores', getSuppliers);
// router.get('/ventas', getVentasList); // Comentado - usando nuevas rutas
// router.get('/ventas/:id', getVentaDetalle); // Comentado - usando nuevas rutas

// Rutas protegidas
router.post('/productos', authenticateToken, requireInventarioPermission, postProduct);
router.put('/productos/:id', authenticateToken, requireInventarioPermission, putProduct);
router.delete('/productos/:id', authenticateToken, requireInventarioPermission, deleteProductById);

// router.post('/ventas', authenticateToken, requireVentasPermission, postVenta); // Comentado - usando nuevas rutas

router.post('/clientes', authenticateToken, requireVentasPermission, postClient);
router.put('/clientes/:id', authenticateToken, requireVentasPermission, putClient);
router.delete('/clientes/:id', authenticateToken, requireVentasPermission, deleteClientById);

router.post('/proveedores', authenticateToken, requireInventarioPermission, postSupplier);
router.put('/proveedores/:id', authenticateToken, requireInventarioPermission, putSupplier);
router.delete('/proveedores/:id', authenticateToken, requireInventarioPermission, deleteSupplierById);

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

export default router;