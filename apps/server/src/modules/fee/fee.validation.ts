import { z } from 'zod';

export const createFeeStructureSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  amount: z.number().positive(),
  frequency: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY', 'ONE_TIME']),
  classId: z.string().uuid().optional(),
});

export const assignFeeToStudentSchema = z.object({
  studentId: z.string().uuid(),
  feeStructureId: z.string().uuid(),
  academicYear: z.string().regex(/^\d{4}-\d{4}$/, 'Format: YYYY-YYYY'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),
  customAmount: z.number().positive().optional(),
});

export const recordPaymentSchema = z.object({
  studentFeeId: z.string().uuid(),
  amount: z.number().positive(),
  paymentMode: z.enum(['CASH', 'CHEQUE', 'UPI', 'NETBANKING', 'CARD']),
  transactionRef: z.string().max(100).optional(),
  remark: z.string().max(500).optional(),
});

export const bulkAssignSchema = z.object({
  feeStructureId: z.string().uuid(),
  academicYear: z.string().regex(/^\d{4}-\d{4}$/),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  studentIds: z.array(z.string().uuid()).min(1),
});
