import { Router } from 'express';
import { tasasCambioController } from '../controller/tasas-cambio.controller.js';

const router = Router();

/**
 * GET /api/tasas-cambio/actual
 * Obtiene la tasa de cambio más reciente
 */
router.get('/actual', tasasCambioController.getTasaActual);

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
 * GET /api/tasas-cambio/:id
 * Obtiene una tasa por ID
 */
router.get('/:id', tasasCambioController.getTasaById);

/**
 * POST /api/tasas-cambio/actualizar
 * Fuerza una actualización manual de la tasa de cambio
 */
router.post('/actualizar', tasasCambioController.actualizarTasa);

export default router;
