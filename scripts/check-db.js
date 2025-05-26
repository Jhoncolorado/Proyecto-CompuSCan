require('dotenv').config();
const pool = require('../config/database');

async function checkDatabase() {
  try {
    // Verificar conexión
    console.log('🔍 Verificando conexión a la base de datos...');
    const client = await pool.connect();
    console.log('✅ Conexión exitosa a la base de datos');

    // Verificar si existe la tabla usuario
    console.log('\n🔍 Verificando estructura de la base de datos...');
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'usuario'
      );
    `);

    if (tableCheck.rows[0].exists) {
      console.log('✅ La tabla usuario existe');
      
      // Verificar estructura de la tabla
      const columns = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'usuario';
      `);
      
      console.log('\n📋 Estructura de la tabla usuario:');
      columns.rows.forEach(col => {
        console.log(`- ${col.column_name}: ${col.data_type}`);
      });

      // Verificar si hay usuarios
      const userCount = await client.query('SELECT COUNT(*) FROM usuario');
      console.log(`\n👥 Número de usuarios en la base de datos: ${userCount.rows[0].count}`);
    } else {
      console.log('❌ La tabla usuario no existe');
    }

    client.release();
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n⚠️ No se pudo conectar a PostgreSQL. Verifica que:');
      console.log('1. PostgreSQL esté instalado y corriendo');
      console.log('2. Las credenciales en el archivo .env sean correctas');
      console.log('3. El puerto especificado esté disponible');
    }
  } finally {
    pool.end();
  }
}

checkDatabase(); 