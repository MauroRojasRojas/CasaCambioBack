

import express from 'express';
import { fetchDni } from './dni.controller.js';

const router = express.Router();

router.get('/:dni', fetchDni);

export default router;   