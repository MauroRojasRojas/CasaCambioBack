import { Router } from 'express';
import { tasasCambioController } from '../controller/tasas-cambio.controller.js';

const router = Router();

/**
 * GET /api/tasas-cambio/actual
 * Obtiene la tasa de cambio más reciente
 */
router.get('/actual', tasasCambioController.getTasaActual);
router.get('/tasa-api', tasasCambioController.getTasaApi);
router.get('/tasa-recomendada', tasasCambioController.getTasaRecomendada);
/**
 * GET /api/tasas-cambio/historico
 * Obtiene el histórico de tasas de cambio
 * Query params: limit (opcional)
 */
router.get('/historico', tasasCambioController.getHistorico);

/**
 * GET /api/tasas-cambio/rango
 * Obtiene tasas por rango de fechas
 * Query params: fechaInicio, fechaFin
 */
router.get('/rango', tasasCambioController.getTasasByDateRange);

/**
 * POST /api/tasas-cambio/actualizar
 * Fuerza una actualización manual de la tasa de cambio
 */
router.post('/actualizar', tasasCambioController.actualizarTasa);

/**
 * GET /api/tasas-cambio/desde-inicio-ano/:dia/:mes/:ano
 * Obtiene tasas de cambio desde el inicio del año hasta la fecha indicada
 * Params: dia, mes, ano (ej: /19/02/2026)
 */
router.get('/desde-inicio-ano/:dia/:mes/:ano', tasasCambioController.getTasasDesdeInicioAno);

/**
 * GET /api/tasas-cambio/:id
 * Obtiene una tasa por ID
 */
router.get('/:id', tasasCambioController.getTasaById);

export default router;
