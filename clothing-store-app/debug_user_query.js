const mysql = require('mysql2/promise');

async function debugUserQuery() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'J4flores24',
    database: 'myropitacarrillochi',
    port: 3306,
  });

  try {
    console.log('🔍 Debuggeando consulta de usuario...');
    
    const username = 'admin';
    
    // Consulta exacta del userRepository
    const [rows] = await pool.query(`
      SELECT u.*, r.id as role_id, r.nombre as role_nombre, r.descripcion as role_descripcion, r.permisos
      FROM usuarios u
      LEFT JOIN usuarios_roles ur ON u.id = ur.usuario_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.username = ? AND u.activo = true
    `, [username]);
    
    console.log('📊 Resultados de la consulta:');
    console.log('Número de filas:', rows.length);
    console.log('Primera fila:', JSON.stringify(rows[0], null, 2));
    
    if (rows.length > 0) {
      const userData = rows[0];
      const roles = [];
      
      // Procesar roles como en el código original
      rows.forEach((row) => {
        if (row.role_id) {
          roles.push({
            id: row.role_id,
            nombre: row.role_nombre,
            descripcion: row.role_descripcion,
            permisos: JSON.parse(row.permisos || '[]')
          });
        }
      });
      
      console.log('👤 Datos del usuario procesados:');
      console.log('ID:', userData.id);
      console.log('Username:', userData.username);
      console.log('Password:', userData.password ? 'Presente' : 'Ausente');
      console.log('Roles:', roles);
      
    } else {
      console.log('❌ No se encontró el usuario');
    }
    
  } catch (error) {
    console.error('💥 Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

debugUserQuery(); 