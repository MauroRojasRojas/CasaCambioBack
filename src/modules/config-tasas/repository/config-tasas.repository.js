// src/modules/config-tasas/repository/config-tasas.repository.js
import pool from '../../../keys.js';

export const configTasasRepository = {

    /** Obtiene la única fila de configuración */
    async getConfig() {
        const [rows] = await pool.execute(
            'SELECT * FROM config_tasas LIMIT 1'
        );
        return rows[0] || null;
    },

    /** Actualiza la configuración completa */
    async updateConfig({ modo, margen_compra, margen_venta, tasa_compra_usd_manual, tasa_venta_usd_manual, actualizado_por }) {
        const query = `
            UPDATE config_tasas
            SET modo                  = ?,
                margen_compra         = ?,
                margen_venta          = ?,
                tasa_compra_usd_manual = ?,
                tasa_venta_usd_manual  = ?

            WHERE id = 1
        `;
        const values = [
            modo,
            margen_compra,
            margen_venta,
            tasa_compra_usd_manual ?? null,
            tasa_venta_usd_manual  ?? null
        ];
        const [result] = await pool.execute(query, values);
        return result.affectedRows > 0;
    }
};