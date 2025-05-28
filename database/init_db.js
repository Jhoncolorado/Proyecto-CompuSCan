const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  // Configuración de la conexión a la base de datos
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
  });

  try {
    // Leer el archivo schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('Conectando a la base de datos...');
    const client = await pool.connect();
    
    console.log('Ejecutando el script SQL...');
    await client.query(schema);
    
    console.log('✅ Esquema de base de datos creado exitosamente');

    // Insertar un usuario administrador para pruebas
    const insertAdminQuery = `
      INSERT INTO usuario (
        nombre, 
        correo, 
        documento, 
        tipo_documento, 
        contrasena, 
        rol
      ) VALUES (
        'Administrador', 
        'admin@compuscansecurity.com', 
        '123456789', 
        'CC', 
        '$2b$10$YourHashedPasswordHere', 
        'admin'
      ) ON CONFLICT (correo) DO NOTHING;
    `;
    
    await client.query(insertAdminQuery);
    console.log('✅ Usuario administrador creado');
    
    // Insertar programas de prueba
    const insertProgramasQuery = `
      INSERT INTO programas (
        nombre_programa, 
        fecha_creacion, 
        fecha_actualizacion
      ) VALUES 
        ('Tecnología en Análisis y Desarrollo de Sistemas de Información', CURRENT_DATE, CURRENT_DATE),
        ('Técnico en Programación de Software', CURRENT_DATE, CURRENT_DATE)
      ON CONFLICT DO NOTHING;
    `;
    
    await client.query(insertProgramasQuery);
    console.log('✅ Programas de prueba creados');
    
    client.release();
    console.log('✅ Inicialización de la base de datos completada');
  } catch (err) {
    console.error('❌ Error al inicializar la base de datos:', err);
  } finally {
    await pool.end();
  }
}

initializeDatabase(); 