
import express from 'express';
import { systemPluginController } from './controller';
import { seoController } from './seoController';
import { authMiddleware } from '../auth/middleware';

/**
 * Noor Official V3 - System Infrastructure Router
 */
const router = express.Router();

// Public Read (Settings + SEO)
router.get('/settings', systemPluginController.getSettings);
router.get('/public/seo', seoController.getPublicSEO);

// Admin Restricted Write
router.put('/settings', authMiddleware, systemPluginController.updateSettings);
router.put('/seo', authMiddleware, seoController.updateSEO);

export default router;
