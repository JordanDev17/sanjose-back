// src/routes/contact.routes.js

import express from 'express';
// Importamos el 'transporter' que ya tienes configurado
import transporter from '../email.js'; 

const router = express.Router();

// Definimos la ruta usando el método POST, ya que recibirá datos.
// La ruta completa será '/api/contact' cuando la integremos en server.js
router.post('/contact', async (req, res) => {
    // 1. Extraemos los datos del cuerpo (body) de la petición que enviará Angular.
    const { name, email, message } = req.body;

    // 2. Validación simple: nos aseguramos de que los campos necesarios no estén vacíos.
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Por favor, completa todos los campos.' });
    }

    // 3. Creamos el objeto con las opciones del correo.
    const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`, // El nombre del remitente que verás en tu bandeja de entrada.
        to: process.env.EMAIL_USER,                     // La dirección donde recibirás los mensajes. ¡Tu propio correo!
        replyTo: email,                                 // ¡MUY IMPORTANTE! Esto hace que al darle "Responder", le respondas al usuario, no a ti mismo.
        subject: `Nuevo mensaje de contacto de: ${name}`, // Asunto del correo.
        
        // El cuerpo del correo. Usamos HTML para que se vea bien.
        html: `
            <h1>Formulario de Usuarios</h1>
            <p>Has recibido un nuevo mensaje de contacto:</p>
            <ul>
                <li><strong>Nombre:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
            </ul>
            <h2>Mensaje:</h2>
            <p>${message}</p>
        `
    };

    // 4. Usamos un bloque try...catch para manejar el envío y los posibles errores.
    try {
        // Usamos el transporter para enviar el correo con las opciones que definimos.
        await transporter.sendMail(mailOptions);
        // Si todo va bien, enviamos una respuesta de éxito al frontend.
        res.status(200).json({ success: true, message: 'Mensaje enviado con éxito.' });

    } catch (error) {
        console.error('Error al enviar el correo de contacto:', error);
        // Si hay un error, lo registramos y enviamos una respuesta de error al frontend.
        res.status(500).json({ success: false, message: 'Hubo un error al enviar el mensaje. Inténtalo de nuevo más tarde.' });
    }
});

export default router;