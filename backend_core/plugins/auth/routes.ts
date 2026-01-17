
import express from 'express';
import { authPluginController } from './controller';
import { authMiddleware } from './middleware';

/**
 * Noor Official V3 - Security Protocol Router
 * Unified Entry/Exit Nodes
 */
const router = express.Router();

// Core Access Nodes
router.post('/register', authPluginController.register);
router.post('/login', authPluginController.login);

// Profile Sync Node
router.get('/me', authMiddleware, authPluginController.getMe);

export default router;
