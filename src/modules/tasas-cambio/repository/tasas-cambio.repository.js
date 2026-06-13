import pool from '../../../keys.js';

export const tasasCambioRepository = {
    // Crear un registro de tasa de cambio
    async create(tasaData) {
        const {
            tasa_api,
            margen_compra,
            margen_venta,
            tasa_compra_usd,
            tasa_venta_usd,
            tasa_compra_pen,
            tasa_venta_pen,
            fecha_hora
        } = tasaData;

        const query = `
            INSERT INTO tasas_cambio (
                fecha_hora, tasa_api, margen_compra, margen_venta,
                tasa_compra_usd, tasa_venta_usd,
                tasa_compra_pen, tasa_venta_pen
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            fecha_hora || new Date(),
            tasa_api,
            margen_compra,
            margen_venta,
            tasa_compra_usd,
            tasa_venta_usd,
            tasa_compra_pen,
            tasa_venta_pen
        ];

        const [result] = await pool.execute(query, values);
        return result.insertId;
    },

    // Obtener la tasa más reciente
    async findLatest() {
        const query = `
            SELECT * FROM tasas_cambio 
            ORDER BY fecha_hora DESC 
            LIMIT 1
        `;
        const [rows] = await pool.execute(query);
        return rows[0] || null;
    },

    // Obtener histórico de tasas
    async findAll(limit = 100) {
        const query = `
            SELECT * FROM tasas_cambio 
            ORDER BY fecha_hora DESC 
            LIMIT ?
        `;
        const [rows] = await pool.execute(query, [limit]);
        return rows;
    },

    // Obtener tasas por rango de fechas
    async findByDateRange(fechaInicio, fechaFin) {
        const query = `
            SELECT * FROM tasas_cambio 
            WHERE fecha_hora BETWEEN ? AND ?
            ORDER BY fecha_hora DESC
        `;
        const [rows] = await pool.execute(query, [fechaInicio, fechaFin]);
        return rows;
    },

    // Obtener por ID
    async findById(id) {
        const query = 'SELECT * FROM tasas_cambio WHERE id = ?';
        const [rows] = await pool.execute(query, [id]);
        return rows[0] || null;
    },

    // Obtener tasa API histórica (1 registro por día, el último de cada fecha)
    async findDailyByDateRange(fechaInicio, fechaFin) {
        const query = `
            SELECT DATE(fecha_hora) AS fecha,
                   tasa_api
            FROM tasas_cambio
            WHERE fecha_hora >= ?
              AND fecha_hora < DATE_ADD(?, INTERVAL 1 DAY)
              AND tasa_api IS NOT NULL
            ORDER BY fecha_hora DESC
        `;
        const [rows] = await pool.execute(query, [fechaInicio, fechaFin]);

        // Agrupar por fecha quedándonos con el primer registro (más reciente de ese día)
        const seen = new Set();
        const result = [];
        for (const row of rows) {
            const fechaKey = row.fecha instanceof Date
                ? row.fecha.toISOString().split('T')[0]
                : String(row.fecha).split(' ')[0];
            if (!seen.has(fechaKey)) {
                seen.add(fechaKey);
                result.push({ fecha: fechaKey, tasa_api: parseFloat(row.tasa_api) });
            }
        }
        return result.sort((a, b) => a.fecha.localeCompare(b.fecha));
    }
};
