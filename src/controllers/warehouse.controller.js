import { pool } from '../db.js';

/**
 * Obtiene todas las bodegas de la base de datos
 */
export const getWarehouseData = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM warehouse');
        res.json(rows);
    } catch (error) {
        console.error('Error obteniendo bodegas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * Obtiene una bodega por su ID
 */
export const getWarehouseIdData = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) return res.status(400).json({ message: 'ID inválido' });

        const [rows] = await pool.query('SELECT * FROM warehouse WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Bodega no encontrada' });

        res.json(rows[0]);
    } catch (error) {
        console.error('Error obteniendo bodega por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * Crea una nueva bodega en la base de datos
 */
export const postWarehouseData = async (req, res) => {
    try {
        const { nombre, slug, descripcion, sector, logotipo_url, sitio_web, contacto_email, contacto_telefono, direccion_bodega, estado } = req.body;

        // Validación de datos obligatorios
        if (!nombre || !slug || !sector || !direccion_bodega) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }

        if (!['activa', 'inactiva', 'pendiente'].includes(estado)) {
            return res.status(400).json({ message: 'Estado no válido' });
        }

        const [rows] = await pool.query(
            `INSERT INTO warehouse (nombre, slug, descripcion, sector, logotipo_url, sitio_web, contacto_email, contacto_telefono, direccion_bodega, estado) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre, slug, descripcion, sector, logotipo_url, sitio_web, contacto_email, contacto_telefono, direccion_bodega, estado]
        );

        res.status(201).json({
            id: rows.insertId,
            nombre,
            slug,
            descripcion,
            sector,
            logotipo_url,
            sitio_web,
            contacto_email,
            contacto_telefono,
            direccion_bodega,
            estado
        });

    } catch (error) {
        console.error('Error creando bodega:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * Actualiza una bodega existente
 */
export const patchWarehouseData = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) return res.status(400).json({ message: 'ID inválido' });

        const updates = req.body;

        // Verificar si hay datos para actualizar
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'Debe proporcionar al menos un campo para actualizar' });
        }

        // Construir la consulta dinámicamente
        const fields = [];
        const values = [];

        for (const [key, value] of Object.entries(updates)) {
            if (['nombre', 'slug', 'descripcion', 'sector', 'logotipo_url', 'sitio_web', 'contacto_email', 'contacto_telefono', 'direccion_bodega', 'estado'].includes(key)) {
                if (key === 'nombre' && !value) {
                    return res.status(400).json({ message: 'El nombre es obligatorio y no puede ser nulo' });
                }
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (fields.length === 0) {
            return res.status(400).json({ message: 'No se proporcionaron campos válidos para actualizar' });
        }

        values.push(id);

        const query = `UPDATE warehouse SET ${fields.join(', ')} WHERE id = ?`;
        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Bodega no encontrada' });
        }

        res.json({ message: 'Bodega actualizada correctamente' });

    } catch (error) {
        console.error('Error actualizando bodega:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};


/**
 * Elimina una bodega por su ID
 */
export const deleteWarehouseData = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) return res.status(400).json({ message: 'ID inválido' });

        const [result] = await pool.query('DELETE FROM warehouse WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Bodega no encontrada' });
        }

        res.json({ message: 'Bodega eliminada correctamente' });

    } catch (error) {
        console.error('Error eliminando bodega:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
