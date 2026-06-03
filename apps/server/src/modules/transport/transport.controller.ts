import { Request, Response, NextFunction } from 'express';
import { transportService } from './transport.service';

export class TransportController {
  async addRoute(req: Request, res: Response, next: NextFunction) {
    try { res.status(201).json({ success: true, data: await transportService.addRoute(req.user!.tenantId, req.body) }); } catch(e) { next(e); }
  }
  async listRoutes(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await transportService.listRoutes(req.user!.tenantId) }); } catch(e) { next(e); }
  }
  async assignStudent(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await transportService.assignStudent(req.user!.tenantId, req.body) }); } catch(e) { next(e); }
  }
  async addStop(req: Request, res: Response, next: NextFunction) {
    try { res.status(201).json({ success: true, data: await transportService.addStop(req.user!.tenantId, req.body) }); } catch(e) { next(e); }
  }
}

export const transportController = new TransportController();
