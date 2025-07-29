import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/itemRepository';

const router = express.Router();

// Obtener todos los productos
router.get('/', authenticateToken, async (req, res) => {
  try {
    const productos = await getAllProducts();
    res.json(productos);
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener producto por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const producto = await getProductById(id);
    
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(producto);
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear nuevo producto
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { nombre, modelo, talla, corte, existencia, precio, en_promocion } = req.body;
    
    if (!nombre || existencia === undefined || precio === undefined) {
      return res.status(400).json({ error: 'Nombre, existencia y precio son requeridos' });
    }
    
    const producto = await createProduct({
      nombre,
      modelo: modelo || '',
      talla: talla || '',
      corte: corte || '',
      existencia: parseInt(existencia),
      precio: parseFloat(precio),
      en_promocion: en_promocion || false
    });
    
    res.status(201).json(producto);
  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar producto
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nombre, modelo, talla, corte, existencia, precio, en_promocion } = req.body;
    
    if (!nombre || existencia === undefined || precio === undefined) {
      return res.status(400).json({ error: 'Nombre, existencia y precio son requeridos' });
    }
    
    const producto = await updateProduct(id, {
      nombre,
      modelo: modelo || '',
      talla: talla || '',
      corte: corte || '',
      existencia: parseInt(existencia),
      precio: parseFloat(precio),
      en_promocion: en_promocion || false
    });
    
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(producto);
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar producto
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const producto = await deleteProduct(id);
    
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Estadísticas de productos
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const productos = await getAllProducts();
    const productosArray = productos as any[];
    
    const stats = {
      totalProductos: productosArray.length,
      productosPromocion: productosArray.filter((p: any) => p.en_promocion).length,
      stockBajo: productosArray.filter((p: any) => p.existencia < 10).length,
      valorInventario: productosArray.reduce((sum: number, p: any) => sum + (p.precio * p.existencia), 0)
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error obteniendo estadísticas de productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router; 