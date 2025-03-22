const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',       // Usuario de PostgreSQL
  host: 'localhost',      // Host de la base de datos
  database: 'compuscan',  // Nombre de la base de datos
  password: '1234',       // Contraseña del usuario
  port: 5432,             // Puerto de PostgreSQL (por defecto es 5432)
});

module.exports = pool;