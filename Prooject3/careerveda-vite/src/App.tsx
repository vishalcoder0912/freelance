import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import RoleGuard from '@/components/auth/RoleGuard';

// =============================================
// 1. PUBLIC ROUTES (Marketing Website)
// =============================================
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const ProgramsPage = lazy(() => import('@/pages/ProgramsPage'));
const ProgramDetailPage = lazy(() => import('@/pages/ProgramDetailPage'));
const CareerPathsPage = lazy(() => import('@/pages/CareerPathsPage'));
const AchieversPage = lazy(() => import('@/pages/AchieversPage'));
const FacultyPage = lazy(() => import('@/pages/FacultyPage'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const BlogDetailPage = lazy(() => import('@/pages/BlogDetailPage'));
const EmployersPage = lazy(() => import('@/pages/EmployersPage'));

// =============================================
// 2. AUTH ROUTES (Standalone)
// =============================================
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));

// =============================================
// 3. STUDENT ROUTES
// =============================================
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const RoadmapPage = lazy(() => import('@/pages/RoadmapPage'));
const LearnPage = lazy(() => import('@/pages/LearnPage'));
const MyLearningPage = lazy(() => import('@/pages/MyLearningPage'));
const MyProjectsPage = lazy(() => import('@/pages/MyProjectsPage'));
const MyCertificatesPage = lazy(() => import('@/pages/MyCertificatesPage'));
const MyPlacementPage = lazy(() => import('@/pages/MyPlacementPage'));
const MyMentorPage = lazy(() => import('@/pages/MyMentorPage'));

// =============================================
// 4. AI FEATURE ROUTES (Student Tools)
// =============================================
const AICopilotPage = lazy(() => import('@/pages/AICopilotPage'));
const CareerAnalysisPage = lazy(() => import('@/pages/CareerAnalysisPage'));
const ResumeAnalyzerPage = lazy(() => import('@/pages/ResumeAnalyzerPage'));
const InterviewCoachPage = lazy(() => import('@/pages/InterviewCoachPage'));
const AnalysisConsolePage = lazy(() => import('@/pages/AnalysisConsolePage'));

// =============================================
// 5. ERP PORTAL ROUTES
// =============================================
const MentorPage = lazy(() => import('@/pages/MentorPage'));
const RecruiterPage = lazy(() => import('@/pages/RecruiterPage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));

// Loading indicator
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFC]">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <span className="absolute text-xs font-semibold text-indigo-600">CV</span>
      </div>
    </div>
  );
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC] grid-bg-light">
      <Navbar />
      <main className="flex-grow pt-16">{children}</main>
      <Footer />
    </div>
  );
}

function StudentRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <RoleGuard allowedRole="student">{children}</RoleGuard>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ============================================= */}
          {/* PUBLIC ROUTES                                 */}
          {/* ============================================= */}
          <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
          <Route path="/programs" element={<PublicLayout><ProgramsPage /></PublicLayout>} />
          <Route path="/program/:slug" element={<PublicLayout><ProgramDetailPage /></PublicLayout>} />
          <Route path="/career-paths" element={<PublicLayout><CareerPathsPage /></PublicLayout>} />
          <Route path="/achievers" element={<PublicLayout><AchieversPage /></PublicLayout>} />
          <Route path="/faculty" element={<PublicLayout><FacultyPage /></PublicLayout>} />
          <Route path="/blog" element={<PublicLayout><BlogPage /></PublicLayout>} />
          <Route path="/blog/:slug" element={<PublicLayout><BlogDetailPage /></PublicLayout>} />
          <Route path="/employers" element={<PublicLayout><EmployersPage /></PublicLayout>} />

          {/* ============================================= */}
          {/* AUTH ROUTES                                    */}
          {/* ============================================= */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/login" element={<LoginPage />} />

          {/* ============================================= */}
          {/* STUDENT ROUTES                                 */}
          {/* ============================================= */}
          <Route path="/dashboard" element={<StudentRoute><DashboardPage /></StudentRoute>} />
          <Route path="/roadmap" element={<StudentRoute><RoadmapPage /></StudentRoute>} />
          <Route path="/learn/:programId/:moduleId/:lessonId" element={<StudentRoute><LearnPage /></StudentRoute>} />
          <Route path="/my-learning" element={<StudentRoute><MyLearningPage /></StudentRoute>} />
          <Route path="/my-projects" element={<StudentRoute><MyProjectsPage /></StudentRoute>} />
          <Route path="/my-certificates" element={<StudentRoute><MyCertificatesPage /></StudentRoute>} />
          <Route path="/my-placement" element={<StudentRoute><MyPlacementPage /></StudentRoute>} />
          <Route path="/my-mentor" element={<StudentRoute><MyMentorPage /></StudentRoute>} />

          {/* ============================================= */}
          {/* AI FEATURE ROUTES (Student Tools)              */}
          {/* ============================================= */}
          <Route path="/ai-copilot" element={<StudentRoute><AICopilotPage /></StudentRoute>} />
          <Route path="/career-analysis" element={<StudentRoute><CareerAnalysisPage /></StudentRoute>} />
          <Route path="/resume-analyzer" element={<StudentRoute><ResumeAnalyzerPage /></StudentRoute>} />
          <Route path="/interview-coach" element={<StudentRoute><InterviewCoachPage /></StudentRoute>} />
          <Route path="/analysis-console" element={<StudentRoute><AnalysisConsolePage /></StudentRoute>} />

          {/* ============================================= */}
          {/* ERP PORTAL ROUTES                              */}
          {/* ============================================= */}
          <Route path="/mentor" element={<ProtectedRoute><RoleGuard allowedRole="mentor"><MentorPage /></RoleGuard></ProtectedRoute>} />
          <Route path="/recruiter" element={<ProtectedRoute><RoleGuard allowedRole="recruiter"><RecruiterPage /></RoleGuard></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><RoleGuard allowedRole="admin"><AdminPage /></RoleGuard></ProtectedRoute>} />

          {/* ============================================= */}
          {/* FALLBACK                                       */}
          {/* ============================================= */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
