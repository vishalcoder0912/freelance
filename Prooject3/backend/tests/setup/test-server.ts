import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from '../../src/middleware/validation.js';
import { setupTestDatabase, teardownTestDatabase } from './prisma.js';
import { prisma } from './prisma.js';

export async function createTestApp() {
  const app = express();

  // Middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // Make prisma available in request
  app.use((req, res, next) => {
    req.prisma = prisma;
    next();
  });

  // Import and mount routes
  const { default: authRoutes } = await import('../../src/modules/auth/routes.js');
  const { default: userRoutes } = await import('../../src/modules/users/routes.js');
  const { default: programRoutes } = await import('../../src/modules/programs/routes.js');
  const { default: enrollmentRoutes } = await import('../../src/modules/enrollments/routes.js');
  const { default: assignmentRoutes } = await import('../../src/modules/assignments/routes.js');
  const { default: projectRoutes } = await import('../../src/modules/projects/routes.js');
  const { default: certificateRoutes } = await import('../../src/modules/certificates/routes.js');
  const { default: jobRoutes } = await import('../../src/modules/jobs/routes.js');
  const { default: paymentRoutes } = await import('../../src/modules/payments/routes.js');
  const { default: adminRoutes } = await import('../../src/modules/admin/routes.js');
  const { default: aiRoutes } = await import('../../src/modules/ai/routes.js');
  const { default: resumeRoutes } = await import('../../src/modules/resume/routes.js');
  const { default: interviewRoutes } = await import('../../src/modules/interview/routes.js');
  const { default: careerAnalysisRoutes } = await import('../../src/modules/career-analysis/routes.js');
  const { default: notificationRoutes } = await import('../../src/modules/notifications/routes.js');

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/programs', programRoutes);
  app.use('/api/enrollments', enrollmentRoutes);
  app.use('/api/assignments', assignmentRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/certificates', certificateRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/resume', resumeRoutes);
  app.use('/api/interview', interviewRoutes);
  app.use('/api/career-analysis', careerAnalysisRoutes);
  app.use('/api/notifications', notificationRoutes);

  // Error handler
  app.use(errorHandler);

  return app;
}

export { prisma };
