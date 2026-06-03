import { Request, Response, NextFunction } from 'express';
import { feeService } from './fee.service';

export class FeeController {
  async createStructure(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await feeService.createFeeStructure(req.user!.tenantId, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (e) { next(e); }
  }

  async listStructures(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await feeService.listFeeStructures(req.user!.tenantId);
      res.json({ success: true, data: result });
    } catch (e) { next(e); }
  }

  async assignFee(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await feeService.assignFeeToStudent(req.user!.tenantId, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (e) { next(e); }
  }

  async bulkAssign(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await feeService.bulkAssignFees(req.user!.tenantId, req.body);
      res.json({ success: true, data: result });
    } catch (e) { next(e); }
  }

  async recordPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await feeService.recordPayment(req.user!.tenantId, req.user!.userId, req.body);
      res.status(201).json({ success: true, data: result, message: 'Payment recorded' });
    } catch (e) { next(e); }
  }

  async getStudentFees(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await feeService.getStudentFees(req.user!.tenantId, req.params.studentId);
      res.json({ success: true, data: result });
    } catch (e) { next(e); }
  }

  async getDefaulters(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await feeService.getDefaulterList(req.user!.tenantId);
      res.json({ success: true, data: result });
    } catch (e) { next(e); }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await feeService.getFeeStats(req.user!.tenantId);
      res.json({ success: true, data: result });
    } catch (e) { next(e); }
  }
}

export const feeController = new FeeController();
