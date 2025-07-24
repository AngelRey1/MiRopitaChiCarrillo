import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'MiRopitaChiCarrillo',
  password: 'PerlaBlanca$700', // tu contraseña real
  port: 5432,
});

export async function crearVenta({ id_cliente, productos }: { id_cliente?: number, productos: Array<{ id_producto: number, cantidad: number, precio_en_venta: number }> }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const ventaRes = await client.query(
      'INSERT INTO venta (fecha_venta, id_cliente) VALUES (NOW(), $1) RETURNING id_venta',
      [id_cliente || null]
    );
    const id_venta = ventaRes.rows[0].id_venta;
    for (const prod of productos) {
      await client.query(
        'INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_en_venta) VALUES ($1, $2, $3, $4)',
        [id_venta, prod.id_producto, prod.cantidad, prod.precio_en_venta]
      );
      await client.query(
        'UPDATE producto SET stock = stock - $1 WHERE id_producto = $2',
        [prod.cantidad, prod.id_producto]
      );
    }
    await client.query('COMMIT');
    return { id_venta };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function getVentas() {
  const res = await pool.query('SELECT * FROM venta ORDER BY fecha_venta DESC');
  return res.rows;
}

export async function getVentaById(id_venta: number) {
  const ventaRes = await pool.query('SELECT * FROM venta WHERE id_venta = $1', [id_venta]);
  const detallesRes = await pool.query('SELECT * FROM detalle_venta WHERE id_venta = $1', [id_venta]);
  return { ...ventaRes.rows[0], detalles: detallesRes.rows };
} 