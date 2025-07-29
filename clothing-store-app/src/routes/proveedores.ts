import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { 
  getAllSuppliers, 
  createSupplier, 
  updateSupplier, 
  deleteSupplier 
} from '../controllers/supplierRepository';

const router = express.Router();

// Obtener todos los proveedores
router.get('/', authenticateToken, async (req, res) => {
  try {
    const proveedores = await getAllSuppliers();
    res.json(proveedores);
  } catch (error) {
    console.error('Error obteniendo proveedores:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear nuevo proveedor
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { nombre, ciudad, telefono, email, direccion, contacto } = req.body;
    
    if (!nombre || !ciudad) {
      return res.status(400).json({ error: 'Nombre y ciudad son requeridos' });
    }
    
    const proveedor = await createSupplier({
      nombre,
      ciudad,
      telefono: telefono || null,
      email: email || null,
      direccion: direccion || null,
      contacto: contacto || null
    });
    
    res.status(201).json(proveedor);
  } catch (error) {
    console.error('Error creando proveedor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar proveedor
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nombre, ciudad, telefono, email, direccion, contacto } = req.body;
    
    if (!nombre || !ciudad) {
      return res.status(400).json({ error: 'Nombre y ciudad son requeridos' });
    }
    
    const proveedor = await updateSupplier(id, {
      nombre,
      ciudad,
      telefono: telefono || null,
      email: email || null,
      direccion: direccion || null,
      contacto: contacto || null
    });
    
    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    
    res.json(proveedor);
  } catch (error) {
    console.error('Error actualizando proveedor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar proveedor
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const proveedor = await deleteSupplier(id);
    
    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    
    res.json({ message: 'Proveedor eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando proveedor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Estadísticas de proveedores
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const proveedores = await getAllSuppliers();
    const proveedoresArray = proveedores as any[];
    
    const stats = {
      totalProveedores: proveedoresArray.length,
      proveedoresActivos: proveedoresArray.length, // Por ahora todos están activos
      pedidosPendientes: 0, // Esto se calcularía con datos de pedidos
      valorPedidos: 0 // Esto se calcularía con datos de pedidos
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error obteniendo estadísticas de proveedores:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router; 