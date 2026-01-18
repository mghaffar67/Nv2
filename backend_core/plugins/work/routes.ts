
import express from 'express';
import { authMiddleware } from '../auth/middleware';
import { workPluginController } from './controller';

const router = express.Router();

// Fetch tasks based on active plan
router.get('/tasks', authMiddleware, workPluginController.getTasks);

// Complete task and claim reward
router.post('/complete', authMiddleware, workPluginController.completeTask);

// Streak Rewards (existing logic kept)
import { gamificationController } from '../../controllers/gamificationController';
router.post('/claim-streak', authMiddleware, async (req: any, res: any) => {
  const config = JSON.parse(localStorage.getItem('noor_config') || '{}');
  req.body.streakRewards = config.streakRewards || [5, 5, 5, 10, 10, 15, 100];
  req.body.userId = req.user.id;
  return gamificationController.claimReward(req, res);
});

export default router;
