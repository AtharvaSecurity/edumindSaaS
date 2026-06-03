import { z } from 'zod';

export const createStudentSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(255).trim(),
  email: z.string().email('Invalid email').max(255).transform(e => e.toLowerCase().trim()).optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
  admissionId: z.string().min(1).max(50).optional(),
  rollNumber: z.number().int().positive().optional(),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
  gender: z.enum(['M', 'F', 'O']).optional(),
  bloodGroup: z.string().max(5).optional(),
  address: z.string().max(500).optional(),
  admissionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
  classId: z.string().uuid('Invalid class ID'),
  sectionId: z.string().uuid('Invalid section ID'),
  parentName: z.string().min(2).max(255).optional(),
  parentPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone').optional(),
  parentEmail: z.string().email('Invalid email').optional(),
  parentOccupation: z.string().max(100).optional(),
  parentRelation: z.enum(['FATHER', 'MOTHER', 'GUARDIAN']).optional(),
});

export const updateStudentSchema = z.object({
  fullName: z.string().min(2).max(255).trim().optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone').optional(),
  rollNumber: z.number().int().positive().optional(),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
  gender: z.enum(['M', 'F', 'O']).optional(),
  bloodGroup: z.string().max(5).optional(),
  address: z.string().max(500).optional(),
  classId: z.string().uuid().optional(),
  sectionId: z.string().uuid().optional(),
  isActive: z.boolean().optional(),
});

export const studentQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().positive()).optional().default('1'),
  limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).optional().default('20'),
  search: z.string().optional(),
  classId: z.string().uuid().optional(),
  sectionId: z.string().uuid().optional(),
  isActive: z.string().transform(val => val === 'true').optional(),
});

export const bulkImportSchema = z.object({
  students: z.array(createStudentSchema).min(1).max(500),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type StudentQueryInput = z.infer<typeof studentQuerySchema>;
