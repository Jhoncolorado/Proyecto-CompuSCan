const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',      // Usuario de PostgreSQL
  host: process.env.DB_HOST || 'localhost',     // Host de la base de datos
  database: process.env.DB_NAME || 'compuscansecurity', // Nombre de la base de datos
  password: process.env.DB_PASSWORD || '1234',  // Contraseña del usuario
  port: process.env.DB_PORT || 5432,            // Puerto de PostgreSQL (por defecto es 5432)
});

module.exports = pool;