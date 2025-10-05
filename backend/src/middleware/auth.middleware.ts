import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth.utils';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user data to request
 * @param req Request object
 * @param res Response object
 * @param next Next function
 * @returns Next function or error response
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): Response | void => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Authentication required' 
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyToken(token);
    
    // Attach user data to request
    (req as any).user = decoded;
    
    // Continue to next middleware
    next();
  } catch (error) {
    return res.status(401).json({ 
      message: 'Invalid or expired token' 
    });
  }
};