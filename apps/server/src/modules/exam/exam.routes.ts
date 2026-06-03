import { Router } from 'express';
import { examController } from './exam.controller';
import { authenticate } from '../../common/middleware/auth.middleware';

const router = Router();
router.use(authenticate());

router.post('/', (rq, rs, nx) => examController.createExam(rq, rs, nx));
router.get('/', (rq, rs, nx) => examController.listExams(rq, rs, nx));
router.post('/marks', (rq, rs, nx) => examController.enterMarks(rq, rs, nx));
router.get('/:examId/results', (rq, rs, nx) => examController.getExamResults(rq, rs, nx));
router.get('/:examId/student/:studentId', (rq, rs, nx) => examController.getStudentResultCard(rq, rs, nx));

export default router;
