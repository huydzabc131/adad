import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { DifficultyBadge } from '../../components/DifficultyBadge';
import { Difficulty } from '../../types';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Circle,
  BookOpen,
  ArrowUpDown,
  Layers,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export const ProblemListView: React.FC = () => {
  const { problems, topics, submissions, setSelectedProblemId, setCurrentView } = useApp();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Compute status for current user for each problem
  const problemStatuses = useMemo(() => {
    if (!currentUser) return {};
    const map: Record<string, 'ACCEPTED' | 'ATTEMPTED' | 'UNSOLVED'> = {};
    for (const p of problems) {
      const subs = submissions.filter((s) => s.user_id === currentUser.id && s.problem_id === p.id);
      if (subs.some((s) => s.status === 'ACCEPTED')) {
        map[p.id] = 'ACCEPTED';
      } else if (subs.length > 0) {
        map[p.id] = 'ATTEMPTED';
      } else {
        map[p.id] = 'UNSOLVED';
      }
    }
    return map;
  }, [problems, submissions, currentUser]);

  // Filter problems
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchTag = p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchTag) return false;
      }

      // Topic
      if (selectedTopic !== 'ALL' && p.topic_id !== selectedTopic) {
        return false;
      }

      // Difficulty
      if (selectedDifficulty !== 'ALL' && p.difficulty !== selectedDifficulty) {
        return false;
      }

      // Status
      if (selectedStatus !== 'ALL') {
        const st = problemStatuses[p.id] || 'UNSOLVED';
        if (st !== selectedStatus) return false;
      }

      return true;
    });
  }, [problems, searchQuery, selectedTopic, selectedDifficulty, selectedStatus, problemStatuses]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F0F6FC] tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <span>Kho Bài Tập Thuật Toán</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#8B949E] mt-1">
            Luyện tập từ cơ bản đến nâng cao, rèn luyện tư duy thuật toán và chuẩn bị thi HSG.
          </p>
        </div>

        {/* Quick Difficulty Pills */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedDifficulty(selectedDifficulty === 'BASIC' ? 'ALL' : 'BASIC')}
            className={`px-3 py-1.5 rounded border text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
              selectedDifficulty === 'BASIC'
                ? 'bg-green-950/40 text-green-400 border-green-500/40'
                : 'bg-[#161B22] border-[#30363D] text-[#8B949E] hover:text-[#F0F6FC]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span>Căn bản</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedDifficulty(selectedDifficulty === 'MEDIUM' ? 'ALL' : 'MEDIUM')}
            className={`px-3 py-1.5 rounded border text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
              selectedDifficulty === 'MEDIUM'
                ? 'bg-amber-950/40 text-amber-400 border-amber-500/40'
                : 'bg-[#161B22] border-[#30363D] text-[#8B949E] hover:text-[#F0F6FC]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Trung bình</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedDifficulty(selectedDifficulty === 'ADVANCED' ? 'ALL' : 'ADVANCED')}
            className={`px-3 py-1.5 rounded border text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
              selectedDifficulty === 'ADVANCED'
                ? 'bg-rose-950/40 text-rose-400 border-rose-500/40'
                : 'bg-[#161B22] border-[#30363D] text-[#8B949E] hover:text-[#F0F6FC]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>Nâng cao</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-lg bg-[#161B22] border border-[#30363D] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B949E]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài tập theo tên hoặc từ khóa..."
              className="w-full pl-9 pr-3 py-2 bg-[#0D1117] border border-[#30363D] rounded text-xs text-[#F0F6FC] placeholder-[#8B949E] focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Topic Select */}
          <div>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded text-xs text-[#E6EDF3] focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">Tất cả chủ đề ({topics.length})</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded text-xs text-[#E6EDF3] focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACCEPTED">✅ Đã giải xong (AC)</option>
              <option value="ATTEMPTED">🟡 Đang làm</option>
              <option value="UNSOLVED">⚪ Chưa làm</option>
            </select>
          </div>
        </div>
      </div>

      {/* Problems Table */}
      <div className="rounded-lg bg-[#161B22] border border-[#30363D] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-[#8B949E] uppercase font-mono bg-[#0D1117] border-b border-[#30363D]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Trạng thái</th>
                <th className="py-3 px-4">Tên bài toán</th>
                <th className="py-3 px-4">Chủ đề</th>
                <th className="py-3 px-4">Độ khó</th>
                <th className="py-3 px-4 text-center">Tỉ lệ AC</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D]/60">
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8B949E]">
                    Không tìm thấy bài tập nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredProblems.map((prob) => {
                  const status = problemStatuses[prob.id] || 'UNSOLVED';
                  const topic = topics.find((t) => t.id === prob.topic_id);
                  const totalSub = prob.total_submissions || 0;
                  const acSub = prob.accepted_submissions || 0;
                  const acRate = totalSub > 0 ? Math.round((acSub / totalSub) * 100) : 100;

                  return (
                    <tr
                      key={prob.id}
                      onClick={() => {
                        setSelectedProblemId(prob.id);
                        setCurrentView('problem-detail');
                      }}
                      className="hover:bg-[#21262D]/50 transition-colors cursor-pointer group"
                    >
                      {/* Status Icon */}
                      <td className="py-3.5 px-4 text-center">
                        {status === 'ACCEPTED' ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400 mx-auto" />
                        ) : status === 'ATTEMPTED' ? (
                          <Clock className="w-4 h-4 text-amber-400 mx-auto" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-[#484F58] mx-auto" />
                        )}
                      </td>

                      {/* Problem Title & Tags */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-sm text-[#F0F6FC] group-hover:text-blue-400 transition-colors">
                          {prob.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          {prob.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-[#0D1117] text-[#8B949E] border border-[#30363D] font-mono"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Topic */}
                      <td className="py-3.5 px-4 text-[#E6EDF3] font-medium">
                        {topic?.name || 'Thuật toán'}
                      </td>

                      {/* Difficulty */}
                      <td className="py-3.5 px-4">
                        <DifficultyBadge difficulty={prob.difficulty} size="sm" />
                      </td>

                      {/* AC Rate */}
                      <td className="py-3.5 px-4 text-center font-mono text-[#8B949E]">
                        <span>{acRate}%</span>
                        <span className="text-[10px] text-[#8B949E] block">
                          ({acSub}/{totalSub})
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 font-medium transition-all inline-flex items-center gap-1 text-xs"
                        >
                          <span>Làm bài</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
