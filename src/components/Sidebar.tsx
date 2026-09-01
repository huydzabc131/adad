import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Timer,
  Award,
  FileCode2,
  User,
  Users,
  Database,
  BarChart3,
  Sparkles,
  Layers,
  Settings,
  ChevronRight,
  ShieldCheck,
  GraduationCap,
  ListPlus,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC<Props> = ({ isOpen, onClose }) => {
  const { currentView, setCurrentView, getStudentProgress, exams } = useApp();
  const { currentUser, isAdmin, isStudent } = useAuth();

  if (!currentUser) return null;

  const progress = isStudent ? getStudentProgress(currentUser.id) : null;
  const activeExamsCount = exams.filter(e => e.is_published).length;

  const studentNavItems: NavItem[] = [
    {
      id: 'student-dashboard',
      label: 'Tổng quan học tập',
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: undefined,
    },
    {
      id: 'problem-list',
      label: 'Luyện tập thuật toán',
      icon: <BookOpen className="w-4 h-4" />,
      badge: '10+ bài',
    },
    {
      id: 'exam-list',
      label: 'Kỳ thi & Kiểm tra',
      icon: <Timer className="w-4 h-4" />,
      badge: activeExamsCount > 0 ? `${activeExamsCount} đang mở` : undefined,
      badgeColor: 'bg-green-900/30 text-green-400 border border-green-500/30',
    },
    {
      id: 'leaderboard',
      label: 'Bảng xếp hạng',
      icon: <Award className="w-4 h-4" />,
      badge: 'Top 1-10',
    },
    {
      id: 'submission-history',
      label: 'Lịch sử nộp bài',
      icon: <FileCode2 className="w-4 h-4" />,
      badge: undefined,
    },
    {
      id: 'profile',
      label: 'Hồ sơ học sinh',
      icon: <User className="w-4 h-4" />,
      badge: undefined,
    },
  ];

  const adminNavItems: NavItem[] = [
    {
      id: 'admin-dashboard',
      label: 'Bảng điều khiển',
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: 'Admin',
    },
    {
      id: 'student-management',
      label: 'Quản lý học sinh',
      icon: <Users className="w-4 h-4" />,
      badge: undefined,
    },
    {
      id: 'problem-management',
      label: 'Quản lý bài tập',
      icon: <BookOpen className="w-4 h-4" />,
      badge: undefined,
    },
    {
      id: 'testcase-management',
      label: 'Quản lý Test Cases',
      icon: <Database className="w-4 h-4" />,
      badge: 'Hidden/Sample',
    },
    {
      id: 'exam-management',
      label: 'Quản lý bài kiểm tra',
      icon: <Timer className="w-4 h-4" />,
      badge: undefined,
    },
    {
      id: 'statistics',
      label: 'Báo cáo & Thống kê',
      icon: <BarChart3 className="w-4 h-4" />,
      badge: undefined,
    },
  ];

  const navItems = isAdmin ? adminNavItems : studentNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed lg:static top-14 bottom-0 left-0 z-30 w-64 bg-[#0D1117] border-r border-[#30363D] flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation list */}
        <div className="p-3 space-y-5 overflow-y-auto custom-scrollbar">
          {/* User Role Card */}
          <div className="p-3 rounded-lg bg-[#161B22] border border-[#30363D]">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                alt={currentUser.full_name}
                className="w-9 h-9 rounded-lg object-cover border border-[#30363D]"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-xs text-[#F0F6FC] truncate">{currentUser.full_name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isAdmin
                        ? 'bg-purple-900/30 text-purple-400 border border-purple-500/30'
                        : 'bg-blue-900/30 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {isAdmin ? <ShieldCheck className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
                    {isAdmin ? 'Giáo viên' : currentUser.class_name}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick mini-progress for students */}
            {isStudent && progress && (
              <div className="mt-3 pt-2.5 border-t border-[#30363D] text-xs">
                <div className="flex justify-between text-[#8B949E] text-[11px] mb-1 font-mono">
                  <span>Tiến độ</span>
                  <span className="font-bold text-green-400">{progress.total_solved} bài</span>
                </div>
                <div className="w-full bg-[#21262D] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.round((progress.total_solved / Math.max(1, progress.basic_total + progress.medium_total + progress.advanced_total)) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section title */}
          <div>
            <p className="px-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B949E] mb-2">
              {isAdmin ? 'Hệ thống Quản trị' : 'Không gian Học tập'}
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = currentView === item.id || (item.id === 'problem-list' && currentView === 'problem-detail');
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setCurrentView(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-white' : 'text-[#8B949E]'}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          item.badgeColor
                            ? item.badgeColor
                            : isActive
                            ? 'bg-blue-700 text-blue-100'
                            : 'bg-[#21262D] text-[#8B949E] border border-[#30363D]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-[#30363D] bg-[#0D1117] text-[#8B949E] text-[10px] font-mono flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span>Judge0 Online</span>
          </div>
          <span className="text-[#8B949E]">v1.0.4</span>
        </div>
      </aside>
    </>
  );
};
