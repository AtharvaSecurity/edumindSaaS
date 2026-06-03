import { Router } from 'express';
import { timetableController } from './timetable.controller';
import { authenticate } from '../../common/middleware/auth.middleware';

const router = Router();
router.use(authenticate());

router.post('/slots', (rq, rs, nx) => timetableController.createSlot(rq, rs, nx));
router.get('/:sectionId', (rq, rs, nx) => timetableController.getTimetable(rq, rs, nx));
router.post('/syllabus', (rq, rs, nx) => timetableController.addSyllabus(rq, rs, nx));
router.get('/syllabus/:classId', (rq, rs, nx) => timetableController.getSyllabus(rq, rs, nx));
router.post('/events', (rq, rs, nx) => timetableController.createEvent(rq, rs, nx));
router.get('/events/list', (rq, rs, nx) => timetableController.getEvents(rq, rs, nx));

export default router;
