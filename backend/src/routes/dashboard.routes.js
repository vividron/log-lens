import { Router } from 'express';
import { getStats, getActivity, topSources, anomalyBreakdown } from '../controllers/dashboard.controller.js';

const router = Router();
router.get('/stats', getStats);
router.get('/timeline', getActivity);
router.get('/activity', getActivity);
router.get('/top-sources', topSources);
router.get('/anomaly-breakdown', anomalyBreakdown);
export default router;
