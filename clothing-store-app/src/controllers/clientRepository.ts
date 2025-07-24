import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'MiRopitaChiCarrillo',
  password: 'PerlaBlanca$700',
  port: 5432,
});

export async function getAllClients() {
  const res = await pool.query('SELECT * FROM cliente');
  return res.rows;
}

export async function createClient(client: { nombres: string; apellidos: string }) {
  const res = await pool.query(
    'INSERT INTO cliente (nombres, apellidos) VALUES ($1, $2) RETURNING *',
    [client.nombres, client.apellidos]
  );
  return res.rows[0];
}

export async function updateClient(id_cliente: number, client: { nombres: string; apellidos: string }) {
  const res = await pool.query(
    'UPDATE cliente SET nombres = $2, apellidos = $3 WHERE id_cliente = $1 RETURNING *',
    [id_cliente, client.nombres, client.apellidos]
  );
  return res.rows[0];
}

export async function deleteClient(id_cliente: number) {
  const res = await pool.query('DELETE FROM cliente WHERE id_cliente = $1 RETURNING *', [id_cliente]);
  return res.rows[0];
} 