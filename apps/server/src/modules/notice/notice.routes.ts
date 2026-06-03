import { Router } from 'express';
import { authenticate } from '../../common/middleware/auth.middleware';
import { noticeService } from './notice.service';
const router = Router();
router.use(authenticate());
router.post('/', async (req, res, next) => { try { res.status(201).json({ success: true, data: await noticeService.create(req.user!.tenantId, req.body) }); } catch(e) { next(e); } });
router.get('/', async (req, res, next) => { try { res.json({ success: true, data: await noticeService.list(req.user!.tenantId) }); } catch(e) { next(e); } });
export default router;
