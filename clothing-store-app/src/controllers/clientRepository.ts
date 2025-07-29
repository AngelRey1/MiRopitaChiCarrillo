import { pool } from '../config/database';

export async function getAllClients() {
  const [rows] = await pool.query('SELECT * FROM cliente');
  return rows;
}

export async function createClient(client: { nombre_cliente: string; apellido_cliente: string }) {
  const [result] = await pool.query(
    'INSERT INTO cliente (nombre_cliente, apellido_cliente) VALUES (?, ?)',
    [client.nombre_cliente, client.apellido_cliente]
  );
  
  // Obtener el cliente recién creado
  const [rows] = await pool.query('SELECT * FROM cliente WHERE id_cliente = ?', [(result as any).insertId]);
  return (rows as any[])[0];
}

export async function updateClient(id_cliente: number, client: { nombre_cliente: string; apellido_cliente: string }) {
  await pool.query(
    'UPDATE cliente SET nombre_cliente = ?, apellido_cliente = ? WHERE id_cliente = ?',
    [client.nombre_cliente, client.apellido_cliente, id_cliente]
  );
  
  // Obtener el cliente actualizado
  const [rows] = await pool.query('SELECT * FROM cliente WHERE id_cliente = ?', [id_cliente]);
  return (rows as any[])[0];
}

export async function deleteClient(id_cliente: number) {
  const [rows] = await pool.query('SELECT * FROM cliente WHERE id_cliente = ?', [id_cliente]);
  if ((rows as any[]).length > 0) {
    await pool.query('DELETE FROM cliente WHERE id_cliente = ?', [id_cliente]);
    return (rows as any[])[0];
  }
  return null;
} 