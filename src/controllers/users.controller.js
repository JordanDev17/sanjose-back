import { pool } from '../db.js';
import bcrypt from 'bcryptjs'; // Asegúrate de tener bcryptjs instalado: npm install bcryptjs

/**
 * Obtiene todos los usuarios de la base de datos
 */
export const getUsersData = async (req, res) => {
    try {
        // Incluye two_factor_enabled en la selección
        const [rows] = await pool.query('SELECT id, nombre_usuario, email, rol, activo, two_factor_enabled FROM usuarios');
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

        // Incluye two_factor_enabled en la selección
        const [rows] = await pool.query('SELECT id, nombre_usuario, email, rol, activo, two_factor_enabled FROM usuarios WHERE id = ?', [id]);
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
        if (!contrasena) {
            return res.status(400).json({ message: 'La contraseña es obligatoria y no puede estar vacía.' });
        }
        if (!rol) {
            return res.status(400).json({ message: 'El rol es obligatorio y no puede estar vacío.' });
        }
        if (typeof activo !== 'boolean') {
            return res.status(400).json({ message: 'El campo "activo" es obligatorio y debe ser un valor booleano (true o false).' });
        }

        // 2. Verificar si el usuario o email ya existen (para evitar duplicados)
        const [existingUser] = await pool.query('SELECT id, nombre_usuario, email FROM usuarios WHERE nombre_usuario = ? OR email = ?', [nombre_usuario, email]);
        if (existingUser.length > 0) {
            if (existingUser[0].email === email) {
                return res.status(409).json({ message: 'El email proporcionado ya está registrado.' });
            }
            if (existingUser[0].nombre_usuario === nombre_usuario) {
                return res.status(409).json({ message: 'El nombre de usuario ya está en uso.' });
            }
        }

        // Hashear la contraseña antes de guardar
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

        // Insertar el nuevo usuario en la base de datos
        // two_factor_enabled se establece a FALSE por defecto al crear el usuario.
        const [result] = await pool.query(
            `INSERT INTO usuarios (nombre_usuario, email, contrasena, rol, activo, two_factor_enabled)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nombre_usuario, email, hashedPassword, rol, activo, false] // two_factor_enabled por defecto es false
        );

        res.status(201).json({
            id: result.insertId,
            nombre_usuario,
            email,
            rol,
            activo,
            two_factor_enabled: false, // Confirmar que se creó con 2FA deshabilitado
            message: 'Usuario creado exitosamente.'
        });

    } catch (error) {
        console.error('Error creando usuario:', error);
        // Manejo de errores específicos de MySQL (aunque ya se hizo una verificación previa)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Entrada duplicada. El usuario o email ya existen.' });
        }
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
            return res.status(400).json({ message: 'ID de usuario inválido.' });
        }

        const updates = req.body;
        // Ahora permitimos actualizar 'two_factor_enabled'
        const allowedFields = ['nombre_usuario', 'email', 'contrasena', 'rol', 'activo', 'two_factor_enabled'];
        const fieldsToUpdate = [];
        const values = [];

        for (const key of Object.keys(updates)) {
            if (allowedFields.includes(key)) {
                let value = updates[key];

                // Validaciones y hasheo por campo
                if (key === 'nombre_usuario') {
                    value = String(value).trim();
                    if (!value) return res.status(400).json({ message: 'El nombre de usuario no puede estar vacío.' });
                } else if (key === 'email') {
                    value = String(value).trim().toLowerCase();
                    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        return res.status(400).json({ message: 'El email debe ser válido y no puede estar vacío.' });
                    }
                } else if (key === 'contrasena') {
                    if (!value || String(value).trim() === '') {
                        return res.status(400).json({ message: 'La contraseña no puede estar vacía.' });
                    }
                    value = await bcrypt.hash(value, 10); // Hashea la nueva contraseña
                } else if (key === 'rol') {
                    value = String(value).trim();
                    if (!value) return res.status(400).json({ message: 'El rol no puede estar vacío.' });
                } else if (key === 'activo' || key === 'two_factor_enabled') { // Manejo para two_factor_enabled
                    if (typeof value !== 'boolean') {
                        return res.status(400).json({ message: `El campo "${key}" debe ser un booleano.` });
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

/**
 * Función para Habilitar/Deshabilitar 2FA (por un usuario autenticado)
 * Esta función es para que un USUARIO cambie su propio estado de 2FA.
 * Asume que `req.user.id` viene de tu middleware `verifyToken`.
 */
export const toggleTwoFactor = async (req, res) => {
    // req.user.id viene de tu middleware verifyToken
    const userId = req.user.id;
    const { enable } = req.body; // true para habilitar, false para deshabilitar

    if (typeof enable !== 'boolean') {
        return res.status(400).json({ message: 'El parámetro "enable" debe ser un valor booleano (true o false).' });
    }

    try {
        await pool.query(
            'UPDATE usuarios SET two_factor_enabled = ? WHERE id = ?',
            [enable, userId]
        );
        res.status(200).json({ message: `Verificación en dos pasos ${enable ? 'habilitada' : 'deshabilitada'} correctamente.` });
    } catch (error) {
        console.error('Error al cambiar el estado de 2FA:', error);
        res.status(500).json({ message: 'Error interno del servidor al cambiar el estado de 2FA.' });
    }
};