const pool = require('../config/db');

const dispositivoModel = {
    getAllDispositivos: async () => {
        try {
            const query = 'SELECT * FROM dispositivo';
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error al obtener los dispositivos:', error);
            throw error;
        }
    },
    getDispositivoById: async (id) => {
        try {
            const query = 'SELECT * FROM dispositivo WHERE id = $1';
            const result = await pool.query(query, [id]);
            if (result.rows.length === 0) {
                throw new Error('Dispositivo no encontrado');
            }
            return result.rows[0];
        } catch (error) {
            console.error('Error al obtener el dispositivo:', error);
            throw error;
        }
    },
    createDispositivo: async (dispositivo) => {
        try {
            const { marca, modelo, usuario_id } = dispositivo;
            const query = `
                INSERT INTO dispositivo (marca, modelo, usuario_id)
                VALUES ($1, $2, $3)
                RETURNING *`;
            const result = await pool.query(query, [marca, modelo, usuario_id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error al crear el dispositivo:', error);
            throw error;
        }
    },
    updateDispositivo: async (id, dispositivo) => {
        try {
            const { marca, modelo, usuario_id } = dispositivo;
            const query = `
                UPDATE dispositivo
                SET marca = $1, modelo = $2, usuario_id = $3
                WHERE id = $4
                RETURNING *`;
            const result = await pool.query(query, [marca, modelo, usuario_id, id]);
            if (result.rows.length === 0) {
                throw new Error('Dispositivo no encontrado');
            }
            return result.rows[0];
        } catch (error) {
            console.error('Error al actualizar el dispositivo:', error);
            throw error;
        }
    },
    deleteDispositivo: async (id) => {
        try {
            const query = 'DELETE FROM dispositivo WHERE id = $1 RETURNING *';
            const result = await pool.query(query, [id]);
            if (result.rows.length === 0) {
                throw new Error('Dispositivo no encontrado');
            }
            return result.rows[0];
        } catch (error) {
            console.error('Error al eliminar el dispositivo:', error);
            throw error;
        }
    },
};

module.exports = dispositivoModel;