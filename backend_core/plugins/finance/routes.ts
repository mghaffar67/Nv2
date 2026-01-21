import express from 'express';
import { financePluginController } from './controller';
import { authMiddleware } from '../auth/middleware';
import { uploadMiddleware } from '../../middleware/upload';

/**
 * Noor Official V3 - Finance Node Router
 */
const router = express.Router();

router.post('/deposit', authMiddleware, uploadMiddleware.single('image'), financePluginController.depositReq);
router.post('/withdraw', authMiddleware, financePluginController.withdrawReq);
router.post('/activate-plan', authMiddleware, financePluginController.activatePlan);
router.get('/history', authMiddleware, financePluginController.getHistory);

export default router;