const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'compuscansecurity',
    password: process.env.DB_PASSWORD || '1234',
    port: process.env.DB_PORT || 5432,
});

// Agregar manejo de errores y logging
pool.on('error', (err) => {
    console.error('Error inesperado en el pool de PostgreSQL', err);
});

// Función para probar la conexión
const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ Conexión exitosa a la base de datos PostgreSQL');
        
        // Verificar que podemos hacer operaciones
        const result = await client.query('SELECT NOW()');
        console.log('✅ Base de datos responde correctamente:', result.rows[0]);
        
        // Verificar la tabla dispositivo
        const tableCheck = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'dispositivo'
            );
        `);
        console.log('✅ Estado de la tabla dispositivo:', tableCheck.rows[0].exists ? 'Existe' : 'No existe');
        
        client.release();
    } catch (err) {
        console.error('❌ Error al conectar con la base de datos:', err);
        throw err;
    }
};

// Ejecutar prueba de conexión
testConnection().catch(console.error);

module.exports = pool; 