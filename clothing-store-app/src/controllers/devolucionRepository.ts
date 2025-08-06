import { pool } from '../config/database';
import { Devolucion, DetalleDevolucion, CreateDevolucionRequest, UpdateDevolucionRequest } from '../types';

// Obtener todas las devoluciones
export async function getAllDevoluciones(): Promise<Devolucion[]> {
  const [rows] = await pool.query(`
    SELECT d.*, u.nombre as usuario_nombre, u.apellido as usuario_apellido,
           c.id_cliente, c.nombre_cliente, c.apellido_cliente
    FROM devoluciones d
    LEFT JOIN usuarios u ON d.usuario_id = u.id
    LEFT JOIN cliente c ON d.cliente_id = c.id_cliente
    ORDER BY d.created_at DESC
  `);
  
  return (rows as any[]).map((row: any) => ({
    id: row.id,
    usuario_id: row.usuario_id,
    venta_id: row.venta_id,
    cliente_id: row.cliente_id,
    fecha_devolucion: row.fecha_devolucion,
    motivo: row.motivo,
    estado: row.estado,
    total_devolucion: row.total_devolucion,
    observaciones: row.observaciones,
    created_at: row.created_at,
    cliente: row.cliente_id ? {
      nombre: row.nombre_cliente,
      apellido: row.apellido_cliente
    } : undefined,
    usuario: row.usuario_id ? {
      nombre: row.usuario_nombre,
      apellido: row.usuario_apellido
    } : undefined
  }));
}

// Obtener devoluciones por usuario
export async function getDevolucionesByUser(userId: number): Promise<Devolucion[]> {
  const [rows] = await pool.query(`
    SELECT d.*, u.nombre as usuario_nombre, u.apellido as usuario_apellido,
           c.id_cliente, c.nombre_cliente, c.apellido_cliente
    FROM devoluciones d
    LEFT JOIN usuarios u ON d.usuario_id = u.id
    LEFT JOIN cliente c ON d.cliente_id = c.id_cliente
    WHERE d.usuario_id = ?
    ORDER BY d.created_at DESC
  `, [userId]);
  
  return (rows as any[]).map((row: any) => ({
    id: row.id,
    usuario_id: row.usuario_id,
    venta_id: row.venta_id,
    cliente_id: row.cliente_id,
    fecha_devolucion: row.fecha_devolucion,
    motivo: row.motivo,
    estado: row.estado,
    total_devolucion: row.total_devolucion,
    observaciones: row.observaciones,
    created_at: row.created_at,
    cliente: row.cliente_id ? {
      nombre: row.nombre_cliente,
      apellido: row.apellido_cliente
    } : undefined,
    usuario: row.usuario_id ? {
      nombre: row.usuario_nombre,
      apellido: row.usuario_apellido
    } : undefined
  }));
}

// Obtener devolución por ID
export async function getDevolucionById(id: number): Promise<Devolucion | null> {
  const [rows] = await pool.query(`
    SELECT d.*, u.nombre as usuario_nombre, u.apellido as usuario_apellido,
           c.id_cliente, c.nombre_cliente, c.apellido_cliente
    FROM devoluciones d
    LEFT JOIN usuarios u ON d.usuario_id = u.id
    LEFT JOIN cliente c ON d.cliente_id = c.id_cliente
    WHERE d.id = ?
  `, [id]);
  
  if ((rows as any[]).length === 0) return null;
  
  const row = (rows as any[])[0];
  return {
    id: row.id,
    usuario_id: row.usuario_id,
    venta_id: row.venta_id,
    cliente_id: row.cliente_id,
    fecha_devolucion: row.fecha_devolucion,
    motivo: row.motivo,
    estado: row.estado,
    total_devolucion: row.total_devolucion,
    observaciones: row.observaciones,
    created_at: row.created_at,
    cliente: row.cliente_id ? {
      nombre: row.nombre_cliente,
      apellido: row.apellido_cliente
    } : undefined,
    usuario: row.usuario_id ? {
      nombre: row.usuario_nombre,
      apellido: row.usuario_apellido
    } : undefined
  };
}

// Obtener ventas disponibles para devolución
export async function getVentasDisponiblesParaDevolucion(): Promise<any[]> {
  const [rows] = await pool.query(`
    SELECT 
      v.id,
      v.fecha_venta,
      v.total,
      v.metodo_pago,
      v.estado,
      c.id_cliente,
      c.nombre_cliente,
      c.apellido_cliente,
      c.telefono,
      u.nombre as vendedor_nombre,
      u.apellido as vendedor_apellido,
      COUNT(dv.id) as total_productos,
      SUM(dv.cantidad) as total_unidades
    FROM ventas v
    LEFT JOIN cliente c ON v.cliente_id = c.id_cliente
    LEFT JOIN usuarios u ON v.usuario_id = u.id
    LEFT JOIN detalles_ventas dv ON v.id = dv.venta_id
    WHERE v.estado = 'completada'
      AND v.id NOT IN (
        SELECT DISTINCT venta_id 
        FROM devoluciones 
        WHERE venta_id IS NOT NULL AND estado IN ('aprobada', 'completada')
      )
    GROUP BY v.id, v.fecha_venta, v.total, v.metodo_pago, v.estado, 
             c.id_cliente, c.nombre_cliente, c.apellido_cliente, c.telefono,
             u.nombre, u.apellido
    ORDER BY v.fecha_venta DESC
  `);
  
  return rows as any[];
}

// Obtener detalles de una venta específica para devolución
export async function getDetallesVentaParaDevolucion(ventaId: number): Promise<any> {
  // Obtener información de la venta
  const [ventaRows] = await pool.query(`
    SELECT 
      v.*,
      c.nombre_cliente,
      c.apellido_cliente,
      c.telefono,
      u.nombre as vendedor_nombre,
      u.apellido as vendedor_apellido
    FROM ventas v
    LEFT JOIN cliente c ON v.cliente_id = c.id_cliente
    LEFT JOIN usuarios u ON v.usuario_id = u.id
    WHERE v.id = ? AND v.estado = 'completada'
  `, [ventaId]);
  
  if ((ventaRows as any[]).length === 0) {
    throw new Error('Venta no encontrada o no disponible para devolución');
  }
  
  const venta = (ventaRows as any[])[0];
  
  // Obtener detalles de la venta
  const [detallesRows] = await pool.query(`
    SELECT 
      dv.*,
      p.nombre as producto_nombre,
      p.modelo,
      p.talla,
      p.corte,
      p.existencia as stock_actual
    FROM detalles_ventas dv
    JOIN producto p ON dv.producto_id = p.id_producto
    WHERE dv.venta_id = ?
  `, [ventaId]);
  
  return {
    venta: {
      id: venta.id,
      fecha_venta: venta.fecha_venta,
      total: venta.total,
      metodo_pago: venta.metodo_pago,
      estado: venta.estado,
      cliente: {
        id: venta.cliente_id,
        nombre: venta.nombre_cliente,
        apellido: venta.apellido_cliente,
        telefono: venta.telefono
      },
      vendedor: {
        nombre: venta.vendedor_nombre,
        apellido: venta.vendedor_apellido
      }
    },
    detalles: detallesRows
  };
}

// Crear nueva devolución
export async function createDevolucion(userId: number, devolucionData: CreateDevolucionRequest): Promise<Devolucion> {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Calcular total
    const total = devolucionData.detalles.reduce((sum, detalle) => {
      return sum + (detalle.cantidad_devuelta * detalle.precio_unitario);
    }, 0);
    
    // Validar fecha
    const fechaDevolucion = devolucionData.fecha_devolucion instanceof Date 
      ? devolucionData.fecha_devolucion 
      : new Date(devolucionData.fecha_devolucion);
    
    // Insertar devolución
    const [devolucionResult] = await connection.query(
      'INSERT INTO devoluciones (usuario_id, venta_id, cliente_id, fecha_devolucion, motivo, estado, total_devolucion, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, devolucionData.venta_id, devolucionData.cliente_id, fechaDevolucion, devolucionData.motivo, 'pendiente', total, devolucionData.observaciones]
    );
    
    const devolucionId = (devolucionResult as any).insertId;
    
    // Insertar detalles
    for (const detalle of devolucionData.detalles) {
      const subtotal = detalle.cantidad_devuelta * detalle.precio_unitario;
      await connection.query(
        'INSERT INTO detalles_devoluciones (devolucion_id, producto_id, cantidad_devuelta, precio_unitario, subtotal, motivo_especifico) VALUES (?, ?, ?, ?, ?, ?)',
        [devolucionId, detalle.producto_id, detalle.cantidad_devuelta, detalle.precio_unitario, subtotal, detalle.motivo_especifico]
      );
      
      // Actualizar stock del producto (devolver al inventario)
      await connection.query(
        'UPDATE producto SET existencia = existencia + ? WHERE id_producto = ?',
        [detalle.cantidad_devuelta, detalle.producto_id]
      );
    }
    
    await connection.commit();
    
    // Retornar la devolución creada
    const devolucion = await getDevolucionById(devolucionId);
    if (!devolucion) {
      throw new Error('Error al recuperar la devolución creada');
    }
    return devolucion;
    
  } catch (error) {
    await connection.rollback();
    console.error('Error en createDevolucion:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Actualizar devolución
export async function updateDevolucion(id: number, devolucionData: UpdateDevolucionRequest): Promise<Devolucion | null> {
  const [result] = await pool.query(
    'UPDATE devoluciones SET estado = ?, observaciones = ? WHERE id = ?',
    [devolucionData.estado, devolucionData.observaciones, id]
  );
  
  if ((result as any).affectedRows === 0) return null;
  
  return await getDevolucionById(id);
}

// Obtener detalles de una devolución
export async function getDetallesDevolucion(devolucionId: number): Promise<DetalleDevolucion[]> {
  const [rows] = await pool.query(`
    SELECT dd.*, p.nombre as producto_nombre, p.modelo, p.talla
    FROM detalles_devoluciones dd
    JOIN producto p ON dd.producto_id = p.id_producto
    WHERE dd.devolucion_id = ?
  `, [devolucionId]);
  
  return (rows as any[]).map((row: any) => ({
    id: row.id,
    devolucion_id: row.devolucion_id,
    producto_id: row.producto_id,
    cantidad_devuelta: row.cantidad_devuelta,
    precio_unitario: row.precio_unitario,
    subtotal: row.subtotal,
    motivo_especifico: row.motivo_especifico,
    created_at: row.created_at,
    producto: {
      nombre: row.producto_nombre,
      modelo: row.modelo,
      talla: row.talla
    }
  }));
}

// Obtener devoluciones por venta
export async function getDevolucionesByVenta(ventaId: number): Promise<Devolucion[]> {
  const [rows] = await pool.query(`
    SELECT d.*, 
           c.nombre_cliente as cliente_nombre, c.apellido_cliente as cliente_apellido,
           u.nombre as usuario_nombre, u.apellido as usuario_apellido
    FROM devoluciones d
    LEFT JOIN cliente c ON d.cliente_id = c.id_cliente
    LEFT JOIN usuarios u ON d.usuario_id = u.id
    WHERE d.venta_id = ?
    ORDER BY d.fecha_devolucion DESC
  `, [ventaId]);
  
  return (rows as any[]).map((row: any) => ({
    id: row.id,
    usuario_id: row.usuario_id,
    venta_id: row.venta_id,
    cliente_id: row.cliente_id,
    fecha_devolucion: row.fecha_devolucion,
    motivo: row.motivo,
    estado: row.estado,
    total_devolucion: row.total_devolucion,
    observaciones: row.observaciones,
    created_at: row.created_at,
    cliente: row.cliente_id ? {
      nombre: row.cliente_nombre,
      apellido: row.cliente_apellido
    } : undefined,
    usuario: {
      nombre: row.usuario_nombre,
      apellido: row.usuario_apellido
    }
  }));
}

// Obtener estadísticas de devoluciones
export async function getDevolucionesStats(): Promise<{
  total_devoluciones: number;
  devoluciones_pendientes: number;
  devoluciones_aprobadas: number;
  devoluciones_rechazadas: number;
  total_monto_devoluciones: number;
}> {
  const [stats] = await pool.query(`
    SELECT 
      COUNT(*) as total_devoluciones,
      COUNT(CASE WHEN estado = 'pendiente' THEN 1 END) as devoluciones_pendientes,
      COUNT(CASE WHEN estado = 'aprobada' THEN 1 END) as devoluciones_aprobadas,
      COUNT(CASE WHEN estado = 'rechazada' THEN 1 END) as devoluciones_rechazadas,
      SUM(total_devolucion) as total_monto_devoluciones
    FROM devoluciones
  `);
  
  const row = (stats as any[])[0];
  return {
    total_devoluciones: row.total_devoluciones || 0,
    devoluciones_pendientes: row.devoluciones_pendientes || 0,
    devoluciones_aprobadas: row.devoluciones_aprobadas || 0,
    devoluciones_rechazadas: row.devoluciones_rechazadas || 0,
    total_monto_devoluciones: row.total_monto_devoluciones || 0
  };
} 