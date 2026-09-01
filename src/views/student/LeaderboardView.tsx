import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  Trophy,
  Award,
  Medal,
  Flame,
  Search,
  Filter,
  GraduationCap,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { users, submissions, setCurrentView, setSelectedProblemId } = useApp();
  const { currentUser } = useAuth();

  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique classes
  const classList = useMemo(() => {
    const set = new Set<string>();
    users.filter((u) => u.role === 'STUDENT').forEach((u) => {
      if (u.class_name) set.add(u.class_name);
    });
    return Array.from(set).sort();
  }, [users]);

  // Compute student rankings
  const rankedStudents = useMemo(() => {
    const students = users.filter((u) => u.role === 'STUDENT');

    // Sort primarily by solved_count DESC, then total_score DESC
    const sorted = [...students].sort((a, b) => {
      if ((b.solved_count || 0) !== (a.solved_count || 0)) {
        return (b.solved_count || 0) - (a.solved_count || 0);
      }
      return (b.total_score || 0) - (a.total_score || 0);
    });

    return sorted.filter((st) => {
      if (selectedClass !== 'ALL' && st.class_name !== selectedClass) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          st.full_name.toLowerCase().includes(q) ||
          st.username.toLowerCase().includes(q) ||
          st.class_name?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [users, selectedClass, searchQuery]);

  const top1 = rankedStudents[0];
  const top2 = rankedStudents[1];
  const top3 = rankedStudents[2];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Trophy className="w-3.5 h-3.5" />
          <span>Vinh Danh Học Sinh Xuất Sắc</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F0F6FC] tracking-tight">
          Bảng Xếp Hạng AlgoMaster
        </h1>
        <p className="text-xs sm:text-sm text-[#8B949E]">
          Xếp hạng dựa trên số lượng bài tập thuật toán đã giải đúng (Accepted) và tổng điểm tích lũy.
        </p>
      </div>

      {/* Podium Top 3 (if exists and no specific search filter) */}
      {!searchQuery && selectedClass === 'ALL' && rankedStudents.length >= 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-4">
          {/* Top 2 (Silver) */}
          <div className="order-2 sm:order-1 p-5 rounded-lg bg-[#161B22] border border-[#30363D] flex flex-col items-center text-center justify-between shadow-xl relative">
            <div className="absolute -top-3 px-3 py-0.5 rounded bg-slate-200 text-slate-950 font-extrabold text-[11px] border border-white">
              HẠNG 2 🥈
            </div>
            <div className="mt-4 space-y-2 flex flex-col items-center">
              <img
                src={top2.avatar_url}
                alt={top2.full_name}
                className="w-16 h-16 rounded-lg object-cover border-2 border-slate-400 shadow-md"
              />
              <p className="font-bold text-sm text-[#F0F6FC]">{top2.full_name}</p>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#21262D] text-[#8B949E] border border-[#30363D] font-mono">
                {top2.class_name}
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-[#30363D] w-full font-mono text-xs">
              <p className="text-green-400 font-bold text-base">{top2.solved_count || 0} bài AC</p>
              <p className="text-[#8B949E] text-[11px]">{top2.total_score || 0} điểm</p>
            </div>
          </div>

          {/* Top 1 (Gold - Taller & Highlighted) */}
          <div className="order-1 sm:order-2 p-6 rounded-lg bg-[#161B22] border-2 border-amber-500/50 flex flex-col items-center text-center justify-between shadow-2xl relative transform sm:-translate-y-2">
            <div className="absolute -top-3.5 px-4 py-0.5 rounded bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md">
              QUÁN QUÂN 🥇
            </div>
            <div className="mt-4 space-y-2 flex flex-col items-center">
              <div className="relative">
                <img
                  src={top1.avatar_url}
                  alt={top1.full_name}
                  className="w-20 h-20 rounded-lg object-cover border-2 border-amber-400 shadow-xl"
                />
                <Sparkles className="w-5 h-5 text-amber-400 absolute -bottom-1 -right-1" />
              </div>
              <p className="font-bold text-base text-[#F0F6FC]">{top1.full_name}</p>
              <span className="text-[10px] px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono">
                {top1.class_name}
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-[#30363D] w-full font-mono text-xs">
              <p className="text-amber-400 font-extrabold text-lg">{top1.solved_count || 0} bài AC</p>
              <p className="text-[#E6EDF3] text-xs font-semibold">{top1.total_score || 0} điểm</p>
            </div>
          </div>

          {/* Top 3 (Bronze) */}
          <div className="order-3 p-5 rounded-lg bg-[#161B22] border border-amber-900/40 flex flex-col items-center text-center justify-between shadow-xl relative">
            <div className="absolute -top-3 px-3 py-0.5 rounded bg-amber-700 text-white font-extrabold text-[11px] border border-amber-600">
              HẠNG 3 🥉
            </div>
            <div className="mt-4 space-y-2 flex flex-col items-center">
              <img
                src={top3.avatar_url}
                alt={top3.full_name}
                className="w-16 h-16 rounded-lg object-cover border-2 border-amber-700 shadow-md"
              />
              <p className="font-bold text-sm text-[#F0F6FC]">{top3.full_name}</p>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#21262D] text-[#8B949E] border border-[#30363D] font-mono">
                {top3.class_name}
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-[#30363D] w-full font-mono text-xs">
              <p className="text-green-400 font-bold text-base">{top3.solved_count || 0} bài AC</p>
              <p className="text-[#8B949E] text-[11px]">{top3.total_score || 0} điểm</p>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-lg bg-[#161B22] border border-[#30363D] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B949E]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo tên học sinh, lớp..."
            className="w-full pl-9 pr-3 py-2 bg-[#0D1117] border border-[#30363D] rounded text-xs text-[#E6EDF3] placeholder-[#8B949E] focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#8B949E] shrink-0">Lớp:</span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded text-xs text-[#E6EDF3] focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Toàn trường (Tất cả các lớp)</option>
            {classList.map((cls) => (
              <option key={cls} value={cls}>
                Lớp {cls}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="rounded-lg bg-[#161B22] border border-[#30363D] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-[#8B949E] uppercase bg-[#0D1117] border-b border-[#30363D]">
              <tr>
                <th className="py-3 px-4 w-16 text-center">Hạng</th>
                <th className="py-3 px-4">Học sinh</th>
                <th className="py-3 px-4">Lớp</th>
                <th className="py-3 px-4 text-center">Số bài đã giải (AC)</th>
                <th className="py-3 px-4 text-right">Tổng điểm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D]/60">
              {rankedStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    Không tìm thấy học sinh nào.
                  </td>
                </tr>
              ) : (
                rankedStudents.map((st, idx) => {
                  const isCurrent = currentUser?.id === st.id;
                  const rank = idx + 1;

                  return (
                    <tr
                      key={st.id}
                      className={`transition-colors ${
                        isCurrent
                          ? 'bg-blue-950/30 font-semibold'
                          : 'hover:bg-[#21262D]/60'
                      }`}
                    >
                      {/* Rank Position */}
                      <td className="py-3.5 px-4 text-center font-mono">
                        {rank === 1 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-extrabold text-xs">
                            1
                          </span>
                        ) : rank === 2 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-slate-950 font-extrabold text-xs">
                            2
                          </span>
                        ) : rank === 3 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700 text-white font-extrabold text-xs">
                            3
                          </span>
                        ) : (
                          <span className="text-[#8B949E] font-bold">#{rank}</span>
                        )}
                      </td>

                      {/* Student Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={st.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                            alt={st.full_name}
                            className="w-8 h-8 rounded object-cover border border-[#30363D]"
                          />
                          <div>
                            <p className="font-semibold text-[#F0F6FC] flex items-center gap-1.5">
                              <span>{st.full_name}</span>
                              {isCurrent && (
                                <span className="text-[10px] px-1.5 py-0.2 bg-blue-600 text-white rounded font-normal">
                                  Bạn
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-[#8B949E] font-mono">@{st.username}</p>
                          </div>
                        </div>
                      </td>

                      {/* Class */}
                      <td className="py-3.5 px-4 text-[#E6EDF3] font-medium">
                        <span className="px-2 py-0.5 rounded bg-[#0D1117] text-blue-400 border border-[#30363D] text-[11px] font-mono">
                          {st.class_name}
                        </span>
                      </td>

                      {/* Solved Count */}
                      <td className="py-3.5 px-4 text-center font-mono">
                        <span className="text-green-400 font-bold text-sm">
                          {st.solved_count || 0}
                        </span>
                        <span className="text-[#8B949E] text-[10px] block">bài toán</span>
                      </td>

                      {/* Total Score */}
                      <td className="py-3.5 px-4 text-right font-mono">
                        <span className="font-extrabold text-sm text-blue-400">
                          {st.total_score || 0}
                        </span>
                        <span className="text-[#8B949E] text-[10px] block">điểm</span>
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
