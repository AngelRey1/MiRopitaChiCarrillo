// =====================================================
// SCRIPT: setup_stored_procedures.js
// DESCRIPCIÓN: Script para crear procedimientos almacenados en la base de datos
// FUNCIÓN: Ejecutar archivos SQL individuales de procedimientos almacenados
// =====================================================

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'J4flores24',
  database: process.env.DB_NAME || 'myropitacarrillochi',
  port: parseInt(process.env.DB_PORT || '3306'),
  multipleStatements: true
};

async function setupStoredProcedures() {
  let connection;
  
  try {
    console.log('🔌 Conectando a la base de datos...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('✅ Conexión exitosa a MySQL');
    
    // Lista de archivos SQL de procedimientos almacenados
    const sqlFiles = [
      // Procedimientos principales
      'sp_crear_venta_completa.sql',
      'sp_actualizar_stock.sql',
      'sp_procesar_devolucion.sql',
      
      // Procedimientos de productos (CRUD)
      'sp_crear_producto.sql',
      'sp_actualizar_producto.sql',
      'sp_eliminar_producto.sql',
      'sp_obtener_producto.sql',
      'sp_listar_productos.sql',
      
      // Procedimientos de clientes (CRUD)
      'sp_crear_cliente.sql',
      'sp_actualizar_cliente.sql',
      'sp_eliminar_cliente.sql',
      'sp_obtener_cliente.sql',
      'sp_listar_clientes.sql',
      
      // Procedimientos de ventas (CRUD)
      'sp_obtener_venta.sql',
      'sp_listar_ventas.sql',
      'sp_eliminar_venta.sql',
      
      // Procedimientos de reportes y estadísticas
      'sp_estadisticas_ventas.sql',
      'sp_productos_mas_vendidos.sql',
      'sp_alertas_stock.sql',
      'sp_ajustar_inventario.sql',
      'sp_marcar_cliente_frecuente.sql',
      'sp_clientes_frecuentes.sql'
    ];
    
    console.log('📖 Ejecutando procedimientos almacenados...');
    
    // Ejecutar cada archivo SQL
    for (const fileName of sqlFiles) {
      try {
        const sqlFilePath = path.join(__dirname, '../database', fileName);
        const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
        
        console.log(`⚙️  Ejecutando ${fileName}...`);
        await connection.query(sqlContent);
        console.log(`✅ ${fileName} ejecutado correctamente`);
        
      } catch (error) {
        console.error(`❌ Error ejecutando ${fileName}:`, error.message);
        // Continuar con el siguiente archivo
      }
    }
    
    console.log('🎉 Procedimientos almacenados configurados');
    
    // Verificar que los procedimientos se crearon correctamente
    console.log('🔍 Verificando procedimientos creados...');
    const [procedures] = await connection.execute(`
      SELECT ROUTINE_NAME 
      FROM INFORMATION_SCHEMA.ROUTINES 
      WHERE ROUTINE_TYPE = 'PROCEDURE' 
      AND ROUTINE_SCHEMA = ?
      ORDER BY ROUTINE_NAME
    `, [dbConfig.database]);
    
    console.log('📋 Procedimientos almacenados disponibles:');
    if (procedures.length === 0) {
      console.log('  ⚠️  No se encontraron procedimientos almacenados');
    } else {
      procedures.forEach(proc => {
        console.log(`  ✅ ${proc.ROUTINE_NAME}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error durante la configuración:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexión cerrada');
    }
  }
}

// Ejecutar el script si se llama directamente
if (require.main === module) {
  setupStoredProcedures()
    .then(() => {
      console.log('✅ Configuración completada exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en la configuración:', error);
      process.exit(1);
    });
}

module.exports = setupStoredProcedures; 