import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Exam, ExamProblemItem } from '../../types';
import { DifficultyBadge } from '../../components/DifficultyBadge';
import {
  Timer,
  PlusCircle,
  Play,
  Pause,
  Trash2,
  Users,
  Award,
  Clock,
  CheckCircle2,
  X,
  BookOpen,
  Eye,
} from 'lucide-react';

export const ExamManagementView: React.FC = () => {
  const {
    exams,
    problems,
    addExam,
    togglePublishExam,
    deleteExam,
    examParticipants,
    setSelectedExamId,
    setCurrentView,
  } = useApp();

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [inspectingExamId, setInspectingExamId] = useState<string | null>(null);

  // Create Exam Form state
  const [examTitle, setExamTitle] = useState('');
  const [examDesc, setExamDesc] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [targetClasses, setTargetClasses] = useState('10A1, 11 Chuyên Tin');
  const [selectedProblemsWithPoints, setSelectedProblemsWithPoints] = useState<
    { problem_id: string; points: number }[]
  >([]);

  // Open Create Exam
  const openCreateModal = () => {
    setExamTitle('Kỳ Thi Thuật Toán Tuần ' + (exams.length + 1));
    setExamDesc('Bài kiểm tra định kỳ đánh giá năng lực lập trình và tư duy giải thuật.');
    setDurationMinutes(45);
    setTargetClasses('10A1, 10A2, 11 Chuyên Tin');
    if (problems.length >= 2) {
      setSelectedProblemsWithPoints([
        { problem_id: problems[0].id, points: 30 },
        { problem_id: problems[1].id, points: 70 },
      ]);
    }
    setShowCreateModal(true);
  };

  const handleToggleProblemInExam = (probId: string) => {
    const exists = selectedProblemsWithPoints.find((p) => p.problem_id === probId);
    if (exists) {
      setSelectedProblemsWithPoints(selectedProblemsWithPoints.filter((p) => p.problem_id !== probId));
    } else {
      setSelectedProblemsWithPoints([...selectedProblemsWithPoints, { problem_id: probId, points: 20 }]);
    }
  };

  const handlePointChange = (probId: string, pts: number) => {
    setSelectedProblemsWithPoints(
      selectedProblemsWithPoints.map((p) => (p.problem_id === probId ? { ...p, points: pts } : p))
    );
  };

  const totalCalculatedScore = selectedProblemsWithPoints.reduce((s, p) => s + p.points, 0);

  const handleCreateExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle || selectedProblemsWithPoints.length === 0) return;

    const classesArr = targetClasses.split(',').map((c) => c.trim()).filter(Boolean);

    addExam({
      title: examTitle,
      description: examDesc,
      duration_minutes: Number(durationMinutes),
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      problems: selectedProblemsWithPoints,
      total_score: totalCalculatedScore,
      is_published: true,
      allow_view_result: true,
      target_classes: classesArr,
      created_by: 'admin_1',
      created_by_name: 'Thầy Nguyễn Văn An',
    });

    setShowCreateModal(false);
  };

  const inspectingExam = exams.find((e) => e.id === inspectingExamId);
  const examParticipantsList = examParticipants.filter((p) => p.exam_id === inspectingExamId);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Timer className="w-6 h-6 text-purple-400" />
            <span>Quản Lý Kỳ Thi & Bài Kiểm Tra ({exams.length})</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tổ chức bài kiểm tra có giới hạn thời gian, phân phối điểm số và theo dõi bảng điểm trực tiếp.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-purple-600/30 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tạo kỳ thi mới</span>
        </button>
      </div>

      {/* Exam Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exams.map((exam) => {
          const participants = examParticipants.filter((p) => p.exam_id === exam.id);

          return (
            <div
              key={exam.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-xl space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                      exam.is_published
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {exam.is_published ? '🟢 Đang mở thi' : '⚪ Bản nháp (Ẩn)'}
                  </span>

                  <div className="flex items-center gap-1">
                    {/* Toggle publish */}
                    <button
                      type="button"
                      onClick={() => togglePublishExam(exam.id)}
                      title={exam.is_published ? 'Đóng kỳ thi' : 'Mở kỳ thi'}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        exam.is_published
                          ? 'bg-amber-950/40 text-amber-400 border-amber-800 hover:bg-amber-900/60'
                          : 'bg-emerald-950/40 text-emerald-400 border-emerald-800 hover:bg-emerald-900/60'
                      }`}
                    >
                      {exam.is_published ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Bạn có chắc muốn xóa kỳ thi "${exam.title}"?`)) {
                          deleteExam(exam.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{exam.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{exam.description}</p>
                </div>

                {/* Exam specs */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs font-mono text-center">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Thời lượng</span>
                    <span className="font-bold text-white">{exam.duration_minutes} phút</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Số bài toán</span>
                    <span className="font-bold text-indigo-400">{exam.problems.length} bài</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Tổng điểm</span>
                    <span className="font-bold text-emerald-400">{exam.total_score}đ</span>
                  </div>
                </div>

                {/* Problems included in exam */}
                <div className="space-y-1 pt-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Danh sách bài thi:</p>
                  <div className="space-y-1">
                    {exam.problems.map((ep, idx) => {
                      const prob = problems.find((p) => p.id === ep.problem_id);
                      return (
                        <div
                          key={ep.problem_id}
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-950/40 text-xs text-slate-300"
                        >
                          <span className="truncate max-w-[200px]">
                            {idx + 1}. {prob?.title || ep.problem_id}
                          </span>
                          <span className="font-mono text-indigo-400 font-bold">{ep.points} điểm</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action: Inspect live submissions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>{participants.length} học sinh tham gia</span>
                </div>

                <button
                  type="button"
                  onClick={() => setInspectingExamId(exam.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem bảng điểm</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal 1: Create Exam Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Timer className="w-5 h-5 text-purple-400" />
                <span>Tạo Kỳ Thi Trực Tuyến Mới</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExamSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Tên kỳ thi</label>
                <input
                  type="text"
                  required
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="Ví dụ: Kiểm tra 1 tiết Thuật toán Mảng & Vòng lặp"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Mô tả kỳ thi</label>
                <textarea
                  rows={2}
                  value={examDesc}
                  onChange={(e) => setExamDesc(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500 resize-none font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Thời lượng (phút)</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Lớp tham gia</label>
                  <input
                    type="text"
                    value={targetClasses}
                    onChange={(e) => setTargetClasses(e.target.value)}
                    placeholder="10A1, 11 Chuyên Tin"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Problem selection and point weight */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-300 font-bold uppercase">
                    Chọn bài tập vào kỳ thi ({selectedProblemsWithPoints.length} bài đã chọn)
                  </label>
                  <span className="font-mono text-emerald-400 font-bold text-sm">
                    Tổng: {totalCalculatedScore} điểm
                  </span>
                </div>

                <div className="max-h-56 overflow-y-auto space-y-1.5 border border-slate-800 rounded-xl p-2 bg-slate-950">
                  {problems.map((prob) => {
                    const isSelected = selectedProblemsWithPoints.some((p) => p.problem_id === prob.id);
                    const currentPoints =
                      selectedProblemsWithPoints.find((p) => p.problem_id === prob.id)?.points || 20;

                    return (
                      <div
                        key={prob.id}
                        className={`flex items-center justify-between p-2 rounded-lg border transition-colors ${
                          isSelected
                            ? 'bg-purple-950/40 border-purple-800/80 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <label className="flex items-center gap-2 cursor-pointer flex-1">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleProblemInExam(prob.id)}
                            className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="font-semibold text-xs text-slate-200">{prob.title}</span>
                          <DifficultyBadge difficulty={prob.difficulty} size="sm" />
                        </label>

                        {isSelected && (
                          <div className="flex items-center gap-1 font-mono">
                            <span className="text-[10px] text-slate-400">Điểm:</span>
                            <input
                              type="number"
                              min="5"
                              max="100"
                              value={currentPoints}
                              onChange={(e) => handlePointChange(prob.id, Number(e.target.value))}
                              className="w-16 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-center text-emerald-400 font-bold text-xs outline-none"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-lg shadow-purple-600/30"
                >
                  Phát hành kỳ thi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Live Participants & Scoreboard Modal */}
      {inspectingExam && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-3xl w-full shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">
                  Bảng Điểm Trực Tiếp: {inspectingExam.title}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Thời lượng: {inspectingExam.duration_minutes} phút • Tổng điểm: {inspectingExam.total_score}đ
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInspectingExamId(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[11px] text-slate-400 uppercase bg-slate-950/60 border-b border-slate-800 font-sans">
                  <tr>
                    <th className="py-2.5 px-3">Học sinh</th>
                    <th className="py-2.5 px-3">Lớp</th>
                    <th className="py-2.5 px-3">Trạng thái</th>
                    <th className="py-2.5 px-3 text-right">Tổng điểm đạt được</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {examParticipantsList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-500 font-sans">
                        Chưa có học sinh nào nộp bài cho kỳ thi này.
                      </td>
                    </tr>
                  ) : (
                    examParticipantsList.map((part) => (
                      <tr key={part.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-3 font-sans font-semibold text-slate-200">
                          {part.student_name}
                        </td>
                        <td className="py-3 px-3 text-slate-400">{part.student_class}</td>
                        <td className="py-3 px-3 font-sans">
                          {part.status === 'SUBMITTED' ? (
                            <span className="text-emerald-400 font-semibold">✅ Đã hoàn thành</span>
                          ) : (
                            <span className="text-amber-400 font-semibold">🟡 Đang làm bài</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right font-extrabold text-sm text-emerald-400">
                          {part.total_score} / {inspectingExam.total_score}đ
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
