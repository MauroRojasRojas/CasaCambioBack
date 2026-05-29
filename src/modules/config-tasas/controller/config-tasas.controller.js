// src/modules/config-tasas/controller/config-tasas.controller.js
import { configTasasService } from '../services/config-tasas.service.js';
import { ApiResponse } from '../../../core/utils/api-response.js';

export const configTasasController = {

    async getConfig(req, res, next) {
        try {
            const config = await configTasasService.getConfig();
            return ApiResponse.success(res, config, 'Configuración obtenida exitosamente');
        } catch (error) {
            next(error);
        }
    },

    async updateConfig(req, res, next) {
        try {
            // req.user?.email si tienes JWT, si no pasa null
            const usuarioEmail = req.user?.email ?? null;
            const config = await configTasasService.updateConfig(req.body, usuarioEmail);
            return ApiResponse.success(res, config, 'Configuración actualizada exitosamente');
        } catch (error) {
            next(error);
        }
    }
};