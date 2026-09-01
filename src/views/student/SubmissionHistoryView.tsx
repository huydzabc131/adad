import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Submission, SubmissionStatus } from '../../types';
import {
  FileCode2,
  Search,
  Filter,
  Eye,
  Copy,
  Check,
  X,
  Clock,
  Cpu,
  ArrowLeft,
  Calendar,
} from 'lucide-react';

export const SubmissionHistoryView: React.FC = () => {
  const { submissions, setSelectedProblemId, setCurrentView } = useApp();
  const { currentUser, isAdmin } = useAuth();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');

  // Modal to inspect source code
  const [viewingSub, setViewingSub] = useState<Submission | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Filter submissions: If student, show only student's; if admin, show all
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      if (!isAdmin && currentUser && sub.user_id !== currentUser.id) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = sub.problem_title.toLowerCase().includes(q);
        const matchUser = sub.user_name.toLowerCase().includes(q);
        if (!matchTitle && !matchUser) return false;
      }

      if (selectedStatus !== 'ALL' && sub.status !== selectedStatus) {
        return false;
      }

      if (selectedLanguage !== 'ALL' && sub.language !== selectedLanguage) {
        return false;
      }

      return true;
    });
  }, [submissions, currentUser, isAdmin, searchQuery, selectedStatus, selectedLanguage]);

  const handleCopyCode = () => {
    if (viewingSub) {
      navigator.clipboard.writeText(viewingSub.source_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F0F6FC] tracking-tight flex items-center gap-2">
            <FileCode2 className="w-6 h-6 text-blue-400" />
            <span>Lịch Sử Nộp Bài ({filteredSubmissions.length})</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#8B949E] mt-1">
            Theo dõi kết quả thực thi mã nguồn, thời gian chạy và test case đã vượt qua.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-lg bg-[#161B22] border border-[#30363D] grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B949E]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên bài toán..."
            className="w-full pl-9 pr-3 py-2 bg-[#0D1117] border border-[#30363D] rounded text-xs text-[#E6EDF3] placeholder-[#8B949E] focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded text-xs text-[#E6EDF3] focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACCEPTED">Accepted (AC)</option>
            <option value="WRONG_ANSWER">Wrong Answer (WA)</option>
            <option value="TIME_LIMIT_EXCEEDED">Time Limit Exceeded (TLE)</option>
            <option value="RUNTIME_ERROR">Runtime Error (RTE)</option>
            <option value="COMPILATION_ERROR">Compilation Error (CE)</option>
          </select>
        </div>

        <div>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded text-xs text-[#E6EDF3] focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Tất cả ngôn ngữ</option>
            <option value="python">Python 3</option>
            <option value="cpp">C++ 20</option>
            <option value="c">C (GCC)</option>
            <option value="java">Java 17</option>
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="rounded-lg bg-[#161B22] border border-[#30363D] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="text-[11px] text-[#8B949E] uppercase bg-[#0D1117] border-b border-[#30363D] font-sans">
              <tr>
                <th className="py-3 px-4">Thời gian nộp</th>
                {isAdmin && <th className="py-3 px-4">Học sinh</th>}
                <th className="py-3 px-4">Bài toán</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Ngôn ngữ</th>
                <th className="py-3 px-4">Thời gian</th>
                <th className="py-3 px-4">Bộ nhớ</th>
                <th className="py-3 px-4">Pass Test</th>
                <th className="py-3 px-4 text-right">Mã nguồn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D]/60">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 9 : 8} className="py-12 text-center text-[#8B949E] font-sans">
                    Chưa có lượt nộp bài nào.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => {
                  const dateStr = new Date(sub.submitted_at).toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={sub.id} className="hover:bg-[#21262D]/60 transition-colors">
                      {/* Date */}
                      <td className="py-3 px-4 text-[#8B949E] text-[11px]">
                        {dateStr}
                      </td>

                      {/* Admin: Student name */}
                      {isAdmin && (
                        <td className="py-3 px-4 font-sans font-medium text-[#E6EDF3]">
                          {sub.user_name} ({sub.user_class})
                        </td>
                      )}

                      {/* Problem Title */}
                      <td className="py-3 px-4 font-sans font-semibold text-[#F0F6FC]">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProblemId(sub.problem_id);
                            setCurrentView('problem-detail');
                          }}
                          className="hover:text-blue-400 hover:underline text-left"
                        >
                          {sub.problem_title}
                        </button>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 font-sans">
                        <StatusBadge status={sub.status} size="sm" />
                      </td>

                      {/* Language */}
                      <td className="py-3 px-4 uppercase text-[#E6EDF3]">
                        {sub.language}
                      </td>

                      {/* Time */}
                      <td className="py-3 px-4 text-[#E6EDF3]">
                        {sub.execution_time} ms
                      </td>

                      {/* Memory */}
                      <td className="py-3 px-4 text-[#8B949E]">
                        {Math.round(sub.memory_used / 1024)} MB
                      </td>

                      {/* Pass tests */}
                      <td className="py-3 px-4 text-[#E6EDF3]">
                        {sub.test_cases_passed} / {sub.total_test_cases}
                      </td>

                      {/* View code button */}
                      <td className="py-3 px-4 text-right font-sans">
                        <button
                          type="button"
                          onClick={() => setViewingSub(sub)}
                          className="px-2.5 py-1 rounded bg-[#21262D] hover:bg-[#30363D] text-blue-400 hover:text-white border border-[#30363D] inline-flex items-center gap-1 text-xs transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Xem code</span>
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

      {/* View Code Modal */}
      {viewingSub && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#30363D]">
              <div>
                <h3 className="font-bold text-[#F0F6FC] text-base">
                  Mã nguồn bài nộp: {viewingSub.problem_title}
                </h3>
                <p className="text-xs text-[#8B949E] font-mono mt-0.5">
                  {viewingSub.user_name} • {viewingSub.language.toUpperCase()} • {viewingSub.execution_time}ms
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingSub(null)}
                className="p-1.5 rounded text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs">
              <StatusBadge status={viewingSub.status} size="md" />
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#21262D] hover:bg-[#30363D] text-[#E6EDF3] border border-[#30363D] rounded transition-colors font-sans"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã sao chép' : 'Sao chép mã'}</span>
              </button>
            </div>

            {/* Code container */}
            <div className="flex-1 overflow-y-auto rounded bg-[#0D1117] p-4 border border-[#30363D] font-mono text-xs text-[#E6EDF3]">
              <pre className="whitespace-pre">{viewingSub.source_code}</pre>
            </div>

            {viewingSub.error_details && (
              <div className="p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                <span className="font-bold block mb-1">Chi tiết lỗi (Runtime/Compilation Output):</span>
                <p className="whitespace-pre-wrap">{viewingSub.error_details}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
