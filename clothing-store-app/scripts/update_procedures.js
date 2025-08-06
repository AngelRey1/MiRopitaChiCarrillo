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

async function updateProcedures() {
  let connection;
  
  try {
    console.log('🔌 Conectando a la base de datos...');
    connection = await mysql.createConnection(dbConfig);
    
    // Actualizar sp_actualizar_stock
    console.log('⚙️  Actualizando sp_actualizar_stock...');
    await connection.query('DROP PROCEDURE IF EXISTS sp_actualizar_stock');
    const stockContent = fs.readFileSync(path.join(__dirname, '../database/sp_actualizar_stock.sql'), 'utf8');
    await connection.query(stockContent);
    console.log('✅ sp_actualizar_stock actualizado');
    
    // Actualizar sp_alertas_stock
    console.log('⚙️  Actualizando sp_alertas_stock...');
    await connection.query('DROP PROCEDURE IF EXISTS sp_alertas_stock');
    const alertasContent = fs.readFileSync(path.join(__dirname, '../database/sp_alertas_stock.sql'), 'utf8');
    await connection.query(alertasContent);
    console.log('✅ sp_alertas_stock actualizado');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

updateProcedures(); 