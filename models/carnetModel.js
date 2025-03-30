const db = require('../config/db');

const carnetModel = {
    getAllCarnets: async () => {
        const query = `
            SELECT 
                c.id,
                c.id_usuario,
                c.id_programa,
                c.numero_carnet,
                c.observacion,
                c.fecha_emision,
                c.fecha_vencimiento,
                c.activo,
                u.nombre as nombre_usuario,
                p.nombre_programa as nombre_programa
            FROM carnet c
            LEFT JOIN usuario u ON c.id_usuario = u.id
            LEFT JOIN programas p ON c.id_programa = p.id
            ORDER BY c.fecha_emision DESC
        `;
        try {
            const { rows } = await db.query(query);
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener carnets: ${error.message}`);
        }
    },

    getCarnetById: async (id) => {
        const query = `
            SELECT 
                c.id,
                c.id_usuario,
                c.id_programa,
                c.numero_carnet,
                c.observacion,
                c.fecha_emision,
                c.fecha_vencimiento,
                c.activo,
                u.nombre as nombre_usuario,
                p.nombre_programa as nombre_programa
            FROM carnet c
            LEFT JOIN usuario u ON c.id_usuario = u.id
            LEFT JOIN programas p ON c.id_programa = p.id
            WHERE c.id = $1
        `;
        try {
            const { rows } = await db.query(query, [id]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error al obtener carnet: ${error.message}`);
        }
    },

    getCarnetByNumero: async (numero_carnet) => {
        const query = `
            SELECT 
                c.id,
                c.id_usuario,
                c.id_programa,
                c.numero_carnet,
                c.observacion,
                c.fecha_emision,
                c.fecha_vencimiento,
                c.activo,
                u.nombre as nombre_usuario,
                p.nombre_programa as nombre_programa
            FROM carnet c
            LEFT JOIN usuario u ON c.id_usuario = u.id
            LEFT JOIN programas p ON c.id_programa = p.id
            WHERE c.numero_carnet = $1
        `;
        try {
            const { rows } = await db.query(query, [numero_carnet]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error al obtener carnet por número: ${error.message}`);
        }
    },

    getCarnetsByUsuario: async (id_usuario) => {
        const query = `
            SELECT 
                c.id,
                c.id_usuario,
                c.id_programa,
                c.numero_carnet,
                c.observacion,
                c.fecha_emision,
                c.fecha_vencimiento,
                c.activo,
                u.nombre as nombre_usuario,
                p.nombre_programa as nombre_programa
            FROM carnet c
            LEFT JOIN usuario u ON c.id_usuario = u.id
            LEFT JOIN programas p ON c.id_programa = p.id
            WHERE c.id_usuario = $1
            ORDER BY c.fecha_emision DESC
        `;
        try {
            const { rows } = await db.query(query, [id_usuario]);
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener carnets del usuario: ${error.message}`);
        }
    },

    createCarnet: async (carnetData) => {
        const {
            id_usuario,
            id_programa,
            numero_carnet,
            observacion,
            fecha_emision,
            fecha_vencimiento,
            activo = true
        } = carnetData;

        // Verificar si el usuario existe
        const checkUsuario = await db.query(
            'SELECT id FROM usuario WHERE id = $1',
            [id_usuario]
        );

        if (checkUsuario.rows.length === 0) {
            throw new Error('El usuario especificado no existe');
        }

        // Verificar si el programa existe
        const checkPrograma = await db.query(
            'SELECT id FROM programas WHERE id = $1',
            [id_programa]
        );

        if (checkPrograma.rows.length === 0) {
            throw new Error('El programa especificado no existe');
        }

        // Verificar si el número de carnet ya existe
        const checkNumero = await db.query(
            'SELECT id FROM carnet WHERE numero_carnet = $1',
            [numero_carnet]
        );

        if (checkNumero.rows.length > 0) {
            throw new Error('El número de carnet ya está en uso');
        }

        const query = `
            INSERT INTO carnet (
                id_usuario,
                id_programa,
                numero_carnet,
                observacion,
                fecha_emision,
                fecha_vencimiento,
                activo
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `;
        try {
            const { rows } = await db.query(query, [
                id_usuario,
                id_programa,
                numero_carnet,
                observacion,
                fecha_emision,
                fecha_vencimiento,
                activo
            ]);
            
            // Obtener el carnet completo con la información relacionada
            return await carnetModel.getCarnetById(rows[0].id);
        } catch (error) {
            throw new Error(`Error al crear carnet: ${error.message}`);
        }
    },

    updateCarnet: async (id, carnetData) => {
        const {
            id_usuario,
            id_programa,
            numero_carnet,
            observacion,
            fecha_emision,
            fecha_vencimiento,
            activo
        } = carnetData;

        // Verificar si el carnet existe
        const carnetExistente = await carnetModel.getCarnetById(id);
        if (!carnetExistente) {
            throw new Error('Carnet no encontrado');
        }

        // Si se proporciona id_usuario, verificar que existe
        if (id_usuario) {
            const checkUsuario = await db.query(
                'SELECT id FROM usuario WHERE id = $1',
                [id_usuario]
            );

            if (checkUsuario.rows.length === 0) {
                throw new Error('El usuario especificado no existe');
            }
        }

        // Si se proporciona id_programa, verificar que existe
        if (id_programa) {
            const checkPrograma = await db.query(
                'SELECT id FROM programas WHERE id = $1',
                [id_programa]
            );

            if (checkPrograma.rows.length === 0) {
                throw new Error('El programa especificado no existe');
            }
        }

        // Si se proporciona número de carnet, verificar que no esté en uso
        if (numero_carnet && numero_carnet !== carnetExistente.numero_carnet) {
            const checkNumero = await db.query(
                'SELECT id FROM carnet WHERE numero_carnet = $1',
                [numero_carnet]
            );

            if (checkNumero.rows.length > 0) {
                throw new Error('El número de carnet ya está en uso');
            }
        }

        const query = `
            UPDATE carnet
            SET id_usuario = COALESCE($1, id_usuario),
                id_programa = COALESCE($2, id_programa),
                numero_carnet = COALESCE($3, numero_carnet),
                observacion = COALESCE($4, observacion),
                fecha_emision = COALESCE($5, fecha_emision),
                fecha_vencimiento = COALESCE($6, fecha_vencimiento),
                activo = COALESCE($7, activo)
            WHERE id = $8
            RETURNING id
        `;
        try {
            const { rows } = await db.query(query, [
                id_usuario,
                id_programa,
                numero_carnet,
                observacion,
                fecha_emision,
                fecha_vencimiento,
                activo,
                id
            ]);
            
            // Obtener el carnet actualizado con la información relacionada
            return await carnetModel.getCarnetById(rows[0].id);
        } catch (error) {
            throw new Error(`Error al actualizar carnet: ${error.message}`);
        }
    },

    deleteCarnet: async (id) => {
        const query = `
            DELETE FROM carnet
            WHERE id = $1
            RETURNING id
        `;
        try {
            const { rows } = await db.query(query, [id]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error al eliminar carnet: ${error.message}`);
        }
    },

    // Método adicional para verificar carnets vencidos
    checkVencimientos: async () => {
        const query = `
            UPDATE carnet
            SET estado = 'Vencido'
            WHERE fecha_vencimiento < CURRENT_TIMESTAMP
            AND estado = 'Activo'
            RETURNING id_carnet, numero_carnet, fecha_vencimiento
        `;
        try {
            const { rows } = await db.query(query);
            return rows;
        } catch (error) {
            throw new Error(`Error al verificar vencimientos: ${error.message}`);
        }
    }
};

module.exports = carnetModel;