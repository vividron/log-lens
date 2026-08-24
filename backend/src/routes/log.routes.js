import { Router } from 'express';
import { upload } from '../middleware/upload.middleware.js';
import { uploadLogs, getLogs, getLog, deleteLogs } from '../controllers/log.controller.js';

const router = Router();

router.post('/upload', upload.single('file'), uploadLogs);
router.get('/', getLogs);
router.get('/:id', getLog);
router.delete('/', deleteLogs);

export default router;
