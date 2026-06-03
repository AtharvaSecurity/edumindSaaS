import { Request, Response, NextFunction } from 'express';
import { timetableService } from './timetable.service';

export class TimetableController {
  async createSlot(req: Request, res: Response, next: NextFunction) {
    try {
      const r = await timetableService.createSlot(req.user!.tenantId, req.body);
      res.status(201).json({ success: true, data: r });
    } catch(e) { next(e); }
  }
  async getTimetable(req: Request, res: Response, next: NextFunction) {
    try {
      const r = await timetableService.getTimetable(req.user!.tenantId, req.params.sectionId);
      res.json({ success: true, data: r });
    } catch(e) { next(e); }
  }
  async addSyllabus(req: Request, res: Response, next: NextFunction) {
    try {
      const r = await timetableService.addSyllabus(req.user!.tenantId, req.body);
      res.status(201).json({ success: true, data: r });
    } catch(e) { next(e); }
  }
  async getSyllabus(req: Request, res: Response, next: NextFunction) {
    try {
      const r = await timetableService.getSyllabus(req.user!.tenantId, req.params.classId, req.query.month as string);
      res.json({ success: true, data: r });
    } catch(e) { next(e); }
  }
  async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const r = await timetableService.createEvent(req.user!.tenantId, req.body);
      res.status(201).json({ success: true, data: r });
    } catch(e) { next(e); }
  }
  async getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const r = await timetableService.getEvents(req.user!.tenantId);
      res.json({ success: true, data: r });
    } catch(e) { next(e); }
  }
}

export const timetableController = new TimetableController();
