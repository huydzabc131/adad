import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { DifficultyBadge } from '../components/DifficultyBadge';
import {
  Terminal,
  Cpu,
  ArrowRight,
  Sparkles,
  Layers,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  LogIn,
  BookOpen,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, topics } = useApp();
  const { currentUser, isAdmin } = useAuth();

  const handleStartCTA = () => {
    if (!currentUser) {
      setCurrentView('login');
    } else if (isAdmin) {
      setCurrentView('admin-dashboard');
    } else {
      setCurrentView('student-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-[#E6EDF3] selection:bg-blue-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[250px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-800/60 text-blue-300 text-xs font-semibold mb-6 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Nền tảng Luyện Lập Trình & Ôn Thi Học Sinh Giỏi</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Chinh phục Thuật toán cùng{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              AlgoMaster
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[#8B949E] leading-relaxed">
            Hệ thống học và luyện tập lập trình theo từng chủ đề từ cơ bản đến nâng cao. Tích hợp Monaco Code Editor hiện đại, hệ thống Online Judge chấm điểm thời gian thực và phòng thi trực tuyến.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleStartCTA}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 transition-all cursor-pointer"
            >
              {currentUser ? (
                <>
                  {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                  <span>{isAdmin ? 'Vào Bảng Quản Trị' : 'Vào Bảng Học Tập'}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Bắt đầu Luyện tập ngay</span>
                </>
              )}
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('problem-list')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#161B22] hover:bg-[#21262D] border border-[#30363D] text-[#E6EDF3] font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Khám phá Kho Bài Tập</span>
            </button>
          </div>

          {/* Key stats row */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#161B22]/80 border border-[#30363D] backdrop-blur-sm">
            <div className="text-center p-2">
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono">21+</p>
              <p className="text-xs text-[#8B949E] mt-0.5">Chủ đề Thuật toán</p>
            </div>
            <div className="text-center p-2">
              <p className="text-2xl sm:text-3xl font-extrabold text-green-400 font-mono">100%</p>
              <p className="text-xs text-[#8B949E] mt-0.5">Chấm điểm tự động</p>
            </div>
            <div className="text-center p-2">
              <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">4</p>
              <p className="text-xs text-[#8B949E] mt-0.5">Ngôn ngữ (Py, C++, C, Java)</p>
            </div>
            <div className="text-center p-2">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">Realtime</p>
              <p className="text-xs text-[#8B949E] mt-0.5">Phòng thi & Đồng hồ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#30363D]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Được thiết kế tối ưu cho học sinh & giáo viên Tin học
          </h2>
          <p className="mt-2 text-sm text-[#8B949E]">
            Từ nhập môn tin học đến các giải thuật chuyên sâu trong kỳ thi học sinh giỏi các cấp
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: 3 Levels */}
          <div className="p-6 rounded-2xl bg-[#161B22] border border-[#30363D] hover:border-[#8B949E]/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Phân loại 3 Cấp độ rõ ràng</h3>
              <p className="text-xs text-[#8B949E] leading-relaxed mb-4">
                Lộ trình từ Căn bản (Nhập xuất, điều kiện, mảng), Trung bình (Sắp xếp, Stack, Đệ quy) đến Nâng cao (Dynamic Programming, Binary Search, Graph).
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-4 border-t border-[#30363D]">
              <DifficultyBadge difficulty="BASIC" size="sm" />
              <DifficultyBadge difficulty="MEDIUM" size="sm" />
              <DifficultyBadge difficulty="ADVANCED" size="sm" />
            </div>
          </div>

          {/* Card 2: Monaco Editor */}
          <div className="p-6 rounded-2xl bg-[#161B22] border border-[#30363D] hover:border-[#8B949E]/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Monaco Code Editor chuyên nghiệp</h3>
              <p className="text-xs text-[#8B949E] leading-relaxed mb-4">
                Giao diện soạn thảo chuẩn VS Code với syntax highlighting, phím tắt, tùy biến cỡ chữ, hỗ trợ Python 3, C++ 20, C và Java.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-4 border-t border-[#30363D] text-xs font-mono text-blue-300">
              <span>Python</span> • <span>C++</span> • <span>C</span> • <span>Java</span>
            </div>
          </div>

          {/* Card 3: Online Judge */}
          <div className="p-6 rounded-2xl bg-[#161B22] border border-[#30363D] hover:border-[#8B949E]/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Hệ thống Sandbox Online Judge</h3>
              <p className="text-xs text-[#8B949E] leading-relaxed mb-4">
                Chạy và chấm mã nguồn từng test case, bao gồm Sample Test và Hidden Test, đo thời gian thực thi (ms) và bộ nhớ (KB).
              </p>
            </div>
            <div className="flex items-center gap-1.5 pt-4 border-t border-[#30363D] text-[11px] text-green-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Chấm tức thì: AC, WA, TLE, MLE, RTE, CE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Showcase */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#30363D]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Chương trình Luyện tập Thuật toán</h2>
            <p className="text-xs text-[#8B949E] mt-1">Khám phá các chủ đề có sẵn trong kho bài tập</p>
          </div>
          <button
            type="button"
            onClick={() => setCurrentView('problem-list')}
            className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Xem tất cả bài tập</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.slice(0, 9).map((topic) => (
            <div
              key={topic.id}
              onClick={() => setCurrentView('problem-list')}
              className="p-4 rounded-xl bg-[#161B22]/60 border border-[#30363D] hover:border-blue-500/50 hover:bg-[#161B22] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-[#E6EDF3] group-hover:text-blue-400 transition-colors">
                  {topic.name}
                </span>
                <DifficultyBadge difficulty={topic.tier} size="sm" />
              </div>
              <p className="text-xs text-[#8B949E] line-clamp-2 leading-relaxed">
                {topic.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-[#30363D] bg-[#0A0C10] text-center text-xs text-[#8B949E]">
        <p>© 2026 AlgoMaster. Nền tảng học và luyện lập trình thuật toán cho học sinh.</p>
        <p className="mt-1 font-mono text-[11px] text-[#6E7681]">Learn. Solve. Master Algorithms.</p>
      </footer>
    </div>
  );
};
