import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

// Views
import { LandingPage } from './views/LandingPage';
import { LoginPage } from './views/LoginPage';
import { Forbidden403View } from './views/Forbidden403View';
import { StudentDashboard } from './views/student/StudentDashboard';
import { ProblemListView } from './views/student/ProblemListView';
import { ProblemDetailView } from './views/student/ProblemDetailView';
import { ExamListView } from './views/student/ExamListView';
import { ExamRoomView } from './views/student/ExamRoomView';
import { LeaderboardView } from './views/student/LeaderboardView';
import { SubmissionHistoryView } from './views/student/SubmissionHistoryView';
import { StudentProfileView } from './views/student/StudentProfileView';

// Admin Views
import { AdminDashboard } from './views/admin/AdminDashboard';
import { StudentManagementView } from './views/admin/StudentManagementView';
import { ProblemManagementView } from './views/admin/ProblemManagementView';
import { TestCaseManagementView } from './views/admin/TestCaseManagementView';
import { ExamManagementView } from './views/admin/ExamManagementView';
import { StatisticsView } from './views/admin/StatisticsView';

const ADMIN_VIEWS = new Set([
  'admin-dashboard',
  'student-management',
  'user-management',
  'problem-management',
  'testcase-management',
  'exam-management',
  'statistics',
]);

const MainLayout: React.FC = () => {
  const { currentView } = useApp();
  const { currentUser, isAdmin } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Views that take full screen without sidebar
  const isLanding = currentView === 'landing';
  const isLogin = currentView === 'login';
  const isExamRoom = currentView === 'exam-room';
  const isProblemDetail = currentView === 'problem-detail';
  const is403 = ADMIN_VIEWS.has(currentView) && !isAdmin;

  const showSidebar = currentUser && !isLanding && !isLogin && !isExamRoom && !isProblemDetail && !is403;

  const renderView = () => {
    // 1. Check Admin Route Access
    if (ADMIN_VIEWS.has(currentView)) {
      if (!isAdmin) {
        return <Forbidden403View />;
      }
    }

    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'login':
        return <LoginPage />;
      case 'student-dashboard':
        return <StudentDashboard />;
      case 'problem-list':
        return <ProblemListView />;
      case 'problem-detail':
        return <ProblemDetailView />;
      case 'exam-list':
        return <ExamListView />;
      case 'exam-room':
        return <ExamRoomView />;
      case 'leaderboard':
        return <LeaderboardView />;
      case 'submission-history':
        return <SubmissionHistoryView />;
      case 'profile':
        return <StudentProfileView />;
      // Admin Views
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'student-management':
      case 'user-management':
        return <StudentManagementView />;
      case 'problem-management':
        return <ProblemManagementView />;
      case 'testcase-management':
        return <TestCaseManagementView />;
      case 'exam-management':
        return <ExamManagementView />;
      case 'statistics':
        return <StatisticsView />;
      default:
        return currentUser ? <StudentDashboard /> : <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-[#E6EDF3] flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Main Body */}
      <div className="flex flex-1 w-full overflow-hidden">
        {showSidebar && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}
        <main className="flex-1 w-full min-w-0 overflow-x-hidden min-h-[calc(100vh-56px)] bg-[#0A0C10]">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
