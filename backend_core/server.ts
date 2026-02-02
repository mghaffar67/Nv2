
import express from 'express';
import cors from 'cors';
import { dbNode } from './utils/db';

/**
 * Noor Official V3 - Core Production Server
 * Optimized for MongoDB connectivity and high-speed routing.
 */

import authRoutes from './plugins/auth/routes';
import financeRoutes from './plugins/finance/routes';
import workRoutes from './plugins/work/routes';
import systemRoutes from './plugins/system/routes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }) as any);

// API DOMAIN MOUNTING
app.use('/api/auth', authRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/work', workRoutes);
app.use('/api/system', systemRoutes);

// Global Exception Handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('🔥 [CORE_ALERT]:', err.message);
  res.status(500).json({ 
    success: false, 
    message: 'Internal Logic Conflict. Audit Logs Generated.' 
  });
});

// Initialization Protocol
const boot = async () => {
  try {
    await dbNode.connect();
    app.listen(PORT, () => {
      console.log(`
      -----------------------------------------
      🚀 NOOR OFFICIAL V3: ACTIVE
      -----------------------------------------
      PORT:      ${PORT}
      DATABASE:  MongoDB Atlas (Online)
      STATUS:    Ready for Requests
      -----------------------------------------
      `);
    });
  } catch (error) {
    console.error("FATAL: System could not start. Database connection required.");
    // Fix process.exit error with type cast
    (process as any).exit(1);
  }
};

boot();

export default app;
