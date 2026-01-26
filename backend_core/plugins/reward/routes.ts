
import express from 'express';
import { authMiddleware } from '../auth/middleware';
import { rewardController } from './controller';

const router = express.Router();

// Admin Endpoints
router.get('/admin/list', authMiddleware, rewardController.getRewards);
router.post('/admin/save', authMiddleware, rewardController.saveReward);
router.delete('/admin/:id', authMiddleware, rewardController.deleteReward);

// User Endpoints
router.get('/my-achievements', authMiddleware, rewardController.getUserAchievements);
router.post('/claim', authMiddleware, rewardController.claimReward);

export default router;
