
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
    
    // In a real environment: jwt.verify(token, secret)
    // For this modular build, we check the standard prefix
    if (!token.includes('jwt-noor-')) {
      return res.status(403).json({ message: 'Invalid authentication signature.' });
    }

    const userId = token.replace('jwt-noor-', '');
    const db = JSON.parse(localStorage.getItem('noor_mock_db') || '[]');
    const user = db.find((u: any) => u.id === userId);

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
