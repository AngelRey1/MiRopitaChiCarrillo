import { Router } from 'express';
import { authenticateToken, requireInventarioPermission, requireEnviosPermission } from '../middleware/auth';
import {
  getAllPedidos,
  getPedidosByUser,
  getPedidoById,
  createPedido,
  updatePedido,
  deletePedido,
  getDetallesPedido,
  getPedidosStats
} from '../controllers/pedidoRepository';

const router = Router();

// Obtener todos los pedidos (solo inventario, envíos y admin)
router.get('/', authenticateToken, requireInventarioPermission, async (req, res) => {
  try {
    const pedidos = await getAllPedidos();
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener pedidos', details: err });
  }
});

// Obtener pedidos del usuario actual
router.get('/my-pedidos', authenticateToken, requireInventarioPermission, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const pedidos = await getPedidosByUser(userId);
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener pedidos del usuario', details: err });
  }
});

// Obtener pedido por ID
router.get('/:id', authenticateToken, requireInventarioPermission, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const pedido = await getPedidoById(id);
    if (pedido) {
      res.json(pedido);
    } else {
      res.status(404).json({ error: 'Pedido no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener pedido', details: err });
  }
});

// Crear nuevo pedido
router.post('/', authenticateToken, requireInventarioPermission, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const pedido = await createPedido(userId, req.body);
    res.status(201).json(pedido);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear pedido', details: err });
  }
});

// Actualizar pedido
router.put('/:id', authenticateToken, requireInventarioPermission, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const pedido = await updatePedido(id, req.body);
    if (pedido) {
      res.json(pedido);
    } else {
      res.status(404).json({ error: 'Pedido no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar pedido', details: err });
  }
});

// Eliminar pedido
router.delete('/:id', authenticateToken, requireInventarioPermission, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await deletePedido(id);
    if (deleted) {
      res.json({ message: 'Pedido eliminado exitosamente' });
    } else {
      res.status(404).json({ error: 'Pedido no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar pedido', details: err });
  }
});

// Obtener detalles de un pedido
router.get('/:id/detalles', authenticateToken, requireInventarioPermission, async (req, res) => {
  try {
    const pedidoId = parseInt(req.params.id, 10);
    const detalles = await getDetallesPedido(pedidoId);
    res.json(detalles);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener detalles de pedido', details: err });
  }
});

// Obtener estadísticas de pedidos
router.get('/stats/overview', authenticateToken, requireInventarioPermission, async (req, res) => {
  try {
    const stats = await getPedidosStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener estadísticas de pedidos', details: err });
  }
});

export default router; 