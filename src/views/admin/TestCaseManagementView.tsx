import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TestCase } from '../../types';
import { DifficultyBadge } from '../../components/DifficultyBadge';
import {
  Database,
  PlusCircle,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowLeft,
  X,
  FileCode2,
  Sparkles,
} from 'lucide-react';

export const TestCaseManagementView: React.FC = () => {
  const {
    problems,
    selectedProblemId,
    setSelectedProblemId,
    setCurrentView,
    addTestCase,
    deleteTestCase,
  } = useApp();

  const problem = problems.find((p) => p.id === selectedProblemId) || problems[0];

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [testInput, setTestInput] = useState<string>('');
  const [testOutput, setTestOutput] = useState<string>('');
  const [isTestHidden, setIsTestHidden] = useState<boolean>(true);
  const [testExplanation, setTestExplanation] = useState<string>('');

  if (!problem) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Vui lòng chọn bài toán để quản lý test cases.</p>
        <button
          type="button"
          onClick={() => setCurrentView('problem-management')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs"
        >
          Quay lại Quản lý bài tập
        </button>
      </div>
    );
  }

  const handleAddTestCaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput || !testOutput) return;

    addTestCase(problem.id, {
      input: testInput,
      expected_output: testOutput,
      is_hidden: isTestHidden,
      explanation: testExplanation || undefined,
    });

    setTestInput('');
    setTestOutput('');
    setTestExplanation('');
    setShowAddModal(false);
  };

  const sampleTests = problem.sample_tests || [];
  const hiddenTests = problem.hidden_tests || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => setCurrentView('problem-management')}
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về danh sách bài tập</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Database className="w-6 h-6 text-indigo-400" />
              <span>Quản Lý Test Cases: {problem.title}</span>
            </h1>
            <DifficultyBadge difficulty={problem.difficulty} size="sm" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tổng cộng {sampleTests.length + hiddenTests.length} test cases ({sampleTests.length} Sample + {hiddenTests.length} Hidden)
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Thêm Test Case Mới</span>
        </button>
      </div>

      {/* Switch Problem Selector */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3 text-xs">
        <span className="text-slate-400 shrink-0">Chọn bài toán cần quản lý test:</span>
        <select
          value={problem.id}
          onChange={(e) => setSelectedProblemId(e.target.value)}
          className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-indigo-500 flex-1 max-w-md font-sans"
        >
          {problems.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} ({p.difficulty})
            </option>
          ))}
        </select>
      </div>

      {/* Test Cases Grid: 1. Sample Tests, 2. Hidden Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sample Tests Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Sample Test Cases (Học sinh nhìn thấy)</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">
              {sampleTests.length} tests
            </span>
          </div>

          {sampleTests.length === 0 ? (
            <p className="text-xs text-slate-500 p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              Chưa có Sample test nào.
            </p>
          ) : (
            <div className="space-y-3">
              {sampleTests.map((test, idx) => (
                <div
                  key={test.id}
                  className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-emerald-400 font-mono">
                      Sample #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteTestCase(problem.id, test.id, false)}
                      className="p-1 rounded-lg hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Xóa test case"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block mb-0.5">Input:</span>
                      <pre className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 overflow-x-auto">
                        {test.input}
                      </pre>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block mb-0.5">Expected Output:</span>
                      <pre className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 overflow-x-auto">
                        {test.expected_output}
                      </pre>
                    </div>
                  </div>

                  {test.explanation && (
                    <p className="text-[11px] text-slate-400 italic">
                      Giải thích: {test.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hidden Tests Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-white flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-amber-400" />
              <span>Hidden Test Cases (Dùng để chấm điểm)</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">
              {hiddenTests.length} tests
            </span>
          </div>

          {hiddenTests.length === 0 ? (
            <p className="text-xs text-slate-500 p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              Chưa có Hidden test nào. Hãy thêm để chống hard-code!
            </p>
          ) : (
            <div className="space-y-3">
              {hiddenTests.map((test, idx) => (
                <div
                  key={test.id}
                  className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-amber-400 font-mono">
                      Hidden Test #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteTestCase(problem.id, test.id, true)}
                      className="p-1 rounded-lg hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Xóa test case"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block mb-0.5">Input:</span>
                      <pre className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 overflow-x-auto">
                        {test.input}
                      </pre>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block mb-0.5">Expected Output:</span>
                      <pre className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-amber-400 overflow-x-auto">
                        {test.expected_output}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Test Case Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-400" />
                <span>Thêm Test Case Mới</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTestCaseSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Loại Test Case</label>
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsTestHidden(true)}
                    className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      isTestHidden ? 'bg-amber-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hidden Test (Chấm tự động)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsTestHidden(false)}
                    className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      !isTestHidden ? 'bg-emerald-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Sample Test (Công khai)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Input Data</label>
                <textarea
                  rows={3}
                  required
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder="Ví dụ: 10\n1 2 3 4 5 6 7 8 9 10"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono outline-none focus:border-indigo-500 resize-none text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Expected Output Data</label>
                <textarea
                  rows={3}
                  required
                  value={testOutput}
                  onChange={(e) => setTestOutput(e.target.value)}
                  placeholder="Ví dụ: 55"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-mono outline-none focus:border-indigo-500 resize-none text-xs"
                />
              </div>

              {!isTestHidden && (
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Giải thích (Optional)</label>
                  <input
                    type="text"
                    value={testExplanation}
                    onChange={(e) => setTestExplanation(e.target.value)}
                    placeholder="Giải thích vì sao output lại như vậy"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30"
                >
                  Lưu Test Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
