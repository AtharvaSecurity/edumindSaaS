import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { config } from './config';
import { errorHandler, notFoundHandler } from './common/middleware/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import studentRoutes from './modules/student/student.routes';
import attendanceRoutes from './modules/attendance/attendance.routes';
import feeRoutes from './modules/fee/fee.routes';
import examRoutes from './modules/exam/exam.routes';
import timetableRoutes from './modules/timetable/timetable.routes';
import libraryRoutes from './modules/library/library.routes';
import transportRoutes from './modules/transport/transport.routes';
import payrollRoutes from './modules/payroll/payroll.routes';
import noticeRoutes from './modules/notice/notice.routes';
import reportRoutes from './modules/report/report.routes';

function createApp(): express.Application {
  const app = express();
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: config.corsOrigin, credentials: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(compression());
  if (config.nodeEnv === 'development') app.use(morgan('dev'));
  app.get('/health', (_req, res) => res.json({ status: 'healthy', version: '5.0', modules: 11 }));
  
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/students', studentRoutes);
  app.use('/api/v1/attendance', attendanceRoutes);
  app.use('/api/v1/fees', feeRoutes);
  app.use('/api/v1/exams', examRoutes);
  app.use('/api/v1/timetable', timetableRoutes);
  app.use('/api/v1/library', libraryRoutes);
  app.use('/api/v1/transport', transportRoutes);
  app.use('/api/v1/payroll', payrollRoutes);
  app.use('/api/v1/notices', noticeRoutes);
  app.use('/api/v1/reports', reportRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
export const app = createApp();
