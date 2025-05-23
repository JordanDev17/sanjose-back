import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js'; // Importa el secreto JWT desde tu config

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({ message: 'No se proporcionó un token.' });
    }

    const token = authHeader.split(' ')[1]; // Esperamos 'Bearer <token>'

    if (!token) {
        return res.status(403).json({ message: 'Formato de token inválido.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id: userId, rol: userRol }
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado.' });
        }
        return res.status(401).json({ message: 'Token inválido o no autorizado.' });
    }
};

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.rol) {
            return res.status(403).json({ message: 'Acceso denegado. Rol de usuario no definido.' });
        }

        if (!allowedRoles.includes(req.user.rol)) {
            return res.status(403).json({ message: 'Acceso denegado. Su rol no tiene permiso para esta acción.' });
        }

        next();
    };
};