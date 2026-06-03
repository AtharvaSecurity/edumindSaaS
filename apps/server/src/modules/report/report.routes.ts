import { Router } from 'express';
import { authenticate } from '../../common/middleware/auth.middleware';
import { reportService } from './report.service';
const router = Router();
router.use(authenticate());
router.get('/dashboard', async (req, res, next) => { try { res.json({ success: true, data: await reportService.dashboardReport(req.user!.tenantId) }); } catch(e) { next(e); } });
export default router;
