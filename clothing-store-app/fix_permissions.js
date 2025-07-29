const mysql = require('mysql2/promise');

async function fixPermissions() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'J4flores24',
    database: 'myropitacarrillochi',
    port: 3306,
  });

  try {
    console.log('🔧 Corrigiendo permisos en la base de datos...');
    
    // Actualizar permisos para que sean JSON válido
    await pool.query(`
      UPDATE roles 
      SET permisos = '["*"]' 
      WHERE nombre = 'admin'
    `);
    
    await pool.query(`
      UPDATE roles 
      SET permisos = '["ventas", "clientes", "productos"]' 
      WHERE nombre = 'vendedor'
    `);
    
    await pool.query(`
      UPDATE roles 
      SET permisos = '["productos", "pedidos", "proveedores"]' 
      WHERE nombre = 'inventario'
    `);
    
    await pool.query(`
      UPDATE roles 
      SET permisos = '["envios", "pedidos"]' 
      WHERE nombre = 'envios'
    `);
    
    await pool.query(`
      UPDATE roles 
      SET permisos = '["devoluciones", "ventas"]' 
      WHERE nombre = 'devoluciones'
    `);
    
    await pool.query(`
      UPDATE roles 
      SET permisos = '["usuarios", "asistencias", "turnos"]' 
      WHERE nombre = 'rrhh'
    `);
    
    console.log('✅ Permisos corregidos correctamente');
    
    // Verificar que funciona
    const [roles] = await pool.query('SELECT nombre, permisos FROM roles');
    console.log('📊 Roles actualizados:');
    roles.forEach(role => {
      console.log(`${role.nombre}: ${role.permisos}`);
    });
    
  } catch (error) {
    console.error('💥 Error:', error.message);
  } finally {
    await pool.end();
  }
}

fixPermissions(); 