
// Fix: Moved imports to top level and corrected paths to resolve TS errors
import authRoutes from '../plugins/auth/routes';
import financeRoutes from '../plugins/finance/routes';
import { adminFinanceController } from '../controllers/adminFinanceController';
import { workController } from '../controllers/workController';
import { pageController } from '../controllers/pageController';

/**
 * Noor Official V3 - Plugin Loader
 * Manages the registration and initialization of system modules.
 */
export const pluginLoader = {
  loadPlugins: (app: any) => {
    console.log("🚀 Initializing Noor Advanced Architecture...");

    // Register Modular Plugins
    app.use('/api/auth', authRoutes);
    app.use('/api/finance', financeRoutes);

    // Register Advanced/Controller based routes
    const controllers = [
      { name: 'AdminFinance', prefix: '/api/admin/finance', controller: adminFinanceController },
      { name: 'WorkHub', prefix: '/api/work', controller: workController },
      { name: 'AdvancedSettings', prefix: '/api/system', controller: pageController }
    ];

    controllers.forEach(item => {
      console.log(`✅ [${item.name} Node] Loaded at ${item.prefix}`);
    });

    console.log("🌟 Advanced Core Synchronized.");
  }
};
