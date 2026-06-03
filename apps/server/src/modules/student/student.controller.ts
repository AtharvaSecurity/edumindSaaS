import { Request, Response, NextFunction } from 'express';
import { studentService } from './student.service';

export class StudentController {
  /**
   * Create a new student
   * POST /api/v1/students
   */
  async createStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const student = await studentService.createStudent(tenantId, req.body);
      res.status(201).json({
        success: true,
        data: student,
        message: 'Student created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get student by ID
   * GET /api/v1/students/:id
   */
  async getStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const student = await studentService.getStudentById(tenantId, req.params.id);
      res.status(200).json({
        success: true,
        data: student,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * List all students
   * GET /api/v1/students
   */
  async listStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const result = await studentService.listStudents(tenantId, req.query);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update student
   * PATCH /api/v1/students/:id
   */
  async updateStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const student = await studentService.updateStudent(tenantId, req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: student,
        message: 'Student updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deactivate student
   * DELETE /api/v1/students/:id
   */
  async deactivateStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const result = await studentService.deactivateStudent(tenantId, req.params.id);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Bulk import students
   * POST /api/v1/students/bulk-import
   */
  async bulkImport(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const result = await studentService.bulkImportStudents(tenantId, req.body.students);
      res.status(200).json({
        success: true,
        data: result,
        message: `Imported ${result.success} students, ${result.failed} failed`,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get student statistics
   * GET /api/v1/students/stats
   */
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const stats = await studentService.getStudentStats(tenantId);
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const studentController = new StudentController();
