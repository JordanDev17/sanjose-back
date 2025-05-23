import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js'; // Asume que exportas 'pool' desde db.js
import { JWT_SECRET } from '../config.js'; // Asegúrate de que JWT_SECRET esté en tu config.js
import transporter from '../email.js'; // Importa el transportador de correo
import { twoFactorEmailTemplate } from '../templates/twoFactorEmail.js'; // Importa la plantilla de correo

// Genera un código numérico aleatorio de 6 dígitos
const generateTwoFactorCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// --- Función de Inicio de Sesión de Usuario (con 2FA) ---
export const login = async (req, res) => {
    // Ahora esperamos también 'twoFactorCode' en el cuerpo de la solicitud
    const { nombre_usuario, contrasena, twoFactorCode } = req.body;

    try {
        // 1. Buscar el usuario por nombre de usuario y obtener los campos de 2FA
        const [rows] = await pool.query(
            'SELECT id, nombre_usuario, contrasena, email, rol, activo, two_factor_enabled, two_factor_code, two_factor_code_expires_at FROM usuarios WHERE nombre_usuario = ?',
            [nombre_usuario]
        );

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

        // --- Lógica de Verificación en Dos Pasos (2FA) ---
        if (user.two_factor_enabled) {
            // Si el 2FA está habilitado para este usuario

            if (!twoFactorCode) {
                // **Paso 1: El usuario no ha enviado el código 2FA todavía.**
                // Generar y enviar un nuevo código 2FA por correo.

                const code = generateTwoFactorCode();
                const expiresInMinutes = 5; // El código será válido por 5 minutos
                const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000); // Calcular la fecha de expiración

                // Guardar el código y la fecha de expiración en la base de datos
                await pool.query(
                    'UPDATE usuarios SET two_factor_code = ?, two_factor_code_expires_at = ? WHERE id = ?',
                    [code, expiresAt, user.id]
                );

                // Construir el contenido del correo usando la plantilla HTML
                const emailContent = twoFactorEmailTemplate(user.nombre_usuario, code, expiresInMinutes);

                const mailOptions = {
                    from: process.env.FROM_EMAIL, // Remitente definido en las variables de entorno
                    to: user.email, // Correo del usuario
                    subject: 'Tu Código de Verificación para Inicio de Sesión',
                    html: emailContent // Contenido HTML
                };

                // Enviar el correo electrónico
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error enviando correo 2FA:', error);
                        // En producción, no expongas este error al usuario. Solo loguéalo.
                    } else {
                        console.log('Correo 2FA enviado:', info.response);
                    }
                });

                // Indicar al frontend que se necesita el código 2FA
                return res.status(200).json({
                    message: 'Verificación en dos pasos requerida. Se ha enviado un código a tu correo electrónico.',
                    twoFactorRequired: true // Señal para el frontend para mostrar el campo de código
                });

            } else {
                // **Paso 2: El usuario ha enviado el código 2FA.**
                const storedCode = user.two_factor_code;
                const storedExpiresAt = new Date(user.two_factor_code_expires_at);

                // Verificar si el código enviado coincide y si no ha expirado
                if (storedCode !== twoFactorCode || new Date() > storedExpiresAt) {
                    // Si es inválido o expirado, limpiar el código en DB (por seguridad)
                    await pool.query('UPDATE usuarios SET two_factor_code = NULL, two_factor_code_expires_at = NULL WHERE id = ?', [user.id]);
                    return res.status(401).json({ message: 'Código de verificación inválido o expirado. Por favor, intenta de nuevo.' });
                }

                // Si el código es válido, limpiar los campos 2FA de la base de datos para evitar reusos
                await pool.query(
                    'UPDATE usuarios SET two_factor_code = NULL, two_factor_code_expires_at = NULL WHERE id = ?',
                    [user.id]
                );
            }
        }

        // Si el 2FA no está habilitado, o si ya se completó la verificación 2FA, generar el JWT
        const token = jwt.sign(
            { id: user.id, nombre_usuario: user.nombre_usuario, rol: user.rol },
            JWT_SECRET,
            { expiresIn: '1h' } // El token expira en 1 hora
        );

        // Inicio de sesión exitoso
        res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            token: token,
            user: {
                id: user.id,
                nombre_usuario: user.nombre_usuario,
                email: user.email, // Asegúrate de que el email se traiga en la consulta SQL si lo quieres aquí
                rol: user.rol
            },
            twoFactorRequired: false // Indica que no se requirió 2FA o ya se completó
        });

    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};