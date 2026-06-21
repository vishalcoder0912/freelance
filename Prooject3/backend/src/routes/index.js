import { Router } from 'express';
import authRoutes from '../modules/auth/routes.js';
import userRoutes from '../modules/users/routes.js';
import programRoutes from '../modules/programs/routes.js';
import curriculumRoutes from '../modules/curriculum/routes.js';
import enrollmentRoutes from '../modules/enrollments/routes.js';
import dashboardRoutes from '../modules/dashboard/routes.js';
import assignmentRoutes from '../modules/assignments/routes.js';
import projectRoutes from '../modules/projects/routes.js';
import certificateRoutes from '../modules/certificates/routes.js';
import mentorshipRoutes from '../modules/mentorship/routes.js';
import facultyRoutes from '../modules/faculty/routes.js';
import achieverRoutes from '../modules/achievers/routes.js';
import blogRoutes from '../modules/blogs/routes.js';
import employerRoutes from '../modules/employers/routes.js';
import jobRoutes from '../modules/jobs/routes.js';
import recruiterRoutes from '../modules/recruiter/routes.js';
import aiRoutes from '../modules/ai/routes.js';
import resumeRoutes from '../modules/resume/routes.js';
import interviewRoutes from '../modules/interview/routes.js';
import careerAnalysisRoutes from '../modules/career-analysis/routes.js';
import paymentRoutes from '../modules/payments/routes.js';
import notificationRoutes from '../modules/notifications/routes.js';
import uploadRoutes from '../modules/uploads/routes.js';
import adminRoutes from '../modules/admin/routes.js';

const router = Router();

// Auth
router.use('/auth', authRoutes);

// Users
router.use('/users', userRoutes);

// Programs & Curriculum
router.use('/programs', programRoutes);
router.use('/', curriculumRoutes);

// Enrollments
router.use('/enrollments', enrollmentRoutes);

// Dashboard
router.use('/dashboard', dashboardRoutes);

// Assignments & Projects
router.use('/assignments', assignmentRoutes);
router.use('/projects', projectRoutes);

// Certificates
router.use('/certificates', certificateRoutes);

// Mentorship
router.use('/mentors', mentorshipRoutes);

// Faculty & Achievers
router.use('/faculty', facultyRoutes);
router.use('/achievers', achieverRoutes);

// Blog
router.use('/blogs', blogRoutes);

// Employers
router.use('/employers', employerRoutes);

// Jobs & Placement
router.use('/jobs', jobRoutes);

// Recruiter Portal
router.use('/recruiter', recruiterRoutes);

// AI Module
router.use('/ai', aiRoutes);

// Resume & Interview
router.use('/resume', resumeRoutes);
router.use('/interview', interviewRoutes);

// Career Analysis
router.use('/career-analysis', careerAnalysisRoutes);

// Payments
router.use('/payments', paymentRoutes);

// Notifications
router.use('/notifications', notificationRoutes);

// Uploads
router.use('/upload', uploadRoutes);

// Admin
router.use('/admin', adminRoutes);

// Health Check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), version: '2.0.0' });
});

export default router;
