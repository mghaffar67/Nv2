
import express from 'express';
import cors from 'cors';
// Fix: Corrected imports to use default exports (routers) from modular plugins
import authRoutes from '../backend_core/plugins/auth/routes';
import financeRoutes from '../backend_core/plugins/finance/routes';
import workRoutes from '../backend_core/plugins/work/routes';

const app = express();
app.use(cors());
// Fix: Added 'as any' cast to express.json() to resolve middleware type mismatch
app.use(express.json({ limit: '10mb' }) as any);

// Initialize Modular Plugins
// Fix: Mount modular routers on their respective API paths
app.use('/api/auth', authRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/work', workRoutes);

// Legacy fallback routes can go here if needed

export default app;