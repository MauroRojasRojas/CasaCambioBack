import express from 'express';
import { fetchRuc } from './ruc.controller.js';

const router = express.Router();

router.get('/:ruc', fetchRuc);

export default router;