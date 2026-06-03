import { Router } from 'express';
import { attendanceController } from './attendance.controller';
import { authenticate, authorize } from '../../common/middleware/auth.middleware';
import { validateBody } from '../../common/middleware/validation.middleware';
import { markAttendanceSchema, createLeaveSchema, approveLeaveSchema } from './attendance.validation';
import { UserRole } from '@prisma/client';

const router = Router();
router.use(authenticate());

// Mark attendance (teachers, admins)
router.post('/',
  authorize(UserRole.TEACHER, UserRole.SCHOOL_ADMIN, UserRole.PRINCIPAL, UserRole.SUPER_ADMIN),
  validateBody(markAttendanceSchema),
  attendanceController.markAttendance.bind(attendanceController)
);

// Get attendance records
router.get('/',
  authorize(UserRole.TEACHER, UserRole.SCHOOL_ADMIN, UserRole.PRINCIPAL, UserRole.SUPER_ADMIN),
  attendanceController.getAttendance.bind(attendanceController)
);

// Get today's stats
router.get('/stats',
  authorize(UserRole.SCHOOL_ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER, UserRole.SUPER_ADMIN),
  attendanceController.getStats.bind(attendanceController)
);

// Student attendance report
router.get('/report/student/:studentId',
  authorize(UserRole.SCHOOL_ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER, UserRole.PARENT, UserRole.STUDENT, UserRole.SUPER_ADMIN),
  attendanceController.getStudentReport.bind(attendanceController)
);

// Section attendance summary
router.get('/section/:sectionId',
  authorize(UserRole.TEACHER, UserRole.SCHOOL_ADMIN, UserRole.PRINCIPAL, UserRole.SUPER_ADMIN),
  attendanceController.getSectionSummary.bind(attendanceController)
);

// Leave routes
router.post('/leaves',
  authorize(UserRole.STUDENT, UserRole.PARENT, UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
  validateBody(createLeaveSchema),
  attendanceController.createLeave.bind(attendanceController)
);

router.get('/leaves',
  authorize(UserRole.SCHOOL_ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT, UserRole.SUPER_ADMIN),
  attendanceController.getLeaves.bind(attendanceController)
);

router.patch('/leaves/:leaveId',
  authorize(UserRole.SCHOOL_ADMIN, UserRole.PRINCIPAL, UserRole.SUPER_ADMIN),
  validateBody(approveLeaveSchema),
  attendanceController.processLeave.bind(attendanceController)
);

export default router;
