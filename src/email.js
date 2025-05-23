// src/config/email.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'; // Necesario para cargar variables de entorno

dotenv.config(); // Carga las variables de entorno del archivo .env

// Configuración del transportador de Nodemailer para Gmail
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,       // Debería ser 'smtp.gmail.com'
    port: parseInt(process.env.EMAIL_PORT, 10), // Debería ser 587 (parseamos a número)
    secure: process.env.EMAIL_SECURE === 'true', // false para el puerto 587 (TLS)
    auth: {
        user: process.env.EMAIL_USER,    
        pass: process.env.EMAIL_PASS     
    },
    // Esto es opcional, pero ayuda a evitar errores de certificado en algunos entornos.
    // En producción, siempre es mejor tenerlo en 'true'.
    tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production'
    }
});

// Opcional: Verificación de la conexión al servidor de correo.
// Es útil para depurar al inicio.
transporter.verify(function (error, success) {
    if (error) {
        console.error('Error al conectar con el servidor de correo:', error);
    } else {
        console.log('Servidor de correo listo para enviar mensajes.');
    }
});

export default transporter;