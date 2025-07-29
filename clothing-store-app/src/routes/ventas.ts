import { Router } from 'express';
import { authenticateToken, requireVentasPermission } from '../middleware/auth';
import {
  getAllVentas,
  getVentasByUser,
  getVentaById,
  createVenta,
  updateVenta,
  getDetallesVenta,
  getVentasStats
} from '../controllers/ventaRepository';

// Función auxiliar para obtener permisos según el rol (copiada del middleware)
function getPermissionsForRole(roleName: string): string[] {
  const rolePermissions: { [key: string]: string[] } = {
    'admin': ['*'],
    'vendedor': ['ventas', 'clientes', 'productos'],
    'inventario': ['productos', 'pedidos', 'proveedores'],
    'envios': ['envios', 'pedidos'],
    'devoluciones': ['devoluciones', 'ventas'],
    'rrhh': ['usuarios', 'asistencias', 'turnos']
  };

  return rolePermissions[roleName] || [];
}

const router = Router();

// Ruta de prueba para verificar permisos
router.get('/test-auth', authenticateToken, (req, res) => {
  console.log('🔍 Test auth - Usuario:', req.user);
  console.log('🔍 Test auth - Roles:', req.user?.roles);
  res.json({
    message: 'Usuario autenticado correctamente',
    user: req.user,
    roles: req.user?.roles
  });
});

// Ruta para verificar permisos específicos
router.get('/check-permissions', authenticateToken, (req, res) => {
  console.log('🔍 Check permissions - Usuario:', req.user);
  console.log('🔍 Check permissions - Roles:', req.user?.roles);
  
  const hasVentasPermission = req.user?.roles.some(roleName => {
    const rolePermissions = getPermissionsForRole(roleName);
    console.log(`🔍 Rol: ${roleName}, Permisos:`, rolePermissions);
    return rolePermissions.includes('*') || rolePermissions.includes('ventas');
  });
  
  console.log('🔍 Tiene permiso ventas:', hasVentasPermission);
  
  res.json({
    message: 'Verificación de permisos',
    user: req.user,
    roles: req.user?.roles,
    hasVentasPermission: hasVentasPermission,
    rolePermissions: req.user?.roles.map(roleName => ({
      role: roleName,
      permissions: getPermissionsForRole(roleName)
    }))
  });
});

// Ruta temporal sin verificación de permisos para pruebas
router.get('/temp', authenticateToken, async (req, res) => {
  try {
    const ventas = await getAllVentas();
    res.json({
      message: 'Acceso temporal sin verificación de permisos',
      user: req.user,
      roles: req.user?.roles,
      ventas: ventas
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener ventas', details: err });
  }
});

// Obtener todas las ventas (solo vendedores y admin)
router.get('/', authenticateToken, requireVentasPermission, async (req, res) => {
  try {
    const ventas = await getAllVentas();
    res.json(ventas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener ventas', details: err });
  }
});

// Obtener ventas del usuario actual
router.get('/my-ventas', authenticateToken, requireVentasPermission, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const ventas = await getVentasByUser(userId);
    res.json(ventas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener ventas del usuario', details: err });
  }
});

// Obtener venta por ID
router.get('/:id', authenticateToken, requireVentasPermission, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const venta = await getVentaById(id);
    if (venta) {
      res.json(venta);
    } else {
      res.status(404).json({ error: 'Venta no encontrada' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener venta', details: err });
  }
});

// Crear nueva venta
router.post('/', authenticateToken, requireVentasPermission, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const venta = await createVenta(userId, req.body);
    res.status(201).json(venta);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear venta', details: err });
  }
});

// Actualizar venta
router.put('/:id', authenticateToken, requireVentasPermission, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const venta = await updateVenta(id, req.body);
    if (venta) {
      res.json(venta);
    } else {
      res.status(404).json({ error: 'Venta no encontrada' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar venta', details: err });
  }
});

// Obtener detalles de una venta
router.get('/:id/detalles', authenticateToken, requireVentasPermission, async (req, res) => {
  try {
    const ventaId = parseInt(req.params.id, 10);
    const detalles = await getDetallesVenta(ventaId);
    res.json(detalles);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener detalles de venta', details: err });
  }
});

// Obtener estadísticas de ventas
router.get('/stats/overview', authenticateToken, requireVentasPermission, async (req, res) => {
  try {
    const stats = await getVentasStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener estadísticas de ventas', details: err });
  }
});

export default router; 