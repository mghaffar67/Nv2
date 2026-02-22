import express from 'express';
import { authPluginController } from './controller';
import { authMiddleware } from './middleware';
import { uploadMiddleware } from '../../middleware/upload';

/**
 * Noor Official V3 - Security Protocol Router
 */
const router = express.Router();

// Core Access Nodes
router.post('/register', authPluginController.register);
router.post('/login', authPluginController.login);

// Profile Sync Node
router.get('/me', authMiddleware, authPluginController.getMe);

// Support Relay Node
router.post('/support-message', authMiddleware, authPluginController.submitSupportMessage);

// Management Nodes
router.put('/profile', authMiddleware, uploadMiddleware.single('image'), authPluginController.updateProfile);
router.put('/password', authMiddleware, authPluginController.changePassword);

// Team Hierarchy Node
router.get('/team', authMiddleware, authPluginController.getTeam);

export default router;