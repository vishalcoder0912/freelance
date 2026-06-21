import { faker } from '@faker-js/faker';
import { PrismaClient, Role, DifficultyLevel, JobType, PaymentStatus, ApplicationStatus, EnrollmentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export class UserFactory {
  static async create(overrides: Partial<any> = {}) {
    const password = overrides.password || 'Test123!';
    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: hashedPassword,
        name: faker.person.fullName(),
        phone: faker.phone.number({ style: 'national' }),
        role: Role.STUDENT,
        isEmailVerified: true,
        isActive: true,
        ...overrides
      }
    });
  }

  static async createMany(count: number, overrides: Partial<any> = {}) {
    const users = [];
    for (let i = 0; i < count; i++) {
      users.push(await this.create(overrides));
    }
    return users;
  }

  static async createAdmin() {
    return this.create({ role: Role.ADMIN });
  }

  static async createMentor() {
    return this.create({ role: Role.MENTOR });
  }

  static async createRecruiter() {
    return this.create({ role: Role.RECRUITER });
  }
}

export class ProgramFactory {
  static async create(overrides: Partial<any> = {}) {
    const title = overrides.title || faker.lorem.words(3);
    
    return prisma.program.create({
      data: {
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: faker.lorem.paragraphs(2),
        shortDescription: faker.lorem.sentence(),
        category: faker.helpers.arrayElement(['Data Science', 'AI', 'Product Management', 'Engineering']),
        duration: faker.number.int({ min: 4, max: 24 }),
        level: DifficultyLevel.BEGINNER,
        price: faker.number.float({ min: 999, max: 99999, fractionDigits: 2 }),
        isActive: true,
        isFeatured: false,
        ...overrides
      }
    });
  }

  static async createMany(count: number, overrides: Partial<any> = {}) {
    const programs = [];
    for (let i = 0; i < count; i++) {
      programs.push(await this.create(overrides));
    }
    return programs;
  }
}

export class ModuleFactory {
  static async create(programId: string, overrides: Partial<any> = {}) {
    return prisma.module.create({
      data: {
        programId,
        title: faker.lorem.words(2),
        description: faker.lorem.sentence(),
        order: faker.number.int({ min: 1, max: 10 }),
        ...overrides
      }
    });
  }
}

export class LessonFactory {
  static async create(moduleId: string, overrides: Partial<any> = {}) {
    return prisma.lesson.create({
      data: {
        moduleId,
        title: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(3),
        duration: faker.number.int({ min: 5, max: 60 }),
        order: faker.number.int({ min: 1, max: 20 }),
        ...overrides
      }
    });
  }
}

export class EnrollmentFactory {
  static async create(userId: string, programId: string, overrides: Partial<any> = {}) {
    return prisma.enrollment.create({
      data: {
        userId,
        programId,
        status: EnrollmentStatus.ACTIVE,
        progress: 0,
        ...overrides
      }
    });
  }
}

export class AssignmentFactory {
  static async create(programId: string, overrides: Partial<any> = {}) {
    return prisma.assignment.create({
      data: {
        programId,
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        dueDate: faker.date.future(),
        maxScore: 100,
        isActive: true,
        ...overrides
      }
    });
  }
}

export class SubmissionFactory {
  static async create(assignmentId: string, userId: string, overrides: Partial<any> = {}) {
    return prisma.submission.create({
      data: {
        assignmentId,
        userId,
        content: faker.lorem.paragraphs(2),
        submittedAt: new Date(),
        ...overrides
      }
    });
  }
}

export class ProjectFactory {
  static async create(userId: string, overrides: Partial<any> = {}) {
    return prisma.project.create({
      data: {
        userId,
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        githubUrl: faker.internet.url(),
        technologies: faker.helpers.arrayElements(['React', 'Node.js', 'Python', 'TypeScript'], { min: 1, max: 4 }),
        submittedAt: new Date(),
        ...overrides
      }
    });
  }
}

export class CertificateFactory {
  static async create(userId: string, programId: string, overrides: Partial<any> = {}) {
    const certificateId = `CV-${faker.string.alphanumeric(8).toUpperCase()}`;
    
    return prisma.certificate.create({
      data: {
        certificateId,
        userId,
        programId,
        issuedAt: new Date(),
        isRevoked: false,
        ...overrides
      }
    });
  }
}

export class EmployerFactory {
  static async create(overrides: Partial<any> = {}) {
    return prisma.employer.create({
      data: {
        name: faker.company.name(),
        email: faker.internet.email(),
        website: faker.internet.url(),
        industry: faker.commerce.department(),
        size: faker.helpers.arrayElement(['1-10', '11-50', '51-200', '201-500', '500+']),
        location: faker.location.city(),
        description: faker.lorem.paragraph(),
        isVerified: true,
        isActive: true,
        ...overrides
      }
    });
  }
}

export class JobFactory {
  static async create(employerId: string, recruiterId: string, overrides: Partial<any> = {}) {
    return prisma.job.create({
      data: {
        employerId,
        recruiterId,
        title: faker.person.jobTitle(),
        description: faker.lorem.paragraphs(2),
        requirements: faker.helpers.arrayElements([
          'React', 'Node.js', 'TypeScript', 'Python', 'SQL', 'Git'
        ], { min: 2, max: 5 }),
        responsibilities: faker.helpers.arrayElements([
          'Write clean code', 'Code reviews', 'Mentor juniors', 'Architecture design'
        ], { min: 2, max: 4 }),
        location: faker.location.city(),
        isRemote: faker.datatype.boolean(),
        jobType: JobType.FULL_TIME,
        salaryMin: faker.number.float({ min: 300000, max: 500000, fractionDigits: 0 }),
        salaryMax: faker.number.float({ min: 500000, max: 1500000, fractionDigits: 0 }),
        experienceMin: faker.number.int({ min: 0, max: 3 }),
        experienceMax: faker.number.int({ min: 3, max: 10 }),
        isActive: true,
        deadline: faker.date.future(),
        ...overrides
      }
    });
  }
}

export class ApplicationFactory {
  static async create(jobId: string, userId: string, overrides: Partial<any> = {}) {
    return prisma.application.create({
      data: {
        jobId,
        userId,
        status: ApplicationStatus.PENDING,
        resumeUrl: faker.internet.url(),
        coverLetter: faker.lorem.paragraphs(2),
        appliedAt: new Date(),
        ...overrides
      }
    });
  }
}

export class PlacementFactory {
  static async create(applicationId: string, jobId: string, userId: string, overrides: Partial<any> = {}) {
    return prisma.placement.create({
      data: {
        applicationId,
        jobId,
        userId,
        status: 'PENDING',
        offeredAt: new Date(),
        ctc: faker.number.float({ min: 300000, max: 1500000, fractionDigits: 0 }),
        ...overrides
      }
    });
  }
}

export class PaymentFactory {
  static async create(userId: string, overrides: Partial<any> = {}) {
    return prisma.payment.create({
      data: {
        userId,
        amount: faker.number.float({ min: 999, max: 99999, fractionDigits: 2 }),
        currency: 'INR',
        status: PaymentStatus.PENDING,
        ...overrides
      }
    });
  }
}

export class NotificationFactory {
  static async create(userId: string, overrides: Partial<any> = {}) {
    return prisma.notification.create({
      data: {
        userId,
        type: faker.helpers.arrayElement(['ASSIGNMENT', 'SESSION', 'PLACEMENT', 'MENTORSHIP', 'PAYMENT', 'GENERAL']),
        title: faker.lorem.words(3),
        message: faker.lorem.sentence(),
        isRead: false,
        ...overrides
      }
    });
  }
}

export class MentorSessionFactory {
  static async create(mentorId: string, studentId: string, overrides: Partial<any> = {}) {
    return prisma.mentorSession.create({
      data: {
        mentorId,
        studentId,
        scheduledAt: faker.date.future(),
        duration: 60,
        topic: faker.lorem.words(3),
        status: 'SCHEDULED',
        ...overrides
      }
    });
  }
}

export class ResumeAnalysisFactory {
  static async create(userId: string, overrides: Partial<any> = {}) {
    return prisma.resumeAnalysis.create({
      data: {
        userId,
        fileName: `${faker.lorem.word()}.pdf`,
        atsScore: faker.number.float({ min: 40, max: 95, fractionDigits: 1 }),
        keywords: faker.helpers.arrayElements(['JavaScript', 'React', 'Node.js', 'Python'], { min: 3, max: 8 }),
        suggestions: faker.helpers.arrayElements([
          'Add more keywords',
          'Improve formatting',
          'Add metrics'
        ], { min: 2, max: 5 }),
        ...overrides
      }
    });
  }
}

export class CareerAnalysisFactory {
  static async create(userId: string, overrides: Partial<any> = {}) {
    return prisma.careerAnalysis.create({
      data: {
        userId,
        careerScore: faker.number.float({ min: 40, max: 95, fractionDigits: 1 }),
        skillGaps: faker.helpers.arrayElements(['Leadership', 'Communication', 'Technical Skills'], { min: 1, max: 4 }),
        recommendations: faker.helpers.arrayElements([
          'Take leadership course',
          'Practice system design',
          'Build portfolio projects'
        ], { min: 2, max: 5 }),
        ...overrides
      }
    });
  }
}

export class InterviewSessionFactory {
  static async create(userId: string, overrides: Partial<any> = {}) {
    return prisma.interviewSession.create({
      data: {
        userId,
        type: faker.helpers.arrayElement(['technical', 'behavioral', 'system_design']),
        questions: [
          { question: 'Tell me about yourself', type: 'behavioral' },
          { question: 'Explain a complex project', type: 'technical' }
        ],
        answers: [
          { answer: 'Sample answer 1', score: 8 },
          { answer: 'Sample answer 2', score: 7 }
        ],
        score: faker.number.float({ min: 5, max: 10, fractionDigits: 1 }),
        feedback: faker.lorem.paragraph(),
        duration: faker.number.int({ min: 15, max: 60 }),
        ...overrides
      }
    });
  }
}

export class AuditLogFactory {
  static async create(userId: string | null, overrides: Partial<any> = {}) {
    return prisma.auditLog.create({
      data: {
        userId,
        action: faker.helpers.arrayElement(['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT']),
        entity: faker.helpers.arrayElement(['User', 'Program', 'Enrollment', 'Payment']),
        entityId: faker.string.uuid(),
        ipAddress: faker.internet.ip(),
        userAgent: faker.internet.userAgent(),
        ...overrides
      }
    });
  }
}

export class BlogFactory {
  static async create(overrides: Partial<any> = {}) {
    const title = faker.lorem.words(5);
    
    return prisma.blog.create({
      data: {
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        content: faker.lorem.paragraphs(5),
        excerpt: faker.lorem.sentence(),
        tags: faker.helpers.arrayElements(['tech', 'career', 'education'], { min: 1, max: 3 }),
        isPublished: true,
        publishedAt: new Date(),
        views: faker.number.int({ min: 0, max: 10000 }),
        ...overrides
      }
    });
  }
}

export class FacultyFactory {
  static async create(overrides: Partial<any> = {}) {
    return prisma.faculty.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        designation: faker.person.jobTitle(),
        bio: faker.lorem.paragraph(),
        expertise: faker.helpers.arrayElements(['AI', 'ML', 'Data Science', 'Web Dev'], { min: 1, max: 3 }),
        isActive: true,
        ...overrides
      }
    });
  }
}

export class AchieverFactory {
  static async create(overrides: Partial<any> = {}) {
    return prisma.achiever.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        program: faker.helpers.arrayElement(['Data Science', 'AI', 'Product Management']),
        company: faker.company.name(),
        designation: faker.person.jobTitle(),
        testimonial: faker.lorem.paragraphs(2),
        rating: faker.number.int({ min: 4, max: 5 }),
        isFeatured: faker.datatype.boolean(),
        ...overrides
      }
    });
  }
}

export class CareerPathFactory {
  static async create(overrides: Partial<any> = {}) {
    const title = faker.person.jobTitle();
    
    return prisma.careerPath.create({
      data: {
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: faker.lorem.paragraph(),
        skills: faker.helpers.arrayElements(['JavaScript', 'Python', 'SQL', 'React'], { min: 3, max: 6 }),
        avgSalary: faker.number.float({ min: 300000, max: 2000000, fractionDigits: 0 }),
        growthRate: faker.number.float({ min: 5, max: 25, fractionDigits: 1 }),
        demand: faker.helpers.arrayElement(['High', 'Very High', 'Medium']),
        ...overrides
      }
    });
  }
}
