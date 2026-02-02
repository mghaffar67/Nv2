
import express from 'express';
import cors from 'cors';
import path from 'path';
// Fix: Added import to help define __dirname in an ES module environment
import { fileURLToPath } from 'url';

/**
 * Noor Official V3 - Purified Core Server
 * Architecture: Modular Plugin Protocol
 */

// Fix: Define __filename and __dirname for ESM compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. PLUGIN SOURCE OF TRUTH
import authRoutes from './plugins/auth/routes';
import financeRoutes from './plugins/finance/routes';
import workRoutes from './plugins/work/routes';
import systemRoutes from './plugins/system/routes';

const app = express();
const PORT = process.env.PORT || 5000;

// 2. MIDDLEWARE STACK
app.use(cors());
app.use(express.json({ limit: '50mb' }) as any);
app.use(express.urlencoded({ extended: true }) as any);

// Security Header Injection
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Powered-By', 'Noor-Core-V3');
  next();
});

// 3. API DOMAIN MOUNTING
app.use('/api/auth', authRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/work', workRoutes);
app.use('/api/system', systemRoutes);

// 4. PRODUCTION ASSET PIPELINE (React Integration)
const DIST_PATH = path.join(__dirname, '../dist');

// Serve static assets from the frontend build
app.use(express.static(DIST_PATH) as any);

// SPA Catch-all: Ensure client-side routing works for all URLs
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(DIST_PATH, 'index.html'));
  }
});

// 5. GLOBAL EXCEPTION HANDLER
app.use((err: any, req: any, res: any, next: any) => {
  console.error('🔥 [CORE_ALERT]:', err.message);
  res.status(500).json({ 
    success: false, 
    message: 'Internal Logic Conflict. Audit Logs Generated.' 
  });
});

app.listen(PORT, () => {
  console.log(`
  -----------------------------------------
  🚀 NOOR OFFICIAL V3 CORE: ACTIVE
  -----------------------------------------
  PORT:      ${PORT}
  ARCH:      Modular Plugin System
  DOMAIN:    http://localhost:${PORT}
  STATUS:    Hardened & Purified
  -----------------------------------------
  `);
});

export default app;
