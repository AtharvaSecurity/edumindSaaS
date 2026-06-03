import { Router } from 'express';
import { studentController } from './student.controller';
import { authenticate, authorize } from '../../common/middleware/auth.middleware';
import { validateBody, validateQuery } from '../../common/middleware/validation.middleware';
import { 
  createStudentSchema, 
  updateStudentSchema, 
  studentQuerySchema, 
  bulkImportSchema 
} from './student.validation';
import { UserRole } from '@prisma/client';

const router = Router();

// All routes require authentication
router.use(authenticate());

// Routes accessible by admin, principal, and teachers
router.get(
  '/',
  authorize(UserRole.SCHOOL_ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER, UserRole.SUPER_ADMIN),
  studentController.listStudents.bind(studentController)
);

router.get(
  '/stats',
  authorize(UserRole.SCHOOL_ADMIN, UserRole.PRINCIPAL, UserRole.SUPER_ADMIN),
  studentController.getStats.bind(studentController)
);

router.get(
  '/:id',
  authorize(UserRole.SCHOOL_ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER, UserRole.SUPER_ADMIN),
  studentController.getStudent.bind(studentController)
);

// Routes only for admin and principal
router.post(
  '/',
  authorize(UserRole.SCHOOL_ADMIN, UserRole.PRINCIPAL, UserRole.SUPER_ADMIN),
  validateBody(createStudentSchema),
  studentController.createStudent.bind(studentController)
);

router.patch(
  '/:id',
  authorize(UserRole.SCHOOL_ADMIN, UserRole.PRINCIPAL, UserRole.SUPER_ADMIN),
  validateBody(updateStudentSchema),
  studentController.updateStudent.bind(studentController)
);

router.delete(
  '/:id',
  authorize(UserRole.SCHOOL_ADMIN, UserRole.PRINCIPAL, UserRole.SUPER_ADMIN),
  studentController.deactivateStudent.bind(studentController)
);

router.post(
  '/bulk-import',
  authorize(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
  validateBody(bulkImportSchema),
  studentController.bulkImport.bind(studentController)
);

export default router;
