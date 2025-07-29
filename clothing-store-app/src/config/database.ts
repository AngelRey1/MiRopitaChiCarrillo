import mysql from 'mysql2/promise';

// Configuración de base de datos con variables de entorno
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'J4flores24',
  database: process.env.DB_NAME || 'myropitacarrillochi',
  port: parseInt(process.env.DB_PORT || '3306'),
  // Configuraciones adicionales para producción
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  charset: 'utf8mb4'
};

// Crear pool de conexiones
export const pool = mysql.createPool(dbConfig);

// Función para probar conexión
export async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT 1 as test');
    console.log('✅ Conexión exitosa a MySQL:', rows);
  } catch (error) {
    console.error('❌ Error al conectar a MySQL:', error);
    throw error;
  }
}

// Función para cerrar conexiones
export async function closeConnection() {
  try {
    await pool.end();
    console.log('✅ Conexiones de base de datos cerradas');
  } catch (error) {
    console.error('❌ Error al cerrar conexiones:', error);
  }
} 