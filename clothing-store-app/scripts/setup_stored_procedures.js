// =====================================================
// SCRIPT: setup_stored_procedures.js
// DESCRIPCIÓN: Script para crear procedimientos almacenados en la base de datos
// FUNCIÓN: Ejecutar el archivo SQL de procedimientos almacenados
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
  multipleStatements: true // Importante para ejecutar múltiples statements
};

async function setupStoredProcedures() {
  let connection;
  
  try {
    console.log('🔌 Conectando a la base de datos...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('✅ Conexión exitosa a MySQL');
    
    // Leer el archivo SQL de procedimientos almacenados
    const sqlFilePath = path.join(__dirname, '../database/stored_procedures.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('📖 Leyendo archivo de procedimientos almacenados...');
    
    // Dividir el contenido en statements individuales
    const statements = sqlContent
      .split('DELIMITER')
      .filter(stmt => stmt.trim())
      .map(stmt => stmt.replace(/\/\/\s*DELIMITER\s*;?/g, '').trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`📝 Encontrados ${statements.length} procedimientos almacenados`);
    
    // Ejecutar cada statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`⚙️  Ejecutando procedimiento ${i + 1}/${statements.length}...`);
          await connection.execute(statement);
          console.log(`✅ Procedimiento ${i + 1} ejecutado correctamente`);
        } catch (error) {
          console.error(`❌ Error ejecutando procedimiento ${i + 1}:`, error.message);
          // Continuar con el siguiente procedimiento
        }
      }
    }
    
    console.log('🎉 Todos los procedimientos almacenados han sido configurados');
    
    // Verificar que los procedimientos se crearon correctamente
    console.log('🔍 Verificando procedimientos creados...');
    const [procedures] = await connection.execute(`
      SELECT ROUTINE_NAME 
      FROM INFORMATION_SCHEMA.ROUTINES 
      WHERE ROUTINE_TYPE = 'PROCEDURE' 
      AND ROUTINE_SCHEMA = ?
    `, [dbConfig.database]);
    
    console.log('📋 Procedimientos almacenados disponibles:');
    procedures.forEach(proc => {
      console.log(`  - ${proc.ROUTINE_NAME}`);
    });
    
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