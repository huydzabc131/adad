import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { CodeEditor } from '../../components/CodeEditor';
import { DifficultyBadge } from '../../components/DifficultyBadge';
import { StatusBadge } from '../../components/StatusBadge';
import {
  SupportedLanguage,
  SubmissionStatus,
} from '../../types';
import {
  judgeProblemSubmission,
  runCustomInput,
} from '../../services/judgeService';
import {
  Timer,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  Play,
  ArrowLeft,
  Award,
  ChevronRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export interface LocalExamSubmission {
  problem_id: string;
  code: string;
  language: SupportedLanguage;
  status: SubmissionStatus;
  score: number;
  max_score: number;
  submitted_at: string;
  passed_test_cases: number;
  total_test_cases: number;
}

export const ExamRoomView: React.FC = () => {
  const {
    exams,
    problems,
    selectedExamId,
    setCurrentView,
    examParticipants,
    startExamForStudent,
    submitExamForStudent,
    isDarkMode,
  } = useApp();
  const { currentUser } = useAuth();

  const exam = exams.find((e) => e.id === selectedExamId) || exams[0];

  // Active question in the exam
  const [currentProblemIdx, setCurrentProblemIdx] = useState<number>(0);
  const examProblemItem = exam?.problems?.[currentProblemIdx];
  const problem = problems.find((p) => p.id === examProblemItem?.problem_id);

  // Editor language and per-problem code state
  const [language, setLanguage] = useState<SupportedLanguage>('python');
  const [codeMap, setCodeMap] = useState<Record<string, string>>({});
  
  // Custom testing
  const [customInput, setCustomInput] = useState<string>('');
  const [customOutput, setCustomOutput] = useState<string | null>(null);
  const [isRunningCustom, setIsRunningCustom] = useState<boolean>(false);

  // Judging state
  const [isJudging, setIsJudging] = useState<boolean>(false);
  const [examSubmissions, setExamSubmissions] = useState<Record<string, LocalExamSubmission>>({});
  const [showFinishConfirm, setShowFinishConfirm] = useState<boolean>(false);

  // Timer state
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(() => (exam?.duration_minutes || 45) * 60);
  const [isExamOver, setIsExamOver] = useState<boolean>(false);

  // Current participant record
  const participant = examParticipants.find(
    (p) => p.exam_id === exam?.id && p.student_id === currentUser?.id
  );

  // Initialize exam start if not started
  useEffect(() => {
    if (exam && currentUser) {
      if (!participant) {
        startExamForStudent(exam.id, currentUser.id, currentUser.full_name, currentUser.class_name);
      } else if (participant.status === 'SUBMITTED' || participant.status === 'TIMED_OUT') {
        setIsExamOver(true);
      }

      // Initialize starter codes
      const initialCodes: Record<string, string> = {};
      exam.problems.forEach((ep) => {
        const prob = problems.find((p) => p.id === ep.problem_id);
        if (prob) {
          initialCodes[ep.problem_id] = prob.starter_code?.python || '';
        }
      });
      setCodeMap(initialCodes);
    }
  }, [exam?.id, currentUser?.id]);

  // Countdown clock effect
  useEffect(() => {
    if (isExamOver || !exam) return;

    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishExam(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isExamOver, exam?.id]);

  if (!exam || !problem) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Không tìm thấy bài thi hoặc bài tập trong phòng thi.</p>
        <button
          type="button"
          onClick={() => setCurrentView('exam-list')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs"
        >
          Quay lại danh sách kỳ thi
        </button>
      </div>
    );
  }

  // Format time MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeftSeconds <= 300; // Under 5 mins

  // Current problem code
  const currentCode = codeMap[problem.id] || problem.starter_code?.[language] || '';

  const handleCodeChange = (newCode: string) => {
    setCodeMap((prev) => ({
      ...prev,
      [problem.id]: newCode,
    }));
  };

  // Run Custom
  const handleRunCustom = async () => {
    setIsRunningCustom(true);
    setCustomOutput(null);
    const input = customInput || problem.sample_tests[0]?.input || '';
    const res = await runCustomInput(currentCode, language, input, problem.time_limit);
    setIsRunningCustom(false);
    setCustomOutput(res.error || res.output);
  };

  // Submit current problem in exam
  const handleSubmitProblem = async () => {
    if (isExamOver || !currentUser) return;
    setIsJudging(true);

    const result = await judgeProblemSubmission(currentCode, language, problem);
    setIsJudging(false);

    // Calculate score earned for this problem
    const maxScore = examProblemItem?.points || examProblemItem?.score || 20;
    const ratio = result.totalCount > 0 ? result.passedCount / result.totalCount : 0;
    const earnedScore = Math.round(ratio * maxScore);

    const subRecord: LocalExamSubmission = {
      problem_id: problem.id,
      code: currentCode,
      language: language,
      status: result.status,
      score: earnedScore,
      max_score: maxScore,
      submitted_at: new Date().toISOString(),
      passed_test_cases: result.passedCount,
      total_test_cases: result.totalCount,
    };

    setExamSubmissions((prev) => ({
      ...prev,
      [problem.id]: subRecord,
    }));

    if (result.status === 'ACCEPTED') {
      confetti({ particleCount: 50, spread: 60 });
    }
  };

  // Finish whole exam
  const handleFinishExam = (isTimedOut = false) => {
    if (!currentUser) return;
    setIsExamOver(true);
    setShowFinishConfirm(false);

    // Collect all problem submissions
    const finalSubs: LocalExamSubmission[] = exam.problems.map((ep) => {
      const existing = examSubmissions[ep.problem_id];
      if (existing) return existing;
      return {
        problem_id: ep.problem_id,
        code: codeMap[ep.problem_id] || '',
        language: 'python' as SupportedLanguage,
        status: 'PENDING' as SubmissionStatus,
        score: 0,
        max_score: ep.points || ep.score || 20,
        submitted_at: new Date().toISOString(),
        passed_test_cases: 0,
        total_test_cases: 5,
      };
    });

    submitExamForStudent(exam.id, currentUser.id, finalSubs, isTimedOut);
    confetti({ particleCount: 100, spread: 90 });
  };

  // Compute live total score
  const liveTotalScore = (Object.values(examSubmissions) as LocalExamSubmission[]).reduce(
    (sum: number, s: LocalExamSubmission) => sum + (s.score || 0),
    0
  );

  // If exam is completed, show the Result Summary Card
  if (isExamOver) {
    const totalScoreNum = Number(liveTotalScore) || 0;
    const examMaxScoreNum = Math.max(1, Number(exam.total_score) || 100);
    const completionRate = Math.round((totalScoreNum / examMaxScoreNum) * 100);

    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 mx-auto flex items-center justify-center text-green-400">
            <Award className="w-7 h-7" />
          </div>

          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-blue-950/40 text-blue-400 border border-blue-500/30">
              Kết quả bài thi
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F0F6FC] mt-3">
              {exam.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#8B949E] mt-1">
              Thí sinh: {currentUser?.full_name} ({currentUser?.class_name})
            </p>
          </div>

          {/* Big Scorecard */}
          <div className="max-w-md mx-auto p-6 rounded-lg bg-[#0D1117] border border-[#30363D] space-y-2">
            <p className="text-xs font-semibold text-[#8B949E] uppercase">Tổng điểm đạt được</p>
            <p className="text-4xl sm:text-5xl font-extrabold text-green-400 font-mono">
              {liveTotalScore} <span className="text-lg text-[#8B949E] font-normal">/ {exam.total_score}đ</span>
            </p>
            <p className="text-xs text-[#8B949E] font-mono">
              Tỉ lệ hoàn thành:{' '}
              <span className="font-bold text-[#F0F6FC]">
                {completionRate}%
              </span>
            </p>
          </div>

          {/* Problem-by-problem Breakdown */}
          <div className="space-y-3 text-left">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#8B949E]">
              Chi tiết điểm từng bài
            </h3>
            <div className="space-y-2">
              {exam.problems.map((ep, idx) => {
                const prob = problems.find((p) => p.id === ep.problem_id);
                const sub = examSubmissions[ep.problem_id];
                return (
                  <div
                    key={ep.problem_id}
                    className="p-4 rounded bg-[#0D1117] border border-[#30363D] flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-[#E6EDF3]">
                        Bài {idx + 1}: {prob?.title}
                      </span>
                      <p className="text-[11px] text-[#8B949E] mt-0.5">
                        {sub
                          ? `${sub.passed_test_cases}/${sub.total_test_cases} test cases đúng (${sub.status})`
                          : 'Chưa làm bài này'}
                      </p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-sm text-green-400">
                        {sub ? sub.score : 0}
                      </span>
                      <span className="text-[#8B949E]"> / {ep.points}đ</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentView('exam-list')}
              className="px-6 py-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm transition-all"
            >
              Quay lại danh sách kỳ thi
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('leaderboard')}
              className="px-6 py-2.5 rounded bg-[#21262D] hover:bg-[#30363D] text-[#E6EDF3] border border-[#30363D] font-semibold text-xs transition-all"
            >
              Xem Bảng Xếp Hạng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-[#0A0C10] text-[#E6EDF3] overflow-hidden">
      {/* Top Floating Exam Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161B22] border-b border-[#30363D] shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowFinishConfirm(true)}
            className="flex items-center gap-1.5 text-xs text-[#8B949E] hover:text-[#F0F6FC] px-2.5 py-1 rounded bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Rời phòng thi</span>
          </button>

          <span className="text-[#30363D]">|</span>

          <div>
            <span className="font-bold text-xs sm:text-sm text-[#F0F6FC] truncate max-w-md">{exam.title}</span>
            <span className="text-[10px] text-blue-400 font-mono ml-2">Điểm hiện tại: {liveTotalScore}đ</span>
          </div>
        </div>

        {/* Live Timer & Finish Button */}
        <div className="flex items-center gap-3">
          {/* Floating Timer Badge */}
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded border font-mono text-xs font-bold transition-all ${
              isLowTime
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                : 'bg-blue-950/40 text-blue-400 border-blue-500/30'
            }`}
          >
            <Clock className={`w-4 h-4 ${isLowTime ? 'text-rose-400' : 'text-blue-400'}`} />
            <span>{formatTime(timeLeftSeconds)}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowFinishConfirm(true)}
            className="px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white font-semibold text-xs rounded shadow-sm transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Nộp toàn bộ bài thi</span>
          </button>
        </div>
      </div>

      {/* Question Selector Tabs */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#0D1117] border-b border-[#30363D] overflow-x-auto shrink-0">
        {exam.problems.map((ep, idx) => {
          const prob = problems.find((p) => p.id === ep.problem_id);
          const isCurrent = idx === currentProblemIdx;
          const sub = examSubmissions[ep.problem_id];
          const isAC = sub?.status === 'ACCEPTED';
          const isAttempted = !!sub;

          return (
            <button
              key={ep.problem_id}
              type="button"
              onClick={() => setCurrentProblemIdx(idx)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-all ${
                isCurrent
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#161B22] text-[#8B949E] hover:text-[#F0F6FC] border border-[#30363D]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isAC ? 'bg-green-400' : isAttempted ? 'bg-amber-400' : 'bg-slate-600'}`} />
              <span>
                Bài {idx + 1}: {prob?.title || ep.problem_id} ({ep.points}đ)
              </span>
              {sub && (
                <span className="text-[10px] font-mono opacity-80">
                  [{sub.score}đ]
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Exam Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left: Problem Statement (5 cols) */}
        <div className="lg:col-span-5 flex flex-col border-r border-[#30363D] bg-[#0D1117] p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-blue-400 font-mono uppercase">
                Bài {currentProblemIdx + 1} / {exam.problems.length} • {examProblemItem.points} Điểm
              </span>
              <DifficultyBadge difficulty={problem.difficulty} size="sm" />
            </div>
            <h2 className="text-xl font-bold text-[#F0F6FC]">{problem.title}</h2>
          </div>

          <div className="p-3.5 rounded bg-[#161B22] border border-[#30363D] text-[#E6EDF3] leading-relaxed whitespace-pre-wrap">
            {problem.description}
          </div>

          <div>
            <p className="font-bold text-xs text-[#8B949E] uppercase mb-1">Input:</p>
            <div className="p-2.5 rounded bg-[#161B22] border border-[#30363D] text-[#E6EDF3] whitespace-pre-wrap">
              {problem.input_description}
            </div>
          </div>

          <div>
            <p className="font-bold text-xs text-[#8B949E] uppercase mb-1">Output:</p>
            <div className="p-2.5 rounded bg-[#161B22] border border-[#30363D] text-[#E6EDF3] whitespace-pre-wrap">
              {problem.output_description}
            </div>
          </div>

          <div>
            <p className="font-bold text-xs text-[#8B949E] uppercase mb-1">Ví dụ:</p>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="p-2 rounded bg-[#161B22] border border-[#30363D]">
                <span className="text-[#8B949E] block text-[10px]">Input</span>
                <pre className="text-[#E6EDF3]">{problem.sample_tests[0]?.input}</pre>
              </div>
              <div className="p-2 rounded bg-[#161B22] border border-[#30363D]">
                <span className="text-[#8B949E] block text-[10px]">Expected Output</span>
                <pre className="text-green-400">{problem.sample_tests[0]?.expected_output}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Monaco Editor + Action Buttons (7 cols) */}
        <div className="lg:col-span-7 flex flex-col h-full bg-[#0A0C10] overflow-hidden">
          <div className="flex-1 min-h-[300px] p-2">
            <CodeEditor
              code={currentCode}
              onChange={handleCodeChange}
              language={language}
              onLanguageChange={setLanguage}
              onResetCode={() => handleCodeChange(problem.starter_code?.[language] || '')}
              isDarkMode={isDarkMode}
              height="100%"
            />
          </div>

          {/* Exam Bottom Bar */}
          <div className="p-3 bg-[#161B22] border-t border-[#30363D] flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isRunningCustom || isJudging}
                onClick={handleRunCustom}
                className="px-3 py-1.5 bg-[#21262D] hover:bg-[#30363D] text-[#E6EDF3] border border-[#30363D] rounded font-semibold flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 text-green-400" />
                <span>Chạy thử</span>
              </button>

              {customOutput && (
                <span className="text-[#8B949E] font-mono text-[11px] truncate max-w-xs">
                  Output: {customOutput}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isJudging}
                onClick={handleSubmitProblem}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded shadow-sm flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isJudging ? 'Đang chấm...' : `Chấm điểm Bài ${currentProblemIdx + 1}`}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Finish Exam Confirmation Modal */}
      {showFinishConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-[#F0F6FC]">Xác nhận nộp bài thi?</h3>
              <p className="text-xs text-[#8B949E] mt-1">
                Bạn còn <span className="font-mono text-amber-400">{formatTime(timeLeftSeconds)}</span>. Sau khi nộp bài, bạn sẽ không thể chỉnh sửa mã nguồn được nữa.
              </p>
            </div>

            <div className="p-3 rounded bg-[#0D1117] border border-[#30363D] text-xs font-mono space-y-1">
              <div className="flex justify-between text-[#8B949E]">
                <span>Số bài đã nộp:</span>
                <span className="font-bold text-[#F0F6FC]">{Object.keys(examSubmissions).length} / {exam.problems.length}</span>
              </div>
              <div className="flex justify-between text-[#8B949E]">
                <span>Điểm tạm tính:</span>
                <span className="font-bold text-green-400">{liveTotalScore}đ</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowFinishConfirm(false)}
                className="flex-1 py-2 rounded bg-[#21262D] hover:bg-[#30363D] text-[#E6EDF3] border border-[#30363D] text-xs font-semibold"
              >
                Tiếp tục làm bài
              </button>
              <button
                type="button"
                onClick={() => handleFinishExam(false)}
                className="flex-1 py-2 rounded bg-green-600 hover:bg-green-500 text-white text-xs font-semibold shadow-sm"
              >
                Nộp bài ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
