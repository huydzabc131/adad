import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { DifficultyBadge } from '../../components/DifficultyBadge';
import { StatusBadge } from '../../components/StatusBadge';
import {
  CheckCircle2,
  Clock,
  Zap,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  Timer,
  ArrowRight,
  Sparkles,
  Flame,
  Award,
  Calendar,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    getStudentProgress,
    problems,
    exams,
    submissions,
    setCurrentView,
    setSelectedProblemId,
    setSelectedExamId,
  } = useApp();
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const progress = getStudentProgress(currentUser.id);
  const userSubs = submissions.filter((s) => s.user_id === currentUser.id);
  const activeExams = exams.filter((e) => e.is_published);

  // Solved vs Attempted
  const attemptingCount = Math.max(0, progress.total_attempted - progress.total_solved);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl bg-[#0D1117] border border-[#30363D] p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-950/40 text-blue-400 text-xs font-mono font-semibold border border-blue-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Học sinh lớp {currentUser.class_name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F0F6FC] tracking-tight">
              Xin chào, {currentUser.full_name}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-[#8B949E] max-w-xl">
              Hôm nay hãy tiếp tục hoàn thành các bài tập thuật toán và nâng cao thứ hạng trên Bảng Xếp Hạng nhé!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentView('problem-list')}
              className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span>Luyện bài tập ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress by Level Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Basic Level Card */}
        <div className="p-5 rounded-lg bg-[#161B22] border border-[#30363D] shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <DifficultyBadge difficulty="BASIC" size="md" />
              <span className="text-xs font-mono text-[#8B949E]">
                {progress.basic_solved} / {progress.basic_total} bài
              </span>
            </div>
            <p className="text-2xl font-bold text-[#F0F6FC] font-mono">
              {progress.basic_total > 0
                ? Math.round((progress.basic_solved / progress.basic_total) * 100)
                : 0}
              %
            </p>
            <p className="text-xs text-[#8B949E] mt-1">Căn bản: Nhập xuất, điều kiện, vòng lặp, chuỗi, mảng</p>
          </div>
          <div className="mt-4 w-full bg-[#21262D] h-2 rounded-full overflow-hidden">
            <div
              className="bg-green-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${
                  progress.basic_total > 0
                    ? Math.round((progress.basic_solved / progress.basic_total) * 100)
                    : 0
                }%`,
              }}
            />
          </div>
        </div>

        {/* Medium Level Card */}
        <div className="p-5 rounded-lg bg-[#161B22] border border-[#30363D] shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <DifficultyBadge difficulty="MEDIUM" size="md" />
              <span className="text-xs font-mono text-[#8B949E]">
                {progress.medium_solved} / {progress.medium_total} bài
              </span>
            </div>
            <p className="text-2xl font-bold text-[#F0F6FC] font-mono">
              {progress.medium_total > 0
                ? Math.round((progress.medium_solved / progress.medium_total) * 100)
                : 0}
              %
            </p>
            <p className="text-xs text-[#8B949E] mt-1">Trung bình: Sắp xếp, Stack, Queue, Đệ quy, Mảng 2D</p>
          </div>
          <div className="mt-4 w-full bg-[#21262D] h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${
                  progress.medium_total > 0
                    ? Math.round((progress.medium_solved / progress.medium_total) * 100)
                    : 0
                }%`,
              }}
            />
          </div>
        </div>

        {/* Advanced Level Card */}
        <div className="p-5 rounded-lg bg-[#161B22] border border-[#30363D] shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <DifficultyBadge difficulty="ADVANCED" size="md" />
              <span className="text-xs font-mono text-[#8B949E]">
                {progress.advanced_solved} / {progress.advanced_total} bài
              </span>
            </div>
            <p className="text-2xl font-bold text-[#F0F6FC] font-mono">
              {progress.advanced_total > 0
                ? Math.round((progress.advanced_solved / progress.advanced_total) * 100)
                : 0}
              %
            </p>
            <p className="text-xs text-[#8B949E] mt-1">Nâng cao: Binary Search, DP, Prefix Sum, Đồ thị</p>
          </div>
          <div className="mt-4 w-full bg-[#21262D] h-2 rounded-full overflow-hidden">
            <div
              className="bg-rose-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${
                  progress.advanced_total > 0
                    ? Math.round((progress.advanced_solved / progress.advanced_total) * 100)
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Statistics Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-[#161B22] border border-[#30363D]">
          <div className="flex items-center gap-2 text-[#8B949E] text-xs mb-1 font-mono">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span>Đã giải đúng (AC)</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-green-400 font-mono">
            {progress.total_solved}
          </p>
          <p className="text-[11px] text-[#8B949E] mt-1">trên tổng {problems.length} bài toán</p>
        </div>

        <div className="p-4 rounded-lg bg-[#161B22] border border-[#30363D]">
          <div className="flex items-center gap-2 text-[#8B949E] text-xs mb-1 font-mono">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Đang cố gắng giải</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
            {attemptingCount}
          </p>
          <p className="text-[11px] text-[#8B949E] mt-1">cần nộp lại để AC</p>
        </div>

        <div className="p-4 rounded-lg bg-[#161B22] border border-[#30363D]">
          <div className="flex items-center gap-2 text-[#8B949E] text-xs mb-1 font-mono">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Tổng lượt Submit</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
            {progress.total_submissions}
          </p>
          <p className="text-[11px] text-[#8B949E] mt-1">lần nộp mã nguồn</p>
        </div>

        <div className="p-4 rounded-lg bg-[#161B22] border border-[#30363D]">
          <div className="flex items-center gap-2 text-[#8B949E] text-xs mb-1 font-mono">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span>Tỉ lệ chính xác</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono">
            {progress.acceptance_rate}%
          </p>
          <p className="text-[11px] text-[#8B949E] mt-1">tỉ lệ Accepted / Submits</p>
        </div>
      </div>

      {/* Row: Active Exams & Weak Topics Advice */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Exams Panel */}
        <div className="lg:col-span-1 p-5 rounded-lg bg-[#161B22] border border-[#30363D] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-green-400" />
                <h3 className="font-bold text-sm text-[#F0F6FC]">Kỳ thi đang diễn ra</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-green-950/40 text-green-400 border border-green-500/30 font-bold">
                {activeExams.length} kỳ thi
              </span>
            </div>

            {activeExams.length === 0 ? (
              <p className="text-xs text-[#8B949E] py-6 text-center">Hiện chưa có bài kiểm tra nào.</p>
            ) : (
              <div className="space-y-3">
                {activeExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="p-3 rounded-lg bg-[#0D1117] border border-[#30363D] hover:border-blue-500/40 transition-all"
                  >
                    <p className="font-semibold text-xs text-[#F0F6FC]">{exam.title}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#8B949E] font-mono">
                      <span>⏱️ {exam.duration_minutes} phút</span>
                      <span>📝 {exam.problems.length} bài</span>
                      <span>⭐ {exam.total_score}đ</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedExamId(exam.id);
                        setCurrentView('exam-room');
                      }}
                      className="mt-3 w-full py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Vào phòng thi</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setCurrentView('exam-list')}
            className="mt-4 pt-3 border-t border-[#30363D] text-center text-xs text-blue-400 hover:text-blue-300 font-mono block w-full"
          >
            Xem tất cả kỳ thi →
          </button>
        </div>

        {/* Topics to improve / Gợi ý rèn luyện */}
        <div className="lg:col-span-2 p-5 rounded-lg bg-[#161B22] border border-[#30363D]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-sm text-[#F0F6FC]">Chủ đề cần cải thiện & Lời khuyên</h3>
            </div>
            <span className="text-[10px] font-mono text-[#8B949E]">Phân tích tự động</span>
          </div>

          <div className="space-y-3">
            {progress.weak_topics.length > 0 ? (
              progress.weak_topics.map((item) => (
                <div
                  key={item.topic_id}
                  className="p-4 rounded-lg bg-[#0D1117] border border-[#30363D] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#F0F6FC]">{item.topic_name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/40 text-amber-400 border border-amber-500/30 font-mono">
                        Hoàn thành {item.solve_rate}%
                      </span>
                    </div>
                    <p className="text-xs text-[#8B949E]">{item.advice}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentView('problem-list')}
                    className="px-3 py-1.5 bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-[#E6EDF3] text-xs font-medium rounded shrink-0 transition-colors"
                  >
                    Luyện tập
                  </button>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-green-400 bg-green-950/20 rounded-lg border border-green-500/30">
                🎉 Tuyệt vời! Bạn đã hoàn thành rất tốt các chủ đề trong chương trình.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div className="p-5 rounded-lg bg-[#161B22] border border-[#30363D]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm text-[#F0F6FC]">Bài nộp gần đây của bạn</h3>
          <button
            type="button"
            onClick={() => setCurrentView('submission-history')}
            className="text-xs text-blue-400 hover:text-blue-300 font-mono"
          >
            Xem lịch sử nộp đầy đủ →
          </button>
        </div>

        {userSubs.length === 0 ? (
          <p className="text-xs text-[#8B949E] py-6 text-center">Bạn chưa nộp bài toán nào. Hãy thử bài đầu tiên!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-[#8B949E] uppercase font-mono border-b border-[#30363D] bg-[#0D1117]">
                <tr>
                  <th className="py-2.5 px-3">Tên bài toán</th>
                  <th className="py-2.5 px-3">Trạng thái</th>
                  <th className="py-2.5 px-3">Ngôn ngữ</th>
                  <th className="py-2.5 px-3">Thời gian</th>
                  <th className="py-2.5 px-3">Test case</th>
                  <th className="py-2.5 px-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363D]/60 font-mono">
                {userSubs.slice(0, 5).map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#21262D]/50 transition-colors">
                    <td className="py-3 px-3 font-sans font-medium text-[#F0F6FC]">
                      {sub.problem_title}
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <StatusBadge status={sub.status} size="sm" />
                    </td>
                    <td className="py-3 px-3 uppercase text-[#8B949E]">{sub.language}</td>
                    <td className="py-3 px-3 text-[#8B949E]">{sub.execution_time} ms</td>
                    <td className="py-3 px-3 text-[#8B949E]">
                      {sub.test_cases_passed} / {sub.total_test_cases}
                    </td>
                    <td className="py-3 px-3 text-right font-sans">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProblemId(sub.problem_id);
                          setCurrentView('problem-detail');
                        }}
                        className="text-xs text-blue-400 hover:text-blue-300 underline font-mono"
                      >
                        Mở bài
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
