import express from 'express';
import { systemPluginController } from './controller';
import { seoController } from './seoController';
import { integrationController } from './integrationController';
import { popupController } from './popupController';
import { contentController } from './contentController';
import { authMiddleware } from '../auth/middleware';

/**
 * Noor Official V3 - Master System Infrastructure Router
 * Handles both public configuration nodes and protected admin settings.
 * Prefix mounted at /api/system
 */
const router = express.Router();

// --- PUBLIC ACCESS NODES ---
// URL: /api/system/public/campaigns
router.get('/public/campaigns', popupController.getActivePopups);

// URL: /api/system/public/integrations
router.get('/public/integrations', integrationController.getPublicScripts);

// URL: /api/system/public/seo
router.get('/public/seo', seoController.getPublicSEO);

// CMS Content Node
// URL: /api/system/site-content/:slug
router.get('/site-content/:slug', contentController.getPageContent);

// Metadata retrieval
router.get('/settings', systemPluginController.getSettings);

// --- ADMIN PROTECTED NODES ---
router.put('/settings', authMiddleware, systemPluginController.updateSettings);
router.put('/seo', authMiddleware, seoController.updateSEO);
router.post('/site-content', authMiddleware, contentController.updateContent);

// Integration & Popup Management
router.get('/integrations', authMiddleware, integrationController.getAllIntegrations);
router.post('/integrations', authMiddleware, integrationController.saveIntegration);
router.patch('/integrations/:id/toggle', authMiddleware, integrationController.toggleStatus);
router.delete('/integrations/:id', authMiddleware, integrationController.deleteIntegration);

export default router;