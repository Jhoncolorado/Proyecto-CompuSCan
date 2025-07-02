const asistenciaModel = require('../models/asistenciaModel');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

const asistenciaController = {
    registrarAsistencia: async (req, res) => {
        try {
            const { id_usuario, id_ficha, estado, tipo, observacion } = req.body;
            const asistencia = await asistenciaModel.registrarAsistencia({ id_usuario, id_ficha, estado, tipo, observacion });
            res.status(201).json(asistencia);
        } catch (error) {
            console.error('Error en registrarAsistencia:', error);
            res.status(500).json({ error: 'Error al registrar asistencia', details: error.message });
        }
    },
    getAsistenciasPorFicha: async (req, res) => {
        try {
            const { id_ficha, fecha } = req.query;
            const asistencias = await asistenciaModel.getAsistenciasPorFicha(id_ficha, fecha);
            res.json(asistencias);
        } catch (error) {
            console.error('Error en getAsistenciasPorFicha:', error);
            res.status(500).json({ error: 'Error al obtener asistencias', details: error.message });
        }
    },
    getAsistenciasPorFichaYFecha: async (req, res) => {
        try {
            const { id_ficha, fecha } = req.query;
            const asistencias = await asistenciaModel.getAsistenciasPorFichaYFecha(id_ficha, fecha);
            res.json(asistencias);
        } catch (error) {
            console.error('Error en getAsistenciasPorFichaYFecha:', error);
            res.status(500).json({ error: 'Error al obtener asistencias', details: error.message });
        }
    },
    getAprendicesPorInstructor: async (req, res) => {
        try {
            const { id_instructor } = req.params;
            const aprendices = await asistenciaModel.getAprendicesPorInstructor(id_instructor);
            res.json(aprendices);
        } catch (error) {
            console.error('Error en getAprendicesPorInstructor:', error);
            res.status(500).json({ error: 'Error al obtener aprendices', details: error.message });
        }
    },
    getAprendicesPorFicha: async (req, res) => {
        try {
            const { id_ficha } = req.params;
            console.log('id_ficha recibido:', id_ficha);
            const aprendices = await asistenciaModel.getAprendicesPorFicha(id_ficha);
            console.log('Aprendices encontrados:', aprendices);
            res.json(aprendices);
        } catch (error) {
            console.error('Error en getAprendicesPorFicha:', error);
            res.status(500).json({ error: 'Error al obtener aprendices', details: error.message });
        }
    },
    editarAsistencia: async (req, res) => {
        try {
            const id = req.params.id;
            const { estado, observacion } = req.body;
            let evidencia = null;
            if (req.file) {
                evidencia = req.file.filename;
            }
            const asistenciaActual = await asistenciaModel.getAsistenciaById(id);
            if (!asistenciaActual) {
                return res.status(404).json({ error: 'Asistencia no encontrada' });
            }
            if (evidencia && asistenciaActual.evidencia) {
                const oldPath = path.join(__dirname, '../uploads', asistenciaActual.evidencia);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            const updated = await asistenciaModel.editarAsistencia({
                id,
                estado: estado || asistenciaActual.estado,
                observacion: observacion || asistenciaActual.observacion,
                evidencia: evidencia || asistenciaActual.evidencia
            });
            res.json(updated);
        } catch (error) {
            console.error('Error en editarAsistencia:', error);
            res.status(500).json({ error: 'Error al editar asistencia', details: error.message });
        }
    },
    getEstadisticasPorFicha: async (req, res) => {
        try {
            const { id_ficha, fecha_inicio, fecha_fin } = req.query;
            if (!id_ficha) {
                return res.status(400).json({ error: 'id_ficha es requerido' });
            }
            const estadisticas = await asistenciaModel.getEstadisticasPorFicha(id_ficha, fecha_inicio, fecha_fin);
            res.json(estadisticas);
        } catch (error) {
            console.error('Error en getEstadisticasPorFicha:', error);
            res.status(500).json({ error: 'Error al obtener estadísticas', details: error.message });
        }
    },
    getHistorialPorFicha: async (req, res) => {
        try {
            const { id_ficha, fecha_inicio, fecha_fin } = req.query;
            if (!id_ficha) {
                return res.status(400).json({ error: 'id_ficha es requerido' });
            }
            // Consultar el horario de la ficha
            const fichaResult = await require('../config/database').query(
                'SELECT hora_inicio_clase, hora_fin_clase FROM ficha WHERE id_ficha = $1',
                [id_ficha]
            );
            if (!fichaResult.rows.length) {
                return res.status(404).json({ error: 'Ficha no encontrada' });
            }
            const HORA_INICIO_CLASE = fichaResult.rows[0].hora_inicio_clase || '07:00';
            const HORA_FIN_CLASE = fichaResult.rows[0].hora_fin_clase || '12:00';

            const historial = await asistenciaModel.getHistorialPorFicha(id_ficha, fecha_inicio, fecha_fin);

            // Función para calcular horas asistidas (limitada al horario de clase)
            function calcularHorasAsistidas(entrada, salida, inicioClase, finClase, fecha) {
                if (!entrada) return 0;
                // Usa SIEMPRE la fecha base YYYY-MM-DD para todos los Date
                const fechaBase = typeof fecha === 'string' ? fecha.slice(0, 10) : fecha;
                const entradaReal = new Date(`${fechaBase}T${entrada}`);
                const salidaReal = salida ? new Date(`${fechaBase}T${salida}`) : null;
                const inicioClaseDate = new Date(`${fechaBase}T${inicioClase}:00`);
                const finClaseDate = new Date(`${fechaBase}T${finClase}:00`);
                // Hora de entrada efectiva
                const entradaEfectiva = entradaReal < inicioClaseDate ? inicioClaseDate : entradaReal;
                // Hora de salida efectiva
                let salidaEfectiva;
                if (!salidaReal) {
                    salidaEfectiva = finClaseDate;
                } else if (salidaReal > finClaseDate) {
                    salidaEfectiva = finClaseDate;
                } else {
                    salidaEfectiva = salidaReal;
                }
                // Calcula la diferencia en horas
                const horas = (salidaEfectiva - entradaEfectiva) / (1000 * 60 * 60);
                return Math.max(0, horas);
            }

            // Procesar historial para agregar total_horas y horas_clase
            const historialConHoras = historial.map(reg => {
                let total_horas = 0;
                let horas_clase = 0;
                if (reg.hora_entrada && reg.hora_salida) {
                    // Parsear las fechas originales
                    const entradaDate = new Date(reg.hora_entrada);
                    const salidaDate = new Date(reg.hora_salida);

                    // Calcular minutos desde medianoche Colombia (UTC-5)
                    let entradaMin = entradaDate.getUTCHours() * 60 + entradaDate.getUTCMinutes() - (5 * 60);
                    let salidaMin = salidaDate.getUTCHours() * 60 + salidaDate.getUTCMinutes() - (5 * 60);
                    if (entradaMin < 0) entradaMin += 24 * 60;
                    if (salidaMin < 0) salidaMin += 24 * 60;

                    // Horario de clase en minutos
                    const [hIni, mIni] = HORA_INICIO_CLASE.split(':').map(Number);
                    const [hFin, mFin] = HORA_FIN_CLASE.split(':').map(Number);
                    const iniClaseMin = hIni * 60 + mIni;
                    const finClaseMin = hFin * 60 + mFin;

                    // Entrada efectiva
                    const entradaEfectiva = Math.max(entradaMin, iniClaseMin);
                    // Salida efectiva
                    const salidaEfectiva = Math.min(salidaMin, finClaseMin);

                    // Diferencia en minutos
                    const diff = Math.max(0, salidaEfectiva - entradaEfectiva);
                    total_horas = Math.round((diff / 60) * 100) / 100;
                    horas_clase = (finClaseMin - iniClaseMin) / 60;
                }
                // --- DEBUG: log para depuración ---
                console.log({ rawEntrada: reg.hora_entrada, rawSalida: reg.hora_salida, total_horas, horas_clase });
                return { ...reg, total_horas, horas_clase };
            });

            res.json(historialConHoras);
        } catch (error) {
            console.error('Error en getHistorialPorFicha:', error);
            res.status(500).json({ error: 'Error al obtener historial', details: error.message });
        }
    },
};

module.exports = asistenciaController; 