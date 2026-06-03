import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';

export class AuthController {
  async registerSchool(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.registerSchool(req.body);
      res.status(201).json({ success: true, data: result, message: 'School registered successfully!' });
    } catch (error) { next(error); }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.status(200).json({ success: true, data: result, message: 'Login successful' });
    } catch (error) { next(error); }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const tokens = await authService.refreshAccessToken(req.body.refreshToken);
      res.status(200).json({ success: true, data: tokens, message: 'Token refreshed' });
    } catch (error) { next(error); }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.logout(req.user!.userId);
      res.status(200).json({ success: true, message: 'Logged out' });
    } catch (error) { next(error); }
  }
}

export const authController = new AuthController();
