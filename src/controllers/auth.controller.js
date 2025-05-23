import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js'; // Asume que exportas 'pool' desde db.js
import { JWT_SECRET } from '../config.js'; // Asegúrate de que JWT_SECRET esté en tu config.js

// --- Función de Registro de Usuario ---
export const register = async (req, res) => {
    const { nombre_usuario, email, contrasena, rol } = req.body; // Puedes permitir que el rol se envíe en el registro,
                                                             // o asignarle un rol por defecto (ej. 'visualizador') si no se especifica.

    // Validaciones básicas
    if (!nombre_usuario || !email || !contrasena) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        // Verificar si el usuario o email ya existen
        const [existingUser] = await pool.query('SELECT id FROM usuarios WHERE nombre_usuario = ? OR email = ?', [nombre_usuario, email]);
        if (existingUser.length > 0) {
            return res.status(409).json({ message: 'El nombre de usuario o el email ya están registrados.' });
        }

        // Hashear la contraseña
        const saltRounds = 10; // Nivel de complejidad del hash
        const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

        // Insertar el nuevo usuario en la base de datos
        // Si no quieres que el rol se defina desde el frontend en el registro,
        // simplemente omite 'rol' de la inserción o asigna un valor fijo aquí.
        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre_usuario, email, contrasena, rol) VALUES (?, ?, ?, ?)',
            [nombre_usuario, email, hashedPassword, rol || 'visualizador'] // Si 'rol' no se envía, se asigna 'visualizador' por defecto
        );

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            userId: result.insertId,
            nombre_usuario: nombre_usuario,
            email: email,
            rol: rol || 'visualizador' // Retorna el rol asignado
        });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor al registrar usuario.' });
    }
};


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