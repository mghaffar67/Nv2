
import express from 'express';
import { authMiddleware } from '../auth/middleware';
import { uploadMiddleware } from '../../middleware/upload';

/**
 * Noor Official V3 - Work & Gamification Node
 * Manages daily assignments and consistency rewards.
 */
const router = express.Router();

// 1. CLAIM STREAK: Rewards consistency
router.post('/claim-streak', authMiddleware, async (req: any, res: any) => {
  try {
    const user = req.user;
    const db = JSON.parse(localStorage.getItem('noor_mock_db') || '[]');
    const config = JSON.parse(localStorage.getItem('noor_config') || '{}');
    const uIdx = db.findIndex((u: any) => u.id === user.id);

    if (uIdx === -1) return res.status(404).json({ message: "Identity Node Missing" });

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const lastClaim = db[uIdx].lastCheckIn ? new Date(db[uIdx].lastCheckIn).toISOString().split('T')[0] : null;

    if (lastClaim === today) {
      return res.status(400).json({ message: "Bonus already synced for today. Refresh at 12:00 AM." });
    }

    let newStreak = (db[uIdx].streak || 0) + 1;
    if (db[uIdx].lastCheckIn) {
      const lastDate = new Date(db[uIdx].lastCheckIn).getTime();
      const diffHours = (now.getTime() - lastDate) / (1000 * 60 * 60);
      if (diffHours > 48) newStreak = 1;
      if (newStreak > 7) newStreak = 1;
    } else {
      newStreak = 1;
    }

    const rewards = config.streakRewards || [5, 5, 5, 10, 10, 15, 100];
    const rewardAmt = rewards[newStreak - 1] || 5;

    db[uIdx].balance = (Number(db[uIdx].balance) || 0) + rewardAmt;
    db[uIdx].streak = newStreak;
    db[uIdx].lastCheckIn = now.toISOString();

    if (!db[uIdx].transactions) db[uIdx].transactions = [];
    db[uIdx].transactions.unshift({
      id: `STRK-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      type: 'reward',
      amount: rewardAmt,
      status: 'approved',
      gateway: `Day ${newStreak} Bonus`,
      date: today,
      timestamp: now.toISOString()
    });

    localStorage.setItem('noor_mock_db', JSON.stringify(db));
    localStorage.setItem('noor_user', JSON.stringify({ ...db[uIdx], password: undefined }));

    return res.status(200).json({ 
      success: true,
      message: `PKR ${rewardAmt} credited to your node. Streak: ${newStreak} Days`,
      newBalance: db[uIdx].balance,
      newStreak: newStreak
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Logic Conflict" });
  }
});

// 2. GET TASKS
router.get('/tasks', authMiddleware, async (req: any, res: any) => {
  const tasks = JSON.parse(localStorage.getItem('noor_tasks_db') || '[]');
  const userPlan = req.user.currentPlan || 'None';
  const available = tasks.filter((t: any) => 
    t.isActive && (t.plan === userPlan || t.plan === 'BASIC' || !t.plan)
  );
  return res.status(200).json(available);
});

// 3. SUBMIT PROOF
router.post('/submit', authMiddleware, uploadMiddleware.single('proof'), async (req: any, res: any) => {
  const { taskId, taskTitle, reward } = req.body;
  const user = req.user;
  const proofPath = req.file ? req.file.path : req.body.image;

  if (!proofPath) return res.status(400).json({ message: "Evidence packet is missing." });

  const db = JSON.parse(localStorage.getItem('noor_mock_db') || '[]');
  const uIdx = db.findIndex((u: any) => u.id === user.id);

  if (!db[uIdx].workSubmissions) db[uIdx].workSubmissions = [];
  db[uIdx].workSubmissions.unshift({
    id: `SUB-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    taskId,
    taskTitle,
    reward: Number(reward),
    userAnswer: proofPath,
    status: 'pending',
    timestamp: new Date().toISOString()
  });

  localStorage.setItem('noor_mock_db', JSON.stringify(db));
  return res.status(201).json({ success: true, message: "Submission queued." });
});

export default router;
