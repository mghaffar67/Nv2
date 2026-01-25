
import express from 'express';
import { systemPluginController } from './controller';
import { seoController } from './seoController';
import { settingsController } from './settingsController';
import { integrationController } from './integrationController';
import { authMiddleware } from '../auth/middleware';
import { uploadMiddleware } from '../../middleware/upload';

/**
 * Noor Official V3 - System Infrastructure Router
 */
const router = express.Router();

// Public Read (Settings + SEO + Integrations)
router.get('/settings', systemPluginController.getSettings);
router.get('/public/seo', seoController.getPublicSEO);
router.get('/public/integrations', integrationController.getPublicIntegrations);

// Admin Restricted Write Protocols
router.put('/settings', authMiddleware, systemPluginController.updateSettings);
router.put('/seo', authMiddleware, seoController.updateSEO);

// Integration Hub Management (Admin Only)
router.get('/integrations', authMiddleware, integrationController.getAllIntegrations);
router.post('/integrations', authMiddleware, integrationController.saveIntegration);
router.patch('/integrations/:id/toggle', authMiddleware, integrationController.toggleStatus);
router.delete('/integrations/:id', authMiddleware, integrationController.deleteIntegration);

// New Company Branding Route (Multipart Support)
router.put('/company-profile', 
  authMiddleware, 
  uploadMiddleware.single('logo'), 
  settingsController.updateCompanyProfile
);

export default router;
