// backend/controllers/warehouse.controller.js
// Este controlador maneja las operaciones CRUD para bodegas, conectándose a la base de datos MySQL.

import { pool } from '../db.js'; // Asegúrate de que esta ruta sea correcta para tu conexión a la base de datos

/**
 * Obtiene todas las bodegas de la base de datos.
 * @param req Objeto de solicitud de Express.
 * @param res Objeto de respuesta de Express.
 */
export const getWarehouses = async (req, res) => {
    try {
        // Aquí podrías implementar filtros si es necesario, como por 'estado'
        // const { estado } = req.query;
        // let query = 'SELECT * FROM warehouse';
        // const params = [];
        // if (estado) {
        //   query += ' WHERE estado = ?';
        //   params.push(estado);
        // }
        // const [rows] = await pool.query(query, params);

        // Actualmente, el frontend espera un array plano, no un objeto paginado del backend.
        // La paginación se simula en el servicio del frontend.
        const [rows] = await pool.query('SELECT * FROM warehouse');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error obteniendo bodegas de la DB:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener bodegas.' });
    }
};

/**
 * Obtiene una bodega por su ID de la base de datos.
 * @param req Objeto de solicitud de Express.
 * @param res Objeto de respuesta de Express.
 */
export const getWarehouseById = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID de bodega inválido.' });
        }

        const [rows] = await pool.query('SELECT * FROM warehouse WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Bodega no encontrada.' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error obteniendo bodega por ID de la DB:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener bodega.' });
    }
};

/**
 * Crea una nueva bodega en la base de datos.
 * @param req Objeto de solicitud de Express.
 * @param res Objeto de respuesta de Express.
 */
export const createWarehouse = async (req, res) => {
    try {
        const { nombre, slug, descripcion, sector, logotipo_url, sitio_web, contacto_email, contacto_telefono, direccion_bodega, estado } = req.body;

        // Validación de datos obligatorios
        if (!nombre || !slug || !descripcion || !sector || !direccion_bodega) {
            return res.status(400).json({ message: 'Faltan campos obligatorios: nombre, slug, descripcion, sector, direccion_bodega.' });
        }

        // Validación de estado (si tienes valores ENUM específicos en tu DB)
        // 'pendiente' se añadió aquí para compatibilidad con un ejemplo anterior, asegúrate de que exista en tu ENUM de DB.
        if (!['activa', 'inactiva', 'pendiente'].includes(estado)) {
            return res.status(400).json({ message: 'Estado de bodega no válido.' });
        }

        const [result] = await pool.query(
            `INSERT INTO warehouse (nombre, slug, descripcion, sector, logotipo_url, sitio_web, contacto_email, contacto_telefono, direccion_bodega, estado)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre, slug, descripcion, sector, logotipo_url, sitio_web, contacto_email, contacto_telefono, direccion_bodega, estado]
        );

        // Obtener la bodega recién creada para devolverla al frontend
        const [rows] = await pool.query('SELECT * FROM warehouse WHERE id = ?', [result.insertId]);

        res.status(201).json(rows[0]); // Devolver el objeto de la bodega creada con su ID real y fechas
    } catch (error) {
        console.error('Error creando bodega en la DB:', error);
        // Manejar error de UNIQUE constraint (ej. nombre o slug duplicado)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Ya existe una bodega con ese nombre o slug. Por favor, elige uno diferente.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al crear bodega.' });
    }
};

/**
 * Actualiza una bodega existente en la base de datos.
 * @param req Objeto de solicitud de Express.
 * @param res Objeto de respuesta de Express.
 */
export const updateWarehouse = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID de bodega inválido.' });
        }

        const updates = req.body;

        // Verificar si hay datos para actualizar
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'Debe proporcionar al menos un campo para actualizar.' });
        }

        // Construir la consulta de actualización dinámicamente
        const fields = [];
        const values = [];

        for (const [key, value] of Object.entries(updates)) {
            // Asegurarse de que solo se actualicen campos permitidos y que el nombre no sea nulo si se provee
            if (['nombre', 'slug', 'descripcion', 'sector', 'logotipo_url', 'sitio_web', 'contacto_email', 'contacto_telefono', 'direccion_bodega', 'estado'].includes(key)) {
                if (key === 'nombre' && (value === null || value === undefined || value === '')) {
                    return res.status(400).json({ message: 'El nombre es obligatorio y no puede ser nulo o vacío.' });
                }
                // Si el campo es 'estado', validar el valor
                if (key === 'estado' && !['activa', 'inactiva', 'pendiente'].includes(value)) {
                    return res.status(400).json({ message: 'Estado de bodega no válido.' });
                }
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (fields.length === 0) {
            return res.status(400).json({ message: 'No se proporcionaron campos válidos para actualizar.' });
        }

        values.push(id); // Añadir el ID al final para la cláusula WHERE

        const query = `UPDATE warehouse SET ${fields.join(', ')}, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?`; // Actualiza fecha_actualizacion automáticamente
        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Bodega no encontrada para actualizar.' });
        }

        // Obtener la bodega actualizada para devolverla al frontend
        const [updatedRows] = await pool.query('SELECT * FROM warehouse WHERE id = ?', [id]);
        res.status(200).json(updatedRows[0]); // Devolver el objeto de la bodega actualizada
    } catch (error) {
        console.error('Error actualizando bodega en la DB:', error);
        // Manejar error de UNIQUE constraint (ej. nombre o slug duplicado al actualizar)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Ya existe una bodega con ese nombre o slug. Por favor, elige uno diferente.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al actualizar bodega.' });
    }
};

/**
 * Elimina una bodega por su ID de la base de datos.
 * @param req Objeto de solicitud de Express.
 * @param res Objeto de respuesta de Express.
 */
export const deleteWarehouse = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID de bodega inválido.' });
        }

        const [result] = await pool.query('DELETE FROM warehouse WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Bodega no encontrada para eliminar.' });
        }

        res.status(204).send(); // 204 No Content: éxito sin devolver cuerpo
    } catch (error) {
        console.error('Error eliminando bodega de la DB:', error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar bodega.' });
    }
};