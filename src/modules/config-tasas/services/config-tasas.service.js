// src/modules/config-tasas/services/config-tasas.service.js
import { configTasasRepository } from '../repository/config-tasas.repository.js';
import { AppError } from '../../../core/errors/app-error.js';

export const configTasasService = {

    async getConfig() {
        const config = await configTasasRepository.getConfig();
        if (!config) {
            throw new AppError('No existe configuración de tasas', 500, 'CONFIG_NOT_FOUND');
        }
        return config;
    },

    async updateConfig(body, usuarioEmail = null) {
        const { modo, margen_compra, margen_venta, tasa_compra_usd_manual, tasa_venta_usd_manual } = body;

        // --- Validaciones ---
        if (!['AUTO', 'MANUAL'].includes(modo)) {
            throw new AppError('modo debe ser AUTO o MANUAL', 400, 'INVALID_MODO');
        }

        if (modo === 'AUTO') {
            // En modo AUTO se requieren los márgenes
            if (margen_compra == null || margen_venta == null) {
                throw new AppError('margen_compra y margen_venta son requeridos en modo API', 400, 'MISSING_MARGENES');
            }
            if (margen_compra < 0 || margen_compra > 0.10) {
                throw new AppError('margen_compra debe estar entre 0 y 0.10 (10%)', 400, 'INVALID_MARGEN');
            }
            if (margen_venta < 0 || margen_venta > 0.10) {
                throw new AppError('margen_venta debe estar entre 0 y 0.10 (10%)', 400, 'INVALID_MARGEN');
            }
        }

        if (modo === 'MANUAL') {
            // En modo MANUAL se requieren las tasas fijas
            if (!tasa_compra_usd_manual || !tasa_venta_usd_manual) {
                throw new AppError('tasa_compra_usd_manual y tasa_venta_usd_manual son requeridas en modo MANUAL', 400, 'MISSING_TASAS_MANUAL');
            }
            if (parseFloat(tasa_compra_usd_manual) <= 0 || parseFloat(tasa_venta_usd_manual) <= 0) {
                throw new AppError('Las tasas manuales deben ser mayores a 0', 400, 'INVALID_TASAS');
            }
            // La tasa de compra siempre debe ser menor a la de venta
            // (el negocio compra barato y vende caro)
            if (parseFloat(tasa_compra_usd_manual) >= parseFloat(tasa_venta_usd_manual)) {
                throw new AppError('tasa_compra_usd_manual debe ser menor que tasa_venta_usd_manual', 400, 'INVALID_SPREAD');
            }
        }

        const updated = await configTasasRepository.updateConfig({
            modo,
            margen_compra:          modo === 'AUTO' ? parseFloat(margen_compra) : null,
            margen_venta:           modo === 'AUTO' ? parseFloat(margen_venta)  : null,
            tasa_compra_usd_manual: modo === 'MANUAL' ? parseFloat(tasa_compra_usd_manual) : null,
            tasa_venta_usd_manual:  modo === 'MANUAL' ? parseFloat(tasa_venta_usd_manual)  : null,
            
        });

        if (!updated) {
            throw new AppError('No se pudo actualizar la configuración', 500, 'UPDATE_FAILED');
        }

        return await configTasasRepository.getConfig();
    }
};