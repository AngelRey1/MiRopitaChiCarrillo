// =====================================================
// SCRIPT: test_stored_procedures.js
// DESCRIPCIÓN: Script para probar los procedimientos almacenados
// FUNCIÓN: Verificar que todos los procedimientos funcionan correctamente
// =====================================================

const mysql = require('mysql2/promise');

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'J4flores24',
  database: process.env.DB_NAME || 'myropitacarrillochi',
  port: parseInt(process.env.DB_PORT || '3306')
};

async function testStoredProcedures() {
  let connection;
  
  try {
    console.log('🔌 Conectando a la base de datos...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('✅ Conexión exitosa a MySQL');
    console.log('🧪 Iniciando pruebas de procedimientos almacenados...\n');
    
    // Test 1: Verificar que los procedimientos existen
    console.log('📋 Test 1: Verificar procedimientos almacenados...');
    const [procedures] = await connection.execute(`
      SELECT ROUTINE_NAME 
      FROM INFORMATION_SCHEMA.ROUTINES 
      WHERE ROUTINE_TYPE = 'PROCEDURE' 
      AND ROUTINE_SCHEMA = ?
    `, [dbConfig.database]);
    
    const expectedProcedures = [
      'sp_crear_venta_completa',
      'sp_actualizar_stock',
      'sp_procesar_devolucion',
      'sp_estadisticas_ventas',
      'sp_productos_mas_vendidos',
      'sp_alertas_stock',
      'sp_ajustar_inventario',
      'sp_marcar_cliente_frecuente',
      'sp_clientes_frecuentes'
    ];
    
    const foundProcedures = procedures.map(p => p.ROUTINE_NAME);
    const missingProcedures = expectedProcedures.filter(p => !foundProcedures.includes(p));
    
    if (missingProcedures.length === 0) {
      console.log('✅ Todos los procedimientos almacenados están presentes');
    } else {
      console.log('❌ Procedimientos faltantes:', missingProcedures);
    }
    
    // Test 2: Verificar tablas necesarias
    console.log('\n📊 Test 2: Verificar tablas necesarias...');
    const requiredTables = [
      'producto',
      'ventas',
      'devoluciones',
      'log_stock_bajo',
      'ajustes_inventario',
      'cliente',
      'usuarios'
    ];
    
    for (const table of requiredTables) {
      try {
        const [result] = await connection.execute(`SELECT 1 FROM ${table} LIMIT 1`);
        console.log(`✅ Tabla ${table} existe`);
      } catch (error) {
        console.log(`❌ Tabla ${table} no existe o no es accesible`);
      }
    }
    
    // Test 3: Probar sp_actualizar_stock
    console.log('\n📦 Test 3: Probar sp_actualizar_stock...');
    try {
      // Obtener un producto de prueba
      const [productos] = await connection.execute('SELECT id_producto, existencia FROM producto LIMIT 1');
      
      if (productos.length > 0) {
        const producto = productos[0];
        const existenciaInicial = producto.existencia;
        
        // Probar actualización de stock
        await connection.execute(
          'CALL sp_actualizar_stock(?, ?, ?)',
          [producto.id_producto, 1, 'compra']
        );
        
        // Verificar que el stock se actualizó
        const [productoActualizado] = await connection.execute(
          'SELECT existencia FROM producto WHERE id_producto = ?',
          [producto.id_producto]
        );
        
        const nuevaExistencia = productoActualizado[0].existencia;
        
        if (nuevaExistencia === existenciaInicial + 1) {
          console.log('✅ sp_actualizar_stock funciona correctamente');
        } else {
          console.log('❌ sp_actualizar_stock no actualizó correctamente el stock');
        }
        
        // Restaurar stock original
        await connection.execute(
          'CALL sp_actualizar_stock(?, ?, ?)',
          [producto.id_producto, 1, 'venta']
        );
      } else {
        console.log('⚠️  No hay productos para probar sp_actualizar_stock');
      }
    } catch (error) {
      console.log('❌ Error probando sp_actualizar_stock:', error.message);
    }
    
    // Test 4: Probar sp_alertas_stock
    console.log('\n🚨 Test 4: Probar sp_alertas_stock...');
    try {
      const [alertas] = await connection.execute('CALL sp_alertas_stock()');
      console.log(`✅ sp_alertas_stock retornó ${alertas[0].length} productos con stock bajo`);
    } catch (error) {
      console.log('❌ Error probando sp_alertas_stock:', error.message);
    }
    
    // Test 5: Verificar log de stock bajo
    console.log('\n📝 Test 5: Verificar log de stock bajo...');
    try {
      const [logs] = await connection.execute('SELECT COUNT(*) as total FROM log_stock_bajo');
      console.log(`✅ Log de stock bajo tiene ${logs[0].total} registros`);
    } catch (error) {
      console.log('❌ Error verificando log de stock bajo:', error.message);
    }
    
    // Test 6: Probar sp_estadisticas_ventas
    console.log('\n📈 Test 6: Probar sp_estadisticas_ventas...');
    try {
      const fechaInicio = new Date();
      fechaInicio.setMonth(fechaInicio.getMonth() - 1);
      const fechaFin = new Date();
      
      const [stats] = await connection.execute(
        'CALL sp_estadisticas_ventas(?, ?)',
        [fechaInicio.toISOString().split('T')[0], fechaFin.toISOString().split('T')[0]]
      );
      
      if (stats[0].length > 0) {
        const estadisticas = stats[0][0];
        console.log('✅ sp_estadisticas_ventas funciona correctamente');
        console.log(`   - Total ventas: ${estadisticas.total_ventas || 0}`);
        console.log(`   - Total ingresos: ${estadisticas.total_ingresos || 0}`);
      } else {
        console.log('⚠️  sp_estadisticas_ventas no retornó datos (puede ser normal si no hay ventas)');
      }
    } catch (error) {
      console.log('❌ Error probando sp_estadisticas_ventas:', error.message);
    }
    
    // Test 7: Probar sp_productos_mas_vendidos
    console.log('\n🏆 Test 7: Probar sp_productos_mas_vendidos...');
    try {
      const [productosVendidos] = await connection.execute('CALL sp_productos_mas_vendidos(5)');
      console.log(`✅ sp_productos_mas_vendidos retornó ${productosVendidos[0].length} productos`);
    } catch (error) {
      console.log('❌ Error probando sp_productos_mas_vendidos:', error.message);
    }
    
    console.log('\n🎉 Pruebas completadas');
    console.log('\n📋 Resumen de procedimientos almacenados disponibles:');
    foundProcedures.forEach(proc => {
      console.log(`  - ${proc}`);
    });
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Conexión cerrada');
    }
  }
}

// Ejecutar el script si se llama directamente
if (require.main === module) {
  testStoredProcedures()
    .then(() => {
      console.log('\n✅ Pruebas completadas exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error en las pruebas:', error);
      process.exit(1);
    });
}

module.exports = testStoredProcedures; 