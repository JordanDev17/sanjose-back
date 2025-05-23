// src/templates/twoFactorEmail.js

/**
 * Genera la plantilla HTML para el correo de verificación de dos factores.
 * @param {string} userName - El nombre de usuario.
 * @param {string} verificationCode - El código de verificación.
 * @param {number} expiresInMinutes - El tiempo de expiración del código en minutos.
 * @returns {string} La plantilla HTML del correo.
 */
export const twoFactorEmailTemplate = (userName, verificationCode, expiresInMinutes) => {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Código de Verificación para Inicio de Sesión</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: none;
            -ms-text-size-adjust: none;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #007bff; /* Color azul para el encabezado */
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .content {
            padding: 30px;
            color: #333333;
            line-height: 1.6;
        }
        .code-box {
            background-color: #e9ecef; /* Fondo gris claro para el código */
            color: #007bff; /* Color azul para el código */
            font-size: 28px;
            font-weight: bold;
            text-align: center;
            padding: 15px 0;
            margin: 20px 0;
            border-radius: 5px;
            letter-spacing: 3px;
        }
        .footer {
            background-color: #f0f0f0;
            color: #777777;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            border-top: 1px solid #e0e0e0;
        }
        a {
            color: #007bff;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Verificación de Seguridad</h2>
        </div>
        <div class="content">
            <p>Hola <strong>${userName}</strong>,</p>
            <p>Hemos recibido una solicitud de inicio de sesión para tu cuenta.</p>
            <p>Para completar el inicio de sesión, por favor usa el siguiente código de verificación:</p>
            <div class="code-box">
                ${verificationCode}
            </div>
            <p>Este código es válido por <strong>${expiresInMinutes} minutos</strong>.</p>
            <p>Por tu seguridad, no compartas este código con nadie.</p>
            <p>Si no solicitaste este código, por favor ignora este correo electrónico.</p>
            <p>Saludos cordiales,<br>
            El equipo de tu aplicación</p>
        </div>
        <div class="footer">
            <p>Este es un correo electrónico automatizado, por favor no respondas a este mensaje.</p>
            <p>&copy; ${new Date().getFullYear()} Tu Aplicación. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
    `;
};