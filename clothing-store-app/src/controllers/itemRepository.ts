import { pool } from '../config/database';

export async function getAllProducts() {
  const [rows] = await pool.query('SELECT * FROM producto');
  return rows;
}

export async function getProductById(id_producto: number) {
  const [rows] = await pool.query('SELECT * FROM producto WHERE id_producto = ?', [id_producto]);
  return (rows as any[])[0];
}

export async function createProduct(producto: {
  nombre: string;
  modelo: string;
  talla: string;
  corte: string;
  existencia: number;
  precio: number;
  en_promocion?: boolean;
}) {
  const [result] = await pool.query(
    `INSERT INTO producto (nombre, modelo, talla, corte, existencia, precio, en_promocion)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      producto.nombre,
      producto.modelo,
      producto.talla,
      producto.corte,
      producto.existencia,
      producto.precio,
      producto.en_promocion || false
    ]
  );
  
  // Obtener el producto recién creado
  const [rows] = await pool.query('SELECT * FROM producto WHERE id_producto = ?', [(result as any).insertId]);
  return (rows as any[])[0];
}

export async function updateProduct(id_producto: number, producto: {
  nombre: string;
  modelo: string;
  talla: string;
  corte: string;
  existencia: number;
  precio: number;
  en_promocion?: boolean;
}) {
  // Obtener existencia actual para calcular la diferencia
  const [currentRows] = await pool.query('SELECT existencia FROM producto WHERE id_producto = ?', [id_producto]);
  const existenciaActual = (currentRows as any[])[0]?.existencia || 0;
  const diferencia = producto.existencia - existenciaActual;
  
  // Actualizar producto
  await pool.query(
    `UPDATE producto SET nombre = ?, modelo = ?, talla = ?, corte = ?, existencia = ?, precio = ?, en_promocion = ?
     WHERE id_producto = ?`,
    [
      producto.nombre,
      producto.modelo,
      producto.talla,
      producto.corte,
      producto.existencia,
      producto.precio,
      producto.en_promocion || false,
      id_producto
    ]
  );
  
  // Si hay diferencia en existencia, usar procedimiento almacenado para actualizar stock
  if (diferencia !== 0) {
    const tipo = diferencia > 0 ? 'compra' : 'venta';
    await pool.query(
      'CALL sp_actualizar_stock(?, ?, ?)',
      [id_producto, Math.abs(diferencia), tipo]
    );
  }
  
  // Obtener el producto actualizado
  const [rows] = await pool.query('SELECT * FROM producto WHERE id_producto = ?', [id_producto]);
  return (rows as any[])[0];
}

export async function deleteProduct(id_producto: number) {
  const [rows] = await pool.query('SELECT * FROM producto WHERE id_producto = ?', [id_producto]);
  if ((rows as any[]).length > 0) {
    await pool.query('DELETE FROM producto WHERE id_producto = ?', [id_producto]);
    return (rows as any[])[0];
  }
  return null;
}