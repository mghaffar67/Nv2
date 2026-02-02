import express from 'express';
import { systemController } from '../controllers/systemController';
import { contentController } from '../plugins/system/contentController';

const router = express.Router();

/**
 * Noor V3 - Public System Registry Routes
 * Mounted at /api/system
 */

// URL: /api/system/public/campaigns
router.get('/public/campaigns', systemController.getPublicPopups);

// URL: /api/system/public/integrations
router.get('/public/integrations', systemController.getPublicIntegrations);

// URL: /api/system/site-content/:slug
router.get('/site-content/:slug', contentController.getPageContent);

export default router;