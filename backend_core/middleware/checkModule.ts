import { dbNode } from '../utils/db';

/**
 * Noor V3 - Feature Gating Middleware
 * Blocks access to API nodes if the master switch is OFF.
 */
export const checkModule = (moduleKey: string) => (req: any, res: any, next: any) => {
  const config = dbNode.getConfig();
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