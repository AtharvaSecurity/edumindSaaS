import { z } from 'zod';

export const markAttendanceSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  sectionId: z.string().uuid('Invalid section ID'),
  records: z.array(z.object({
    studentId: z.string().uuid(),
    status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'HOLIDAY']),
    remark: z.string().max(500).optional(),
  })).min(1, 'At least one attendance record required'),
});

export const getAttendanceSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Invalid month format (YYYY-MM)').optional(),
  sectionId: z.string().uuid().optional(),
  studentId: z.string().uuid().optional(),
  page: z.string().transform(Number).optional().default('1'),
  limit: z.string().transform(Number).optional().default('20'),
});

export const createLeaveSchema = z.object({
  studentId: z.string().uuid().optional(),
  leaveType: z.enum(['SICK', 'CASUAL', 'EMERGENCY', 'VACATION', 'OTHER']),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  reason: z.string().min(10, 'Reason must be at least 10 characters').max(1000),
});

export const approveLeaveSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  remark: z.string().max(500).optional(),
});
