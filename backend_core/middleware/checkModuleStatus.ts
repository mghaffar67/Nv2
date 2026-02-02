import { dbNode } from '../utils/db';

/**
 * Noor V3 - Global Feature Guard
 */
export const checkModuleStatus = (moduleName: string) => (req: any, res: any, next: any) => {
  const config = dbNode.getConfig() as any;
  const module = config[moduleName];

  if (!module) return next();

  // 1. Basic Toggle Check
  if (!module.enabled) {
    return res.status(403).json({ 
      success: false, 
      message: module.message || `Module [${moduleName}] is currently offline for maintenance.` 
    });
  }

  // 2. Time Guard Logic
  if (module.startTime && module.endTime) {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startH, startM] = module.startTime.split(':').map(Number);
    const [endH, endM] = module.endTime.split(':').map(Number);
    
    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;

    if (currentTime < startTotal || currentTime > endTotal) {
      return res.status(403).json({
        success: false,
        message: `This feature is operational between ${module.startTime} and ${module.endTime} PKT.`
      });
    }
  }

  next();
};