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
            font-family: 'Roboto', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            overflow: hidden;
            border: 1px solid #ccc;
        }
        .header {
            background-color: #003366;
            color: #ffffff;
            padding: 25px;
            text-align: center;
            font-size: 22px;
            font-weight: bold;
        }
        .content {
            padding: 40px;
            color: #333333;
            font-size: 16px;
            line-height: 1.8;
        }
        .code-box {
            background-color: #808080;
            color: #ffffff;
            font-size: 30px;
            font-weight: bold;
            text-align: center;
            padding: 20px;
            margin: 30px 0;
            border-radius: 8px;
            letter-spacing: 4px;
            border: 2px solid #003366;
        }
        .footer {
            background-color: #f0f0f0;
            color: #555555;
            padding: 20px;
            text-align: center;
            font-size: 13px;
            border-top: 1px solid #ccc;
        }
        a {
            color: #003366;
            text-decoration: none;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            Verificación de Seguridad
        </div>
        <div class="content">
            <p>Hola <strong>${userName}</strong>,</p>
            <p>Hemos recibido una solicitud de inicio de sesión para tu usuario.</p>
            <p>Para completar el inicio de sesión, usa el siguiente código de verificación:</p>
            <div class="code-box">
                ${verificationCode}
            </div>
            <p>Este código es válido por <strong>${expiresInMinutes} minutos</strong>.</p>
            <p>Por seguridad, no compartas este código con nadie.</p>
            <p>Si no solicitaste este código, ignora este mensaje.</p>
            <p>Saludos<br>
            Parque Industrial SanJose </p>
        </div>
        <div class="footer">
            <p>Este es un correo automatizado, no respondas.</p>
            <p>&copy; ${new Date().getFullYear()} Tu Aplicación. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
`;
};