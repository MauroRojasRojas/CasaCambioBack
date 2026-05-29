// src/modules/config-tasas/router/config-tasas.routes.js
import { Router } from 'express';
import { configTasasController } from '../controller/config-tasas.controller.js';

const router = Router();

// GET  /api/config-tasas       → obtener config actual
router.get('/', configTasasController.getConfig);

// PUT  /api/config-tasas       → actualizar config
router.put('/', configTasasController.updateConfig);

export default router;