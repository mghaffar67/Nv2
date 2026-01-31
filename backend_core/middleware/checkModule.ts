import { dbNode } from '../utils/db';

/**
 * Noor V3 - Feature Gating Middleware
 * Blocks access to API nodes if the master switch is OFF.
 */
export const checkModule = (moduleKey: string) => async (req: any, res: any, next: any) => {
  // Fix: Added await to async db call
  const config = await dbNode.getConfig();
  // Fix: config is now the object from awaited promise
  const moduleStatus = config.modules?.[moduleKey];

  if (moduleStatus === false) {
    return res.status(503).json({
      success: false,
      message: "This feature is temporarily disabled by the Administration Protocol.",
      module: moduleKey
    });
  }

  next();
};