const { Client } = require('pg');
// Intentar cargar variables de entorno si no se han cargado
try {
  require('dotenv').config();
} catch (error) {
  console.log('Dotenv no pudo cargar el archivo .env, usando valores por defecto');
}

// Crear la base de datos si no existe
async function createDatabaseIfNotExists() {
  // Conexión a PostgreSQL sin especificar una base de datos
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD || '1234',
    port: process.env.DB_PORT || 5432,
    database: 'postgres' // Base de datos por defecto de PostgreSQL
  });

  // El nombre de la base de datos a crear
  const dbName = process.env.DB_NAME || 'compuscansecurity';

  try {
    await client.connect();
    console.log('Conectado a PostgreSQL para verificar la base de datos');
    
    // Verificar si la base de datos existe
    const checkResult = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = '${dbName}'`
    );
    
    if (checkResult.rows.length === 0) {
      console.log(`La base de datos "${dbName}" no existe. Creándola...`);
      
      // Crear la base de datos
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Base de datos "${dbName}" creada exitosamente`);
    } else {
      console.log(`La base de datos "${dbName}" ya existe`);
    }
  } catch (err) {
    console.error('Error al verificar o crear la base de datos:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Ejecutar la función
createDatabaseIfNotExists().then(() => {
  console.log('Proceso de verificación de base de datos completado');
}); 