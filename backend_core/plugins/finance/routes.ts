
import express from 'express';
import { financePluginController } from './controller';
import { authMiddleware } from '../auth/middleware';
import { uploadMiddleware } from '../../middleware/upload';

/**
 * Noor Official V3 - Finance Node Router
 * Authorized endpoints for capital flow and audit trails.
 */
const router = express.Router();

// Test Route for Verification
router.get('/test', (req, res) => res.status(200).json({ status: "Finance Node Online" }));

// 1. DEPOSIT: Requires Auth + Screenshot Audit Packet
// Now uses the consolidated controller logic to handle persistence
router.post('/deposit', authMiddleware, uploadMiddleware.single('image'), financePluginController.depositReq);

// 2. WITHDRAW: Standard Auth Node
router.post('/withdraw', authMiddleware, financePluginController.withdrawReq);

// 3. HISTORY: Audit Retrieval
router.get('/history', authMiddleware, financePluginController.getHistory);

export default router;
