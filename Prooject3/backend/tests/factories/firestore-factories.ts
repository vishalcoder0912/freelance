import { faker } from '@faker-js/faker';

function generateId() {
  return `mock-${faker.string.alphanumeric(20)}`;
}

export function mockUser(overrides: Record<string, unknown> = {}) {
  return {
    id: generateId(),
    uid: generateId(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    phone: faker.phone.number({ style: 'national' }),
    role: 'STUDENT',
    careerGoal: faker.person.jobTitle(),
    currentExperience: faker.number.int({ min: 0, max: 10 }).toString(),
    bio: faker.lorem.sentence(),
    skills: faker.helpers.arrayElements(['Python', 'React', 'Node.js', 'SQL', 'TypeScript', 'AWS', 'Docker'], { min: 2, max: 5 }),
    isActive: true,
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    ...overrides,
  };
}

export function mockAdmin(overrides: Record<string, unknown> = {}) {
  return mockUser({ role: 'ADMIN', ...overrides });
}

export function mockMentor(overrides: Record<string, unknown> = {}) {
  return mockUser({ role: 'MENTOR', ...overrides });
}

export function mockRecruiter(overrides: Record<string, unknown> = {}) {
  return mockUser({ role: 'RECRUITER', ...overrides });
}

export function mockProgram(overrides: Record<string, unknown> = {}) {
  const title = (overrides.title as string) || faker.lorem.words(3);
  return {
    id: generateId(),
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-'),
    desc: faker.lorem.paragraphs(2),
    shortDesc: faker.lorem.sentence(),
    category: faker.helpers.arrayElement(['Data Science', 'AI', 'Product Management', 'Engineering', 'Analytics']),
    duration: `${faker.number.int({ min: 4, max: 24 })} months`,
    level: faker.helpers.arrayElement(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
    price: faker.number.int({ min: 4999, max: 99999 }),
    skills: faker.helpers.arrayElements(['Python', 'React', 'Node.js', 'SQL', 'ML', 'AWS', 'Docker', 'Kubernetes'], { min: 3, max: 6 }),
    placementRate: `${faker.number.int({ min: 80, max: 98 })}%`,
    avgPackage: `₹${faker.number.int({ min: 8, max: 30 })} LPA`,
    isPopular: faker.datatype.boolean(),
    isActive: true,
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    ...overrides,
  };
}

export function mockModule(programId: string, overrides: Record<string, unknown> = {}) {
  return {
    id: generateId(),
    programId,
    title: faker.lorem.words(2),
    description: faker.lorem.sentence(),
    order: faker.number.int({ min: 1, max: 15 }),
    createdAt: faker.date.past().toISOString(),
    ...overrides,
  };
}

export function mockLesson(moduleId: string, overrides: Record<string, unknown> = {}) {
  return {
    id: generateId(),
    moduleId,
    title: faker.lorem.words(3),
    content: faker.lorem.paragraphs(3),
    duration: faker.number.int({ min: 5, max: 60 }),
    order: faker.number.int({ min: 1, max: 25 }),
    videoUrl: faker.internet.url(),
    createdAt: faker.date.past().toISOString(),
    ...overrides,
  };
}

export function mockEnrollment(userId: string, programId: string, overrides: Record<string, unknown> = {}) {
  return {
    id: generateId(),
    userId,
    programId,
    status: 'ACTIVE',
    progress: faker.number.int({ min: 0, max: 100 }),
    enrolledAt: faker.date.past().toISOString(),
    completedAt: null,
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    ...overrides,
  };
}

export function mockAssignment(programId: string, overrides: Record<string, unknown> = {}) {
  return {
    id: generateId(),
    programId,
    title: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    dueDate: faker.date.future().toISOString(),
    maxScore: 100,
    isActive: true,
    createdAt: faker.date.past().toISOString(),
    ...overrides,
  };
}

export function mockSubmission(assignmentId: string, userId: string, overrides: Record<string, unknown> = {}) {
  return {
    id: generateId(),
    assignmentId,
    userId,
    submissionUrl: faker.internet.url(),
    notes: faker.lorem.sentence(),
    status: 'SUBMITTED',
    score: overrides.status === 'GRADED' ? faker.number.int({ min: 50, max: 100 }) : null,
    feedback: overrides.status === 'GRADED' ? faker.lorem.paragraph() : null,
    submittedAt: faker.date.recent().toISOString(),
    ...overrides,
  };
}

export function mockProject(userId: string, overrides: Record<string, unknown> = {}) {
  return {
    id: generateId(),
    userId,
    title: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    githubUrl: faker.internet.url(),
    technologies: faker.helpers.arrayElements(['React', 'Node.js', 'Python', 'TypeScript', 'Docker'], { min: 1, max: 4 }),
    status: 'IN_PROGRESS',
    submissionUrl: null,
    submittedAt: null,
    score: null,
    feedback: null,
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    ...overrides,
  };
}

export function mockCertificate(userId: string, programId: string, overrides: Record<string, unknown> = {}) {
  return {
    id: generateId(),
    userId,
    programId,
    certificateId: `CV-${faker.string.alphanumeric(8).toUpperCase()}`,
    title: faker.lorem.words(3),
    issuedAt: faker.date.past().toISOString(),
    isRevoked: false,
    downloadUrl: faker.internet.url(),
    ...overrides,
  };
}

export function mockJob(overrides: Record<string, unknown> = {}) {
  return {
    id: generateId(),
    title: faker.person.jobTitle(),
    company: faker.company.name(),
    description: faker.lorem.paragraphs(2),
    requirements: faker.helpers.arrayElements(['React', 'Node.js', 'TypeScript', 'Python', 'SQL'], { min: 2, max: 5 }),
    location: faker.location.city(),
    type: faker.helpers.arrayElement(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']),
    salaryMin: faker.number.int({ min: 300000, max: 800000 }),
    salaryMax: faker.number.int({ min: 800001, max: 2500000 }),
    experienceMin: faker.number.int({ min: 0, max: 3 }),
    experienceMax: faker.number.int({ min: 3, max: 10 }),
    status: 'ACTIVE',
    postedBy: generateId(),
    postedAt: faker.date.past().toISOString(),
    deadline: faker.date.future().toISOString(),
    ...overrides,
  };
}

export function mockApplication(jobId: string, userId: string, overrides: Record<string, unknown> = {}) {
  return {
    id: generateId(),
    jobId,
    userId,
    status: 'PENDING',
    resumeUrl: faker.internet.url(),
    coverLetter: faker.lorem.paragraphs(2),
    appliedAt: faker.date.recent().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    ...overrides,
  };
}

export function mockPlacement(applicationId: string, jobId: string, userId: string, overrides: Record<string, unknown> = {}) {
  return {
    id: generateId(),
    applicationId,
    jobId,
    userId,
    company: faker.company.name(),
    package: faker.number.int({ min: 500000, max: 3000000 }).toString(),
    status: 'PENDING',
    offeredAt: faker.date.recent().toISOString(),
    joinedAt: null,
    createdAt: faker.date.past().toISOString(),
    ...overrides,
  };
}

export function mockPayment(userId: string, overrides: Record<string, unknown> = {}) {
  return {
    id: generateId(),
    userId,
    amount: faker.number.int({ min: 4999, max: 99999 }),
    currency: 'INR',
    status: 'PENDING',
    programId: generateId(),
    paymentId: null,
    signature: null,
    createdAt: faker.date.past().toISOString(),
    completedAt: null,
    ...overrides,
  };
}

export function mockNotification(userId: string, overrides: Record<string, unknown> = {}) {
  return {
    id: generateId(),
    userId,
    type: faker.helpers.arrayElement(['ASSIGNMENT', 'SESSION', 'PLACEMENT', 'MENTORSHIP', 'PAYMENT', 'GENERAL']),
    title: faker.lorem.words(3),
    message: faker.lorem.sentence(),
    isRead: false,
    createdAt: faker.date.past().toISOString(),
    ...overrides,
  };
}

export function mockMentorshipSession(mentorId: string, studentId: string, overrides: Record<string, unknown> = {}) {
  return {
    id: generateId(),
    mentorId,
    studentId,
    scheduledAt: faker.date.future().toISOString(),
    duration: 60,
    topic: faker.lorem.words(3),
    status: 'SCHEDULED',
    notes: null,
    createdAt: faker.date.past().toISOString(),
    ...overrides,
  };
}

export function mockBlogPost(overrides: Record<string, unknown> = {}) {
  const title = (overrides.title as string) || faker.lorem.words(5);
  return {
    id: generateId(),
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-'),
    content: faker.lorem.paragraphs(5),
    excerpt: faker.lorem.sentence(),
    author: faker.person.fullName(),
    tags: faker.helpers.arrayElements(['career', 'tech', 'education', 'AI'], { min: 1, max: 3 }),
    image: faker.image.url(),
    isPublished: true,
    publishedAt: faker.date.past().toISOString(),
    readTime: faker.number.int({ min: 3, max: 15 }),
    views: faker.number.int({ min: 0, max: 10000 }),
    ...overrides,
  };
}

export function mockFaculty(overrides: Record<string, unknown> = {}) {
  return {
    id: generateId(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    designation: faker.person.jobTitle(),
    bio: faker.lorem.paragraph(),
    expertise: faker.helpers.arrayElements(['AI', 'ML', 'Data Science', 'Web Dev', 'Cloud'], { min: 1, max: 3 }),
    image: faker.image.url(),
    isActive: true,
    createdAt: faker.date.past().toISOString(),
    ...overrides,
  };
}

export function mockAchiever(overrides: Record<string, unknown> = {}) {
  return {
    id: generateId(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    program: faker.helpers.arrayElement(['Data Science', 'AI Engineering', 'Product Management', 'Data Analytics']),
    company: faker.company.name(),
    designation: faker.person.jobTitle(),
    package: `₹${faker.number.int({ min: 10, max: 40 })} LPA`,
    testimonial: faker.lorem.paragraphs(2),
    image: faker.image.url(),
    rating: faker.number.int({ min: 4, max: 5 }),
    isFeatured: faker.datatype.boolean(),
    ...overrides,
  };
}

export function mockCareerPath(overrides: Record<string, unknown> = {}) {
  const title = (overrides.title as string) || faker.person.jobTitle();
  return {
    id: generateId(),
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-'),
    description: faker.lorem.paragraph(),
    skills: faker.helpers.arrayElements(['JavaScript', 'Python', 'SQL', 'React', 'AWS'], { min: 3, max: 6 }),
    avgSalary: `₹${faker.number.int({ min: 8, max: 30 })} LPA`,
    growthRate: `${faker.number.int({ min: 10, max: 35 })}%`,
    demand: faker.helpers.arrayElement(['High', 'Very High', 'Medium']),
    ...overrides,
  };
}

export function mockEmployer(overrides: Record<string, unknown> = {}) {
  return {
    id: generateId(),
    name: faker.company.name(),
    email: faker.internet.email(),
    website: faker.internet.url(),
    industry: faker.commerce.department(),
    size: faker.helpers.arrayElement(['1-10', '11-50', '51-200', '201-500', '500+']),
    location: faker.location.city(),
    description: faker.lorem.paragraph(),
    logo: faker.image.url(),
    isVerified: true,
    isActive: true,
    ...overrides,
  };
}

export function mockAiReport(userId: string, overrides: Record<string, unknown> = {}) {
  return {
    id: generateId(),
    userId,
    type: faker.helpers.arrayElement(['CHAT', 'RESUME_UPLOAD', 'RESUME_ANALYSIS', 'INTERVIEW', 'CAREER_ANALYSIS_UPLOAD', 'CAREER_ANALYSIS']),
    query: faker.lorem.sentence(),
    response: faker.lorem.paragraph(),
    report: overrides.report || null,
    createdAt: faker.date.past().toISOString(),
    ...overrides,
  };
}

export function mockInterviewSession(userId: string, overrides: Record<string, unknown> = {}) {
  return {
    id: generateId(),
    userId,
    role: faker.helpers.arrayElement(['AI Engineer', 'Product Manager', 'Data Scientist', 'Full Stack Developer']),
    status: 'IN_PROGRESS',
    startedAt: faker.date.recent().toISOString(),
    completedAt: null,
    score: null,
    feedback: null,
    ...overrides,
  };
}

export function mockResumeAnalysis(userId: string, overrides: Record<string, unknown> = {}) {
  return {
    id: generateId(),
    userId,
    resumeUrl: faker.internet.url(),
    fileType: 'pdf',
    atsScore: faker.number.int({ min: 40, max: 95 }),
    keywordMatch: faker.number.int({ min: 40, max: 95 }),
    formattingScore: faker.number.int({ min: 60, max: 100 }),
    missingKeywords: faker.helpers.arrayElements(['PyTorch', 'Kubernetes', 'MLOps', 'Redis'], { min: 2, max: 4 }),
    strengths: faker.helpers.arrayElements(['Strong React experience', 'Good project portfolio', 'Clear career progression'], { min: 2, max: 3 }),
    improvements: faker.helpers.arrayElements(['Add metrics', 'Include certifications', 'Optimize for ATS'], { min: 2, max: 3 }),
    suggestions: faker.helpers.arrayElements(['Add cloud projects', 'Quantify achievements', 'Use action verbs'], { min: 2, max: 3 }),
    createdAt: faker.date.past().toISOString(),
    ...overrides,
  };
}

export function mockAnalyticsReport(overrides: Record<string, unknown> = {}) {
  return {
    totalUsers: faker.number.int({ min: 100, max: 10000 }),
    totalStudents: faker.number.int({ min: 80, max: 8000 }),
    totalPrograms: faker.number.int({ min: 5, max: 50 }),
    totalEnrollments: faker.number.int({ min: 100, max: 5000 }),
    activeEnrollments: faker.number.int({ min: 50, max: 3000 }),
    totalPlacements: faker.number.int({ min: 20, max: 1000 }),
    totalApplicants: faker.number.int({ min: 50, max: 2000 }),
    totalRevenue: faker.number.int({ min: 100000, max: 10000000 }),
    totalTransactions: faker.number.int({ min: 50, max: 5000 }),
    averagePackage: `₹${faker.number.int({ min: 8, max: 25 })} LPA`,
    byMonth: {},
    byCompany: {},
    byProgram: {},
    ...overrides,
  };
}
