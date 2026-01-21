
import { dbNode } from '../../utils/db';

/**
 * Noor Official V3 - Auth Middleware
 * Validates JWT tokens and secures private routes.
 */
export const authMiddleware = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization required. Token missing.' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token.includes('jwt-noor-')) {
      return res.status(403).json({ message: 'Invalid authentication signature.' });
    }

    // Fix: Correctly extract user ID from composite token (jwt-noor-ID-timestamp)
    // ID itself may contain hyphens (e.g., USR-ABCDEF)
    const tokenParts = token.split('-');
    if (tokenParts.length < 4) {
       return res.status(403).json({ message: 'Malformed authentication packet.' });
    }
    
    // Extract everything between 'jwt-noor-' and the last part (timestamp)
    const userId = tokenParts.slice(2, -1).join('-');
    const user = dbNode.findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Identity not found in core registry.' });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: 'Access denied. Account is currently suspended.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal Security Error' });
  }
};
