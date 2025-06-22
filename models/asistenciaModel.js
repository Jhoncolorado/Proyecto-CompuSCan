const pool = require('../config/database');

const asistenciaModel = {
    registrarAsistencia: async ({ id_usuario, id_ficha, fecha, estado, tipo, motivo, observacion }) => {
        const tipoRegistro = tipo || 'manual';
        // Verificar si ya existe asistencia para ese usuario, ficha y fecha
        const existe = await pool.query(
            'SELECT id FROM asistencia WHERE id_usuario = $1 AND id_ficha = $2 AND fecha = $3',
            [id_usuario, id_ficha, fecha]
        );
        if (existe.rows.length > 0) {
            // Si existe, actualiza el estado, tipo, motivo y observacion
            const result = await pool.query(
                'UPDATE asistencia SET estado = $1, tipo = $2, motivo = $3, observacion = $4 WHERE id = $5 RETURNING *',
                [estado, tipoRegistro, motivo || null, observacion || null, existe.rows[0].id]
            );
            return result.rows[0];
        } else {
            // Si no existe, inserta
            const result = await pool.query(
                'INSERT INTO asistencia (id_usuario, id_ficha, fecha, estado, tipo, motivo, observacion) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [id_usuario, id_ficha, fecha, estado, tipoRegistro, motivo || null, observacion || null]
            );
            return result.rows[0];
        }
    },
    getAsistenciasPorFicha: async (id_ficha, fecha) => {
        const result = await pool.query(
            'SELECT * FROM asistencia WHERE id_ficha = $1 AND fecha = $2',
            [id_ficha, fecha]
        );
        return result.rows;
    },
    getAsistenciasPorFichaYFecha: async (id_ficha, fecha) => {
        const result = await pool.query(
            'SELECT * FROM asistencia WHERE id_ficha = $1 AND fecha = $2',
            [id_ficha, fecha]
        );
        return result.rows;
    },
    getAprendicesPorInstructor: async (id_instructor) => {
        const result = await pool.query(
            `SELECT u.*
             FROM usuario u
             JOIN instructor_ficha ifi ON u.id_ficha = ifi.id_ficha
             WHERE ifi.id_instructor = $1 AND u.rol = 'aprendiz'`,
            [id_instructor]
        );
        return result.rows;
    },
};

module.exports = asistenciaModel; 