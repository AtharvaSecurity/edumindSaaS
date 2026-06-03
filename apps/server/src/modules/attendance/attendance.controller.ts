import { Request, Response, NextFunction } from 'express';
import { attendanceService } from './attendance.service';

export class AttendanceController {
  async markAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await attendanceService.markAttendance(
        req.user!.tenantId,
        req.user!.userId,
        req.body
      );
      res.status(200).json({ success: true, data: result, message: 'Attendance marked' });
    } catch (error) { next(error); }
  }

  async getAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await attendanceService.getAttendance(req.user!.tenantId, req.query);
      res.status(200).json({ success: true, ...result });
    } catch (error) { next(error); }
  }

  async getStudentReport(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await attendanceService.getStudentAttendanceReport(
        req.user!.tenantId,
        req.params.studentId,
        req.query.month as string
      );
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getSectionSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await attendanceService.getSectionAttendanceSummary(
        req.user!.tenantId,
        req.query.date as string,
        req.params.sectionId
      );
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async createLeave(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await attendanceService.createLeave(
        req.user!.tenantId,
        req.user!.userId,
        req.user!.role,
        req.body
      );
      res.status(201).json({ success: true, data: result, message: 'Leave application submitted' });
    } catch (error) { next(error); }
  }

  async processLeave(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await attendanceService.processLeave(
        req.user!.tenantId,
        req.user!.userId,
        req.params.leaveId,
        req.body
      );
      res.status(200).json({ success: true, data: result, message: `Leave ${req.body.status.toLowerCase()}` });
    } catch (error) { next(error); }
  }

  async getLeaves(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await attendanceService.getLeaves(req.user!.tenantId, req.query);
      res.status(200).json({ success: true, ...result });
    } catch (error) { next(error); }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await attendanceService.getAttendanceStats(req.user!.tenantId);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }
}

export const attendanceController = new AttendanceController();
