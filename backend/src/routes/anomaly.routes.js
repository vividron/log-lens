import { Router } from 'express';
import { getAnomalies, getAnomalyById, analyzeAnomaly } from '../controllers/anomaly.controller.js';

const router = Router();

router.get('/', getAnomalies);
router.get('/:id', getAnomalyById);
router.post('/:id/analyze', analyzeAnomaly);

export default router;
