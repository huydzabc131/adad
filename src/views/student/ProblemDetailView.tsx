import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { DifficultyBadge } from '../../components/DifficultyBadge';
import { StatusBadge } from '../../components/StatusBadge';
import { CodeEditor } from '../../components/CodeEditor';
import {
  SupportedLanguage,
  SubmissionStatus,
  TestCaseResult,
} from '../../types';
import {
  judgeProblemSubmission,
  runCustomInput,
} from '../../services/judgeService';
import {
  Play,
  Send,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  AlertTriangle,
  FileText,
  Lightbulb,
  History,
  Copy,
  Check,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Terminal,
  Maximize2,
} from 'lucide-react';

export const ProblemDetailView: React.FC = () => {
  const {
    problems,
    topics,
    selectedProblemId,
    setSelectedProblemId,
    setCurrentView,
    addSubmission,
    submissions,
    isDarkMode,
  } = useApp();
  const { currentUser } = useAuth();

  const problem = problems.find((p) => p.id === selectedProblemId) || problems[0];
  const topic = topics.find((t) => t.id === problem?.topic_id);

  // Left pane tab
  const [leftTab, setLeftTab] = useState<'description' | 'hints' | 'submissions'>('description');

  // Editor language & code
  const [language, setLanguage] = useState<SupportedLanguage>('python');
  const [code, setCode] = useState<string>(() => problem?.starter_code?.[language] || '');

  // Custom testing panel
  const [bottomTab, setBottomTab] = useState<'sample_test' | 'custom_test' | 'verdict'>('sample_test');
  const [selectedSampleIdx, setSelectedSampleIdx] = useState<number>(0);
  const [customInput, setCustomInput] = useState<string>('');
  const [customOutput, setCustomOutput] = useState<string | null>(null);
  const [customError, setCustomError] = useState<string | null>(null);

  // Judging state
  const [isRunningCustom, setIsRunningCustom] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionProgress, setSubmissionProgress] = useState<{ current: number; total: number } | null>(null);
  const [judgeResults, setJudgeResults] = useState<{
    status: SubmissionStatus;
    executionTimeMs: number;
    memoryUsedKb: number;
    passedCount: number;
    totalCount: number;
    testCaseResults: TestCaseResult[];
    error?: string;
  } | null>(null);

  // Copy helper
  const [copiedTestId, setCopiedTestId] = useState<string | null>(null);

  // Update code when problem or language changes
  useEffect(() => {
    if (problem) {
      setCode(problem.starter_code?.[language] || '');
      if (problem.sample_tests?.length > 0) {
        setCustomInput(problem.sample_tests[0].input);
      }
      setJudgeResults(null);
      setCustomOutput(null);
    }
  }, [problem?.id, language]);

  if (!problem) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Không tìm thấy bài tập.</p>
        <button
          type="button"
          onClick={() => setCurrentView('problem-list')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTestId(id);
    setTimeout(() => setCopiedTestId(null), 1800);
  };

  // Run Custom Input
  const handleRunCode = async () => {
    setIsRunningCustom(true);
    setBottomTab('custom_test');
    setCustomError(null);
    setCustomOutput(null);

    const inputToRun =
      bottomTab === 'sample_test' && problem.sample_tests[selectedSampleIdx]
        ? problem.sample_tests[selectedSampleIdx].input
        : customInput;

    const res = await runCustomInput(code, language, inputToRun, problem.time_limit);
    setIsRunningCustom(false);

    if (res.error) {
      setCustomError(res.error);
    } else {
      setCustomOutput(res.output);
    }
  };

  // Submit Code & Online Judge
  const handleSubmitCode = async () => {
    if (!currentUser) return;
    setIsSubmitting(true);
    setBottomTab('verdict');
    setSubmissionProgress({ current: 0, total: problem.sample_tests.length + problem.hidden_tests.length });

    const result = await judgeProblemSubmission(code, language, problem, (current, total) => {
      setSubmissionProgress({ current, total });
    });

    setJudgeResults(result);
    setIsSubmitting(false);
    setSubmissionProgress(null);

    // Record submission into system
    addSubmission({
      user_id: currentUser.id,
      user_name: currentUser.full_name,
      user_class: currentUser.class_name,
      problem_id: problem.id,
      problem_title: problem.title,
      language: language,
      source_code: code,
      status: result.status,
      execution_time: result.executionTimeMs,
      memory_used: result.memoryUsedKb,
      test_cases_passed: result.passedCount,
      total_test_cases: result.totalCount,
      test_case_results: result.testCaseResults,
      error_details: result.error,
    });

    // If Accepted, fire celebratory confetti!
    if (result.status === 'ACCEPTED') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  // Submissions of current user for this problem
  const problemSubmissions = submissions.filter(
    (s) => s.user_id === currentUser?.id && s.problem_id === problem.id
  );

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Problem Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0D1117] border-b border-[#30363D] text-xs shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentView('problem-list')}
            className="flex items-center gap-1 text-[#8B949E] hover:text-[#F0F6FC] px-2.5 py-1 rounded bg-[#161B22] border border-[#30363D] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Danh sách bài</span>
          </button>

          <span className="text-[#30363D]">|</span>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-[#8B949E] bg-[#161B22] px-1.5 py-0.5 rounded border border-[#30363D]">
              #P{problem.id.slice(0, 4)}
            </span>
            <span className="font-bold text-[#F0F6FC] truncate max-w-md">{problem.title}</span>
            <DifficultyBadge difficulty={problem.difficulty} size="sm" />
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-[#8B949E] font-mono hidden sm:flex">
          <span>⏱️ {problem.time_limit}s</span>
          <span>💾 {problem.memory_limit}MB</span>
        </div>
      </div>

      {/* Main Split Body: Left Pane (Problem Specs) & Right Pane (Code Editor & Judge) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-[#0A0C10]">
        {/* LEFT PANE: Description / Hints / History (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col border-r border-[#30363D] bg-[#0D1117] overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center gap-1 p-2 bg-[#161B22] border-b border-[#30363D] text-xs shrink-0">
            <button
              type="button"
              onClick={() => setLeftTab('description')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
                leftTab === 'description'
                  ? 'bg-blue-600 text-white'
                  : 'text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Đề bài</span>
            </button>

            <button
              type="button"
              onClick={() => setLeftTab('hints')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
                leftTab === 'hints'
                  ? 'bg-blue-600 text-white'
                  : 'text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Gợi ý ({problem.hints?.length || 0})</span>
            </button>

            <button
              type="button"
              onClick={() => setLeftTab('submissions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
                leftTab === 'submissions'
                  ? 'bg-blue-600 text-white'
                  : 'text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Lịch sử ({problemSubmissions.length})</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto custom-scrollbar space-y-5 text-[#E6EDF3] text-xs sm:text-sm leading-relaxed">
            {leftTab === 'description' && (
              <>
                {/* Title & metadata */}
                <div>
                  <h1 className="text-xl font-bold text-[#F0F6FC] mb-2">{problem.title}</h1>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <DifficultyBadge difficulty={problem.difficulty} size="sm" />
                    <span className="px-2 py-0.5 rounded bg-[#161B22] text-blue-400 border border-[#30363D] font-mono text-[11px]">
                      {topic?.name || 'Thuật toán'}
                    </span>
                    <span className="text-[#8B949E] font-mono text-[11px]">
                      Giới hạn: {problem.time_limit}s • {problem.memory_limit}MB
                    </span>
                  </div>
                </div>

                {/* Problem Description */}
                <div className="space-y-1.5">
                  <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8B949E]">Mô tả bài toán</h3>
                  <div className="p-3.5 rounded-lg bg-[#161B22] border border-[#30363D] whitespace-pre-wrap text-[#E6EDF3] leading-relaxed">
                    {problem.description}
                  </div>
                </div>

                {/* Input Format */}
                <div className="space-y-1.5">
                  <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8B949E]">Dữ liệu vào (Input Format)</h3>
                  <div className="p-3 rounded-lg bg-[#161B22] border border-[#30363D] whitespace-pre-wrap text-[#D1D5DB]">
                    {problem.input_description}
                  </div>
                </div>

                {/* Output Format */}
                <div className="space-y-1.5">
                  <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8B949E]">Dữ liệu ra (Output Format)</h3>
                  <div className="p-3 rounded-lg bg-[#161B22] border border-[#30363D] whitespace-pre-wrap text-[#D1D5DB]">
                    {problem.output_description}
                  </div>
                </div>

                {/* Constraints */}
                <div className="space-y-1.5">
                  <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8B949E]">Ràng buộc (Constraints)</h3>
                  <div className="p-3 rounded-lg bg-[#161B22] border border-[#30363D] font-mono text-xs text-amber-300">
                    {problem.constraints}
                  </div>
                </div>

                {/* Sample Test Cases */}
                <div className="space-y-3 pt-1">
                  <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8B949E]">Ví dụ mẫu (Sample Tests)</h3>
                  {problem.sample_tests.map((test, idx) => (
                    <div
                      key={test.id}
                      className="rounded-lg bg-[#161B22] border border-[#30363D] overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-3 py-1.5 bg-[#21262D] border-b border-[#30363D] text-[11px] font-mono text-[#8B949E]">
                        <span>Ví dụ #{idx + 1}</span>
                      </div>

                      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {/* Input Box */}
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-[#8B949E] mb-1 font-mono">
                            <span>Input:</span>
                            <button
                              type="button"
                              onClick={() => handleCopyText(test.input, test.id + '_in')}
                              className="text-[#8B949E] hover:text-[#F0F6FC] p-0.5"
                              title="Sao chép Input"
                            >
                              {copiedTestId === test.id + '_in' ? (
                                <Check className="w-3 h-3 text-green-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          <pre className="p-2.5 rounded bg-[#0D1117] border border-[#30363D] font-mono text-xs text-[#E6EDF3] overflow-x-auto">
                            {test.input}
                          </pre>
                        </div>

                        {/* Output Box */}
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-[#8B949E] mb-1 font-mono">
                            <span>Output:</span>
                            <button
                              type="button"
                              onClick={() => handleCopyText(test.expected_output, test.id + '_out')}
                              className="text-[#8B949E] hover:text-[#F0F6FC] p-0.5"
                              title="Sao chép Output"
                            >
                              {copiedTestId === test.id + '_out' ? (
                                <Check className="w-3 h-3 text-green-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          <pre className="p-2.5 rounded bg-[#0D1117] border border-[#30363D] font-mono text-xs text-green-400 overflow-x-auto">
                            {test.expected_output}
                          </pre>
                        </div>
                      </div>

                      {test.explanation && (
                        <div className="px-3 pb-3 text-xs text-[#8B949E] italic">
                          <span className="font-semibold text-[#E6EDF3]">Giải thích: </span>
                          {test.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {leftTab === 'hints' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs font-mono">
                  <Lightbulb className="w-4 h-4" />
                  <span>Gợi ý hướng giải quyết</span>
                </div>
                {problem.hints && problem.hints.length > 0 ? (
                  problem.hints.map((hint, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg bg-[#161B22] border border-[#30363D] text-[#E6EDF3] text-xs space-y-1"
                    >
                      <span className="font-mono font-bold text-blue-400">Gợi ý {idx + 1}:</span>
                      <p>{hint}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-[#8B949E] italic">Chưa có gợi ý cụ thể cho bài toán này.</p>
                )}
              </div>
            )}

            {leftTab === 'submissions' && (
              <div className="space-y-3">
                <h3 className="font-semibold text-xs font-mono text-[#F0F6FC]">Lịch sử nộp bài của bạn</h3>
                {problemSubmissions.length === 0 ? (
                  <p className="text-[#8B949E] py-6 text-center text-xs">Bạn chưa nộp lần nào cho bài này.</p>
                ) : (
                  <div className="space-y-2">
                    {problemSubmissions.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3 rounded-lg bg-[#161B22] border border-[#30363D] flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={sub.status} size="sm" />
                            <span className="font-mono uppercase text-[#8B949E] text-[11px]">{sub.language}</span>
                          </div>
                          <p className="text-[11px] text-[#8B949E] font-mono mt-1">
                            {sub.execution_time}ms • {sub.test_cases_passed}/{sub.total_test_cases} tests đúng
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCode(sub.source_code)}
                          className="px-2.5 py-1 bg-[#21262D] hover:bg-[#30363D] text-[#E6EDF3] rounded text-xs transition-colors border border-[#30363D]"
                        >
                          Tải lại mã
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: Monaco Code Editor + Runner (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col h-full overflow-hidden bg-[#0A0C10]">
          {/* Top Monaco Editor Component */}
          <div className="flex-1 min-h-[300px] overflow-hidden p-2">
            <CodeEditor
              code={code}
              onChange={setCode}
              language={language}
              onLanguageChange={setLanguage}
              onResetCode={() => setCode(problem.starter_code?.[language] || '')}
              isDarkMode={true}
              height="100%"
            />
          </div>

          {/* Bottom Testing & Verdict Panel */}
          <div className="h-64 sm:h-72 border-t border-[#30363D] bg-[#0D1117] flex flex-col shrink-0">
            {/* Panel Tabs & Action Buttons */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#161B22] border-b border-[#30363D] text-xs shrink-0">
              {/* Tabs */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setBottomTab('sample_test')}
                  className={`px-3 py-1 rounded font-medium text-xs transition-colors ${
                    bottomTab === 'sample_test'
                      ? 'bg-[#21262D] text-[#F0F6FC] border border-[#30363D]'
                      : 'text-[#8B949E] hover:text-[#F0F6FC]'
                  }`}
                >
                  Test Mẫu
                </button>

                <button
                  type="button"
                  onClick={() => setBottomTab('custom_test')}
                  className={`px-3 py-1 rounded font-medium text-xs transition-colors ${
                    bottomTab === 'custom_test'
                      ? 'bg-[#21262D] text-[#F0F6FC] border border-[#30363D]'
                      : 'text-[#8B949E] hover:text-[#F0F6FC]'
                  }`}
                >
                  Test Tùy Chỉnh
                </button>

                <button
                  type="button"
                  onClick={() => setBottomTab('verdict')}
                  className={`px-3 py-1 rounded font-medium text-xs transition-colors flex items-center gap-1.5 ${
                    bottomTab === 'verdict'
                      ? 'bg-[#21262D] text-[#F0F6FC] border border-[#30363D]'
                      : 'text-[#8B949E] hover:text-[#F0F6FC]'
                  }`}
                >
                  <span>Kết quả Chấm</span>
                  {judgeResults && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        judgeResults.status === 'ACCEPTED' ? 'bg-green-400' : 'bg-rose-400'
                      }`}
                    />
                  )}
                </button>
              </div>

              {/* Action Buttons: Run Code & Submit */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isRunningCustom || isSubmitting}
                  onClick={handleRunCode}
                  className="px-3 py-1.5 rounded bg-[#21262D] hover:bg-[#30363D] text-[#E6EDF3] border border-[#30363D] font-medium text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                  title="Chạy thử nghiệm trên Test Mẫu hoặc Custom Input"
                >
                  <Play className={`w-3.5 h-3.5 text-green-400 ${isRunningCustom ? 'animate-spin' : ''}`} />
                  <span>{isRunningCustom ? 'Đang chạy...' : 'Chạy thử'}</span>
                </button>

                <button
                  type="button"
                  disabled={isRunningCustom || isSubmitting}
                  onClick={handleSubmitCode}
                  className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-sm"
                >
                  <Send className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
                  <span>{isSubmitting ? 'Đang chấm...' : 'Nộp bài (Submit)'}</span>
                </button>
              </div>
            </div>

            {/* Panel Tab View */}
            <div className="flex-1 p-3 overflow-y-auto custom-scrollbar text-xs font-mono bg-[#0D1117]">
              {/* 1. Sample Test View */}
              {bottomTab === 'sample_test' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {problem.sample_tests.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedSampleIdx(idx)}
                        className={`px-2.5 py-1 rounded text-xs font-mono font-semibold ${
                          selectedSampleIdx === idx
                            ? 'bg-blue-600 text-white'
                            : 'bg-[#161B22] text-[#8B949E] hover:text-[#F0F6FC] border border-[#30363D]'
                        }`}
                      >
                        Test Case #{idx + 1}
                      </button>
                    ))}
                  </div>

                  {problem.sample_tests[selectedSampleIdx] && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <p className="text-[11px] text-[#8B949E] font-sans mb-1">Input:</p>
                        <pre className="p-2.5 rounded bg-[#161B22] border border-[#30363D] text-[#E6EDF3]">
                          {problem.sample_tests[selectedSampleIdx].input}
                        </pre>
                      </div>
                      <div>
                        <p className="text-[11px] text-[#8B949E] font-sans mb-1">Expected Output:</p>
                        <pre className="p-2.5 rounded bg-[#161B22] border border-[#30363D] text-green-400">
                          {problem.sample_tests[selectedSampleIdx].expected_output}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. Custom Test View */}
              {bottomTab === 'custom_test' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-full">
                  <div className="flex flex-col">
                    <p className="text-[11px] text-[#8B949E] font-sans mb-1">Custom Input (Dữ liệu kiểm tra):</p>
                    <textarea
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="Nhập dữ liệu test vào đây..."
                      className="flex-1 w-full p-2.5 rounded bg-[#161B22] border border-[#30363D] text-[#E6EDF3] placeholder-[#8B949E] focus:outline-none focus:border-blue-500 resize-none font-mono text-xs"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[11px] text-[#8B949E] font-sans mb-1">Kết quả chạy thử (Your Output):</p>
                    <div className="flex-1 p-2.5 rounded bg-[#161B22] border border-[#30363D] overflow-y-auto">
                      {customError ? (
                        <p className="text-rose-400">{customError}</p>
                      ) : customOutput !== null ? (
                        <pre className="text-green-400">{customOutput || '(Chương trình không in ra gì)'}</pre>
                      ) : (
                        <p className="text-[#8B949E] italic font-sans text-xs">Nhấn "Chạy thử" để xem output...</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Judge Verdict View */}
              {bottomTab === 'verdict' && (
                <div className="space-y-3">
                  {isSubmitting && submissionProgress ? (
                    <div className="py-6 flex flex-col items-center justify-center space-y-2">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-[#E6EDF3] font-mono font-semibold text-xs">
                        Đang chấm test case {submissionProgress.current} / {submissionProgress.total}...
                      </p>
                    </div>
                  ) : judgeResults ? (
                    <div className="space-y-3">
                      {/* Overall status banner */}
                      <div
                        className={`p-3 rounded-lg border flex items-center justify-between font-sans ${
                          judgeResults.status === 'ACCEPTED'
                            ? 'bg-[#0D1117] border-green-500/40 text-green-300'
                            : 'bg-[#0D1117] border-rose-500/40 text-rose-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <StatusBadge status={judgeResults.status} size="md" />
                          <span className="font-bold text-xs sm:text-sm">
                            {judgeResults.status === 'ACCEPTED'
                              ? 'Accepted! Bạn đã giải thành công bài toán này.'
                              : 'Kết quả chưa chính xác. Hãy kiểm tra các trường hợp test bên dưới.'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono text-[#E6EDF3]">
                          <span>CPU: {judgeResults.executionTimeMs}ms</span>
                          <span>MEM: {Math.round(judgeResults.memoryUsedKb / 1024)}MB</span>
                          <span className="font-bold text-green-400">
                            {judgeResults.passedCount}/{judgeResults.totalCount} passed
                          </span>
                        </div>
                      </div>

                      {/* Test case breakdown list */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {judgeResults.testCaseResults.map((tc, idx) => (
                          <div
                            key={tc.test_case_id}
                            className={`p-2 rounded border text-center font-mono text-xs ${
                              tc.passed
                                ? 'bg-green-950/20 border-green-500/30 text-green-400'
                                : 'bg-rose-950/20 border-rose-500/30 text-rose-400'
                            }`}
                          >
                            <p className="font-semibold font-sans text-[11px]">
                              {tc.is_hidden ? `Hidden ${idx + 1}` : `Sample ${idx + 1}`}
                            </p>
                            <p className="text-[10px] mt-0.5">{tc.passed ? '✅ AC' : '❌ WA'}</p>
                            <p className="text-[9px] text-[#8B949E]">{tc.execution_time_ms}ms</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-[#8B949E] font-sans text-xs">
                      Nhấn "Nộp bài (Submit)" để chấm toàn bộ test case với Online Judge.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
