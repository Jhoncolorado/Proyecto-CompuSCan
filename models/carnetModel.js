const pool = require('../config/db');

const carnetModel = {
    // Para RFID: Buscar por ID (o número si prefieres)
    getCarnetById: async (id) => {
        const query = `
            SELECT c.*, u.nombre, u.documento 
            FROM carnet c
            JOIN usuario u ON c.id_usuario = u.id
            WHERE c.id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // Para admin: Actualizar estado (activo/inactivo)
    updateCarnet: async (id, { activo }) => {
        const query = `
            UPDATE carnet
            SET activo = $1
            WHERE id = $2
            RETURNING *`;
        const result = await pool.query(query, [activo, id]);
        return result.rows[0];
    }
};

module.exports = carnetModel;