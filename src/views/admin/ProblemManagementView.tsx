import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Problem, Difficulty, SupportedLanguage, TestCase } from '../../types';
import { DifficultyBadge } from '../../components/DifficultyBadge';
import {
  BookOpen,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  Database,
  Eye,
  X,
  Code2,
  Layers,
  Sparkles,
} from 'lucide-react';

export const ProblemManagementView: React.FC = () => {
  const {
    problems,
    topics,
    addProblem,
    updateProblem,
    deleteProblem,
    setSelectedProblemId,
    setCurrentView,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');

  // Modals
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formTopicId, setFormTopicId] = useState(topics[0]?.id || 'topic-1');
  const [formDifficulty, setFormDifficulty] = useState<Difficulty>('BASIC');
  const [formTimeLimit, setFormTimeLimit] = useState(1);
  const [formMemoryLimit, setFormMemoryLimit] = useState(256);
  const [formPoints, setFormPoints] = useState(10);
  const [formTags, setFormTags] = useState('toán, vòng lặp');
  const [formDescription, setFormDescription] = useState('');
  const [formInputDesc, setFormInputDesc] = useState('');
  const [formOutputDesc, setFormOutputDesc] = useState('');
  const [formConstraints, setFormConstraints] = useState('');
  const [formPyCode, setFormPyCode] = useState('# Nhập mã nguồn Python tại đây\n');
  const [formSampleIn, setFormSampleIn] = useState('5');
  const [formSampleOut, setFormSampleOut] = useState('15');

  // Filter problems
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      if (selectedTopic !== 'ALL' && p.topic_id !== selectedTopic) return false;
      if (selectedDifficulty !== 'ALL' && p.difficulty !== selectedDifficulty) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return p.title.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q));
      }
      return true;
    });
  }, [problems, selectedTopic, selectedDifficulty, searchQuery]);

  // Open Create modal
  const openCreateModal = () => {
    setFormTitle('');
    setFormTopicId(topics[0]?.id || 'topic-1');
    setFormDifficulty('BASIC');
    setFormTimeLimit(1);
    setFormMemoryLimit(256);
    setFormPoints(10);
    setFormTags('toán, căn bản');
    setFormDescription('Cho số nguyên N. Hãy tính...');
    setFormInputDesc('Dòng đầu tiên chứa số nguyên N.');
    setFormOutputDesc('In ra kết quả của bài toán.');
    setFormConstraints('1 ≤ N ≤ 10^5');
    setFormPyCode('# Viết mã nguồn giải thuật\n');
    setFormSampleIn('5');
    setFormSampleOut('15');
    setShowAddModal(true);
  };

  // Open Edit modal
  const openEditModal = (p: Problem) => {
    setEditingProblem(p);
    setFormTitle(p.title);
    setFormTopicId(p.topic_id);
    setFormDifficulty(p.difficulty);
    setFormTimeLimit(p.time_limit);
    setFormMemoryLimit(p.memory_limit);
    setFormPoints(p.points || 10);
    setFormTags(p.tags.join(', '));
    setFormDescription(p.description);
    setFormInputDesc(p.input_description);
    setFormOutputDesc(p.output_description);
    setFormConstraints(p.constraints);
    setFormPyCode(p.starter_code?.python || '');
    setFormSampleIn(p.sample_tests[0]?.input || '');
    setFormSampleOut(p.sample_tests[0]?.expected_output || '');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArr = formTags.split(',').map((t) => t.trim()).filter(Boolean);

    const sampleTests: TestCase[] = [
      {
        id: `sample-1`,
        problem_id: 'new',
        input: formSampleIn,
        expected_output: formSampleOut,
        is_hidden: false,
        explanation: 'Ví dụ mẫu đầu tiên',
      },
    ];

    const hiddenTests: TestCase[] = [
      {
        id: `hidden-1`,
        problem_id: 'new',
        input: formSampleIn,
        expected_output: formSampleOut,
        is_hidden: true,
      },
      {
        id: `hidden-2`,
        problem_id: 'new',
        input: '10',
        expected_output: '55',
        is_hidden: true,
      },
    ];

    const slug = formTitle
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `problem-${Date.now()}`;

    addProblem({
      title: formTitle,
      slug,
      topic_id: formTopicId,
      difficulty: formDifficulty,
      description: formDescription,
      input_description: formInputDesc,
      output_description: formOutputDesc,
      constraints: formConstraints,
      time_limit: Number(formTimeLimit),
      memory_limit: Number(formMemoryLimit),
      points: Number(formPoints),
      tags: tagsArr,
      starter_code: {
        python: formPyCode,
        cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}',
        c: '#include <stdio.h>\n\nint main() {\n    return 0;\n}',
        java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n    }\n}',
      },
      sample_tests: sampleTests,
      hidden_tests: hiddenTests,
      hints: ['Đọc kỹ định dạng Input/Output', 'Tối ưu độ phức tạp thời gian'],
      created_by: 'admin',
    });

    setShowAddModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProblem) return;

    const tagsArr = formTags.split(',').map((t) => t.trim()).filter(Boolean);

    updateProblem(editingProblem.id, {
      title: formTitle,
      topic_id: formTopicId,
      difficulty: formDifficulty,
      description: formDescription,
      input_description: formInputDesc,
      output_description: formOutputDesc,
      constraints: formConstraints,
      time_limit: Number(formTimeLimit),
      memory_limit: Number(formMemoryLimit),
      points: Number(formPoints),
      tags: tagsArr,
      starter_code: {
        ...editingProblem.starter_code,
        python: formPyCode,
      },
    });

    setEditingProblem(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-400" />
            <span>Quản Lý Kho Bài Tập ({problems.length})</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tạo bài toán, biên soạn đề bài, thiết lập giới hạn thời gian/bộ nhớ và quản lý test case.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tạo bài tập mới</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên bài hoặc từ khóa..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">Tất cả chủ đề</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">Tất cả độ khó</option>
            <option value="BASIC">🟢 Căn bản</option>
            <option value="MEDIUM">🟡 Trung bình</option>
            <option value="ADVANCED">🔴 Nâng cao</option>
          </select>
        </div>
      </div>

      {/* Problems Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-slate-400 uppercase bg-slate-950/60 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Tên bài toán</th>
                <th className="py-3 px-4">Chủ đề</th>
                <th className="py-3 px-4">Độ khó</th>
                <th className="py-3 px-4">Giới hạn</th>
                <th className="py-3 px-4 text-center">Test Cases</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    Không tìm thấy bài tập nào.
                  </td>
                </tr>
              ) : (
                filteredProblems.map((prob) => {
                  const topic = topics.find((t) => t.id === prob.topic_id);
                  const sampleCount = prob.sample_tests?.length || 0;
                  const hiddenCount = prob.hidden_tests?.length || 0;

                  return (
                    <tr key={prob.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-200">{prob.title}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {prob.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 font-mono"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-300 font-medium">{topic?.name}</td>

                      <td className="py-3 px-4">
                        <DifficultyBadge difficulty={prob.difficulty} size="sm" />
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        {prob.time_limit}s • {prob.memory_limit}MB
                      </td>

                      <td className="py-3 px-4 text-center font-mono text-xs">
                        <span className="text-emerald-400">{sampleCount} Sample</span> •{' '}
                        <span className="text-amber-400">{hiddenCount} Hidden</span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          {/* Manage Test cases */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProblemId(prob.id);
                              setCurrentView('testcase-management');
                            }}
                            title="Quản lý Test Cases"
                            className="p-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900 text-indigo-400 hover:text-white"
                          >
                            <Database className="w-3.5 h-3.5" />
                          </button>

                          {/* Preview in student editor */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProblemId(prob.id);
                              setCurrentView('problem-detail');
                            }}
                            title="Xem giao diện làm bài"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Problem */}
                          <button
                            type="button"
                            onClick={() => openEditModal(prob)}
                            title="Chỉnh sửa bài tập"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Problem */}
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Bạn có chắc muốn xóa bài "${prob.title}"?`)) {
                                deleteProblem(prob.id);
                              }
                            }}
                            title="Xóa bài tập"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create or Edit Problem */}
      {(showAddModal || editingProblem) && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <span>{editingProblem ? 'Chỉnh Sửa Bài Tập' : 'Tạo Bài Tập Mới'}</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProblem(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={editingProblem ? handleEditSubmit : handleCreateSubmit}
              className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs"
            >
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Tên bài toán</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Ví dụ: Tính Tổng Mảng"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Chủ đề (Topic)</label>
                  <select
                    value={formTopicId}
                    onChange={(e) => setFormTopicId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-indigo-500"
                  >
                    {topics.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Độ khó</label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value as Difficulty)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-indigo-500"
                  >
                    <option value="BASIC">Căn bản</option>
                    <option value="MEDIUM">Trung bình</option>
                    <option value="ADVANCED">Nâng cao</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Giới hạn thời gian (s)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formTimeLimit}
                    onChange={(e) => setFormTimeLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Giới hạn bộ nhớ (MB)</label>
                  <input
                    type="number"
                    value={formMemoryLimit}
                    onChange={(e) => setFormMemoryLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">Mô tả bài toán (Problem Statement)</label>
                <textarea
                  rows={4}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-indigo-500 resize-none font-sans"
                />
              </div>

              {/* Input / Output Spec */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Dữ liệu vào (Input format)</label>
                  <textarea
                    rows={2}
                    value={formInputDesc}
                    onChange={(e) => setFormInputDesc(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-indigo-500 resize-none font-sans"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Dữ liệu ra (Output format)</label>
                  <textarea
                    rows={2}
                    value={formOutputDesc}
                    onChange={(e) => setFormOutputDesc(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-indigo-500 resize-none font-sans"
                  />
                </div>
              </div>

              {/* Constraints & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Ràng buộc (Constraints)</label>
                  <input
                    type="text"
                    value={formConstraints}
                    onChange={(e) => setFormConstraints(e.target.value)}
                    placeholder="1 ≤ N ≤ 10^5"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Tags (cách nhau bằng dấu phẩy)</label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="toán, mảng, dp"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Sample Test */}
              {!editingProblem && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Sample Input 1</label>
                    <textarea
                      rows={2}
                      value={formSampleIn}
                      onChange={(e) => setFormSampleIn(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Sample Output 1</label>
                    <textarea
                      rows={2}
                      value={formSampleOut}
                      onChange={(e) => setFormSampleOut(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-emerald-400 font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProblem(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30"
                >
                  {editingProblem ? 'Lưu thay đổi' : 'Tạo bài tập'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
