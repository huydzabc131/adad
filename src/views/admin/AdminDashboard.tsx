import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/StatusBadge';
import { DifficultyBadge } from '../../components/DifficultyBadge';
import {
  Users,
  BookOpen,
  FileCode2,
  Timer,
  PlusCircle,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    users,
    problems,
    submissions,
    exams,
    getGlobalStats,
    setCurrentView,
    setSelectedProblemId,
  } = useApp();
  const { currentUser } = useAuth();

  const stats = getGlobalStats();
  const students = users.filter((u) => u.role === 'STUDENT');
  const activeExams = exams.filter((e) => e.is_published);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Admin Greeting & Actions */}
      <div className="rounded-xl bg-[#0D1117] border border-[#30363D] p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-950/40 text-blue-400 text-xs font-mono font-semibold border border-blue-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Bảng Điều Khiển Giáo Viên / Admin</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F0F6FC] tracking-tight">
            Chào mừng Thầy/Cô {currentUser?.full_name}
          </h1>
          <p className="text-xs sm:text-sm text-[#8B949E] max-w-xl">
            Quản lý tài khoản học sinh, bài tập thuật toán, test case và tổ chức các kỳ thi trực tuyến.
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setCurrentView('student-management')}
            className="px-3.5 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Users className="w-4 h-4" />
            <span>Thêm học sinh</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('problem-management')}
            className="px-3.5 py-2 rounded bg-[#21262D] hover:bg-[#30363D] text-[#E6EDF3] font-medium text-xs flex items-center gap-1.5 border border-[#30363D] transition-all"
          >
            <PlusCircle className="w-4 h-4 text-blue-400" />
            <span>Tạo bài tập mới</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('exam-management')}
            className="px-3.5 py-2 rounded bg-[#21262D] hover:bg-[#30363D] text-[#E6EDF3] font-medium text-xs flex items-center gap-1.5 border border-[#30363D] transition-all"
          >
            <Timer className="w-4 h-4 text-amber-400" />
            <span>Tạo kỳ thi</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-lg bg-[#161B22] border border-[#30363D] shadow-md">
          <div className="flex items-center justify-between text-[#8B949E] text-xs mb-2 font-mono">
            <span className="font-medium">Học sinh</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-extrabold text-[#F0F6FC] font-mono">{stats.total_students}</p>
          <p className="text-[11px] text-[#8B949E] mt-1">tài khoản trong hệ thống</p>
        </div>

        <div className="p-5 rounded-lg bg-[#161B22] border border-[#30363D] shadow-md">
          <div className="flex items-center justify-between text-[#8B949E] text-xs mb-2 font-mono">
            <span className="font-medium">Kho Bài tập</span>
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-extrabold text-[#F0F6FC] font-mono">{stats.total_problems}</p>
          <div className="flex items-center gap-2 text-[10px] text-[#8B949E] mt-1 font-mono">
            <span className="text-green-400">{stats.basic_problems} CB</span> •
            <span className="text-amber-400">{stats.medium_problems} TB</span> •
            <span className="text-rose-400">{stats.advanced_problems} NC</span>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-[#161B22] border border-[#30363D] shadow-md">
          <div className="flex items-center justify-between text-[#8B949E] text-xs mb-2 font-mono">
            <span className="font-medium">Lượt Submit</span>
            <FileCode2 className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-cyan-400 font-mono">{stats.total_submissions}</p>
          <p className="text-[11px] text-[#8B949E] mt-1">
            {stats.acceptance_rate}% tỉ lệ Accepted
          </p>
        </div>

        <div className="p-5 rounded-lg bg-[#161B22] border border-[#30363D] shadow-md">
          <div className="flex items-center justify-between text-[#8B949E] text-xs mb-2 font-mono">
            <span className="font-medium">Kỳ thi đang mở</span>
            <Timer className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-3xl font-extrabold text-green-400 font-mono">{activeExams.length}</p>
          <p className="text-[11px] text-[#8B949E] mt-1">trên tổng {exams.length} kỳ thi</p>
        </div>
      </div>

      {/* Two columns: Recent Submissions & Active Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Submissions (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-lg bg-[#161B22] border border-[#30363D] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#F0F6FC]">Lượt nộp bài gần nhất toàn trường</h3>
            <button
              type="button"
              onClick={() => setCurrentView('submission-history')}
              className="text-xs text-blue-400 hover:text-blue-300 font-mono"
            >
              Xem tất cả →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-[#8B949E] uppercase font-mono bg-[#0D1117] border-b border-[#30363D]">
                <tr>
                  <th className="py-2.5 px-3">Học sinh</th>
                  <th className="py-2.5 px-3">Bài toán</th>
                  <th className="py-2.5 px-3">Trạng thái</th>
                  <th className="py-2.5 px-3">Ngôn ngữ</th>
                  <th className="py-2.5 px-3">Thời gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363D]/60 font-mono">
                {submissions.slice(0, 6).map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#21262D]/50 transition-colors">
                    <td className="py-2.5 px-3 font-sans">
                      <p className="font-semibold text-[#F0F6FC]">{sub.user_name}</p>
                      <span className="text-[10px] text-[#8B949E] font-mono">{sub.user_class}</span>
                    </td>
                    <td className="py-2.5 px-3 font-sans font-medium text-[#E6EDF3]">
                      {sub.problem_title}
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <StatusBadge status={sub.status} size="sm" />
                    </td>
                    <td className="py-2.5 px-3 uppercase text-[#8B949E]">{sub.language}</td>
                    <td className="py-2.5 px-3 text-[#8B949E]">{sub.execution_time}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Active Exams Panel (1 col) */}
        <div className="p-5 rounded-lg bg-[#161B22] border border-[#30363D] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#F0F6FC]">Kỳ thi trực tuyến</h3>
              <button
                type="button"
                onClick={() => setCurrentView('exam-management')}
                className="text-xs text-blue-400 hover:text-blue-300 font-mono"
              >
                Quản lý →
              </button>
            </div>

            <div className="space-y-3">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  className="p-3 rounded bg-[#0D1117] border border-[#30363D] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#F0F6FC]">{exam.title}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        exam.is_published
                          ? 'bg-green-950/40 text-green-400 border border-green-500/30'
                          : 'bg-[#21262D] text-[#8B949E]'
                      }`}
                    >
                      {exam.is_published ? 'Đang mở' : 'Bản nháp'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-[#8B949E] font-mono">
                    <span>⏱️ {exam.duration_minutes}p</span>
                    <span>📝 {exam.problems.length} bài</span>
                    <span>⭐ {exam.total_score}đ</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCurrentView('statistics')}
            className="mt-6 w-full py-2.5 rounded bg-[#21262D] hover:bg-[#30363D] text-[#E6EDF3] text-xs font-medium border border-[#30363D] flex items-center justify-center gap-1.5 transition-colors"
          >
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            <span>Xem Báo cáo Thống kê Toàn diện</span>
          </button>
        </div>
      </div>
    </div>
  );
};
