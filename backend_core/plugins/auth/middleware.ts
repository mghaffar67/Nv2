
import { dbNode } from '../../utils/db';

/**
 * Noor Official V3 - Auth Middleware
 * Robust session validation for instant data access.
 */
export const authMiddleware = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Session expired. Please login again.' });
    }

    const token = authHeader.split(' ')[1];
    
    // Quick validation of our custom token structure
    if (!token.startsWith('jwt-noor-')) {
      return res.status(403).json({ message: 'Session signature invalid.' });
    }

    // Extract ID: token format is jwt-noor-{userId}-{timestamp}
    // We split by hyphens and take the middle segments
    const parts = token.split('-');
    if (parts.length < 3) {
      return res.status(403).json({ message: 'Session packet corrupted.' });
    }

    // Reconstruction of ID (handling IDs that might contain hyphens themselves)
    const userId = parts.slice(2, parts.length - 1).join('-');
    const user = dbNode.findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User account not found.' });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: 'This account has been suspended.' });
    }

    // Attach user node to request for downstream usage
    req.user = user;
    next();
  } catch (error) {
    console.error('Middleware Error:', error);
    res.status(500).json({ message: 'Internal validation error.' });
  }
};
