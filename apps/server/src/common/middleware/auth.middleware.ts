import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../../config/jwt';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { prisma } from '../../config/database';

export function authenticate() {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) throw new UnauthorizedError('Invalid authorization header');
      
      const token = authHeader.split(' ')[1];
      const decoded = verifyAccessToken(token);
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, isActive: true, role: true },
      });
      
      if (!user) throw new UnauthorizedError('User not found');
      if (!user.isActive) throw new ForbiddenError('Account is deactivated');
      
      req.user = {
        userId: decoded.userId,
        tenantId: decoded.tenantId,
        role: decoded.role as any,
        subdomain: decoded.subdomain,
      };
      next();
    } catch (error) {
      next(error instanceof Error && 'statusCode' in error ? error : new UnauthorizedError('Authentication failed'));
    }
  };
}

export function authorize(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new UnauthorizedError('Not authenticated'));
    if (req.user.role === 'SUPER_ADMIN' || allowedRoles.includes(req.user.role)) return next();
    next(new ForbiddenError('Insufficient permissions'));
  };
}
