const STORAGE_KEY = 'careerveda_student_data';

export interface AssignmentRecord {
  id: string;
  title: string;
  program: string;
  module: string;
  deadline: string;
  submitted: boolean;
  submittedAt: string | null;
  score: number | null;
  feedback: string | null;
  fileName: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
}

export interface ProjectRecord {
  id: string;
  title: string;
  program: string;
  category: string;
  status: 'not-started' | 'in-progress' | 'submitted' | 'reviewed';
  score: number | null;
  feedback: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  documentationUrl: string | null;
  teamSize: number;
  technologies: string[];
}

export interface CertificateRecord {
  id: string;
  title: string;
  program: string;
  issuedAt: string;
  credentialId: string;
  skills: string[];
  verified: boolean;
}

export interface JobListing {
  id: string;
  company: string;
  role: string;
  location: string;
  salary: string;
  type: string;
  experience: string;
  skills: string[];
  postedAt: string;
  description: string;
}

export interface ApplicationRecord {
  id: string;
  jobId: string;
  company: string;
  role: string;
  location: string;
  salary: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  appliedAt: string;
  matchScore: number;
  interviews: { type: string; date: string; feedback?: string }[];
}

export interface NotificationItem {
  id: string;
  message: string;
  type: 'assignment' | 'session' | 'feedback' | 'job' | 'certificate' | 'general';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface CareerAssessmentResult {
  takenAt: string;
  recommendedPaths: string[];
  strengths: string[];
  gaps: string[];
  score: number;
}

export interface ResumeReport {
  uploadedAt: string;
  fileName: string;
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}

export interface InterviewSession {
  id: string;
  role: string;
  date: string;
  score: number | null;
  feedback: string | null;
  completed: boolean;
}

export interface StudentData {
  onboarding: {
    emailVerified: boolean;
    profileCompleted: boolean;
    resumeUploaded: boolean;
    careerAssessmentTaken: boolean;
    careerPathSelected: boolean;
  };
  profile: {
    name: string;
    phone: string;
    education: string;
    experience: string;
    location: string;
  };
  courseProgress: {
    lessonsCompleted: number;
    totalLessons: number;
    assignmentsSubmitted: number;
    totalAssignments: number;
    projectsCompleted: number;
    totalProjects: number;
  };
  attendance: {
    attended: number;
    total: number;
  };
  scores: {
    resumeScore: number | null;
    interviewScore: number | null;
    assignmentAvg: number | null;
    projectAvg: number | null;
  };
  interviews: {
    hr: number | null;
    technical: number | null;
    systemDesign: number | null;
    coding: number | null;
  };
  weeklyTasks: {
    completed: number;
    total: number;
  };
  learning: {
    lessonProgress: Record<string, boolean>;
    lessonNotes: Record<string, string>;
    timeSpent: Record<string, number>;
    currentLesson: string | null;
  };
  assignments: AssignmentRecord[];
  projects: ProjectRecord[];
  certificates: CertificateRecord[];
  applications: ApplicationRecord[];
  savedJobs: string[];
  notifications: NotificationItem[];
  careerAssessment: CareerAssessmentResult | null;
  resumeReport: ResumeReport | null;
  interviewSessions: InterviewSession[];
  nextClass: string | null;
  assignmentsDue: number;
  selectedCareerPath: string | null;
  communityActivity: {
    discussions: number;
    events: number;
    hackathons: number;
    referrals: number;
  };
}

export function getDefaultStudentData(): StudentData {
  return {
    onboarding: {
      emailVerified: false,
      profileCompleted: false,
      resumeUploaded: false,
      careerAssessmentTaken: false,
      careerPathSelected: false,
    },
    profile: { name: '', phone: '', education: '', experience: '', location: '' },
    courseProgress: {
      lessonsCompleted: 0, totalLessons: 0,
      assignmentsSubmitted: 0, totalAssignments: 0,
      projectsCompleted: 0, totalProjects: 0,
    },
    attendance: { attended: 0, total: 0 },
    scores: { resumeScore: null, interviewScore: null, assignmentAvg: null, projectAvg: null },
    interviews: { hr: null, technical: null, systemDesign: null, coding: null },
    weeklyTasks: { completed: 0, total: 8 },
    learning: { lessonProgress: {}, lessonNotes: {}, timeSpent: {}, currentLesson: null },
    assignments: [],
    projects: [],
    certificates: [],
    applications: [],
    savedJobs: [],
    notifications: [],
    careerAssessment: null,
    resumeReport: null,
    interviewSessions: [],
    nextClass: null,
    assignmentsDue: 0,
    selectedCareerPath: null,
    communityActivity: { discussions: 0, events: 0, hackathons: 0, referrals: 0 },
  };
}

export function getStudentData(): StudentData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const def = getDefaultStudentData();
      return {
        ...def, ...parsed,
        onboarding: { ...def.onboarding, ...parsed.onboarding },
        profile: { ...def.profile, ...parsed.profile },
        courseProgress: { ...def.courseProgress, ...parsed.courseProgress },
        attendance: { ...def.attendance, ...parsed.attendance },
        scores: { ...def.scores, ...parsed.scores },
        interviews: { ...def.interviews, ...parsed.interviews },
        weeklyTasks: { ...def.weeklyTasks, ...parsed.weeklyTasks },
        learning: { ...def.learning, ...parsed.learning },
        communityActivity: { ...def.communityActivity, ...parsed.communityActivity },
      };
    }
  } catch { /* ignore */ }
  return getDefaultStudentData();
}

export function saveStudentData(data: StudentData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function initStudentData(): void {
  if (!localStorage.getItem(STORAGE_KEY)) {
    saveStudentData(getDefaultStudentData());
  }
}

export function updateStudentData(updates: Partial<StudentData>): StudentData {
  const current = getStudentData();
  const merged = { ...current, ...updates };
  for (const key of ['onboarding', 'profile', 'courseProgress', 'attendance', 'scores', 'interviews', 'weeklyTasks', 'learning', 'communityActivity'] as const) {
    if (updates[key]) (merged as any)[key] = { ...(current as any)[key], ...(updates as any)[key] };
  }
  saveStudentData(merged);
  return merged;
}

// ===== ONBOARDING =====
export function completeOnboardingStep(step: keyof StudentData['onboarding']): StudentData {
  const data = getStudentData();
  data.onboarding[step] = true;
  saveStudentData(data);
  return data;
}

export function getOnboardingProgress(): { completed: number; total: number } {
  const s = getStudentData().onboarding;
  const done = [s.emailVerified, s.profileCompleted, s.resumeUploaded, s.careerAssessmentTaken, s.careerPathSelected].filter(Boolean).length;
  return { completed: done, total: 5 };
}

export function isOnboardingComplete(): boolean {
  return getOnboardingProgress().completed === 5;
}

export function getOnboardingStepLabel(step: keyof StudentData['onboarding']): string {
  const labels: Record<keyof StudentData['onboarding'], string> = {
    emailVerified: 'Verify Email Address',
    profileCompleted: 'Complete Your Profile',
    resumeUploaded: 'Upload Resume',
    careerAssessmentTaken: 'Take Career Assessment',
    careerPathSelected: 'Select a Career Path',
  };
  return labels[step];
}

export function getOnboardingStepNav(step: keyof StudentData['onboarding']): string | null {
  const nav: Record<keyof StudentData['onboarding'], string | null> = {
    emailVerified: null,
    profileCompleted: null,
    resumeUploaded: '/resume-analyzer',
    careerAssessmentTaken: '/career-analysis',
    careerPathSelected: '/career-paths',
  };
  return nav[step];
}

// ===== PROGRESS METRICS =====
export function getCourseProgressPercent(): number {
  const c = getStudentData().courseProgress;
  const total = c.totalLessons + c.totalAssignments + c.totalProjects;
  if (total === 0) return 0;
  return Math.round(((c.lessonsCompleted + c.assignmentsSubmitted + c.projectsCompleted) / total) * 100);
}

export function getAttendancePercent(): number {
  const a = getStudentData().attendance;
  return a.total > 0 ? Math.round((a.attended / a.total) * 100) : 0;
}

export function getAIScore(): number | null {
  const s = getStudentData().scores;
  const vals = [s.resumeScore, s.interviewScore, s.assignmentAvg, s.projectAvg].filter((v): v is number => v !== null);
  return vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
}

export function getPlacementReadiness(): number {
  return Math.round(Math.min(
    Math.min(getAttendancePercent(), 100) * 0.25 +
    Math.min(getCourseProgressPercent(), 100) * 0.25 +
    Math.min(getAIScore() ?? 0, 100) * 0.25 +
    Math.min(getStudentData().scores.resumeScore ?? 0, 100) * 0.25,
  100));
}

export function getPlacementTier(score: number): string {
  if (score <= 30) return 'Beginner';
  if (score <= 60) return 'Learning';
  if (score <= 80) return 'Interview Ready';
  return 'Placement Ready';
}

export function isPlacementLocked(): boolean {
  const data = getStudentData();
  const att = getAttendancePercent();
  const ai = getAIScore() ?? 0;
  const resume = data.scores.resumeScore ?? 0;
  const ap = data.courseProgress.totalAssignments > 0
    ? (data.courseProgress.assignmentsSubmitted / data.courseProgress.totalAssignments) * 100 : 0;
  return att < 80 || ap < 75 || ai < 70 || resume < 75;
}

export function getUnlockedFeatures(): string[] {
  const f: string[] = ['dashboard'];
  const data = getStudentData();
  if (data.onboarding.profileCompleted) f.push('career-assessment');
  if (data.onboarding.careerAssessmentTaken) f.push('resume-analyzer');
  if (data.onboarding.resumeUploaded) f.push('ai-copilot');
  if (data.scores.interviewScore !== null) f.push('mock-interview');
  if (!isPlacementLocked()) f.push('placement-portal');
  return f;
}

// ===== LESSONS =====
export function completeLesson(lessonKey: string): StudentData {
  const data = getStudentData();
  data.learning.lessonProgress[lessonKey] = true;
  data.courseProgress.lessonsCompleted = Object.keys(data.learning.lessonProgress).length;
  data.courseProgress.totalLessons = Math.max(data.courseProgress.totalLessons, data.courseProgress.lessonsCompleted);
  saveStudentData(data);
  return data;
}

export function isLessonCompleted(lessonKey: string): boolean {
  return !!getStudentData().learning.lessonProgress[lessonKey];
}

export function saveLessonNote(lessonKey: string, note: string): void {
  const data = getStudentData();
  data.learning.lessonNotes[lessonKey] = note;
  saveStudentData(data);
}

export function getLessonNote(lessonKey: string): string {
  return getStudentData().learning.lessonNotes[lessonKey] || '';
}

export function setCurrentLesson(lessonKey: string | null): void {
  const data = getStudentData();
  data.learning.currentLesson = lessonKey;
  saveStudentData(data);
}

export function getModuleProgress(programSlug: string, moduleIndex: number, lessonsPerModule: number): number {
  const data = getStudentData();
  let completed = 0;
  for (let i = 0; i < lessonsPerModule; i++) {
    if (data.learning.lessonProgress[`${programSlug}-m${moduleIndex}-l${i}`]) completed++;
  }
  return lessonsPerModule > 0 ? Math.round((completed / lessonsPerModule) * 100) : 0;
}

export function getFirstIncompleteLessonKey(programSlug: string, modules: { id: string; lessons: { id: string }[] }[]): string | null {
  const data = getStudentData();
  for (const mod of modules) {
    for (const les of mod.lessons) {
      const key = `${programSlug}-${mod.id}-${les.id}`;
      if (!data.learning.lessonProgress[key]) return key;
    }
  }
  return null;
}

// ===== ASSIGNMENTS =====
export function submitAssignment(id: string, fileName: string, githubUrl?: string, liveUrl?: string): void {
  const data = getStudentData();
  const a = data.assignments.find(x => x.id === id);
  if (a) {
    a.submitted = true;
    a.submittedAt = new Date().toISOString();
    a.fileName = fileName;
    if (githubUrl) a.githubUrl = githubUrl;
    if (liveUrl) a.liveUrl = liveUrl;
    data.courseProgress.assignmentsSubmitted = data.assignments.filter(x => x.submitted).length;
    data.courseProgress.totalAssignments = data.assignments.length;
    data.assignmentsDue = data.assignments.filter(x => !x.submitted && new Date(x.deadline) > new Date()).length;
    addNotification('assignment', `Assignment "${a.title}" submitted successfully`, `/assignments/${id}`);
    saveStudentData(data);
  }
}

export function addNotification(type: NotificationItem['type'], message: string, link?: string): void {
  const data = getStudentData();
  data.notifications.unshift({
    id: `n${Date.now()}`,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString(),
    link,
  });
  saveStudentData(data);
}

export function markNotificationsRead(): void {
  const data = getStudentData();
  data.notifications.forEach(n => n.read = true);
  saveStudentData(data);
}

export function getUnreadCount(): number {
  return getStudentData().notifications.filter(n => !n.read).length;
}

// ===== PROJECTS =====
export function submitProject(id: string, githubUrl: string, liveUrl: string, documentationUrl: string): void {
  const data = getStudentData();
  const p = data.projects.find(x => x.id === id);
  if (p) {
    p.status = 'submitted';
    p.githubUrl = githubUrl;
    p.liveUrl = liveUrl;
    p.documentationUrl = documentationUrl;
    data.courseProgress.projectsCompleted = data.projects.filter(x => x.status === 'submitted' || x.status === 'reviewed').length;
    data.courseProgress.totalProjects = data.projects.length;
    addNotification('general', `Project "${p.title}" submitted for review`, `/my-projects`);
    saveStudentData(data);
  }
}

// ===== APPLICATIONS =====
export function applyForJob(job: JobListing): void {
  const data = getStudentData();
  const exists = data.applications.find(a => a.jobId === job.id);
  if (!exists) {
    const app: ApplicationRecord = {
      id: `app${Date.now()}`,
      jobId: job.id,
      company: job.company,
      role: job.role,
      location: job.location,
      salary: job.salary,
      status: 'applied',
      appliedAt: new Date().toISOString(),
      matchScore: Math.round(50 + Math.random() * 45),
      interviews: [],
    };
    data.applications.push(app);
    addNotification('job', `Applied to ${job.role} at ${job.company}`, '/my-placement');
    saveStudentData(data);
  }
}

// ===== CAREER ASSESSMENT =====
export function saveCareerAssessment(result: CareerAssessmentResult): void {
  const data = getStudentData();
  data.careerAssessment = result;
  data.onboarding.careerAssessmentTaken = true;
  saveStudentData(data);
}

// ===== RESUME REPORT =====
export function saveResumeReport(report: ResumeReport): void {
  const data = getStudentData();
  data.resumeReport = report;
  data.scores.resumeScore = report.atsScore;
  data.onboarding.resumeUploaded = true;
  saveStudentData(data);
}

// ===== INTERVIEW SESSIONS =====
export function saveInterviewSession(session: InterviewSession): void {
  const data = getStudentData();
  data.interviewSessions.push(session);
  if (session.score !== null) {
    const scores = data.interviewSessions.filter(s => s.score !== null).map(s => s.score!);
    data.scores.interviewScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }
  saveStudentData(data);
}

// ===== PROFILE =====
export function saveProfile(profile: StudentData['profile']): void {
  const data = getStudentData();
  data.profile = profile;
  data.onboarding.profileCompleted = !!(profile.name && profile.phone && profile.education && profile.location);
  saveStudentData(data);
}

// ===== SIMULATE =====
export function simulateWeeklyProgress(): void {
  const data = getStudentData();
  data.weeklyTasks.completed = Math.min(data.weeklyTasks.completed + 1, data.weeklyTasks.total);
  data.courseProgress.lessonsCompleted = Math.min(data.courseProgress.lessonsCompleted + 1, 24);
  data.courseProgress.totalLessons = 24;
  data.attendance.attended = Math.min(data.attendance.attended + 1, 20);
  data.attendance.total = 20;
  saveStudentData(data);
}

// ===== SEED DEFAULT DATA FOR FRESH USERS =====
export function seedStudentData(): void {
  const data = getStudentData();
  if (data.assignments.length > 0) return;

  data.assignments = [
    { id: 'a1', title: 'Python Data Structures', program: 'Data Science', module: 'Python', deadline: '2026-07-15', submitted: false, submittedAt: null, score: null, feedback: null, fileName: null, githubUrl: null, liveUrl: null },
    { id: 'a2', title: 'SQL Query Optimization', program: 'Data Science', module: 'Databases', deadline: '2026-07-20', submitted: false, submittedAt: null, score: null, feedback: null, fileName: null, githubUrl: null, liveUrl: null },
    { id: 'a3', title: 'Linear Regression Model', program: 'Data Science', module: 'ML', deadline: '2026-07-10', submitted: true, submittedAt: '2026-07-08T14:30:00Z', score: 87, feedback: 'Good work! Try adding feature engineering.', fileName: 'regression.ipynb', githubUrl: '#', liveUrl: null },
    { id: 'a4', title: 'Data Visualization Dashboard', program: 'Data Science', module: 'Visualization', deadline: '2026-07-25', submitted: false, submittedAt: null, score: null, feedback: null, fileName: null, githubUrl: null, liveUrl: null },
  ];
  data.courseProgress.totalAssignments = data.assignments.length;
  data.courseProgress.assignmentsSubmitted = data.assignments.filter(a => a.submitted).length;
  data.assignmentsDue = data.assignments.filter(a => !a.submitted && new Date(a.deadline) > new Date()).length;

  const scores = data.assignments.filter(a => a.score !== null).map(a => a.score!);
  data.scores.assignmentAvg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

  data.projects = [
    { id: 'p1', title: 'Customer Churn Prediction', program: 'Data Science', category: 'ML Model', status: 'reviewed', score: 92, feedback: 'Excellent work! Clean code and strong analysis.', githubUrl: '#', liveUrl: '#', documentationUrl: '#', teamSize: 2, technologies: ['Python', 'Scikit-Learn', 'Pandas'] },
    { id: 'p2', title: 'Real-time Analytics Dashboard', program: 'Data Science', category: 'Dashboard', status: 'in-progress', score: null, feedback: null, githubUrl: null, liveUrl: null, documentationUrl: null, teamSize: 3, technologies: ['React', 'D3.js', 'FastAPI'] },
    { id: 'p3', title: 'NLP Sentiment Analyzer', program: 'Data Science', category: 'NLP', status: 'not-started', score: null, feedback: null, githubUrl: null, liveUrl: null, documentationUrl: null, teamSize: 1, technologies: ['PyTorch', 'Transformers'] },
  ];
  data.courseProgress.totalProjects = data.projects.length;
  data.courseProgress.projectsCompleted = data.projects.filter(p => p.status === 'reviewed' || p.status === 'submitted').length;
  const pScores = data.projects.filter(p => p.score !== null).map(p => p.score!);
  data.scores.projectAvg = pScores.length > 0 ? Math.round(pScores.reduce((a, b) => a + b, 0) / pScores.length) : null;

  data.certificates = [
    { id: 'c1', title: 'Python for Data Science', program: 'Data Science', issuedAt: '2026-05-15', credentialId: 'CV-DS-PY-001', skills: ['Python', 'NumPy', 'Pandas'], verified: true },
    { id: 'c2', title: 'Machine Learning Fundamentals', program: 'Data Science', issuedAt: '2026-06-01', credentialId: 'CV-DS-ML-002', skills: ['Regression', 'Classification', 'Scikit-Learn'], verified: true },
  ];

  data.careerAssessment = {
    takenAt: '2026-06-10T10:00:00Z',
    recommendedPaths: ['Data Science', 'AI Engineering'],
    strengths: ['Analytical Thinking', 'Python', 'Statistics'],
    gaps: ['Deep Learning', 'Cloud Deployment'],
    score: 78,
  };

  data.resumeReport = {
    uploadedAt: '2026-06-12T14:00:00Z',
    fileName: 'resume_2026.pdf',
    atsScore: 76,
    matchedKeywords: ['Python', 'SQL', 'Machine Learning', 'Data Analysis'],
    missingKeywords: ['TensorFlow', 'Docker', 'AWS'],
    suggestions: ['Add cloud computing experience', 'Quantify achievements with metrics', 'Include relevant certifications'],
  };

  data.interviewSessions = [
    { id: 'i1', role: 'Data Scientist', date: '2026-06-20', score: 82, feedback: 'Strong technical skills. Work on communication of complex topics.', completed: true },
  ];
  data.scores.interviewScore = 82;

  saveStudentData(data);
}
