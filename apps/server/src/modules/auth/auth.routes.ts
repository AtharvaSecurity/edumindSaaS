import { Router } from 'express';
import { authController } from './auth.controller';
import { authenticate } from '../../common/middleware/auth.middleware';
import { validateBody } from '../../common/middleware/validation.middleware';
import { loginSchema, registerSchoolSchema, refreshTokenSchema } from './auth.validation';

const router = Router();

router.post('/register', validateBody(registerSchoolSchema), (req, res, next) => authController.registerSchool(req, res, next));
router.post('/login', validateBody(loginSchema), (req, res, next) => authController.login(req, res, next));
router.post('/refresh', validateBody(refreshTokenSchema), (req, res, next) => authController.refreshToken(req, res, next));
router.post('/logout', authenticate(), (req, res, next) => authController.logout(req, res, next));

export default router;
