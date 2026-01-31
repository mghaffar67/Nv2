import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Noor V3 - Hardened Core Server (AWS/Vercel Ready)
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from './plugins/auth/routes';
import financeRoutes from './plugins/finance/routes';
import workRoutes from './plugins/work/routes';
import systemRoutes from './plugins/system/routes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '15mb' }) as any);

// Health Monitor Protocol
app.get('/health', (req, res) => {
  res.status(200).json({
    status: "Healthy",
    node: "Production Cluster",
    uptime: (process as any).uptime(),
    timestamp: new Date().toISOString()
  });
});

// Plugin Mounting
app.use('/api/auth', authRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/work', workRoutes);
app.use('/api/system', systemRoutes);

// Production Build Assets
const DIST_PATH = path.join(__dirname, '../dist');
app.use(express.static(DIST_PATH) as any);

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(DIST_PATH, 'index.html'));
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`🚀 NOOR CORE V3 Dev Node Active: ${PORT}`));
}

export default app;