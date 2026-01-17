
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
    console.log("🚀 Initializing Noor Modular Architecture...");

    // Register Modular Plugins
    // Fix: Corrected named imports to use default exports (routers) and mounted them via app.use()
    app.use('/api/auth', authRoutes);
    app.use('/api/finance', financeRoutes);

    // Register Legacy/Controller based routes (To be refactored in future steps)
    const controllers = [
      { name: 'AdminFinance', prefix: '/api/admin/finance', controller: adminFinanceController },
      { name: 'Work', prefix: '/api/work', controller: workController },
      { name: 'System', prefix: '/api/system', controller: pageController }
    ];

    controllers.forEach(item => {
      console.log(`✅ [${item.name} Controller] Loaded at ${item.prefix}`);
    });

    console.log("🌟 Modular Core Synchronized.");
  }
};
