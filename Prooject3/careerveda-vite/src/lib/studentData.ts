const STORAGE_KEY = 'careerveda_student_data';

export interface StudentData {
  onboarding: {
    emailVerified: boolean;
    profileCompleted: boolean;
    resumeUploaded: boolean;
    careerAssessmentTaken: boolean;
    careerPathSelected: boolean;
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
  nextClass: string | null;
  assignmentsDue: number;
  selectedCareerPath: string | null;
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
    courseProgress: {
      lessonsCompleted: 0,
      totalLessons: 0,
      assignmentsSubmitted: 0,
      totalAssignments: 0,
      projectsCompleted: 0,
      totalProjects: 0,
    },
    attendance: {
      attended: 0,
      total: 0,
    },
    scores: {
      resumeScore: null,
      interviewScore: null,
      assignmentAvg: null,
      projectAvg: null,
    },
    interviews: {
      hr: null,
      technical: null,
      systemDesign: null,
      coding: null,
    },
    weeklyTasks: {
      completed: 0,
      total: 8,
    },
    learning: {
      lessonProgress: {},
      lessonNotes: {},
      timeSpent: {},
      currentLesson: null,
    },
    nextClass: null,
    assignmentsDue: 0,
    selectedCareerPath: null,
  };
}

export function getStudentData(): StudentData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const defaults = getDefaultStudentData();
      return { ...defaults, ...parsed, onboarding: { ...defaults.onboarding, ...parsed.onboarding }, courseProgress: { ...defaults.courseProgress, ...parsed.courseProgress }, attendance: { ...defaults.attendance, ...parsed.attendance }, scores: { ...defaults.scores, ...parsed.scores }, interviews: { ...defaults.interviews, ...parsed.interviews }, weeklyTasks: { ...defaults.weeklyTasks, ...parsed.weeklyTasks }, learning: { ...defaults.learning, ...parsed.learning } };
    }
  } catch { /* ignore */ }
  return getDefaultStudentData();
}

export function saveStudentData(data: StudentData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function initStudentData(): void {
  const exists = localStorage.getItem(STORAGE_KEY);
  if (!exists) {
    saveStudentData(getDefaultStudentData());
  }
}

export function updateStudentData(updates: Partial<StudentData>): StudentData {
  const current = getStudentData();
  const merged = { ...current, ...updates };
  if (updates.onboarding) merged.onboarding = { ...current.onboarding, ...updates.onboarding };
  if (updates.courseProgress) merged.courseProgress = { ...current.courseProgress, ...updates.courseProgress };
  if (updates.attendance) merged.attendance = { ...current.attendance, ...updates.attendance };
  if (updates.scores) merged.scores = { ...current.scores, ...updates.scores };
  if (updates.interviews) merged.interviews = { ...current.interviews, ...updates.interviews };
  if (updates.weeklyTasks) merged.weeklyTasks = { ...current.weeklyTasks, ...updates.weeklyTasks };
  if (updates.learning) merged.learning = { ...current.learning, ...updates.learning };
  saveStudentData(merged);
  return merged;
}

export function completeOnboardingStep(step: keyof StudentData['onboarding']): StudentData {
  const data = getStudentData();
  data.onboarding[step] = true;
  saveStudentData(data);
  return data;
}

export function getOnboardingProgress(): { completed: number; total: number } {
  const data = getStudentData();
  const steps = data.onboarding;
  let completed = 0;
  if (steps.emailVerified) completed++;
  if (steps.profileCompleted) completed++;
  if (steps.resumeUploaded) completed++;
  if (steps.careerAssessmentTaken) completed++;
  if (steps.careerPathSelected) completed++;
  return { completed, total: 5 };
}

export function isOnboardingComplete(): boolean {
  const p = getOnboardingProgress();
  return p.completed === p.total;
}

export function getCourseProgressPercent(): number {
  const { courseProgress: c } = getStudentData();
  const total = c.totalLessons + c.totalAssignments + c.totalProjects;
  if (total === 0) return 0;
  const done = c.lessonsCompleted + c.assignmentsSubmitted + c.projectsCompleted;
  return Math.round((done / total) * 100);
}

export function getAttendancePercent(): number {
  const { attendance: a } = getStudentData();
  if (a.total === 0) return 0;
  return Math.round((a.attended / a.total) * 100);
}

export function getAIScore(): number | null {
  const { scores: s } = getStudentData();
  const vals = [s.resumeScore, s.interviewScore, s.assignmentAvg, s.projectAvg].filter((v): v is number => v !== null);
  if (vals.length === 0) return null;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

export function getPlacementReadiness(): number {
  const att = getAttendancePercent();
  const cp = getCourseProgressPercent();
  const ai = getAIScore() ?? 0;
  const resume = getStudentData().scores.resumeScore ?? 0;

  let score = 0;
  score += Math.min(att, 100) * 0.25;
  score += Math.min(cp, 100) * 0.25;
  score += Math.min(ai, 100) * 0.25;
  score += Math.min(resume, 100) * 0.25;

  return Math.round(Math.min(score, 100));
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
  const assignmentsPct = data.courseProgress.totalAssignments > 0
    ? (data.courseProgress.assignmentsSubmitted / data.courseProgress.totalAssignments) * 100
    : 0;
  return att < 80 || assignmentsPct < 75 || ai < 70 || resume < 75;
}

export function getUnlockedFeatures(): string[] {
  const features: string[] = ['dashboard'];
  const data = getStudentData();

  if (data.onboarding.profileCompleted) features.push('career-assessment');
  if (data.onboarding.careerAssessmentTaken) features.push('resume-analyzer');
  if (data.onboarding.resumeUploaded) features.push('ai-copilot');
  if (data.scores.interviewScore !== null) features.push('mock-interview');
  if (!isPlacementLocked()) features.push('placement-portal');

  return features;
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
  const start = moduleIndex * lessonsPerModule;
  let completed = 0;
  for (let i = 0; i < lessonsPerModule; i++) {
    const key = `${programSlug}-m${moduleIndex}-l${i}`;
    if (data.learning.lessonProgress[key]) completed++;
  }
  return lessonsPerModule > 0 ? Math.round((completed / lessonsPerModule) * 100) : 0;
}

export function getOverallModuleIndex(programSlug: string, moduleIndex: number, lessonsPerModule: number): number {
  const data = getStudentData();
  const start = moduleIndex * lessonsPerModule;
  for (let i = 0; i < lessonsPerModule; i++) {
    const key = `${programSlug}-m${moduleIndex}-l${i}`;
    if (!data.learning.lessonProgress[key]) return moduleIndex;
  }
  return moduleIndex + 1;
}

export function getCurrentLessonKey(programSlug: string, modules: { lessons: any[] }[]): string | null {
  const data = getStudentData();
  for (let m = 0; m < modules.length; m++) {
    for (let l = 0; l < modules[m].lessons.length; l++) {
      const key = `${programSlug}-m${m}-l${l}`;
      if (!data.learning.lessonProgress[key]) return key;
    }
  }
  return null;
}

export function simulateWeeklyProgress(): void {
  const data = getStudentData();
  data.weeklyTasks.completed = Math.min(data.weeklyTasks.completed + 1, data.weeklyTasks.total);
  data.courseProgress.lessonsCompleted = Math.min(data.courseProgress.lessonsCompleted + 1, 24);
  data.courseProgress.totalLessons = 24;
  data.attendance.attended = Math.min(data.attendance.attended + 1, 20);
  data.attendance.total = 20;
  saveStudentData(data);
}
