import { Router } from 'express';
import { feeController } from './fee.controller';
import { authenticate, authorize } from '../../common/middleware/auth.middleware';
import { validateBody } from '../../common/middleware/validation.middleware';
import { createFeeStructureSchema, assignFeeToStudentSchema, recordPaymentSchema, bulkAssignSchema } from './fee.validation';

const router = Router();
router.use(authenticate());

router.post('/structures', authorize('SCHOOL_ADMIN', 'ACCOUNTANT', 'SUPER_ADMIN'), validateBody(createFeeStructureSchema), (rq, rs, nx) => feeController.createStructure(rq, rs, nx));
router.get('/structures', authorize('SCHOOL_ADMIN', 'ACCOUNTANT', 'TEACHER', 'PRINCIPAL', 'SUPER_ADMIN'), (rq, rs, nx) => feeController.listStructures(rq, rs, nx));
router.post('/assign', authorize('SCHOOL_ADMIN', 'ACCOUNTANT', 'SUPER_ADMIN'), validateBody(assignFeeToStudentSchema), (rq, rs, nx) => feeController.assignFee(rq, rs, nx));
router.post('/bulk-assign', authorize('SCHOOL_ADMIN', 'ACCOUNTANT', 'SUPER_ADMIN'), validateBody(bulkAssignSchema), (rq, rs, nx) => feeController.bulkAssign(rq, rs, nx));
router.post('/payments', authorize('SCHOOL_ADMIN', 'ACCOUNTANT', 'SUPER_ADMIN'), validateBody(recordPaymentSchema), (rq, rs, nx) => feeController.recordPayment(rq, rs, nx));
router.get('/student/:studentId', authorize('SCHOOL_ADMIN', 'ACCOUNTANT', 'PARENT', 'STUDENT', 'SUPER_ADMIN'), (rq, rs, nx) => feeController.getStudentFees(rq, rs, nx));
router.get('/defaulters', authorize('SCHOOL_ADMIN', 'ACCOUNTANT', 'PRINCIPAL', 'SUPER_ADMIN'), (rq, rs, nx) => feeController.getDefaulters(rq, rs, nx));
router.get('/stats', authorize('SCHOOL_ADMIN', 'ACCOUNTANT', 'PRINCIPAL', 'SUPER_ADMIN'), (rq, rs, nx) => feeController.getStats(rq, rs, nx));

export default router;
