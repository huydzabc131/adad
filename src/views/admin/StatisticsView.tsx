import React from 'react';
import { useApp } from '../../context/AppContext';
import { DifficultyBadge } from '../../components/DifficultyBadge';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Users,
  BookOpen,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

export const StatisticsView: React.FC = () => {
  const { problems, topics, submissions, users, getGlobalStats } = useApp();
  const stats = getGlobalStats();

  // Status breakdown
  const statusCounts = submissions.reduce((acc, sub) => {
    acc[sub.status] = (acc[sub.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const acCount = statusCounts['ACCEPTED'] || 0;
  const waCount = statusCounts['WRONG_ANSWER'] || 0;
  const tleCount = statusCounts['TIME_LIMIT_EXCEEDED'] || 0;
  const rteCount = statusCounts['RUNTIME_ERROR'] || 0;
  const otherCount = submissions.length - (acCount + waCount + tleCount + rteCount);

  // Topic solve stats
  const topicStats = topics.map((t) => {
    const topicProblems = problems.filter((p) => p.topic_id === t.id);
    const topicSubs = submissions.filter((s) => topicProblems.some((p) => p.id === s.problem_id));
    const topicAC = topicSubs.filter((s) => s.status === 'ACCEPTED').length;
    const acRate = topicSubs.length > 0 ? Math.round((topicAC / topicSubs.length) * 100) : 100;

    return {
      id: t.id,
      name: t.name,
      tier: t.tier,
      totalProblems: topicProblems.length,
      totalSubs: topicSubs.length,
      acRate,
    };
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-purple-400" />
          <span>Báo Cáo & Thống Kê Toàn Hệ Thống</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Tổng hợp kết quả rèn luyện thuật toán, phân tích tỉ lệ giải đúng và độ khó các chủ đề.
        </p>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Học sinh đăng ký</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1">
            {stats.total_students}
          </p>
          <span className="text-[11px] text-slate-500">trên 4 lớp học</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Kho bài tập</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono mt-1">
            {stats.total_problems}
          </p>
          <span className="text-[11px] text-slate-500">21+ chủ đề thuật toán</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Tổng lượt nộp bài</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono mt-1">
            {stats.total_submissions}
          </p>
          <span className="text-[11px] text-slate-500">lượt chấm Online Judge</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Tỉ lệ Accepted toàn trường</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono mt-1">
            {stats.acceptance_rate}%
          </p>
          <span className="text-[11px] text-slate-500">chính xác trên lần nộp</span>
        </div>
      </div>

      {/* Row: Verdict Breakdown & Difficulty Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submissions Status Breakdown */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-cyan-400" />
            <span>Phân bố Kết quả Chấm Mã Nguồn</span>
          </h3>

          <div className="space-y-3">
            {/* Accepted */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Accepted (AC)
                </span>
                <span className="font-mono text-slate-300">
                  {acCount} ({submissions.length > 0 ? Math.round((acCount / submissions.length) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{
                    width: `${submissions.length > 0 ? (acCount / submissions.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Wrong Answer */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5" /> Wrong Answer (WA)
                </span>
                <span className="font-mono text-slate-300">
                  {waCount} ({submissions.length > 0 ? Math.round((waCount / submissions.length) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full"
                  style={{
                    width: `${submissions.length > 0 ? (waCount / submissions.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Time Limit Exceeded */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Time Limit Exceeded (TLE)
                </span>
                <span className="font-mono text-slate-300">
                  {tleCount} ({submissions.length > 0 ? Math.round((tleCount / submissions.length) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{
                    width: `${submissions.length > 0 ? (tleCount / submissions.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Difficulty Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span>Phân bố Độ Khó Bài Tập</span>
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <DifficultyBadge difficulty="BASIC" />
              <span className="font-mono text-xs text-white font-bold">{stats.basic_problems} bài</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <DifficultyBadge difficulty="MEDIUM" />
              <span className="font-mono text-xs text-white font-bold">{stats.medium_problems} bài</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <DifficultyBadge difficulty="ADVANCED" />
              <span className="font-mono text-xs text-white font-bold">{stats.advanced_problems} bài</span>
            </div>
          </div>
        </div>
      </div>

      {/* Topic Mastery Rate Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-white">Thống Kê Độ Thành Thạo Theo Chủ Đề</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-slate-400 uppercase bg-slate-950/60 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Tên chủ đề</th>
                <th className="py-2.5 px-3">Cấp độ</th>
                <th className="py-2.5 px-3 text-center">Số lượng bài</th>
                <th className="py-2.5 px-3 text-center">Lượt nộp</th>
                <th className="py-2.5 px-3 text-right">Tỉ lệ AC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {topicStats.map((ts) => (
                <tr key={ts.id} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-sans font-semibold text-slate-200">{ts.name}</td>
                  <td className="py-2.5 px-3 font-sans">
                    <DifficultyBadge difficulty={ts.tier} size="sm" />
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-300">{ts.totalProblems}</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">{ts.totalSubs}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-400">{ts.acRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
