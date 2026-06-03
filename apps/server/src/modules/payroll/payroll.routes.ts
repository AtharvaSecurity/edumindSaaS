import { Router } from 'express';
import { authenticate } from '../../common/middleware/auth.middleware';
import { payrollService } from './payroll.service';
const router = Router();
router.use(authenticate());
router.post('/', async (req, res, next) => { try { res.status(201).json({ success: true, data: await payrollService.addSalary(req.user!.tenantId, req.body) }); } catch(e) { next(e); } });
router.get('/', async (req, res, next) => { try { res.json({ success: true, data: await payrollService.listSalaries(req.user!.tenantId, req.query.month as string) }); } catch(e) { next(e); } });
router.patch('/:id/pay', async (req, res, next) => { try { res.json({ success: true, data: await payrollService.markPaid(req.user!.tenantId, req.params.id) }); } catch(e) { next(e); } });
export default router;
