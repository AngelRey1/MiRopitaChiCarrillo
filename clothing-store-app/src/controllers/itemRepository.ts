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