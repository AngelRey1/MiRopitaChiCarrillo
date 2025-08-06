// =====================================================
// ARCHIVO: storedProcedures.ts
// DESCRIPCIÓN: Rutas para procedimientos almacenados
// FUNCIÓN: Endpoints para operaciones complejas usando stored procedures
// =====================================================

import { Router } from 'express';
import { authenticateToken, requireVentasPermission, requireDevolucionesPermission } from '../middleware/auth';
import {
  crearVentaCompleta,
  actualizarStock,
  procesarDevolucion,
  getProductosStockBajo,
  getLogStockBajo,
  actualizarStockCompra,
  CreateVentaCompletaRequest,
  ProcesarDevolucionRequest,
  TipoOperacionStock
} from '../controllers/storedProcedures';

const router = Router();

// =====================================================
// RUTAS PARA VENTAS CON PROCEDIMIENTOS ALMACENADOS
// =====================================================

// Crear venta completa usando procedimiento almacenado
router.post('/ventas/completa', authenticateToken, requireVentasPermission, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const ventaData: CreateVentaCompletaRequest = {
      usuario_id: userId,
      cliente_id: req.body.cliente_id,
      metodo_pago: req.body.metodo_pago,
      observaciones: req.body.observaciones,
      detalles: req.body.detalles
    };

    // Validaciones básicas
    if (!ventaData.cliente_id || !ventaData.metodo_pago || !ventaData.detalles || ventaData.detalles.length === 0) {
      return res.status(400).json({ 
        error: 'Datos incompletos', 
        required: ['cliente_id', 'metodo_pago', 'detalles'] 
      });
    }

    const resultado = await crearVentaCompleta(ventaData);
    res.status(201).json({
      message: 'Venta creada exitosamente',
      venta_id: resultado.venta_id
    });

  } catch (error: any) {
    console.error('Error al crear venta completa:', error);
    res.status(500).json({ 
      error: 'Error al crear venta', 
      details: error.message 
    });
  }
});

// =====================================================
// RUTAS PARA GESTIÓN DE STOCK
// =====================================================

// Actualizar stock usando procedimiento almacenado
router.post('/stock/actualizar', authenticateToken, async (req, res) => {
  try {
    const { producto_id, cantidad, tipo } = req.body;

    // Validaciones
    if (!producto_id || cantidad === undefined || !tipo) {
      return res.status(400).json({ 
        error: 'Datos incompletos', 
        required: ['producto_id', 'cantidad', 'tipo'] 
      });
    }

    // Validar tipo de operación
    const tiposValidos: TipoOperacionStock[] = ['venta', 'compra', 'devolucion'];
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({ 
        error: 'Tipo de operación inválido', 
        valid_types: tiposValidos 
      });
    }

    await actualizarStock(producto_id, cantidad, tipo);
    
    res.json({ 
      message: 'Stock actualizado exitosamente',
      producto_id,
      cantidad,
      tipo
    });

  } catch (error: any) {
    console.error('Error al actualizar stock:', error);
    res.status(500).json({ 
      error: 'Error al actualizar stock', 
      details: error.message 
    });
  }
});

// Actualizar stock para compras
router.post('/stock/compra', authenticateToken, async (req, res) => {
  try {
    const { producto_id, cantidad } = req.body;

    if (!producto_id || cantidad === undefined) {
      return res.status(400).json({ 
        error: 'Datos incompletos', 
        required: ['producto_id', 'cantidad'] 
      });
    }

    await actualizarStockCompra(producto_id, cantidad);
    
    res.json({ 
      message: 'Stock actualizado por compra exitosamente',
      producto_id,
      cantidad
    });

  } catch (error: any) {
    console.error('Error al actualizar stock por compra:', error);
    res.status(500).json({ 
      error: 'Error al actualizar stock', 
      details: error.message 
    });
  }
});

// Obtener productos con stock bajo
router.get('/stock/bajo', authenticateToken, async (req, res) => {
  try {
    const productos = await getProductosStockBajo();
    res.json(productos);
  } catch (error: any) {
    console.error('Error al obtener productos con stock bajo:', error);
    res.status(500).json({ 
      error: 'Error al obtener productos con stock bajo', 
      details: error.message 
    });
  }
});

// Obtener log de stock bajo
router.get('/stock/log-bajo', authenticateToken, async (req, res) => {
  try {
    const log = await getLogStockBajo();
    res.json(log);
  } catch (error: any) {
    console.error('Error al obtener log de stock bajo:', error);
    res.status(500).json({ 
      error: 'Error al obtener log de stock bajo', 
      details: error.message 
    });
  }
});

// =====================================================
// RUTAS PARA DEVOLUCIONES CON PROCEDIMIENTOS ALMACENADOS
// =====================================================

// Procesar devolución usando procedimiento almacenado
router.post('/devoluciones/procesar', authenticateToken, requireDevolucionesPermission, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const devolucionData: ProcesarDevolucionRequest = {
      usuario_id: userId,
      venta_id: req.body.venta_id,
      cliente_id: req.body.cliente_id,
      motivo: req.body.motivo,
      total_devolucion: req.body.total_devolucion,
      observaciones: req.body.observaciones,
      detalles: req.body.detalles
    };

    // Validaciones básicas
    if (!devolucionData.venta_id || !devolucionData.cliente_id || !devolucionData.motivo || !devolucionData.detalles || devolucionData.detalles.length === 0) {
      return res.status(400).json({ 
        error: 'Datos incompletos', 
        required: ['venta_id', 'cliente_id', 'motivo', 'detalles'] 
      });
    }

    const resultado = await procesarDevolucion(devolucionData);
    res.status(201).json({
      message: 'Devolución procesada exitosamente',
      devolucion_id: resultado.devolucion_id
    });

  } catch (error: any) {
    console.error('Error al procesar devolución:', error);
    res.status(500).json({ 
      error: 'Error al procesar devolución', 
      details: error.message 
    });
  }
});

// =====================================================
// RUTAS PARA ESTADÍSTICAS Y REPORTES
// =====================================================

// Obtener estadísticas de stock
router.get('/stats/stock', authenticateToken, async (req, res) => {
  try {
    const productosStockBajo = await getProductosStockBajo();
    const logStockBajo = await getLogStockBajo();

    const stats = {
      productos_sin_stock: productosStockBajo.filter((p: any) => p.existencia === 0).length,
      productos_stock_bajo: productosStockBajo.filter((p: any) => p.existencia > 0 && p.existencia <= 5).length,
      alertas_stock_bajo: logStockBajo.length,
      alertas_hoy: logStockBajo.filter((log: any) => {
        const hoy = new Date().toISOString().split('T')[0];
        return log.fecha_alerta.toISOString().split('T')[0] === hoy;
      }).length
    };

    res.json(stats);
  } catch (error: any) {
    console.error('Error al obtener estadísticas de stock:', error);
    res.status(500).json({ 
      error: 'Error al obtener estadísticas de stock', 
      details: error.message 
    });
  }
});

export default router; 