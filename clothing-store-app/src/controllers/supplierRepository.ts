import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'J4flores24',
  database: 'myropitacarrillochi',
  port: 3306,
});

export async function getAllSuppliers() {
  const [rows] = await pool.query('SELECT * FROM proveedor');
  return rows;
}

export async function createSupplier(supplier: { nombre: string; ciudad: string }) {
  const [result] = await pool.query(
    'INSERT INTO proveedor (nombre, ciudad) VALUES (?, ?)',
    [supplier.nombre, supplier.ciudad]
  );
  
  // Obtener el proveedor recién creado
  const [rows] = await pool.query('SELECT * FROM proveedor WHERE id_proveedor = ?', [(result as any).insertId]);
  return (rows as any[])[0];
}

export async function updateSupplier(id_proveedor: number, supplier: { nombre: string; ciudad: string }) {
  await pool.query(
    'UPDATE proveedor SET nombre = ?, ciudad = ? WHERE id_proveedor = ?',
    [supplier.nombre, supplier.ciudad, id_proveedor]
  );
  
  // Obtener el proveedor actualizado
  const [rows] = await pool.query('SELECT * FROM proveedor WHERE id_proveedor = ?', [id_proveedor]);
  return (rows as any[])[0];
}

export async function deleteSupplier(id_proveedor: number) {
  const [rows] = await pool.query('SELECT * FROM proveedor WHERE id_proveedor = ?', [id_proveedor]);
  if ((rows as any[]).length > 0) {
    await pool.query('DELETE FROM proveedor WHERE id_proveedor = ?', [id_proveedor]);
    return (rows as any[])[0];
  }
  return null;
} 