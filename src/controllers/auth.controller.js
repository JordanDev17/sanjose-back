import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { pool } from '../db.js'; // Importa la conexión a tu base de datos
import { JWT_SECRET } from '../config.js'; // Importa el secreto JWT desde tu config

export const login = async (req, res) => {
    const { nombre_usuario, contrasena } = req.body;

    if (!nombre_usuario || !contrasena) {
        return res.status(400).json({ message: 'Usuario y contraseña son requeridos.' });
    }

    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE nombre_usuario = ?', [nombre_usuario]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const isMatch = await bcrypt.compare(contrasena, user.contrasena);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        // Generar el JWT con el ID y el rol del usuario
        const token = jwt.sign(
            { id: user.id, rol: user.rol },
            JWT_SECRET,
            { expiresIn: '1h' } // Token expira en 1 hora
        );

        res.json({
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: user.id,
                nombre_usuario: user.nombre_usuario,
                email: user.email,
                rol: user.rol
            }
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error del servidor.' });
    }
};

// OPCIONAL: Ruta de registro para crear nuevos usuarios, especialmente administradores
export const register = async (req, res) => {
    const { nombre_usuario, email, contrasena, rol } = req.body; // Puedes forzar el rol o dejarlo por defecto

    if (!nombre_usuario || !email || !contrasena) {
        return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    }

    try {
        // Verificar si el usuario o email ya existen
        const [existingUser] = await pool.query('SELECT id FROM usuarios WHERE nombre_usuario = ? OR email = ?', [nombre_usuario, email]);
        if (existingUser.length > 0) {
            return res.status(409).json({ message: 'El nombre de usuario o email ya están registrados.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contrasena, salt);

        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre_usuario, email, contrasena, rol) VALUES (?, ?, ?, ?)',
            [nombre_usuario, email, hashedPassword, rol || 'visualizador'] // Puedes asignar un rol por defecto o requerirlo
        );

        res.status(201).json({ message: 'Usuario registrado exitosamente', userId: result.insertId });

    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ message: 'Error del servidor.' });
    }
};