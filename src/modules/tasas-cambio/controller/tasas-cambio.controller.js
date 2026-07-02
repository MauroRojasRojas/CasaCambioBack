import { tasasCambioService } from '../services/tasas-cambio.service.js';
import { ApiResponse } from '../../../core/utils/api-response.js';
import { tasasCambioRepository } from '../repository/tasas-cambio.repository.js';
export const tasasCambioController = {
    /**
     * GET /api/tasas-cambio/actual
     * Obtiene la tasa de cambio más reciente
     */
    async getTasaActual(req, res, next) {
        try {
            const tasa = await tasasCambioService.getTasaActual();
            return ApiResponse.success(res, tasa, 'Tasa de cambio actual obtenida exitosamente');
        } catch (error) {
            next(error);
        }
    },

    /**
     * GET /api/tasas-cambio/historico
     * Obtiene el histórico de tasas de cambio
     * Query params: limit (opcional, default 100)
     */
    async getHistorico(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 100;
            const historico = await tasasCambioService.getHistorico(limit);
            return ApiResponse.success(res, historico, `Histórico de ${historico.length} tasas obtenido exitosamente`);
        } catch (error) {
            next(error);
        }
    },

    /**
     * GET /api/tasas-cambio/rango
     * Obtiene tasas por rango de fechas
     * Query params: fechaInicio, fechaFin (formato: YYYY-MM-DD)
     */
    async getTasasByDateRange(req, res, next) {
        try {
            const { fechaInicio, fechaFin } = req.query;
            const tasas = await tasasCambioService.getTasasByDateRange(fechaInicio, fechaFin);
            return ApiResponse.success(res, tasas, `${tasas.length} tasas obtenidas para el rango especificado`);
        } catch (error) {
            next(error);
        }
    },

    /**
     * GET /api/tasas-cambio/:id
     * Obtiene una tasa por ID
     */
    async getTasaById(req, res, next) {
        try {
            const { id } = req.params;
            const tasa = await tasasCambioService.getTasaById(id);
            return ApiResponse.success(res, tasa, 'Tasa de cambio obtenida exitosamente');
        } catch (error) {
            next(error);
        }
    },

    /**
     * POST /api/tasas-cambio/actualizar
     * Fuerza una actualización manual de la tasa de cambio
     */
    async actualizarTasa(req, res, next) {
        try {
            const tasa = await tasasCambioService.fetchAndSaveTasaCambio();
            return ApiResponse.success(res, tasa, 'Tasa de cambio actualizada exitosamente');
        } catch (error) {
            next(error);
        }
    },

    /**
     * GET /api/tasas-cambio/desde-inicio-ano/:dia/:mes/:ano
     * Obtiene tasas de cambio desde inicio de año hasta la fecha indicada
     * Parámetros: dia, mes, ano (ej: 19/02/2026)
     */
    async getTasasDesdeInicioAno(req, res, next) {
        try {
            const { dia, mes, ano } = req.params;
            const tasas = await tasasCambioService.getTasasDesdeInicioAno(dia, mes, ano);
            return ApiResponse.success(res, tasas, `${tasas.length} tasas obtenidas desde inicio de año`);
        } catch (error) {
            next(error);
        }
    } ,

async getTasaApi(req, res, next) {
    try {
        const tasa = await tasasCambioService.getTasaApiRaw();
        return ApiResponse.success(res, { tasa_api: tasa });
    } catch (error) {
        next(error);
    }
},

async getTasaRecomendada(req, res, next) {
    try {
        const tasa = await tasasCambioService.getTasaRecomendada();
        return ApiResponse.success(res, tasa, 'Tasa recomendada obtenida exitosamente');
    } catch (error) {
        next(error);
    }
}
};
