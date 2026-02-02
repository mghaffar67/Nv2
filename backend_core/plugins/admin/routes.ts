import express from 'express';
import { dbNode } from '../../utils/db';
import { authMiddleware } from '../auth/middleware';
import { adminPluginController } from './controller';
import { adminController } from '../../controllers/adminController';
import { workController } from '../../controllers/workController';
import { financeController } from '../../controllers/financeController';

const router = express.Router();

/**
 * Noor V3 - Admin Management Hub
 */

// Member Management
router.get('/users', authMiddleware, async (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: "Forbidden" });
  try {
    const users = await dbNode.getUsers();
    const safeUsers = users.map(({ password, ...u }: any) => u);
    res.json(safeUsers);
  } catch (e) {
    res.status(500).json({ message: "Registry error" });
  }
});

router.put('/users/balance', authMiddleware, adminController.editUserBalance);

// Staff Management
router.get('/staff', authMiddleware, async (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: "Forbidden" });
  try {
    const allUsers = await dbNode.getUsers();
    const staff = allUsers.filter((u: any) => u.role === 'admin' || u.role === 'manager');
    const safeStaff = staff.map(({ password, ...u }: any) => u);
    res.json(safeStaff);
  } catch (e) {
    res.status(500).json({ message: "Staff sync failure" });
  }
});

// Finance Audit Nodes
router.get('/finance/deposits', authMiddleware, financeController.getAllDeposits);
router.get('/finance/withdrawals', authMiddleware, financeController.getAllWithdrawals);
router.post('/finance/deposit/approve', authMiddleware, financeController.approveDeposit);
router.post('/finance/deposit/reject', authMiddleware, financeController.rejectDeposit);
router.post('/finance/withdraw/approve', authMiddleware, financeController.approveWithdrawal);
router.post('/finance/withdraw/reject', authMiddleware, financeController.rejectWithdrawal);

// Requests generic management
router.post('/finance/requests/manage', authMiddleware, adminPluginController.processRequestAction);

// Task Inventory
router.get('/tasks', authMiddleware, async (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: "Forbidden" });
  try {
    const tasks = await dbNode.getTasks();
    res.json(tasks);
  } catch (e) {
    res.status(500).json({ message: "Task Node error" });
  }
});

router.post('/tasks', authMiddleware, workController.createTask);

// Sidebar stats
router.get('/pending-stats', authMiddleware, adminPluginController.getPendingStats);

export default router;