const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function fixPassword() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'J4flores24',
    database: 'myropitacarrillochi',
    port: 3306,
  });

  try {
    console.log('🔧 Generando nuevo hash para password123...');
    
    const password = 'password123';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    console.log('🔧 Hash generado:', hashedPassword);
    
    // Verificar que el hash funciona
    const isValid = await bcrypt.compare(password, hashedPassword);
    console.log('🔧 Verificación del hash:', isValid);
    
    // Actualizar todos los usuarios con el nuevo hash
    console.log('🔧 Actualizando passwords en la base de datos...');
    
    await pool.query(`
      UPDATE usuarios 
      SET password = ? 
      WHERE username IN ('admin', 'vendedor', 'inventario', 'envios', 'devoluciones', 'rrhh')
    `, [hashedPassword]);
    
    console.log('✅ Passwords actualizados correctamente');
    
    // Verificar que funciona
    const [users] = await pool.query('SELECT username, password FROM usuarios WHERE username = ?', ['admin']);
    if (users.length > 0) {
      const testPassword = await bcrypt.compare('password123', users[0].password);
      console.log('✅ Verificación final:', testPassword);
    }
    
  } catch (error) {
    console.error('💥 Error:', error.message);
  } finally {
    await pool.end();
  }
}

fixPassword(); 