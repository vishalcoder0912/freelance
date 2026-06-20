import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Lazy load pages for optimal bundle splitting
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const ProgramsPage = lazy(() => import('@/pages/ProgramsPage'));
const ProgramDetailPage = lazy(() => import('@/pages/ProgramDetailPage'));
const AICopilotPage = lazy(() => import('@/pages/AICopilotPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const CareerAnalysisPage = lazy(() => import('@/pages/CareerAnalysisPage'));
const ResumeAnalyzerPage = lazy(() => import('@/pages/ResumeAnalyzerPage'));
const InterviewCoachPage = lazy(() => import('@/pages/InterviewCoachPage'));
const CareerPathsPage = lazy(() => import('@/pages/CareerPathsPage'));
const AchieversPage = lazy(() => import('@/pages/AchieversPage'));
const FacultyPage = lazy(() => import('@/pages/FacultyPage'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const EmployersPage = lazy(() => import('@/pages/EmployersPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));

// A Loading indicator matching the premium light-purple aesthetic
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

// Layout wrapper for standard public pages containing Navbar & Footer
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC] grid-bg-light">
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes with Navbar & Footer */}
          <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
          <Route path="/programs" element={<PublicLayout><ProgramsPage /></PublicLayout>} />
          <Route path="/program/:slug" element={<PublicLayout><ProgramDetailPage /></PublicLayout>} />
          <Route path="/career-paths" element={<PublicLayout><CareerPathsPage /></PublicLayout>} />
          <Route path="/achievers" element={<PublicLayout><AchieversPage /></PublicLayout>} />
          <Route path="/faculty" element={<PublicLayout><FacultyPage /></PublicLayout>} />
          <Route path="/blog" element={<PublicLayout><BlogPage /></PublicLayout>} />
          <Route path="/employers" element={<PublicLayout><EmployersPage /></PublicLayout>} />

          {/* Dedicated SaaS App / Interactive AI Pages (Stand-alone Layouts) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/ai-copilot" element={<AICopilotPage />} />
          <Route path="/career-analysis" element={<CareerAnalysisPage />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzerPage />} />
          <Route path="/interview-coach" element={<InterviewCoachPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
