import express from 'express';
import cors from 'cors';
import authRoutes from '../backend_core/plugins/auth/routes';
import financeRoutes from '../backend_core/plugins/finance/routes';
import workRoutes from '../backend_core/plugins/work/routes';
import systemRoutes from '../backend_core/routes/systemRoutes';
import rewardRoutes from '../backend_core/plugins/reward/routes';
import adminRoutes from '../backend_core/plugins/admin/routes';

const app = express();
const router = express.Router();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '15mb' }) as any);

// Health Monitor Protocol
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: "Active", 
    node: "Vercel Serverless Cluster",
    timestamp: new Date().toISOString()
  });
});

/**
 * Modular Plugin Mounting
 * CRITICAL FIX: Ensure prefixing is consistent across local and cloud
 */
router.use('/auth', authRoutes);
router.use('/finance', financeRoutes);
router.use('/work', workRoutes);
router.use('/system', systemRoutes); 
router.use('/rewards', rewardRoutes);
router.use('/admin', adminRoutes);

// Mount the unified router under both possible entry points
app.use('/api', router);
app.use('/', router); 

// 404 Fallback
app.use((req: any, res: any) => {
  console.warn(`[404 Route Missing] ${req.method} ${req.url}`);
  res.status(404).json({ 
    success: false,
    message: `API Node missing: ${req.method} ${req.url}`,
    context: "Noor V3 Core Routing"
  });
});

export default app;