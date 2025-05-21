import { pool } from '../db.js';

/**
 * Obtiene todas las noticias de la base de datos
 */
export const getNewsData = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM news');
        res.json(rows);
    } catch (error) {
        console.error('Error obteniendo noticias:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * Obtiene una noticia por su ID
 */
export const getNewsIdData = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) return res.status(400).json({ message: 'ID inválido' });

        const [rows] = await pool.query('SELECT * FROM news WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Noticia no encontrada' });

        res.json(rows[0]);
    } catch (error) {
        console.error('Error obteniendo noticia por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * Crea una nueva noticia en la base de datos
 */
export const postNewsData = async (req, res) => {
    try {
        const { titulo, slug, resumen, contenido, imagen_destacada, categoria, autor, estado } = req.body;

        // Validar datos obligatorios
        if (!titulo || !slug || !contenido || !categoria) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }

        if (!['borrador', 'publicado', 'archivado'].includes(estado)) {
            return res.status(400).json({ message: 'Estado no válido' });
        }

        const [rows] = await pool.query(
            `INSERT INTO news (titulo, slug, resumen, contenido, imagen_destacada, categoria, autor, estado) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [titulo, slug, resumen, contenido, imagen_destacada, categoria, autor, estado]
        );

        res.status(201).json({
            id: rows.insertId,
            titulo,
            slug,
            resumen,
            contenido,
            imagen_destacada,
            categoria,
            autor,
            estado
        });

    } catch (error) {
        console.error('Error creando noticia:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * Actualiza una noticia existente
 */
export const patchNewsData = async (req, res) => {
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
            if (['titulo', 'slug', 'resumen', 'contenido', 'imagen_destacada', 'categoria', 'autor', 'estado'].includes(key)) {
                if (key === 'titulo' && !value) {
                    return res.status(400).json({ message: 'El título es obligatorio y no puede ser nulo' });
                }
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (fields.length === 0) {
            return res.status(400).json({ message: 'No se proporcionaron campos válidos para actualizar' });
        }

        values.push(id);

        const query = `UPDATE news SET ${fields.join(', ')} WHERE id = ?`;
        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Noticia no encontrada' });
        }

        res.json({ message: 'Noticia actualizada correctamente' });

    } catch (error) {
        console.error('Error actualizando noticia:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};


/**
 * Elimina una noticia por su ID
 */
export const deleteNewsData = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) return res.status(400).json({ message: 'ID inválido' });

        const [result] = await pool.query('DELETE FROM news WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Noticia no encontrada' });
        }

        res.json({ message: 'Noticia eliminada correctamente' });

    } catch (error) {
        console.error('Error eliminando noticia:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
