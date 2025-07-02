const pool = require('../config/database');

// Usa dayjs con zona horaria si está disponible, si no, usa toLocaleDateString
const getFechaColombia = () => {
  try {
    // Si tienes dayjs y plugin timezone:
    // return dayjs().tz('America/Bogota').format('YYYY-MM-DD');
    // Si no, usa toLocaleDateString:
    return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
};

const asistenciaModel = {
    registrarAsistencia: async ({ id_usuario, id_ficha, estado, tipo, observacion }) => {
        const fechaHoy = getFechaColombia();
        let existe = await pool.query(
            `SELECT id FROM asistencia WHERE id_usuario = $1 AND id_ficha = $2 AND fecha = $3`,
            [id_usuario, id_ficha, fechaHoy]
        );
        if (existe.rows.length > 0) {
            let query = `UPDATE asistencia SET estado = $1, tipo = $2, observacion = $3, fecha = $4 WHERE id = $5 RETURNING *`;
            let values = [estado, tipo, observacion || null, fechaHoy, existe.rows[0].id];
            const result = await pool.query(query, values);
            return result.rows[0];
        } else {
            let query = 'INSERT INTO asistencia (id_usuario, id_ficha, estado, tipo, observacion, fecha) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
            let values = [id_usuario, id_ficha, estado, tipo, observacion || null, fechaHoy];
            const result = await pool.query(query, values);
            return result.rows[0];
        }
    },
    getAsistenciasPorFicha: async (id_ficha, fecha) => {
        const result = await pool.query(
            `SELECT * FROM asistencia WHERE id_ficha = $1 AND fecha = $2`,
            [id_ficha, fecha]
        );
        return result.rows;
    },
    getAsistenciasPorFichaYFecha: async (id_ficha, fecha) => {
        const result = await pool.query(
            `SELECT * FROM asistencia WHERE id_ficha = $1 AND fecha = $2`,
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
    getAprendicesPorFicha: async (id_ficha) => {
        const result = await pool.query(
            "SELECT * FROM usuario WHERE id_ficha = $1 AND rol = 'aprendiz'",
            [id_ficha]
        );
        return result.rows;
    },
    getAsistenciaById: async (id) => {
        const result = await pool.query('SELECT * FROM asistencia WHERE id = $1', [id]);
        return result.rows[0];
    },
    editarAsistencia: async ({ id, estado, tipo, observacion, evidencia }) => {
        let query = 'UPDATE asistencia SET estado = $1, tipo = $2, observacion = $3, evidencia = $4 WHERE id = $5 RETURNING *';
        let values = [estado, tipo, observacion, evidencia, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },
    getEstadisticasPorFicha: async (id_ficha, fecha_inicio, fecha_fin) => {
        let filtroFecha = '';
        let params = [id_ficha];
        if (fecha_inicio && fecha_fin) {
            filtroFecha = 'AND fecha BETWEEN $2 AND $3';
            params.push(fecha_inicio, fecha_fin);
        } else if (fecha_inicio) {
            filtroFecha = 'AND fecha = $2';
            params.push(fecha_inicio);
        }
        const result = await pool.query(
            `SELECT 
                COUNT(*) FILTER (WHERE estado = 'presente') AS presentes,
                COUNT(*) FILTER (WHERE estado = 'ausente') AS ausentes,
                COUNT(*) FILTER (WHERE estado = 'justificado') AS justificados,
                COUNT(*) AS total
            FROM asistencia
            WHERE id_ficha = $1 ${filtroFecha}`,
            params
        );
        const row = result.rows[0];
        let porcentaje = 0;
        if (row && row.total > 0) {
            porcentaje = Math.round((row.presentes / row.total) * 100);
        }
        return {
            presentes: parseInt(row.presentes, 10) || 0,
            ausentes: parseInt(row.ausentes, 10) || 0,
            justificados: parseInt(row.justificados, 10) || 0,
            total: parseInt(row.total, 10) || 0,
            porcentaje
        };
    },
    getHistorialPorFicha: async (id_ficha, fecha_inicio, fecha_fin) => {
        let filtroFecha = '';
        let params = [id_ficha];
        if (fecha_inicio && fecha_fin) {
            filtroFecha = 'AND fecha BETWEEN $2 AND $3';
            params.push(fecha_inicio, fecha_fin);
        } else if (fecha_inicio) {
            filtroFecha = 'AND fecha = $2';
            params.push(fecha_inicio);
        }
        const result = await pool.query(
            `SELECT a.id_usuario, u.nombre, u.documento, a.id_ficha, 
                    a.fecha,
                    a.estado, a.tipo, a.observacion
             FROM asistencia a
             JOIN usuario u ON a.id_usuario = u.id
             WHERE a.id_ficha = $1 ${filtroFecha}
             ORDER BY a.fecha ASC, u.nombre ASC`,
            params
        );
        return result.rows;
    },
};

module.exports = asistenciaModel; 