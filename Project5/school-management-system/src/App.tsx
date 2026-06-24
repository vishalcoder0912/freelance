/*
 * App.tsx - Main application routing component.
 * Defines all routes for the school management system including
 * public pages, class-level portals (kindergarten, nursery, LKG, UKG),
 * and role-based portals (student, parent, teacher, admin).
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Layout } from './shared/components/Layout'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Classes } from './pages/Classes'
import { Games } from './pages/Games'
import { Rewards } from './pages/Rewards'
import { Profile } from './pages/Profile'

import { KindergartenDashboard } from './classes/kindergarten/dashboard/KindergartenDashboard'
import { AlphabetWorld } from './classes/kindergarten/alphabet-world/AlphabetWorld'
import { NumberWorld } from './classes/kindergarten/number-world/NumberWorld'
import { ColorLearning } from './classes/kindergarten/color-learning/ColorLearning'
import { ShapeLearning } from './classes/kindergarten/shape-learning/ShapeLearning'
import { AnimalKingdom } from './classes/kindergarten/animal-kingdom/AnimalKingdom'
import { RhymesZone } from './classes/kindergarten/rhymes-zone/RhymesZone'
import { DrawingBoard } from './classes/kindergarten/drawing-board/DrawingBoard'
import { ActivityCenter } from './classes/kindergarten/activity-center/ActivityCenter'
import { MiniGames } from './classes/kindergarten/mini-games/MiniGames'
import { Rewards as KindergartenRewards } from './classes/kindergarten/rewards/Rewards'
import { ProgressTracker } from './classes/kindergarten/progress-tracker/ProgressTracker'

import { NurseryDashboard } from './classes/nursery/dashboard/NurseryDashboard'
import { Alphabets } from './classes/nursery/alphabets/Alphabets'
import { Numbers } from './classes/nursery/numbers/Numbers'
import { FruitsLearning } from './classes/nursery/fruits-learning/FruitsLearning'
import { VegetablesLearning } from './classes/nursery/vegetables-learning/VegetablesLearning'
import { TransportLearning } from './classes/nursery/transport-learning/TransportLearning'
import { StoryWorld } from './classes/nursery/story-world/StoryWorld'
import { MemoryGames } from './classes/nursery/memory-games/MemoryGames'
import { Puzzles } from './classes/nursery/puzzles/Puzzles'
import { Rewards as NurseryRewards } from './classes/nursery/rewards/Rewards'
import { Progress } from './classes/nursery/progress/Progress'

import { LkgDashboard } from './classes/lkg/dashboard/LkgDashboard'
import { ReadingZone } from './classes/lkg/reading-zone/ReadingZone'
import { Phonics } from './classes/lkg/phonics/Phonics'
import { Counting } from './classes/lkg/counting/Counting'
import { Handwriting } from './classes/lkg/handwriting/Handwriting'
import { ScienceFun } from './classes/lkg/science-fun/ScienceFun'
import { MathFun } from './classes/lkg/math-fun/MathFun'
import { InteractiveGames as LkgInteractiveGames } from './classes/lkg/interactive-games/InteractiveGames'
import { Assessments } from './classes/lkg/assessments/Assessments'
import { Rewards as LkgRewards } from './classes/lkg/rewards/Rewards'

import { UkgDashboard } from './classes/ukg/dashboard/UkgDashboard'
import { English } from './classes/ukg/english/English'
import { Mathematics } from './classes/ukg/mathematics/Mathematics'
import { EnvironmentalScience } from './classes/ukg/environmental-science/EnvironmentalScience'
import { GeneralKnowledge } from './classes/ukg/general-knowledge/GeneralKnowledge'
import { CreativeZone } from './classes/ukg/creative-zone/CreativeZone'
import { CodingForKids } from './classes/ukg/coding-for-kids/CodingForKids'
import { InteractiveGames as UkgInteractiveGames } from './classes/ukg/interactive-games/InteractiveGames'
import { Exams } from './classes/ukg/exams/Exams'
import { Achievements } from './classes/ukg/achievements/Achievements'

import StudentDashboard from './student-portal/pages/StudentDashboard'
import Homework from './student-portal/pages/Homework'
import Timetable from './student-portal/pages/Timetable'
import OnlineClasses from './student-portal/pages/OnlineClasses'
import StudentReports from './student-portal/pages/Reports'
import StudentCertificates from './student-portal/pages/Certificates'

import ParentDashboard from './parent-portal/pages/ParentDashboard'
import FeeTracking from './parent-portal/pages/FeeTracking'
import AttendanceReports from './parent-portal/pages/AttendanceReports'
import Performance from './parent-portal/pages/Performance'
import Communication from './parent-portal/pages/Communication'
import ActivityMonitoring from './parent-portal/pages/ActivityMonitoring'

import TeacherDashboard from './teacher-portal/pages/TeacherDashboard'
import ClassManagement from './teacher-portal/pages/ClassManagement'
import TeacherAttendance from './teacher-portal/pages/Attendance'
import Assignments from './teacher-portal/pages/Assignments'
import QuizBuilder from './teacher-portal/pages/QuizBuilder'
import StudentAnalytics from './teacher-portal/pages/StudentAnalytics'

import AdminDashboard from './admin/pages/AdminDashboard'
import StudentManagement from './admin/pages/StudentManagement'
import StaffManagement from './admin/pages/StaffManagement'
import FeeManagement from './admin/pages/FeeManagement'
import TransportManagement from './admin/pages/TransportManagement'
import EventManagement from './admin/pages/EventManagement'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/games" element={<Games />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/kindergarten" element={<KindergartenDashboard />} />
            <Route path="/kindergarten/alphabet-world" element={<AlphabetWorld />} />
            <Route path="/kindergarten/number-world" element={<NumberWorld />} />
            <Route path="/kindergarten/color-learning" element={<ColorLearning />} />
            <Route path="/kindergarten/shape-learning" element={<ShapeLearning />} />
            <Route path="/kindergarten/animal-kingdom" element={<AnimalKingdom />} />
            <Route path="/kindergarten/rhymes-zone" element={<RhymesZone />} />
            <Route path="/kindergarten/drawing-board" element={<DrawingBoard />} />
            <Route path="/kindergarten/activity-center" element={<ActivityCenter />} />
            <Route path="/kindergarten/mini-games" element={<MiniGames />} />
            <Route path="/kindergarten/rewards" element={<KindergartenRewards />} />
            <Route path="/kindergarten/progress-tracker" element={<ProgressTracker />} />

            <Route path="/nursery" element={<NurseryDashboard />} />
            <Route path="/nursery/alphabets" element={<Alphabets />} />
            <Route path="/nursery/numbers" element={<Numbers />} />
            <Route path="/nursery/fruits-learning" element={<FruitsLearning />} />
            <Route path="/nursery/vegetables-learning" element={<VegetablesLearning />} />
            <Route path="/nursery/transport-learning" element={<TransportLearning />} />
            <Route path="/nursery/story-world" element={<StoryWorld />} />
            <Route path="/nursery/memory-games" element={<MemoryGames />} />
            <Route path="/nursery/puzzles" element={<Puzzles />} />
            <Route path="/nursery/rewards" element={<NurseryRewards />} />
            <Route path="/nursery/progress" element={<Progress />} />

            <Route path="/lkg" element={<LkgDashboard />} />
            <Route path="/lkg/reading-zone" element={<ReadingZone />} />
            <Route path="/lkg/phonics" element={<Phonics />} />
            <Route path="/lkg/counting" element={<Counting />} />
            <Route path="/lkg/handwriting" element={<Handwriting />} />
            <Route path="/lkg/science-fun" element={<ScienceFun />} />
            <Route path="/lkg/math-fun" element={<MathFun />} />
            <Route path="/lkg/interactive-games" element={<LkgInteractiveGames />} />
            <Route path="/lkg/assessments" element={<Assessments />} />
            <Route path="/lkg/rewards" element={<LkgRewards />} />

            <Route path="/ukg" element={<UkgDashboard />} />
            <Route path="/ukg/english" element={<English />} />
            <Route path="/ukg/mathematics" element={<Mathematics />} />
            <Route path="/ukg/environmental-science" element={<EnvironmentalScience />} />
            <Route path="/ukg/general-knowledge" element={<GeneralKnowledge />} />
            <Route path="/ukg/creative-zone" element={<CreativeZone />} />
            <Route path="/ukg/coding-for-kids" element={<CodingForKids />} />
            <Route path="/ukg/interactive-games" element={<UkgInteractiveGames />} />
            <Route path="/ukg/exams" element={<Exams />} />
            <Route path="/ukg/achievements" element={<Achievements />} />

            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/homework" element={<Homework />} />
            <Route path="/student/timetable" element={<Timetable />} />
            <Route path="/student/online-classes" element={<OnlineClasses />} />
            <Route path="/student/reports" element={<StudentReports />} />
            <Route path="/student/certificates" element={<StudentCertificates />} />

            <Route path="/parent" element={<ParentDashboard />} />
            <Route path="/parent/fee-tracking" element={<FeeTracking />} />
            <Route path="/parent/attendance" element={<AttendanceReports />} />
            <Route path="/parent/performance" element={<Performance />} />
            <Route path="/parent/communication" element={<Communication />} />
            <Route path="/parent/activity" element={<ActivityMonitoring />} />

            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/teacher/class-management" element={<ClassManagement />} />
            <Route path="/teacher/attendance" element={<TeacherAttendance />} />
            <Route path="/teacher/assignments" element={<Assignments />} />
            <Route path="/teacher/quiz-builder" element={<QuizBuilder />} />
            <Route path="/teacher/analytics" element={<StudentAnalytics />} />

            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<StudentManagement />} />
            <Route path="/admin/staff" element={<StaffManagement />} />
            <Route path="/admin/fees" element={<FeeManagement />} />
            <Route path="/admin/transport" element={<TransportManagement />} />
            <Route path="/admin/events" element={<EventManagement />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
