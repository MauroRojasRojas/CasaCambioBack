import { Router } from 'express';
import { operacionesController } from '../controller/operaciones.controller.js';
import { verifyJWT } from '../../../middleware/auth/verifiy-jwt.js';
import { requireAdmin } from '../../../middleware/auth/requireAdmin.js';

const router = Router();

// Rutas fijas primero (para que no las intercepte :id)
router.get('/admin', verifyJWT, requireAdmin, operacionesController.listAdmin);
router.get('/admin/estadisticas', verifyJWT, requireAdmin, operacionesController.getEstadisticas);
router.get('/admin/export', verifyJWT, requireAdmin, operacionesController.exportExcel);
router.get('/persona/:personaCode', verifyJWT, operacionesController.getByPersonaCode);

// Rutas con parámetros dinámicos (van al final)
router.post('/', verifyJWT, operacionesController.create);
router.get('/', verifyJWT, requireAdmin, operacionesController.list);
router.get('/:id', verifyJWT, operacionesController.getById);
router.put('/:codigoOperacion/estado', verifyJWT, requireAdmin, operacionesController.updateEstado);
router.put('/:id/tasa', verifyJWT, requireAdmin, operacionesController.updateTasa);
router.put('/:id', verifyJWT, requireAdmin, operacionesController.update);
router.delete('/:id', verifyJWT, requireAdmin, operacionesController.delete);

export default router;