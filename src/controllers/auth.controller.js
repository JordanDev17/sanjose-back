import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js'; // Asume que exportas 'pool' desde db.js
import { JWT_SECRET } from '../config.js'; // Asegúrate de que JWT_SECRET esté en tu config.js



// --- Función de Inicio de Sesión de Usuario ---
export const login = async (req, res) => {
    const { nombre_usuario, contrasena } = req.body;

    try {
        // 1. Buscar el usuario por nombre de usuario
        const [rows] = await pool.query('SELECT id, nombre_usuario, contrasena, rol, activo FROM usuarios WHERE nombre_usuario = ?', [nombre_usuario]);

        // Si el usuario no existe
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const user = rows[0];

        // Si el usuario está inactivo
        if (!user.activo) {
            return res.status(403).json({ message: 'Tu cuenta está inactiva. Contacta al administrador.' });
        }

        // 2. Comparar la contraseña enviada con la contraseña hasheada en la base de datos
        const isMatch = await bcrypt.compare(contrasena, user.contrasena);

        // Si las contraseñas no coinciden
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        // 3. Generar el Token Web JSON (JWT)
        // Incluye el ID del usuario, nombre de usuario y el ROL en el payload del token
        const token = jwt.sign(
            { id: user.id, nombre_usuario: user.nombre_usuario, rol: user.rol }, // <-- ¡El rol se incluye aquí!
            JWT_SECRET,
            { expiresIn: '1h' } // El token expira en 1 hora
        );

        // 4. Enviar el token y la información básica del usuario (incluido el rol) al cliente
        res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            token: token,
            user: { // Información del usuario para el frontend
                id: user.id,
                nombre_usuario: user.nombre_usuario,
                email: user.email, // Si lo traes en la consulta
                rol: user.rol // <-- ¡El rol se envía aquí!
            }
        });

    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};