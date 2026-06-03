import { Request, Response, NextFunction } from 'express';
import { examService } from './exam.service';

export class ExamController {
  async createExam(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await examService.createExam(req.user!.tenantId, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (e) { next(e); }
  }

  async listExams(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await examService.listExams(req.user!.tenantId);
      res.json({ success: true, data: result });
    } catch (e) { next(e); }
  }

  async enterMarks(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await examService.enterMarks(req.user!.tenantId, req.user!.userId, req.body);
      res.json({ success: true, data: result, message: 'Marks saved!' });
    } catch (e) { next(e); }
  }

  async getExamResults(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await examService.getExamResults(req.user!.tenantId, req.params.examId);
      res.json({ success: true, data: result });
    } catch (e) { next(e); }
  }

  async getStudentResultCard(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await examService.getStudentResultCard(
        req.user!.tenantId, req.params.studentId, req.params.examId
      );
      res.json({ success: true, data: result });
    } catch (e) { next(e); }
  }
}

export const examController = new ExamController();
