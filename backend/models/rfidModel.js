const pool = require('../config/db');

const rfidModel = {
    getAllRfids: async () => {
        const query = 'SELECT * FROM rfid';
        const result = await pool.query(query);
        return result.rows;
    },
    getRfidById: async (id) => {
        const query = 'SELECT * FROM rfid WHERE idrfid = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
    createRfid: async (rfid) => {
        const { hora_salida, hora_entrada, fecha, usuario_id } = rfid;
        const query = `
            INSERT INTO rfid (hora_salida, hora_entrada, fecha, usuario_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *`;
        const result = await pool.query(query, [hora_salida, hora_entrada, fecha, usuario_id]);
        return result.rows[0];
    },
    updateRfid: async (id, rfid) => {
        const { hora_salida, hora_entrada, fecha, usuario_id } = rfid;
        const query = `
            UPDATE rfid
            SET hora_salida = $1, hora_entrada = $2, fecha = $3, usuario_id = $4
            WHERE idrfid = $5
            RETURNING *`;
        const result = await pool.query(query, [hora_salida, hora_entrada, fecha, usuario_id, id]);
        return result.rows[0];
    },
    deleteRfid: async (id) => {
        const query = 'DELETE FROM rfid WHERE idrfid = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
};

module.exports = rfidModel;