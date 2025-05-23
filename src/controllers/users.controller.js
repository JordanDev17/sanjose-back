import { pool } from '../db.js';

/**
 * Obtiene todos los usuarios de la base de datos
 */
export const getUsersData = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, nombre_usuario, email, rol, activo FROM usuarios'); // No retornar contraseñas
        res.json(rows);
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener usuarios.' });
    }
};

/**
 * Obtiene un usuario por su ID
 */
export const getUsersIdData = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID de usuario inválido. Debe ser un número entero.' });
        }

        const [rows] = await pool.query('SELECT id, nombre_usuario, email, rol, activo FROM usuarios WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error obteniendo usuario por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener usuario por ID.' });
    }
};

/**
 * Crea un nuevo usuario en la base de datos
 */
export const postUsersData = async (req, res) => {
    try {
        let { nombre_usuario, email, contrasena, rol, activo } = req.body;

        // Limpiar y normalizar entradas
        nombre_usuario = nombre_usuario ? String(nombre_usuario).trim() : '';
        email = email ? String(email).trim().toLowerCase() : ''; // Normalizar email a minúsculas
        contrasena = contrasena ? String(contrasena) : ''; // Contraseña no se trimea para permitir espacios intencionales
        rol = rol ? String(rol).trim() : '';
        // 'activo' ya se espera como booleano, no necesita trim

        // 1. Validación de datos obligatorios y tipo correcto
        if (!nombre_usuario) {
            return res.status(400).json({ message: 'El nombre de usuario es obligatorio y no puede estar vacío.' });
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { // Regex simple para email
            return res.status(400).json({ message: 'El email es obligatorio y debe tener un formato válido.' });
        }
        if (!contrasena) { // Solo verificar que no esté vacío, la complejidad se puede hacer en el frontend o con librerías de validación
            return res.status(400).json({ message: 'La contraseña es obligatoria y no puede estar vacía.' });
        }
        if (!rol) {
            return res.status(400).json({ message: 'El rol es obligatorio y no puede estar vacío.' });
        }
        if (typeof activo !== 'boolean') {
            return res.status(400).json({ message: 'El campo "activo" es obligatorio y debe ser un valor booleano (true o false).' });
        }

        // TODO: En un entorno de producción, aquí deberías hashear la contraseña:
        // const hashedPassword = await bcrypt.hash(contrasena, 10);

        const [rows] = await pool.query(
            `INSERT INTO Usuarios (nombre_usuario, email, contrasena, rol, activo)
             VALUES (?, ?, ?, ?, ?)`,
            [nombre_usuario, email, contrasena, rol, activo] // Usar contrasena sin hashear por ahora
        );

        res.status(201).json({
            id: rows.insertId,
            nombre_usuario,
            email,
            rol,
            activo,
            message: 'Usuario creado exitosamente.'
        });

    } catch (error) {
        console.error('Error creando usuario:', error);

        // Manejo de errores específicos de MySQL
        if (error.code === 'ER_DUP_ENTRY') {
            // Error de entrada duplicada
            if (error.sqlMessage.includes('email')) {
                return res.status(409).json({ message: 'El email proporcionado ya está registrado.' });
            }
            if (error.sqlMessage.includes('nombre_usuario')) { // Si también tienes unique en nombre_usuario
                return res.status(409).json({ message: 'El nombre de usuario ya está en uso.' });
            }
            return res.status(409).json({ message: 'Entrada duplicada. Revise los datos.' }); // Genérico para otras claves únicas
        }
        // Otros errores del servidor
        res.status(500).json({ message: 'Error interno del servidor al crear usuario.' });
    }
};

/**
 * Actualiza un usuario existente
 */
export const patchUsersData = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID de usuario inválido. ' });
        }

        const updates = req.body;
        const allowedFields = ['nombre_usuario', 'email', 'contrasena', 'rol', 'activo'];
        const fieldsToUpdate = [];
        const values = [];

        for (const key of Object.keys(updates)) {
            if (allowedFields.includes(key)) {
                let value = updates[key];

                // Validaciones por campo
                if (key === 'nombre_usuario') {
                    value = String(value).trim();
                    if (!value) return res.status(400).json({ message: 'El nombre de usuario no puede estar vacío.' });
                } else if (key === 'email') {
                    value = String(value).trim().toLowerCase();
                    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        return res.status(400).json({ message: 'El email debe ser válido y no puede estar vacío.' });
                    }
                } else if (key === 'contrasena') {
                    // TODO: En un entorno de producción, aquí deberías hashear la nueva contraseña:
                    // value = await bcrypt.hash(value, 10);
                    if (!value || String(value).trim() === '') {
                         return res.status(400).json({ message: 'La contraseña no puede estar vacía.' });
                    }
                } else if (key === 'rol') {
                    value = String(value).trim();
                    if (!value) return res.status(400).json({ message: 'El rol no puede estar vacío.' });
                } else if (key === 'activo') {
                    if (typeof value !== 'boolean') {
                        return res.status(400).json({ message: 'El campo "activo" debe ser un booleano.' });
                    }
                }
                fieldsToUpdate.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (fieldsToUpdate.length === 0) {
            return res.status(400).json({ message: 'No se proporcionaron campos válidos para actualizar o todos están vacíos.' });
        }

        values.push(id); // Agregar el ID al final para la cláusula WHERE

        const query = `UPDATE usuarios SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado o no se realizaron cambios.' });
        }

        res.json({ message: 'Usuario actualizado correctamente.' });

    } catch (error) {
        console.error('Error actualizando usuario:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            if (error.sqlMessage.includes('email')) {
                return res.status(409).json({ message: 'El nuevo email proporcionado ya está registrado por otro usuario.' });
            }
            if (error.sqlMessage.includes('nombre_usuario')) {
                return res.status(409).json({ message: 'El nuevo nombre de usuario ya está en uso por otro usuario.' });
            }
            return res.status(409).json({ message: 'Entrada duplicada al actualizar. Revise los datos.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al actualizar usuario.' });
    }
};

/**
 * Elimina un usuario por su ID
 */
export const deleteUsersData = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID de usuario inválido. Debe ser un número entero.' });
        }

        const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.json({ message: 'Usuario eliminado correctamente.' });

    } catch (error) {
        console.error('Error eliminando usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar usuario.' });
    }
};