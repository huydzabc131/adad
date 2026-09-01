import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  Code2,
  ShieldCheck,
  GraduationCap,
  LogOut,
  ChevronDown,
  UserCheck,
  User,
  Menu,
  X,
  LogIn,
  UserPlus,
} from 'lucide-react';

interface Props {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<Props> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { currentView, setCurrentView, exams } = useApp();
  const { currentUser, isAdmin, isStudent, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Active exams count
  const activeExamsCount = exams.filter((e) => e.is_published).length;

  return (
    <header className="sticky top-0 z-40 w-full h-14 border-b border-[#30363D] bg-[#161B22] text-[#E6EDF3] flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
      <div className="flex items-center justify-between w-full">
        {/* Left: Brand & Mobile Sidebar Toggle */}
        <div className="flex items-center gap-3 sm:gap-4">
          {currentUser && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-1.5 text-[#8B949E] hover:text-white hover:bg-[#21262D] rounded-lg border border-transparent hover:border-[#30363D] cursor-pointer"
              title="Menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <div
            onClick={() => {
              if (!currentUser) setCurrentView('landing');
              else if (isAdmin) setCurrentView('admin-dashboard');
              else setCurrentView('student-dashboard');
            }}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-sm shadow-blue-500/30 flex items-center justify-center flex-shrink-0">
              <Code2 className="w-5 h-5 text-white flex-shrink-0" size={20} />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap">
                Algo<span className="text-blue-500">Master</span>
              </h1>
              <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 hidden xs:inline-block">
                PRO
              </span>
            </div>
          </div>

          {/* Quick navigation links for logged-in desktop view */}
          {currentUser && (
            <nav className="hidden md:flex items-center gap-5 ml-4 text-xs font-medium text-[#8B949E]">
              {isStudent ? (
                <>
                  <button
                    type="button"
                    onClick={() => setCurrentView('student-dashboard')}
                    className={`transition-colors py-4 cursor-pointer ${
                      currentView === 'student-dashboard'
                        ? 'text-[#F0F6FC] font-semibold border-b-2 border-blue-500'
                        : 'hover:text-[#F0F6FC]'
                    }`}
                  >
                    Tổng quan
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentView('problem-list')}
                    className={`transition-colors py-4 cursor-pointer ${
                      currentView === 'problem-list' || currentView === 'problem-detail'
                        ? 'text-[#F0F6FC] font-semibold border-b-2 border-blue-500'
                        : 'hover:text-[#F0F6FC]'
                    }`}
                  >
                    Luyện tập
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentView('exam-list')}
                    className={`transition-colors py-4 relative flex items-center gap-1.5 cursor-pointer ${
                      currentView === 'exam-list' || currentView === 'exam-room'
                        ? 'text-[#F0F6FC] font-semibold border-b-2 border-blue-500'
                        : 'hover:text-[#F0F6FC]'
                    }`}
                  >
                    <span>Kỳ thi</span>
                    {activeExamsCount > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentView('leaderboard')}
                    className={`transition-colors py-4 cursor-pointer ${
                      currentView === 'leaderboard'
                        ? 'text-[#F0F6FC] font-semibold border-b-2 border-blue-500'
                        : 'hover:text-[#F0F6FC]'
                    }`}
                  >
                    Bảng xếp hạng
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentView('submission-history')}
                    className={`transition-colors py-4 cursor-pointer ${
                      currentView === 'submission-history'
                        ? 'text-[#F0F6FC] font-semibold border-b-2 border-blue-500'
                        : 'hover:text-[#F0F6FC]'
                    }`}
                  >
                    Lịch sử
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setCurrentView('admin-dashboard')}
                    className={`transition-colors py-4 cursor-pointer ${
                      currentView === 'admin-dashboard'
                        ? 'text-[#F0F6FC] font-semibold border-b-2 border-blue-500'
                        : 'hover:text-[#F0F6FC]'
                    }`}
                  >
                    Bảng điều khiển
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentView('student-management')}
                    className={`transition-colors py-4 cursor-pointer ${
                      currentView === 'student-management' || currentView === 'user-management'
                        ? 'text-[#F0F6FC] font-semibold border-b-2 border-blue-500'
                        : 'hover:text-[#F0F6FC]'
                    }`}
                  >
                    Quản lý người dùng
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentView('problem-management')}
                    className={`transition-colors py-4 cursor-pointer ${
                      currentView === 'problem-management'
                        ? 'text-[#F0F6FC] font-semibold border-b-2 border-blue-500'
                        : 'hover:text-[#F0F6FC]'
                    }`}
                  >
                    Kho bài tập
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentView('testcase-management')}
                    className={`transition-colors py-4 cursor-pointer ${
                      currentView === 'testcase-management'
                        ? 'text-[#F0F6FC] font-semibold border-b-2 border-blue-500'
                        : 'hover:text-[#F0F6FC]'
                    }`}
                  >
                    Test Cases
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentView('exam-management')}
                    className={`transition-colors py-4 cursor-pointer ${
                      currentView === 'exam-management'
                        ? 'text-[#F0F6FC] font-semibold border-b-2 border-blue-500'
                        : 'hover:text-[#F0F6FC]'
                    }`}
                  >
                    Kỳ thi
                  </button>
                </>
              )}
            </nav>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu((prev) => !prev)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-[#21262D] border border-[#30363D] hover:border-[#8B949E]/50 transition-all text-xs cursor-pointer shadow-sm"
              >
                <img
                  src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                  alt={currentUser.full_name}
                  className="w-6 h-6 rounded-full object-cover border border-[#30363D]"
                />
                <div className="text-left hidden sm:block">
                  <span className="font-semibold text-[#E6EDF3] leading-tight truncate max-w-[120px] block">
                    {currentUser.full_name}
                  </span>
                </div>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                    isAdmin
                      ? 'bg-purple-900/30 text-purple-400 border border-purple-500/30'
                      : 'bg-blue-900/30 text-blue-400 border border-blue-500/30'
                  }`}
                >
                  {isAdmin ? 'ADMIN' : 'USER'}
                </span>
                <ChevronDown className="w-3 h-3 text-[#8B949E]" />
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div
                  className="absolute right-0 mt-2 w-60 bg-[#161B22] border border-[#30363D] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setShowUserMenu(false)}
                >
                  <div className="p-2.5 border-b border-[#30363D] mb-1">
                    <p className="font-semibold text-xs text-[#F0F6FC] truncate">{currentUser.full_name}</p>
                    <p className="text-[11px] text-[#8B949E] font-mono">@{currentUser.username}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-[#C9D1D9] bg-[#0D1117] p-2 rounded-lg border border-[#30363D]">
                      <span>Vai trò:</span>
                      <span
                        className={`font-bold font-mono px-1.5 py-0.5 rounded text-[10px] ${
                          isAdmin ? 'text-purple-400' : 'text-blue-400'
                        }`}
                      >
                        {isAdmin ? 'Quản trị viên (ADMIN)' : 'Người dùng (USER)'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentView('profile')}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#C9D1D9] hover:text-white hover:bg-[#21262D] transition-colors text-left cursor-pointer"
                  >
                    <User className="w-4 h-4 text-blue-400" />
                    <span>Hồ sơ & Bảo mật tài khoản</span>
                  </button>

                  <div className="border-t border-[#30363D] my-1" />

                  <button
                    type="button"
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-900/20 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentView('login')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-[#E6EDF3] border border-[#30363D] text-xs font-semibold transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-400" />
                <span>Đăng nhập</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('login')}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm shadow-blue-500/20"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Đăng ký</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
