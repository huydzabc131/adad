import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  Timer,
  Calendar,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export const ExamListView: React.FC = () => {
  const { exams, examParticipants, setSelectedExamId, setCurrentView } = useApp();
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const now = new Date().getTime();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#F0F6FC] tracking-tight flex items-center gap-2">
          <Timer className="w-6 h-6 text-blue-400" />
          <span>Kỳ Thi & Bài Kiểm Tra Trực Tuyến</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#8B949E] mt-1">
          Tham gia các kỳ thi do Giáo viên tổ chức, làm bài có giới hạn thời gian và xếp hạng trực tiếp.
        </p>
      </div>

      {/* Exam Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exams.map((exam) => {
          const participant = examParticipants.find(
            (p) => p.exam_id === exam.id && p.student_id === currentUser.id
          );
          const isFinished = participant?.status === 'SUBMITTED' || participant?.status === 'TIMED_OUT';
          const isStarted = participant?.status === 'IN_PROGRESS';

          return (
            <div
              key={exam.id}
              className="p-6 rounded-lg bg-[#161B22] border border-[#30363D] hover:border-blue-500/40 transition-all shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-950/40 text-blue-400 border border-blue-500/30">
                    Kỳ thi chính thức
                  </span>
                  {isFinished ? (
                    <span className="text-xs font-semibold text-green-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Đã nộp bài ({participant?.total_score}đ)</span>
                    </span>
                  ) : isStarted ? (
                    <span className="text-xs font-semibold text-amber-400 flex items-center gap-1 animate-pulse">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Đang làm bài</span>
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-[#8B949E] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Chưa tham gia</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#F0F6FC] mb-1">{exam.title}</h3>
                  <p className="text-xs text-[#8B949E] leading-relaxed line-clamp-2">
                    {exam.description}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 rounded bg-[#0D1117] border border-[#30363D] text-xs font-mono text-center">
                  <div>
                    <span className="text-[#8B949E] block text-[10px]">Thời lượng</span>
                    <span className="font-bold text-[#F0F6FC]">{exam.duration_minutes} phút</span>
                  </div>
                  <div>
                    <span className="text-[#8B949E] block text-[10px]">Số bài tập</span>
                    <span className="font-bold text-blue-400">{exam.problems.length} bài</span>
                  </div>
                  <div>
                    <span className="text-[#8B949E] block text-[10px]">Tổng điểm</span>
                    <span className="font-bold text-green-400">{exam.total_score}đ</span>
                  </div>
                </div>

                <div className="text-[11px] text-[#8B949E] space-y-1">
                  <p>👤 Giáo viên ra đề: <span className="text-[#E6EDF3]">{exam.created_by_name}</span></p>
                  {exam.target_classes && (
                    <p>🎯 Lớp tham gia: <span className="text-blue-400">{exam.target_classes.join(', ')}</span></p>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#30363D]">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedExamId(exam.id);
                    setCurrentView('exam-room');
                  }}
                  className={`w-full py-2.5 rounded font-medium text-xs flex items-center justify-center gap-2 transition-all ${
                    isFinished
                      ? 'bg-[#21262D] hover:bg-[#30363D] text-[#E6EDF3] border border-[#30363D]'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                  }`}
                >
                  <Timer className="w-4 h-4" />
                  <span>{isFinished ? 'Xem lại kết quả bài thi' : isStarted ? 'Tiếp tục làm bài' : 'Bắt đầu làm bài thi'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
