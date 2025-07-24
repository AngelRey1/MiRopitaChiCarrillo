import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'MiRopitaChiCarrillo',
  password: 'PerlaBlanca$700',
  port: 5432,
});

export async function getAllSuppliers() {
  const res = await pool.query('SELECT * FROM proveedor');
  return res.rows;
}

export async function createSupplier(supplier: { nombre: string; ciudad: string }) {
  const res = await pool.query(
    'INSERT INTO proveedor (nombre, ciudad) VALUES ($1, $2) RETURNING *',
    [supplier.nombre, supplier.ciudad]
  );
  return res.rows[0];
}

export async function updateSupplier(id_proveedor: number, supplier: { nombre: string; ciudad: string }) {
  const res = await pool.query(
    'UPDATE proveedor SET nombre = $2, ciudad = $3 WHERE id_proveedor = $1 RETURNING *',
    [id_proveedor, supplier.nombre, supplier.ciudad]
  );
  return res.rows[0];
}

export async function deleteSupplier(id_proveedor: number) {
  const res = await pool.query('DELETE FROM proveedor WHERE id_proveedor = $1 RETURNING *', [id_proveedor]);
  return res.rows[0];
} 