import { getCurrentUser } from '@/lib/auth';

export interface Student {
  id: string;
  name: string;
  email: string;
  program: string;
  progress: number;
  attendance: number;
  assignmentsCompleted: number;
  assignmentsTotal: number;
  assignmentsMissing: number;
  aiScore: number;
  resumeScore: number;
  interviewScore: number;
  placementReadiness: number;
  readiness: 'High' | 'Medium' | 'Low';
  avatar?: string;
}

export interface AtRiskStudent {
  id: string;
  name: string;
  reason: string;
  value: string;
  severity: 'high' | 'medium' | 'low';
}

export interface StudentProgressPipeline {
  onboarding: number;
  learning: number;
  assignments: number;
  projects: number;
  placementReady: number;
  placed: number;
}

export interface PlacementReadiness {
  ready: number;
  almostReady: number;
  needsWork: number;
}

export interface ReviewQueue {
  assignmentReviews: number;
  projectReviews: number;
  resumeReviews: number;
  interviewFeedback: number;
}

export interface MentorAnalytics {
  studentsImproved: number;
  averageCompletion: number;
  placementSuccess: number;
  feedbackRating: number;
}

export interface Session {
  id: string;
  studentName: string;
  studentId: string;
  program: string;
  progress: number;
  topic: string;
  placementReadiness: number;
  time: string;
  status: 'upcoming' | 'completed';
  duration?: string;
}

export interface Deadline {
  id: string;
  title: string;
  due: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Message {
  id: string;
  type: 'question' | 'urgent' | 'general';
  count: number;
}

const MOCK_STUDENTS: Student[] = [
  { id: '1', name: 'Rohan Sharma', email: 'rohan@email.com', program: 'AI Engineering', progress: 22, attendance: 85, assignmentsCompleted: 2, assignmentsTotal: 5, assignmentsMissing: 3, aiScore: 88, resumeScore: 76, interviewScore: 55, placementReadiness: 45, readiness: 'Low' },
  { id: '2', name: 'Priya Patel', email: 'priya@email.com', program: 'Data Science', progress: 58, attendance: 58, assignmentsCompleted: 4, assignmentsTotal: 6, assignmentsMissing: 2, aiScore: 82, resumeScore: 71, interviewScore: 68, placementReadiness: 60, readiness: 'Medium' },
  { id: '3', name: 'Aditya Sen', email: 'aditya@email.com', program: 'AI Engineering', progress: 91, attendance: 95, assignmentsCompleted: 8, assignmentsTotal: 8, assignmentsMissing: 0, aiScore: 94, resumeScore: 89, interviewScore: 41, placementReadiness: 82, readiness: 'High' },
  { id: '4', name: 'Neha Gupta', email: 'neha@email.com', program: 'Product Management', progress: 45, attendance: 72, assignmentsCompleted: 3, assignmentsTotal: 7, assignmentsMissing: 4, aiScore: 79, resumeScore: 85, interviewScore: 72, placementReadiness: 55, readiness: 'Medium' },
  { id: '5', name: 'Arjun Mehta', email: 'arjun@email.com', program: 'Full Stack Dev', progress: 65, attendance: 80, assignmentsCompleted: 5, assignmentsTotal: 6, assignmentsMissing: 1, aiScore: 73, resumeScore: 68, interviewScore: 60, placementReadiness: 50, readiness: 'Low' },
  { id: '6', name: 'Sneha Kapoor', email: 'sneha@email.com', program: 'Data Science', progress: 83, attendance: 92, assignmentsCompleted: 7, assignmentsTotal: 7, assignmentsMissing: 0, aiScore: 90, resumeScore: 82, interviewScore: 78, placementReadiness: 78, readiness: 'High' },
  { id: '7', name: 'Vikram Singh', email: 'vikram@email.com', program: 'AI Engineering', progress: 12, attendance: 40, assignmentsCompleted: 1, assignmentsTotal: 4, assignmentsMissing: 3, aiScore: 45, resumeScore: 35, interviewScore: 28, placementReadiness: 20, readiness: 'Low' },
  { id: '8', name: 'Ananya Reddy', email: 'ananya@email.com', program: 'Data Science', progress: 74, attendance: 88, assignmentsCompleted: 5, assignmentsTotal: 6, assignmentsMissing: 1, aiScore: 85, resumeScore: 79, interviewScore: 82, placementReadiness: 72, readiness: 'Medium' },
];

const DELAY = 300;

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchStudents(): Promise<Student[]> {
  await delay(DELAY);
  const user = getCurrentUser();
  if (!user) return [];
  return MOCK_STUDENTS;
}

export async function fetchStudentById(id: string): Promise<Student | null> {
  await delay(DELAY);
  return MOCK_STUDENTS.find(s => s.id === id) ?? null;
}

export async function fetchKPIs() {
  await delay(DELAY);
  const students = MOCK_STUDENTS;
  return {
    studentsAssigned: students.length,
    atRiskStudents: students.filter(s => s.placementReadiness < 50 || s.progress < 30 || s.attendance < 60).length,
    pendingReviews: 12,
    placementReadyStudents: students.filter(s => s.placementReadiness >= 70).length,
  };
}

export async function fetchAtRiskStudents(): Promise<AtRiskStudent[]> {
  await delay(DELAY);
  return [
    { id: '1', name: 'Rohan Sharma', reason: 'Progress', value: '22%', severity: 'high' },
    { id: '2', name: 'Priya Patel', reason: 'Attendance', value: '58%', severity: 'high' },
    { id: '3', name: 'Aditya Sen', reason: 'Interview Score', value: '41/100', severity: 'medium' },
    { id: '5', name: 'Arjun Mehta', reason: 'Readiness', value: '50%', severity: 'low' },
    { id: '7', name: 'Vikram Singh', reason: 'Progress', value: '12%', severity: 'high' },
  ];
}

export async function fetchStudentPipeline(): Promise<StudentProgressPipeline> {
  await delay(DELAY);
  return {
    onboarding: 5,
    learning: 22,
    assignments: 10,
    projects: 7,
    placementReady: 4,
    placed: 0,
  };
}

export async function fetchPlacementReadiness(): Promise<PlacementReadiness> {
  await delay(DELAY);
  return { ready: 18, almostReady: 14, needsWork: 16 };
}

export async function fetchReviewQueue(): Promise<ReviewQueue> {
  await delay(DELAY);
  return { assignmentReviews: 8, projectReviews: 3, resumeReviews: 5, interviewFeedback: 4 };
}

export async function fetchMentorAnalytics(): Promise<MentorAnalytics> {
  await delay(DELAY);
  return { studentsImproved: 21, averageCompletion: 84, placementSuccess: 91, feedbackRating: 4.8 };
}

export async function fetchSessions(): Promise<Session[]> {
  await delay(DELAY);
  return [
    { id: '1', studentName: 'Priya Patel', studentId: '2', program: 'Data Science', progress: 67, topic: 'Data Science Q&A', placementReadiness: 72, time: '4:00 PM', status: 'upcoming' },
    { id: '2', studentName: 'Aditya Sen', studentId: '3', program: 'AI Engineering', progress: 91, topic: 'MLOps Pipeline Review', placementReadiness: 82, time: '5:30 PM', status: 'upcoming' },
    { id: '3', studentName: 'Neha Gupta', studentId: '4', program: 'Product Management', progress: 45, topic: 'Product Strategy Workshop', placementReadiness: 55, time: '7:00 PM', status: 'upcoming' },
    { id: '4', studentName: 'Rohan Sharma', studentId: '1', program: 'AI Engineering', progress: 22, topic: 'Career Guidance', placementReadiness: 45, time: 'Tomorrow, 11:00 AM', status: 'upcoming' },
    { id: '5', studentName: 'Sneha Kapoor', studentId: '6', program: 'Data Science', progress: 83, topic: 'Resume Review', placementReadiness: 78, time: 'Tomorrow, 2:00 PM', status: 'upcoming' },
    { id: '6', studentName: 'Priya Patel', studentId: '2', program: 'Data Science', progress: 58, topic: 'Data Science Q&A', placementReadiness: 60, time: 'Jun 20, 2026', duration: '45 min', status: 'completed' },
    { id: '7', studentName: 'Aditya Sen', studentId: '3', program: 'AI Engineering', progress: 91, topic: 'MLOps Review', placementReadiness: 82, time: 'Jun 19, 2026', duration: '50 min', status: 'completed' },
  ];
}

export async function fetchDeadlines(): Promise<Deadline[]> {
  await delay(DELAY);
  return [
    { id: '1', title: 'Assignment Review', due: 'Due Today', priority: 'high' },
    { id: '2', title: 'Project Evaluation', due: 'Tomorrow', priority: 'high' },
    { id: '3', title: 'Capstone Feedback', due: '2 Days', priority: 'medium' },
    { id: '4', title: 'Resume Review', due: '3 Days', priority: 'low' },
  ];
}

export async function fetchMessages(): Promise<Message[]> {
  await delay(DELAY);
  return [
    { id: '1', type: 'question', count: 8 },
    { id: '2', type: 'urgent', count: 2 },
    { id: '3', type: 'general', count: 12 },
  ];
}
