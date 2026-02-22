import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

// Noor V3 - Unified Full-Stack Entry Point
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import existing routes from backend_core
import authRoutes from './backend_core/plugins/auth/routes';
import financeRoutes from './backend_core/plugins/finance/routes';
import workRoutes from './backend_core/plugins/work/routes';
import systemRoutes from './backend_core/plugins/system/routes';
import rewardRoutes from './backend_core/plugins/reward/routes';
import adminRoutes from './backend_core/plugins/admin/routes';

async function startServer() {
  const app = express();
  const PORT = 3000; // Platform requirement

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '15mb' }) as any);

  // Request Logging Protocol
  app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
  });

  app.get('/api/test-db', async (req, res) => {
    try {
      const { dbNode } = await import('./backend_core/utils/db');
      const data = await dbNode.getIntegrations();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Health Monitor Protocol
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: "Healthy",
      node: "Production Cluster",
      timestamp: new Date().toISOString()
    });
  });

  // Primary Plugin Mounting - Unified /api prefix
  app.use('/api/auth', authRoutes);
  app.use('/api/finance', financeRoutes);
  app.use('/api/work', workRoutes);
  
  // System Plugin Mounting
  app.use('/api/system', systemRoutes);
  
  app.use('/api/rewards', rewardRoutes);
  app.use('/api/admin', adminRoutes);

  // 404 Fallback for API
  app.use('/api/*', (req, res) => {
    console.warn(`[404] API Node missing: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ 
      success: false, 
      message: `API Node missing: ${req.method} ${req.originalUrl}` 
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    // Vite middleware for development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production Build Assets
    const DIST_PATH = path.join(__dirname, 'dist');
    app.use(express.static(DIST_PATH) as any);

    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(DIST_PATH, 'index.html'));
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 NOOR CORE V3 Active on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
