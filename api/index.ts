import express from 'express';
import cors from 'cors';
import authRoutes from '../backend_core/plugins/auth/routes';
import financeRoutes from '../backend_core/plugins/finance/routes';
import workRoutes from '../backend_core/plugins/work/routes';
import systemRoutes from '../backend_core/plugins/system/routes';
import rewardRoutes from '../backend_core/plugins/reward/routes';

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://noorofficial.com',
  /\.vercel\.app$/ // Allow all Vercel deployments
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(o => typeof o === 'string' ? o === origin : o.test(origin))) {
      callback(null, true);
    } else {
      callback(new Error('CORS Policy Conflict.'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '15mb' }) as any);

// API Node Mounting
app.use('/api/auth', authRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/work', workRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/rewards', rewardRoutes);

// Vercel Health Probe
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "Vercel Node Active", database: "AWS MongoDB Linked" });
});

// For local testing
if (process.env.NODE_ENV !== 'production') {
  const PORT = 5000;
  app.listen(PORT, () => console.log(`🚀 Dev Hub running on port ${PORT}`));
}

export default app;