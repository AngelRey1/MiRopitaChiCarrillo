// =====================================================
// ARCHIVO: storedProcedures.ts
// DESCRIPCIÓN: Controlador para manejar procedimientos almacenados
// FUNCIÓN: Ejecutar procedimientos almacenados para operaciones complejas
// =====================================================

import { pool } from '../config/database';

// =====================================================
// PROCEDIMIENTO: sp_crear_venta_completa
// =====================================================

export interface CreateVentaCompletaRequest {
  usuario_id: number;
  cliente_id: number;
  metodo_pago: string;
  observaciones?: string;
  detalles: Array<{
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
  }>;
}

export async function crearVentaCompleta(data: CreateVentaCompletaRequest): Promise<{ venta_id: number }> {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Validar stock antes de crear la venta
    for (const detalle of data.detalles) {
      const [productoRows] = await connection.query(
        'SELECT existencia, nombre FROM producto WHERE id_producto = ?',
        [detalle.producto_id]
      );
      
      if ((productoRows as any[]).length === 0) {
        throw new Error(`Producto con ID ${detalle.producto_id} no encontrado`);
      }
      
      const producto = (productoRows as any[])[0];
      if (producto.existencia < detalle.cantidad) {
        throw new Error(`Stock insuficiente para ${producto.nombre}. Disponible: ${producto.existencia}, Solicitado: ${detalle.cantidad}`);
      }
    }
    
    // Ejecutar procedimiento almacenado para crear venta
    const [result] = await connection.query(
      'CALL sp_crear_venta_completa(?, ?, ?, ?)',
      [data.usuario_id, data.cliente_id, data.metodo_pago, data.observaciones || '']
    );
    
    const ventaId = (result as any)[0][0].venta_id;
    
    // Insertar detalles de venta
    for (const detalle of data.detalles) {
      const subtotal = detalle.cantidad * detalle.precio_unitario;
      
      await connection.query(
        'INSERT INTO detalles_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
        [ventaId, detalle.producto_id, detalle.cantidad, detalle.precio_unitario, subtotal]
      );
      
      // Actualizar stock usando el procedimiento almacenado
      await connection.query(
        'CALL sp_actualizar_stock(?, ?, ?)',
        [detalle.producto_id, detalle.cantidad, 'venta']
      );
    }
    
    await connection.commit();
    
    return { venta_id: ventaId };
    
  } catch (error) {
    await connection.rollback();
    console.error('Error en crearVentaCompleta:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// =====================================================
// PROCEDIMIENTO: sp_actualizar_stock
// =====================================================

export type TipoOperacionStock = 'venta' | 'compra' | 'devolucion';

export async function actualizarStock(
  producto_id: number, 
  cantidad: number, 
  tipo: TipoOperacionStock
): Promise<void> {
  try {
    await pool.query(
      'CALL sp_actualizar_stock(?, ?, ?)',
      [producto_id, cantidad, tipo]
    );
  } catch (error) {
    console.error('Error en actualizarStock:', error);
    throw error;
  }
}

// =====================================================
// PROCEDIMIENTO: sp_procesar_devolucion
// =====================================================

export interface ProcesarDevolucionRequest {
  usuario_id: number;
  venta_id: number;
  cliente_id: number;
  motivo: string;
  total_devolucion: number;
  observaciones?: string;
  detalles: Array<{
    producto_id: number;
    cantidad_devuelta: number;
    precio_unitario: number;
    motivo_especifico?: string;
  }>;
}

export async function procesarDevolucion(data: ProcesarDevolucionRequest): Promise<{ devolucion_id: number }> {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Ejecutar procedimiento almacenado para procesar devolución
    const [result] = await connection.query(
      'CALL sp_procesar_devolucion(?, ?, ?, ?, ?, ?)',
      [
        data.usuario_id, 
        data.venta_id, 
        data.cliente_id, 
        data.motivo, 
        data.total_devolucion, 
        data.observaciones || ''
      ]
    );
    
    const devolucionId = (result as any)[0][0].devolucion_id;
    
    // Insertar detalles de devolución
    for (const detalle of data.detalles) {
      const subtotal = detalle.cantidad_devuelta * detalle.precio_unitario;
      
      await connection.query(
        'INSERT INTO detalles_devoluciones (devolucion_id, producto_id, cantidad_devuelta, precio_unitario, subtotal, motivo_especifico) VALUES (?, ?, ?, ?, ?, ?)',
        [devolucionId, detalle.producto_id, detalle.cantidad_devuelta, detalle.precio_unitario, subtotal, detalle.motivo_especifico || '']
      );
      
      // Actualizar stock usando el procedimiento almacenado
      await connection.query(
        'CALL sp_actualizar_stock(?, ?, ?)',
        [detalle.producto_id, detalle.cantidad_devuelta, 'devolucion']
      );
    }
    
    await connection.commit();
    
    return { devolucion_id: devolucionId };
    
  } catch (error) {
    await connection.rollback();
    console.error('Error en procesarDevolucion:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// =====================================================
// FUNCIONES AUXILIARES PARA GESTIÓN DE STOCK
// =====================================================

// Obtener productos con stock bajo
export async function getProductosStockBajo(): Promise<any[]> {
  const [rows] = await pool.query(`
    SELECT 
      p.id_producto,
      p.nombre,
      p.modelo,
      p.talla,
      p.existencia,
      p.precio,
      CASE 
        WHEN p.existencia = 0 THEN 'SIN STOCK'
        WHEN p.existencia <= 5 THEN 'STOCK BAJO'
        ELSE 'STOCK NORMAL'
      END as estado_stock
    FROM producto p
    WHERE p.existencia <= 5 AND p.activo = TRUE
    ORDER BY p.existencia ASC
  `);
  
  return rows as any[];
}

// Obtener log de stock bajo
export async function getLogStockBajo(): Promise<any[]> {
  const [rows] = await pool.query(`
    SELECT 
      lsb.*,
      p.nombre as producto_nombre,
      p.modelo,
      p.talla
    FROM log_stock_bajo lsb
    JOIN producto p ON lsb.producto_id = p.id_producto
    ORDER BY lsb.fecha_alerta DESC
  `);
  
  return rows as any[];
}

// Actualizar stock manualmente (para compras)
export async function actualizarStockCompra(
  producto_id: number, 
  cantidad: number
): Promise<void> {
  try {
    await pool.query(
      'CALL sp_actualizar_stock(?, ?, ?)',
      [producto_id, cantidad, 'compra']
    );
  } catch (error) {
    console.error('Error en actualizarStockCompra:', error);
    throw error;
  }
} 