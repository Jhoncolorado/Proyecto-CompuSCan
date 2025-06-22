const xlsx = require('xlsx');
const path = require('path');
const { Pool } = require('pg');

// Configura tu conexión PostgreSQL aquí
const pool = new Pool({
  user: 'postgres', 
  host: 'localhost',
  database: 'compuscansecurity',
  password: '1234', 
  port: 5432,
});

// Ruta del archivo Excel
const filePath = path.join(__dirname, 'Reporte Asistencia ().xlsx');

// Leer el archivo
const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet);

// Nombres de columna según tu Excel
const COLUMNA_TIPO_DOC = 'Tipo de Documento';
const COLUMNA_DOCUMENTO = 'Número de Documento';
const COLUMNA_NOMBRE = 'Nombre';
const COLUMNA_APELLIDOS = 'Apellidos';
const COLUMNA_FICHA = 'Ficha';

async function importarAprendices() {
  for (const row of data) {
    const tipo_doc = row[COLUMNA_TIPO_DOC];
    const documento = row[COLUMNA_DOCUMENTO];
    const nombre = row[COLUMNA_NOMBRE];
    const apellidos = row[COLUMNA_APELLIDOS];
    const id_ficha = row[COLUMNA_FICHA];

    // Validar que documento, nombre, apellidos e id_ficha existan
    if (!documento || !nombre || !apellidos || !id_ficha) {
      console.log('Fila ignorada por datos incompletos:', row);
      continue;
    }

    const nombre_completo = `${nombre} ${apellidos}`;

    // Verifica si el usuario ya existe
    const existe = await pool.query(
      'SELECT id FROM usuario WHERE documento = $1',
      [documento]
    );
    if (existe.rows.length > 0) {
      console.log(`Ya existe: ${nombre_completo} (${documento})`);
      continue;
    }

    // Inserta el usuario usando el id_ficha de la fila
    await pool.query(
      'INSERT INTO usuario (nombre, documento, tipo_documento, id_ficha, rol) VALUES ($1, $2, $3, $4, $5)',
      [nombre_completo, documento, tipo_doc, id_ficha, 'aprendiz']
    );
    console.log(`Importado: ${nombre_completo} (${documento}) en ficha ${id_ficha}`);
  }
  console.log('Importación finalizada.');
  await pool.end();
  process.exit();
}

importarAprendices().catch(err => {
  console.error('Error en la importación:', err);
  process.exit(1);
}); 