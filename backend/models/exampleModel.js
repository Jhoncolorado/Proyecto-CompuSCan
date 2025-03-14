const pool = require('../config/db');

const exampleModel = {
    getExampleData: async () => {
        try {
            const query = 'SELECT * FROM dispositivo'; // Cambia "example_table" por el nombre de tu tabla
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error en el modelo:', error);
            throw error;
        }
    },
};

module.exports = exampleModel;