const pool = require('../config/db');

const rfidModel = {
    getAllRfids: async () => {
        try {
            const query = 'SELECT * FROM rfids';
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error al obtener los rfids:', error);
            throw error;
        }
    },
    getRfidById: async (id) => {
        try {
            const query = 'SELECT * FROM rfids WHERE id = $1';
            const result = await pool.query(query, [id]);
            if (result.rows.length === 0) {
                throw new Error('RFID no encontrado');
            }
            return result.rows[0];
        } catch (error) {
            console.error('Error al obtener el rfid:', error);
            throw error;
        }
    },
    createRfid: async (rfid) => {
        try {
            const { hora_salida, hora_entrada, fecha, usuario_id } = rfid;
            const query = `
                INSERT INTO rfids (hora_salida, hora_entrada, fecha, usuario_id)
                VALUES ($1, $2, $3, $4)
                RETURNING *`;
            const result = await pool.query(query, [hora_salida, hora_entrada, fecha, usuario_id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error al crear el rfid:', error);
            throw error;
        }
    },
    updateRfid: async (id, rfid) => {
        try {
            const { hora_salida, hora_entrada, fecha, usuario_id } = rfid;
            const query = `
                UPDATE rfids
                SET hora_salida = $1, hora_entrada = $2, fecha = $3, usuario_id = $4
                WHERE id = $5
                RETURNING *`;
            const result = await pool.query(query, [hora_salida, hora_entrada, fecha, usuario_id, id]);
            if (result.rows.length === 0) {
                throw new Error('RFID no encontrado');
            }
            return result.rows[0];
        } catch (error) {
            console.error('Error al actualizar el rfid:', error);
            throw error;
        }
    },
    deleteRfid: async (id) => {
        try {
            const query = 'DELETE FROM rfids WHERE id = $1 RETURNING *';
            const result = await pool.query(query, [id]);
            if (result.rows.length === 0) {
                throw new Error('RFID no encontrado');
            }
            return result.rows[0];
        } catch (error) {
            console.error('Error al eliminar el rfid:', error);
            throw error;
        }
    },
};

module.exports = rfidModel;