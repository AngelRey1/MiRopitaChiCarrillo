const mysql = require('mysql2/promise');

async function testQuery() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'J4flores24',
    database: 'myropitacarrillochi',
    port: 3306,
  });

  try {
    console.log('🔍 Probando consulta de usuario...');
    
    const username = 'admin';
    
    // Consulta exacta del userRepository
    const [rows] = await pool.query(`
      SELECT u.*, r.id as role_id, r.nombre as role_nombre, r.descripcion as role_descripcion, r.permisos
      FROM usuarios u
      LEFT JOIN usuarios_roles ur ON u.id = ur.usuario_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.username = ? AND u.activo = true
    `, [username]);
    
    console.log('📊 Resultados:');
    console.log('Número de filas:', rows.length);
    
    if (rows.length > 0) {
      console.log('Primera fila:', JSON.stringify(rows[0], null, 2));
      
      const userData = rows[0];
      const roles = [];
      
      // Procesar roles
      rows.forEach((row) => {
        if (row.role_id) {
          try {
            roles.push({
              id: row.role_id,
              nombre: row.role_nombre,
              descripcion: row.role_descripcion,
              permisos: JSON.parse(row.permisos || '[]')
            });
          } catch (error) {
            console.error('Error parsing permisos:', error);
            console.error('Permisos raw:', row.permisos);
          }
        }
      });
      
      console.log('Roles procesados:', roles);
      
      // Probar bcrypt
      const bcrypt = require('bcryptjs');
      const password = 'password123';
      const hashedPassword = userData.password;
      
      console.log('🔍 Probando bcrypt...');
      console.log('Password original:', password);
      console.log('Password hasheado:', hashedPassword);
      
      const isValid = await bcrypt.compare(password, hashedPassword);
      console.log('Password válido:', isValid);
      
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

testQuery(); 