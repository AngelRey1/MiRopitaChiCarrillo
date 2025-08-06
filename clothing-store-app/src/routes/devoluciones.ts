import { Router } from 'express';
import { authenticateToken, requireDevolucionesPermission } from '../middleware/auth';
import {
  getAllDevoluciones,
  getDevolucionesByUser,
  getDevolucionById,
  createDevolucion,
  updateDevolucion,
  getDetallesDevolucion,
  getDevolucionesByVenta,
  getDevolucionesStats,
  getVentasDisponiblesParaDevolucion,
  getDetallesVentaParaDevolucion
} from '../controllers/devolucionRepository';

const router = Router();

// Obtener todas las devoluciones (solo devoluciones y admin)
router.get('/', authenticateToken, requireDevolucionesPermission, async (req, res) => {
  try {
    const devoluciones = await getAllDevoluciones();
    res.json(devoluciones);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener devoluciones', details: err });
  }
});

// Obtener devoluciones del usuario actual
router.get('/my-devoluciones', authenticateToken, requireDevolucionesPermission, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const devoluciones = await getDevolucionesByUser(userId);
    res.json(devoluciones);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener devoluciones del usuario', details: err });
  }
});

// Obtener ventas disponibles para devolución
router.get('/ventas-disponibles', authenticateToken, requireDevolucionesPermission, async (req, res) => {
  try {
    const ventas = await getVentasDisponiblesParaDevolucion();
    res.json(ventas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener ventas disponibles', details: err });
  }
});

// Obtener detalles de una venta específica para devolución
router.get('/venta/:ventaId/detalles', authenticateToken, requireDevolucionesPermission, async (req, res) => {
  try {
    const ventaId = parseInt(req.params.ventaId, 10);
    const detallesVenta = await getDetallesVentaParaDevolucion(ventaId);
    res.json(detallesVenta);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener detalles de la venta', details: err });
  }
});

// Obtener devolución por ID
router.get('/:id', authenticateToken, requireDevolucionesPermission, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const devolucion = await getDevolucionById(id);
    if (devolucion) {
      res.json(devolucion);
    } else {
      res.status(404).json({ error: 'Devolución no encontrada' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener devolución', details: err });
  }
});

// Crear nueva devolución
router.post('/', authenticateToken, requireDevolucionesPermission, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const devolucion = await createDevolucion(userId, req.body);
    res.status(201).json(devolucion);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear devolución', details: err });
  }
});

// Actualizar devolución
router.put('/:id', authenticateToken, requireDevolucionesPermission, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const devolucion = await updateDevolucion(id, req.body);
    if (devolucion) {
      res.json(devolucion);
    } else {
      res.status(404).json({ error: 'Devolución no encontrada' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar devolución', details: err });
  }
});

// Obtener detalles de una devolución
router.get('/:id/detalles', authenticateToken, requireDevolucionesPermission, async (req, res) => {
  try {
    const devolucionId = parseInt(req.params.id, 10);
    const detalles = await getDetallesDevolucion(devolucionId);
    res.json(detalles);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener detalles de devolución', details: err });
  }
});

// Obtener devoluciones por venta
router.get('/venta/:ventaId', authenticateToken, requireDevolucionesPermission, async (req, res) => {
  try {
    const ventaId = parseInt(req.params.ventaId, 10);
    const devoluciones = await getDevolucionesByVenta(ventaId);
    res.json(devoluciones);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener devoluciones de la venta', details: err });
  }
});

// Obtener estadísticas de devoluciones
router.get('/stats/overview', authenticateToken, requireDevolucionesPermission, async (req, res) => {
  try {
    const stats = await getDevolucionesStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener estadísticas de devoluciones', details: err });
  }
});

export default router; 