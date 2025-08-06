// =====================================================
// ARCHIVO: database.ts
// DESCRIPCIÓN: Configuración de conexión a la base de datos MySQL
// FUNCIÓN: Manejo de conexiones, pool de conexiones y funciones de utilidad
// =====================================================

// Importar el driver de MySQL para Node.js
import mysql from 'mysql2/promise';

// =====================================================
// CONFIGURACIÓN DE LA BASE DE DATOS
// =====================================================

// Configuración de conexión usando variables de entorno
// Si no están definidas, usa valores por defecto para desarrollo local
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',           // Host de la base de datos
  user: process.env.DB_USER || 'root',                // Usuario de la base de datos
  password: process.env.DB_PASSWORD || 'J4flores24',  // Contraseña del usuario
  database: process.env.DB_NAME || 'myropitacarrillochi', // Nombre de la base de datos
  port: parseInt(process.env.DB_PORT || '3306'),      // Puerto de MySQL (por defecto 3306)
  
  // Configuraciones adicionales para optimizar el rendimiento
  acquireTimeout: 60000,                              // Tiempo máximo para obtener conexión (60 segundos)
  timeout: 60000,                                     // Tiempo máximo de timeout para consultas (60 segundos)
  reconnect: true,                                    // Reconectar automáticamente si se pierde la conexión
  charset: 'utf8mb4'                                  // Charset para soporte completo de caracteres especiales
};

// =====================================================
// POOL DE CONEXIONES
// =====================================================

// Crear un pool de conexiones para manejar múltiples conexiones simultáneas
// Esto mejora el rendimiento al reutilizar conexiones en lugar de crear nuevas
export const pool = mysql.createPool(dbConfig);

// =====================================================
// FUNCIÓN DE PRUEBA DE CONEXIÓN
// =====================================================

// Función para probar que la conexión a la base de datos funciona correctamente
// Se ejecuta al iniciar la aplicación para verificar que todo esté configurado bien
export async function testConnection() {
  try {
    // Ejecutar una consulta simple para verificar la conexión
    const [rows] = await pool.query('SELECT 1 as test');
    console.log('✅ Conexión exitosa a MySQL:', rows);
  } catch (error) {
    // Si hay error, mostrar el mensaje y lanzar la excepción
    console.error('❌ Error al conectar a MySQL:', error);
    throw error;
  }
}

// =====================================================
// FUNCIÓN DE CIERRE DE CONEXIONES
// =====================================================

// Función para cerrar todas las conexiones del pool de manera ordenada
// Se usa principalmente al cerrar la aplicación o en casos de emergencia
export async function closeConnection() {
  try {
    // Cerrar todas las conexiones del pool
    await pool.end();
    console.log('✅ Conexiones de base de datos cerradas');
  } catch (error) {
    // Si hay error al cerrar, mostrar el mensaje pero no lanzar excepción
    console.error('❌ Error al cerrar conexiones:', error);
  }
} 