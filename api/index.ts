
import express from 'express';
import cors from 'cors';
import authRoutes from '../backend_core/plugins/auth/routes';
import financeRoutes from '../backend_core/plugins/finance/routes';
import workRoutes from '../backend_core/plugins/work/routes';
import systemRoutes from '../backend_core/plugins/system/routes';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }) as any);

// Fast Routing Protocol
app.use('/api/auth', authRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/work', workRoutes);
app.use('/api/system', systemRoutes);

export default app;
