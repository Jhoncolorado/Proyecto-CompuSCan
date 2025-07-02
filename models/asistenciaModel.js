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
        const tipoRegistro = tipo || 'manual';
        const fechaHoy = getFechaColombia();
        let existe;
        if (estado === 'presente') {
            existe = await pool.query(
                `SELECT id FROM asistencia WHERE id_usuario = $1 AND id_ficha = $2 AND fecha = $3`,
                [id_usuario, id_ficha, fechaHoy]
            );
        } else {
            existe = await pool.query(
                `SELECT id FROM asistencia WHERE id_usuario = $1 AND id_ficha = $2 AND fecha = $3 AND estado IN ('ausente','justificado')`,
                [id_usuario, id_ficha, fechaHoy]
            );
        }
        if (existe.rows.length > 0) {
            // Si existe, actualiza el estado y limpia horas si no es presente
            let query, values;
            if (estado === 'presente') {
                query = `UPDATE asistencia SET estado = $1, tipo = $2, observacion = $3, hora_entrada = COALESCE(hora_entrada, NOW()), fecha = $4 WHERE id = $5 RETURNING *`;
                values = [estado, tipoRegistro, observacion || null, fechaHoy, existe.rows[0].id];
            } else {
                query = `UPDATE asistencia SET estado = $1, tipo = $2, observacion = $3, hora_entrada = NULL, hora_salida = NULL, fecha = $4 WHERE id = $5 RETURNING *`;
                values = [estado, tipoRegistro, observacion || null, fechaHoy, existe.rows[0].id];
            }
            const result = await pool.query(query, values);
            return result.rows[0];
        } else {
            // Si no existe, inserta
            let query, values;
            if (estado === 'presente') {
                query = 'INSERT INTO asistencia (id_usuario, id_ficha, hora_entrada, hora_salida, estado, tipo, observacion, fecha) VALUES ($1, $2, $3, NULL, $4, $5, $6, $7) RETURNING *';
                values = [id_usuario, id_ficha, new Date(), estado, tipoRegistro, observacion || null, fechaHoy];
            } else {
                query = 'INSERT INTO asistencia (id_usuario, id_ficha, hora_entrada, hora_salida, estado, tipo, observacion, fecha) VALUES ($1, $2, NULL, NULL, $3, $4, $5, $6) RETURNING *';
                values = [id_usuario, id_ficha, estado, tipoRegistro, observacion || null, fechaHoy];
            }
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
        console.log('getAprendicesPorFicha - id_ficha:', id_ficha);
        const result = await pool.query(
            "SELECT * FROM usuario WHERE id_ficha = $1 AND rol = 'aprendiz'",
            [id_ficha]
        );
        console.log('getAprendicesPorFicha - resultado:', result.rows);
        return result.rows;
    },
    getAsistenciaById: async (id) => {
        const result = await pool.query('SELECT * FROM asistencia WHERE id = $1', [id]);
        return result.rows[0];
    },
    editarAsistencia: async ({ id, estado, observacion, evidencia }) => {
        // Solo poner hora_entrada y hora_salida si es 'presente'
        let query, values;
        if (estado === 'presente') {
            query = 'UPDATE asistencia SET estado = $1, observacion = $2, evidencia = $3 WHERE id = $4 RETURNING *';
            values = [estado, observacion, evidencia, id];
        } else {
            query = 'UPDATE asistencia SET estado = $1, observacion = $2, evidencia = $3, hora_entrada = NULL, hora_salida = NULL WHERE id = $4 RETURNING *';
            values = [estado, observacion, evidencia, id];
        }
        const result = await pool.query(query, values);
        return result.rows[0];
    },
    // Estadísticas de asistencia por ficha y rango de fechas
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
                COUNT(*) AS total,
                COUNT(*) FILTER (WHERE LOWER(tipo) = 'rfid' AND estado = 'presente') AS rfid,
                COUNT(*) FILTER (WHERE LOWER(tipo) = 'manual') AS manual
            FROM asistencia
            WHERE id_ficha = $1 ${filtroFecha}`,
            params
        );
        // Porcentaje de asistencia
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
            porcentaje,
            rfid: parseInt(row.rfid, 10) || 0,
            manual: parseInt(row.manual, 10) || 0
        };
    },
    // Historial de asistencia por ficha y rango de fechas
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
                    a.estado, a.tipo, a.hora_entrada, a.hora_salida
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