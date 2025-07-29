import { pool } from '../config/database';

export async function getAllSuppliers() {
  const [rows] = await pool.query('SELECT * FROM proveedor');
  return rows;
}

export async function createSupplier(supplier: { 
  nombre: string; 
  ciudad: string; 
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
  contacto?: string | null;
}) {
  const [result] = await pool.query(
    'INSERT INTO proveedor (nombre, ciudad, telefono, email, direccion, contacto) VALUES (?, ?, ?, ?, ?, ?)',
    [supplier.nombre, supplier.ciudad, supplier.telefono, supplier.email, supplier.direccion, supplier.contacto]
  );
  
  // Obtener el proveedor recién creado
  const [rows] = await pool.query('SELECT * FROM proveedor WHERE id_proveedor = ?', [(result as any).insertId]);
  return (rows as any[])[0];
}

export async function updateSupplier(id_proveedor: number, supplier: { 
  nombre: string; 
  ciudad: string; 
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
  contacto?: string | null;
}) {
  await pool.query(
    'UPDATE proveedor SET nombre = ?, ciudad = ?, telefono = ?, email = ?, direccion = ?, contacto = ? WHERE id_proveedor = ?',
    [supplier.nombre, supplier.ciudad, supplier.telefono, supplier.email, supplier.direccion, supplier.contacto, id_proveedor]
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