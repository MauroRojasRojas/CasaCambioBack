import express from 'express';
import { personasNaturalesController } from '../controller/personas-naturales.controller.js';

const router = express.Router();

// Rutas para personas naturales
router.post('/', personasNaturalesController.create);
router.get('/', personasNaturalesController.list);
router.get('/:id', personasNaturalesController.getById);
router.put('/:id', personasNaturalesController.update);
router.delete('/:id', personasNaturalesController.delete);

export default router;