import mysql from 'mysql2/promise';
import { Pedido, DetallePedido, CreatePedidoRequest, UpdatePedidoRequest } from '../types';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'J4flores24',
  database: 'myropitacarrillochi',
  port: 3306,
});

// Obtener todos los pedidos
export async function getAllPedidos(): Promise<Pedido[]> {
  const [rows] = await pool.query(`
    SELECT p.*, 
           u.nombre as usuario_nombre, u.apellido as usuario_apellido
    FROM pedidos p
    LEFT JOIN usuarios u ON p.usuario_id = u.id
    ORDER BY p.created_at DESC
  `);
  
  return (rows as any[]).map((row: any) => ({
    id: row.id,
    usuario_id: row.usuario_id,
    proveedor_id: row.proveedor_id,
    fecha_pedido: row.fecha_pedido,
    fecha_entrega_esperada: row.fecha_entrega_esperada,
    estado: row.estado,
    total: row.total,
    observaciones: row.observaciones,
    created_at: row.created_at,
    proveedor: undefined, // Por ahora no incluimos proveedor
    usuario: {
      nombre: row.usuario_nombre,
      apellido: row.usuario_apellido
    }
  }));
}

// Obtener pedidos por usuario
export async function getPedidosByUser(userId: number): Promise<Pedido[]> {
  const [rows] = await pool.query(`
    SELECT p.*, 
           u.nombre as usuario_nombre, u.apellido as usuario_apellido
    FROM pedidos p
    LEFT JOIN usuarios u ON p.usuario_id = u.id
    WHERE p.usuario_id = ?
    ORDER BY p.created_at DESC
  `, [userId]);
  
  return (rows as any[]).map((row: any) => ({
    id: row.id,
    usuario_id: row.usuario_id,
    proveedor_id: row.proveedor_id,
    fecha_pedido: row.fecha_pedido,
    fecha_entrega_esperada: row.fecha_entrega_esperada,
    estado: row.estado,
    total: row.total,
    observaciones: row.observaciones,
    created_at: row.created_at,
    proveedor: undefined, // Por ahora no incluimos proveedor
    usuario: {
      nombre: row.usuario_nombre,
      apellido: row.usuario_apellido
    }
  }));
}

// Obtener pedido por ID
export async function getPedidoById(id: number): Promise<Pedido | null> {
  const [rows] = await pool.query(`
    SELECT p.*, 
           u.nombre as usuario_nombre, u.apellido as usuario_apellido
    FROM pedidos p
    LEFT JOIN usuarios u ON p.usuario_id = u.id
    WHERE p.id = ?
  `, [id]);
  
  if ((rows as any[]).length === 0) return null;
  
  const row = (rows as any[])[0];
  return {
    id: row.id,
    usuario_id: row.usuario_id,
    proveedor_id: row.proveedor_id,
    fecha_pedido: row.fecha_pedido,
    fecha_entrega_esperada: row.fecha_entrega_esperada,
    estado: row.estado,
    total: row.total,
    observaciones: row.observaciones,
    created_at: row.created_at,
    proveedor: undefined, // Por ahora no incluimos proveedor
    usuario: {
      nombre: row.usuario_nombre,
      apellido: row.usuario_apellido
    }
  };
}

// Crear nuevo pedido
export async function createPedido(userId: number, pedidoData: CreatePedidoRequest): Promise<Pedido> {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Calcular total
    const total = pedidoData.detalles.reduce((sum, detalle) => {
      return sum + (detalle.cantidad * detalle.precio_unitario);
    }, 0);
    
    // Validar fecha
    const fechaPedido = new Date(); // Usar fecha actual
    
    // Insertar pedido
    const [pedidoResult] = await connection.query(
      'INSERT INTO pedidos (usuario_id, proveedor_id, fecha_pedido, fecha_entrega_esperada, estado, total, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, pedidoData.proveedor_id, fechaPedido, pedidoData.fecha_entrega_esperada, 'pendiente', total, pedidoData.observaciones]
    );
    
    const pedidoId = (pedidoResult as any).insertId;
    
    // Insertar detalles
    for (const detalle of pedidoData.detalles) {
      const subtotal = detalle.cantidad * detalle.precio_unitario;
      await connection.query(
        'INSERT INTO detalles_pedidos (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
        [pedidoId, detalle.producto_id, detalle.cantidad, detalle.precio_unitario, subtotal]
      );
    }
    
    await connection.commit();
    
    // Retornar el pedido creado
    const pedido = await getPedidoById(pedidoId);
    if (!pedido) {
      throw new Error('Error al recuperar el pedido creado');
    }
    return pedido;
    
  } catch (error) {
    await connection.rollback();
    console.error('Error en createPedido:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Actualizar pedido
export async function updatePedido(id: number, pedidoData: UpdatePedidoRequest): Promise<Pedido | null> {
  const [result] = await pool.query(
    'UPDATE pedidos SET estado = ?, fecha_entrega_esperada = ?, observaciones = ? WHERE id = ?',
    [pedidoData.estado, pedidoData.fecha_entrega_esperada, pedidoData.observaciones, id]
  );
  
  if ((result as any).affectedRows === 0) return null;
  
  return await getPedidoById(id);
}

// Obtener detalles de un pedido
export async function getDetallesPedido(pedidoId: number): Promise<DetallePedido[]> {
  const [rows] = await pool.query(`
    SELECT dp.*, p.nombre as producto_nombre, p.descripcion as producto_descripcion
    FROM detalles_pedidos dp
    LEFT JOIN producto p ON dp.producto_id = p.id
    WHERE dp.pedido_id = ?
  `, [pedidoId]);
  
  return (rows as any[]).map((row: any) => ({
    id: row.id,
    pedido_id: row.pedido_id,
    producto_id: row.producto_id,
    cantidad: row.cantidad,
    precio_unitario: row.precio_unitario,
    subtotal: row.subtotal,
    created_at: row.created_at,
    producto: {
      nombre: row.producto_nombre,
      descripcion: row.producto_descripcion
    }
  }));
}

// Obtener estadísticas de pedidos
export async function getPedidosStats(): Promise<{
  total_pedidos: number;
  pedidos_pendientes: number;
  pedidos_confirmados: number;
  pedidos_entregados: number;
}> {
  const [stats] = await pool.query(`
    SELECT 
      COUNT(*) as total_pedidos,
      COUNT(CASE WHEN estado = 'pendiente' THEN 1 END) as pedidos_pendientes,
      COUNT(CASE WHEN estado = 'confirmado' THEN 1 END) as pedidos_confirmados,
      COUNT(CASE WHEN estado = 'entregado' THEN 1 END) as pedidos_entregados
    FROM pedidos
  `);
  
  const row = (stats as any[])[0];
  return {
    total_pedidos: row.total_pedidos || 0,
    pedidos_pendientes: row.pedidos_pendientes || 0,
    pedidos_confirmados: row.pedidos_confirmados || 0,
    pedidos_entregados: row.pedidos_entregados || 0
  };
} 