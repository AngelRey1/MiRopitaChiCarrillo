import mysql from 'mysql2/promise';
import { Venta, DetalleVenta, CreateVentaRequest, UpdateVentaRequest } from '../types';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'J4flores24',
  database: 'myropitacarrillochi',
  port: 3306,
});

// Obtener todas las ventas
export async function getAllVentas(): Promise<Venta[]> {
  const [rows] = await pool.query(`
    SELECT v.*, u.nombre as usuario_nombre, u.apellido as usuario_apellido
    FROM ventas v
    LEFT JOIN usuarios u ON v.usuario_id = u.id
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
    cliente: undefined, // Por ahora no incluimos cliente
    usuario: row.usuario_id ? {
      nombre: row.usuario_nombre,
      apellido: row.usuario_apellido
    } : undefined
  }));
}

// Obtener ventas por usuario
export async function getVentasByUser(userId: number): Promise<Venta[]> {
  const [rows] = await pool.query(`
    SELECT v.*, u.nombre as usuario_nombre, u.apellido as usuario_apellido
    FROM ventas v
    LEFT JOIN usuarios u ON v.usuario_id = u.id
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
    cliente: undefined, // Por ahora no incluimos cliente
    usuario: row.usuario_id ? {
      nombre: row.usuario_nombre,
      apellido: row.usuario_apellido
    } : undefined
  }));
}

// Obtener venta por ID
export async function getVentaById(id: number): Promise<Venta | null> {
  const [rows] = await pool.query(`
    SELECT v.*, u.nombre as usuario_nombre, u.apellido as usuario_apellido
    FROM ventas v
    LEFT JOIN usuarios u ON v.usuario_id = u.id
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
    cliente: undefined, // Por ahora no incluimos cliente
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
    
    // Calcular total
    const total = ventaData.detalles.reduce((sum, detalle) => {
      return sum + (detalle.cantidad * detalle.precio_unitario);
    }, 0);
    
    // Validar fecha
    const fechaVenta = ventaData.fecha_venta instanceof Date 
      ? ventaData.fecha_venta 
      : new Date(ventaData.fecha_venta);
    
    // Insertar venta
    const [ventaResult] = await connection.query(
      'INSERT INTO ventas (usuario_id, cliente_id, fecha_venta, total, metodo_pago, estado, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, ventaData.cliente_id, fechaVenta, total, ventaData.metodo_pago, 'completada', ventaData.observaciones]
    );
    
    const ventaId = (ventaResult as any).insertId;
    
    // Insertar detalles
    for (const detalle of ventaData.detalles) {
      const subtotal = detalle.cantidad * detalle.precio_unitario;
      await connection.query(
        'INSERT INTO detalles_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
        [ventaId, detalle.producto_id, detalle.cantidad, detalle.precio_unitario, subtotal]
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