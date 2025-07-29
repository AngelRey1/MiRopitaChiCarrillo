const mysql = require('mysql2/promise');

async function testDatabase() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'J4flores24',
    database: 'myropitacarrillochi',
    port: 3306,
  });

  try {
    console.log('🔍 Verificando tablas...');
    
    // Verificar si existe la tabla usuarios
    const [tables] = await pool.query('SHOW TABLES');
    console.log('Tablas existentes:', tables.map(t => Object.values(t)[0]));
    
    // Verificar usuarios
    const [users] = await pool.query('SELECT username, nombre, apellido FROM usuarios');
    console.log('Usuarios encontrados:', users);
    
    // Verificar roles
    const [roles] = await pool.query('SELECT nombre, descripcion FROM roles');
    console.log('Roles encontrados:', roles);
    
    // Verificar usuarios_roles
    const [userRoles] = await pool.query(`
      SELECT u.username, r.nombre as role_name 
      FROM usuarios_roles ur 
      JOIN usuarios u ON ur.usuario_id = u.id 
      JOIN roles r ON ur.role_id = r.id
    `);
    console.log('Asignaciones de roles:', userRoles);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

testDatabase(); 