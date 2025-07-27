import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'J4flores24',
  database: 'myropitacarrillochi',
  port: 3306,
});

export async function crearVenta({ id_cliente, productos }: { id_cliente?: number, productos: Array<{ id_producto: number, cantidad: number, precio_en_venta: number }> }) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [ventaRes] = await connection.query(
      'INSERT INTO venta (fecha_venta, id_cliente) VALUES (NOW(), ?)',
      [id_cliente || null]
    );
    const id_venta = (ventaRes as any).insertId;
    for (const prod of productos) {
      await connection.query(
        'INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_en_venta) VALUES (?, ?, ?, ?)',
        [id_venta, prod.id_producto, prod.cantidad, prod.precio_en_venta]
      );
      await connection.query(
        'UPDATE producto SET existencia = existencia - ? WHERE id_producto = ?',
        [prod.cantidad, prod.id_producto]
      );
    }
    await connection.commit();
    return { id_venta };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

export async function getVentas() {
  const [rows] = await pool.query('SELECT * FROM venta ORDER BY fecha_venta DESC');
  return rows;
}

export async function getVentaById(id_venta: number) {
  const [ventaRows] = await pool.query('SELECT * FROM venta WHERE id_venta = ?', [id_venta]);
  const [detallesRows] = await pool.query('SELECT * FROM detalle_venta WHERE id_venta = ?', [id_venta]);
  return { ...(ventaRows as any[])[0], detalles: detallesRows };
} 