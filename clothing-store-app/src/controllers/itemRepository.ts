import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'MiRopitaChiCarrillo',
  password: 'PerlaBlanca$700', // tu contraseña real
  port: 5432,
});

export async function getAllProducts() {
  const res = await pool.query('SELECT * FROM producto');
  return res.rows;
}

export async function getProductById(id_producto: number) {
  const res = await pool.query('SELECT * FROM producto WHERE id_producto = $1', [id_producto]);
  return res.rows[0];
}

export async function createProduct(producto: {
  nombre: string;
  descripcion: string;
  talla: string;
  color: string;
  costo_adquisicion: number;
  precio_venta: number;
  stock: number;
  id_proveedor: number;
}) {
  const res = await pool.query(
    `INSERT INTO producto (nombre, descripcion, talla, color, costo_adquisicion, precio_venta, stock, id_proveedor)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [
      producto.nombre,
      producto.descripcion,
      producto.talla,
      producto.color,
      producto.costo_adquisicion,
      producto.precio_venta,
      producto.stock,
      producto.id_proveedor
    ]
  );
  return res.rows[0];
}

export async function updateProduct(id_producto: number, producto: {
  nombre: string;
  descripcion: string;
  talla: string;
  color: string;
  costo_adquisicion: number;
  precio_venta: number;
  stock: number;
  id_proveedor: number;
}) {
  const res = await pool.query(
    `UPDATE producto SET nombre = $2, descripcion = $3, talla = $4, color = $5, costo_adquisicion = $6, precio_venta = $7, stock = $8, id_proveedor = $9
     WHERE id_producto = $1 RETURNING *`,
    [
      id_producto,
      producto.nombre,
      producto.descripcion,
      producto.talla,
      producto.color,
      producto.costo_adquisicion,
      producto.precio_venta,
      producto.stock,
      producto.id_proveedor
    ]
  );
  return res.rows[0];
}

export async function deleteProduct(id_producto: number) {
  const res = await pool.query('DELETE FROM producto WHERE id_producto = $1 RETURNING *', [id_producto]);
  return res.rows[0];
}

export async function testConnection() {
  try {
    const res = await pool.query('SELECT 1');
    console.log('Conexión exitosa a PostgreSQL:', res.rows);
  } catch (error) {
    console.error('Error al conectar a PostgreSQL:', error);
  }
}