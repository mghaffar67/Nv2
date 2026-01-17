
import express from 'express';
import cors from 'cors';
import path from 'path';

// Manual Route Imports for Force Connection
import authRoutes from './plugins/auth/routes';
import financeRoutes from './plugins/finance/routes';
import workRoutes from './plugins/work/routes';
import systemRoutes from './plugins/system/routes';

/**
 * Noor Official V3 - Core Entry Node
 * Manual Mounting Protocol for Step 7
 */
const app = express();

// 1. GLOBAL MIDDLEWARE
app.use(cors());
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true }));

// 2. STATIC ASSET SERVING
app.use('/uploads', express.static(path.join((process as any).cwd(), 'public/uploads')));

// 3. MANUAL ROUTE MOUNTING (Direct Connection)
app.use('/api/auth', authRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/work', workRoutes);
app.use('/api/system', systemRoutes); // Fixed: Mounted system routes

// 4. API 404 CATCH-ALL
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API Route Not Found. Resource node moved or deleted.',
    requested_path: req.originalUrl 
  });
});

// 5. GLOBAL ERROR HANDLER
app.use((err: any, req: any, res: any, next: any) => {
  console.error('🔥 SYSTEM_ERROR:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal Logic Conflict detected.',
    error: err.message 
  });
});

export default app;
