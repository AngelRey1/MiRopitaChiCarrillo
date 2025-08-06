import { pool } from '../config/database';
import { Venta, DetalleVenta, CreateVentaRequest, UpdateVentaRequest } from '../types';

// Obtener todas las ventas
export async function getAllVentas(): Promise<Venta[]> {
  const [rows] = await pool.query(`
    SELECT v.*, u.nombre as usuario_nombre, u.apellido as usuario_apellido,
           c.id_cliente, c.nombre_cliente, c.apellido_cliente
    FROM ventas v
    LEFT JOIN usuarios u ON v.usuario_id = u.id
    LEFT JOIN cliente c ON v.cliente_id = c.id_cliente
    ORDER BY v.created_at DESC
  `);
  
  return (rows as any[]).map((row: any) => ({
    id: row.id,
    usuario_id: row.usuario_id,
    cliente_id: row.cliente_id,
    fecha_venta: row.fecha_venta,
    total: row.total,
    metodo_pago: row.metodo_pago,
    estado: row.estado,
    observaciones: row.observaciones,
    created_at: row.created_at,
    cliente: row.cliente_id ? {
      nombre: row.nombre_cliente,
      apellido: row.apellido_cliente,
      email: '' // No hay email en la tabla cliente
    } : undefined,
    usuario: row.usuario_id ? {
      nombre: row.usuario_nombre,
      apellido: row.usuario_apellido
    } : undefined
  }));
}

// Obtener ventas por usuario
export async function getVentasByUser(userId: number): Promise<Venta[]> {
  const [rows] = await pool.query(`
    SELECT v.*, u.nombre as usuario_nombre, u.apellido as usuario_apellido,
           c.id_cliente, c.nombre_cliente, c.apellido_cliente
    FROM ventas v
    LEFT JOIN usuarios u ON v.usuario_id = u.id
    LEFT JOIN cliente c ON v.cliente_id = c.id_cliente
    WHERE v.usuario_id = ?
    ORDER BY v.created_at DESC
  `, [userId]);
  
  return (rows as any[]).map((row: any) => ({
    id: row.id,
    usuario_id: row.usuario_id,
    cliente_id: row.cliente_id,
    fecha_venta: row.fecha_venta,
    total: row.total,
    metodo_pago: row.metodo_pago,
    estado: row.estado,
    observaciones: row.observaciones,
    created_at: row.created_at,
    cliente: row.cliente_id ? {
      nombre: row.nombre_cliente,
      apellido: row.apellido_cliente,
      email: '' // No hay email en la tabla cliente
    } : undefined,
    usuario: row.usuario_id ? {
      nombre: row.usuario_nombre,
      apellido: row.usuario_apellido
    } : undefined
  }));
}

// Obtener venta por ID
export async function getVentaById(id: number): Promise<Venta | null> {
  const [rows] = await pool.query(`
    SELECT v.*, u.nombre as usuario_nombre, u.apellido as usuario_apellido,
           c.id_cliente, c.nombre_cliente, c.apellido_cliente
    FROM ventas v
    LEFT JOIN usuarios u ON v.usuario_id = u.id
    LEFT JOIN cliente c ON v.cliente_id = c.id_cliente
    WHERE v.id = ?
  `, [id]);
  
  if ((rows as any[]).length === 0) return null;
  
  const row = (rows as any[])[0];
  return {
    id: row.id,
    usuario_id: row.usuario_id,
    cliente_id: row.cliente_id,
    fecha_venta: row.fecha_venta,
    total: row.total,
    metodo_pago: row.metodo_pago,
    estado: row.estado,
    observaciones: row.observaciones,
    created_at: row.created_at,
    cliente: row.cliente_id ? {
      nombre: row.nombre_cliente,
      apellido: row.apellido_cliente,
      email: '' // No hay email en la tabla cliente
    } : undefined,
    usuario: row.usuario_id ? {
      nombre: row.usuario_nombre,
      apellido: row.usuario_apellido
    } : undefined
  };
}

// Crear nueva venta
export async function createVenta(userId: number, ventaData: CreateVentaRequest): Promise<Venta> {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Validar stock antes de crear la venta
    for (const detalle of ventaData.detalles) {
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
    
    // Calcular total
    const total = ventaData.detalles.reduce((sum, detalle) => {
      return sum + (detalle.cantidad * detalle.precio_unitario);
    }, 0);
    
    // Validar fecha
    const fechaVenta = ventaData.fecha_venta instanceof Date 
      ? ventaData.fecha_venta 
      : new Date(ventaData.fecha_venta);
    
    // Usar procedimiento almacenado para crear venta
    const [ventaResult] = await connection.query(
      'CALL sp_crear_venta_completa(?, ?, ?, ?)',
      [userId, ventaData.cliente_id, ventaData.metodo_pago, ventaData.observaciones || '']
    );
    
    const ventaId = (ventaResult as any)[0][0].venta_id;
    
    // Insertar detalles y actualizar stock usando procedimientos almacenados
    for (const detalle of ventaData.detalles) {
      const subtotal = detalle.cantidad * detalle.precio_unitario;
      
      // Insertar detalle de venta
      await connection.query(
        'INSERT INTO detalles_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
        [ventaId, detalle.producto_id, detalle.cantidad, detalle.precio_unitario, subtotal]
      );
      
      // Actualizar stock usando procedimiento almacenado
      await connection.query(
        'CALL sp_actualizar_stock(?, ?, ?)',
        [detalle.producto_id, detalle.cantidad, 'venta']
      );
    }
    
    await connection.commit();
    
    // Retornar la venta creada
    const venta = await getVentaById(ventaId);
    if (!venta) {
      throw new Error('Error al recuperar la venta creada');
    }
    return venta;
    
  } catch (error) {
    await connection.rollback();
    console.error('Error en createVenta:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Actualizar venta
export async function updateVenta(id: number, ventaData: UpdateVentaRequest): Promise<Venta | null> {
  const [result] = await pool.query(
    'UPDATE ventas SET estado = ?, observaciones = ? WHERE id = ?',
    [ventaData.estado, ventaData.observaciones, id]
  );
  
  if ((result as any).affectedRows === 0) return null;
  
  return await getVentaById(id);
}

// Obtener detalles de una venta
export async function getDetallesVenta(ventaId: number): Promise<DetalleVenta[]> {
  const [rows] = await pool.query(`
    SELECT dv.*
    FROM detalles_ventas dv
    WHERE dv.venta_id = ?
  `, [ventaId]);
  
  return (rows as any[]).map((row: any) => ({
    id: row.id,
    venta_id: row.venta_id,
    producto_id: row.producto_id,
    cantidad: row.cantidad,
    precio_unitario: row.precio_unitario,
    subtotal: row.subtotal,
    created_at: row.created_at,
    producto: undefined // Por ahora no incluimos producto
  }));
}

// Obtener estadísticas de ventas
export async function getVentasStats(): Promise<{
  total_ventas: number;
  total_ingresos: number;
  ventas_hoy: number;
  ingresos_hoy: number;
}> {
  const [stats] = await pool.query(`
    SELECT 
      COUNT(*) as total_ventas,
      SUM(total) as total_ingresos,
      COUNT(CASE WHEN DATE(fecha_venta) = CURDATE() THEN 1 END) as ventas_hoy,
      SUM(CASE WHEN DATE(fecha_venta) = CURDATE() THEN total ELSE 0 END) as ingresos_hoy
    FROM ventas 
    WHERE estado = 'completada'
  `);
  
  const row = (stats as any[])[0];
  return {
    total_ventas: row.total_ventas || 0,
    total_ingresos: row.total_ingresos || 0,
    ventas_hoy: row.ventas_hoy || 0,
    ingresos_hoy: row.ingresos_hoy || 0
  };
}

// Obtener productos con stock bajo
export async function getProductosStockBajo(): Promise<any[]> {
  const [rows] = await pool.query(`
    SELECT 
      id_producto,
      nombre,
      modelo,
      talla,
      existencia,
      precio,
      CASE 
        WHEN existencia = 0 THEN 'SIN STOCK'
        WHEN existencia <= 5 THEN 'STOCK BAJO'
        ELSE 'STOCK NORMAL'
      END as estado_stock
    FROM producto 
    WHERE existencia <= 5 AND activo = TRUE
    ORDER BY existencia ASC
  `);
  
  return rows as any[];
} 