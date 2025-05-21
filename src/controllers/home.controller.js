import { pool } from '../db.js';

/**
 * Obtiene los datos del dashboard, incluyendo noticias y bodegas
 */
export const getDashboardData = async (req, res) => {
    try {
        // Obtener noticias y bodegas en paralelo para mejorar eficiencia
        const [newsPromise, warehousePromise] = await Promise.all([
            pool.query('SELECT * FROM news'),
            pool.query('SELECT * FROM warehouse')
        ]);

        // Extraer los resultados
        const [news] = newsPromise;
        const [warehouse] = warehousePromise;

        res.json({ news, warehouse });

    } catch (error) {
        console.error('Error obteniendo datos del dashboard:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
