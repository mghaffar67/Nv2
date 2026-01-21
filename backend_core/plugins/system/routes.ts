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

// Plan Management Module Toggle Node
router.put('/modules/plans', authMiddleware, async (req: any, res: any) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ message: "Admin node required." });
    
    const configStr = localStorage.getItem('noor_config') || '{}';
    const config = JSON.parse(configStr);
    
    if (!config.modules) config.modules = {};
    config.modules.plansEnabled = req.body.enabled;
    
    localStorage.setItem('noor_config', JSON.stringify(config));
    return res.status(200).json({ success: true, message: `Plan station module ${req.body.enabled ? 'Enabled' : 'Disabled'}` });
});

export default router;
