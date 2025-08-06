const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'J4flores24',
  database: 'myropitacarrillochi',
  port: 3306
};

async function fixListarVentas() {
  let connection;
  
  try {
    console.log('🔌 Conectando a la base de datos...');
    connection = await mysql.createConnection(dbConfig);
    
    const sqlFilePath = path.join(__dirname, '../database/sp_listar_ventas.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('⚙️  Ejecutando sp_listar_ventas.sql...');
    await connection.query(sqlContent);
    console.log('✅ sp_listar_ventas.sql ejecutado correctamente');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixListarVentas(); 