import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'J4flores24',
  database: 'myropitacarrillochi',
  port: 3306,
});

export async function getAllClients() {
  const [rows] = await pool.query('SELECT * FROM cliente');
  return rows;
}

export async function createClient(client: { nombres: string; apellidos: string }) {
  const [result] = await pool.query(
    'INSERT INTO cliente (nombres, apellidos) VALUES (?, ?)',
    [client.nombres, client.apellidos]
  );
  
  // Obtener el cliente recién creado
  const [rows] = await pool.query('SELECT * FROM cliente WHERE id_cliente = ?', [(result as any).insertId]);
  return (rows as any[])[0];
}

export async function updateClient(id_cliente: number, client: { nombres: string; apellidos: string }) {
  await pool.query(
    'UPDATE cliente SET nombres = ?, apellidos = ? WHERE id_cliente = ?',
    [client.nombres, client.apellidos, id_cliente]
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