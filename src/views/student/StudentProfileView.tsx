import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { DifficultyBadge } from '../../components/DifficultyBadge';
import {
  User,
  GraduationCap,
  Trophy,
  Award,
  CheckCircle2,
  Zap,
  Lock,
  Edit2,
  ShieldCheck,
  KeyRound,
  AlertCircle,
  Mail,
  Save,
} from 'lucide-react';

export const StudentProfileView: React.FC = () => {
  const { getStudentProgress, exams, examParticipants } = useApp();
  const { currentUser, isAdmin, updateProfile, changePassword } = useAuth();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'EDIT_PROFILE' | 'SECURITY'>('OVERVIEW');

  // Edit Profile form
  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [className, setClassName] = useState(currentUser?.class_name || '');
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Security password change form
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isChangingPass, setIsChangingPass] = useState(false);

  if (!currentUser) return null;

  const progress = getStudentProgress(currentUser.id);
  const userExams = examParticipants.filter((p) => p.student_id === currentUser.id);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);

    const res = updateProfile({
      full_name: fullName,
      email: email,
      class_name: className,
    });

    if (res.success) {
      setProfileMsg({ type: 'success', text: 'Cập nhật thông tin cá nhân thành công!' });
    } else {
      setProfileMsg({ type: 'error', text: res.message || 'Cập nhật thất bại.' });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Mật khẩu mới và mật khẩu xác nhận không khớp.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Mật khẩu mới phải có tối thiểu 6 ký tự.' });
      return;
    }

    setIsChangingPass(true);
    try {
      const res = await changePassword(oldPassword, newPassword);
      if (res.success) {
        setPasswordMsg({ type: 'success', text: 'Đổi mật khẩu thành công!' });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMsg({ type: 'error', text: res.message || 'Đổi mật khẩu thất bại.' });
      }
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err?.message || 'Có lỗi xảy ra khi đổi mật khẩu.' });
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#161B22] border border-[#30363D] shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
          alt={currentUser.full_name}
          className="w-20 h-20 rounded-2xl object-cover border border-[#30363D] shadow-md flex-shrink-0"
        />

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-bold text-[#F0F6FC]">{currentUser.full_name}</h1>
            <span
              className={`inline-flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-0.5 rounded ${
                isAdmin
                  ? 'bg-purple-900/30 text-purple-400 border border-purple-500/30'
                  : 'bg-blue-900/30 text-blue-400 border border-blue-500/30'
              }`}
            >
              {isAdmin ? <ShieldCheck className="w-3.5 h-3.5" /> : <GraduationCap className="w-3.5 h-3.5" />}
              <span>{isAdmin ? 'Quản trị viên (ADMIN)' : `Lớp ${currentUser.class_name}`}</span>
            </span>
          </div>
          <p className="text-xs text-[#8B949E] font-mono">@{currentUser.username} • {currentUser.email || 'Chưa cập nhật email'}</p>

          {!isAdmin && (
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs">
              <div className="flex items-center gap-1.5 text-green-400 font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>{progress.total_solved} bài toán AC</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-400 font-mono">
                <Trophy className="w-4 h-4" />
                <span>{currentUser.total_score || 0} điểm tích lũy</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-400 font-mono">
                <Zap className="w-4 h-4" />
                <span>{progress.acceptance_rate}% tỉ lệ AC</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#30363D] gap-4 text-xs font-semibold text-[#8B949E]">
        <button
          type="button"
          onClick={() => setActiveTab('OVERVIEW')}
          className={`py-3 px-2 flex items-center gap-2 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'OVERVIEW'
              ? 'border-blue-500 text-[#F0F6FC]'
              : 'border-transparent hover:text-[#C9D1D9]'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Tổng quan tiến độ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('EDIT_PROFILE')}
          className={`py-3 px-2 flex items-center gap-2 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'EDIT_PROFILE'
              ? 'border-blue-500 text-[#F0F6FC]'
              : 'border-transparent hover:text-[#C9D1D9]'
          }`}
        >
          <Edit2 className="w-4 h-4" />
          <span>Chỉnh sửa thông tin</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('SECURITY')}
          className={`py-3 px-2 flex items-center gap-2 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'SECURITY'
              ? 'border-blue-500 text-[#F0F6FC]'
              : 'border-transparent hover:text-[#C9D1D9]'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Bảo mật & Đổi mật khẩu</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Solving Stats by Level */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#161B22] border border-[#30363D]">
              <div className="flex items-center justify-between mb-2">
                <DifficultyBadge difficulty="BASIC" />
                <span className="text-xs font-mono text-green-400 font-bold">
                  {progress.basic_solved} / {progress.basic_total}
                </span>
              </div>
              <div className="w-full bg-[#0D1117] h-2 rounded-full mt-3 overflow-hidden border border-[#30363D]">
                <div
                  className="bg-green-500 h-full rounded-full"
                  style={{
                    width: `${
                      progress.basic_total > 0
                        ? Math.round((progress.basic_solved / progress.basic_total) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#161B22] border border-[#30363D]">
              <div className="flex items-center justify-between mb-2">
                <DifficultyBadge difficulty="MEDIUM" />
                <span className="text-xs font-mono text-amber-400 font-bold">
                  {progress.medium_solved} / {progress.medium_total}
                </span>
              </div>
              <div className="w-full bg-[#0D1117] h-2 rounded-full mt-3 overflow-hidden border border-[#30363D]">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{
                    width: `${
                      progress.medium_total > 0
                        ? Math.round((progress.medium_solved / progress.medium_total) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#161B22] border border-[#30363D]">
              <div className="flex items-center justify-between mb-2">
                <DifficultyBadge difficulty="ADVANCED" />
                <span className="text-xs font-mono text-rose-400 font-bold">
                  {progress.advanced_solved} / {progress.advanced_total}
                </span>
              </div>
              <div className="w-full bg-[#0D1117] h-2 rounded-full mt-3 overflow-hidden border border-[#30363D]">
                <div
                  className="bg-rose-500 h-full rounded-full"
                  style={{
                    width: `${
                      progress.advanced_total > 0
                        ? Math.round((progress.advanced_solved / progress.advanced_total) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Exam Participation History */}
          <div className="p-6 rounded-2xl bg-[#161B22] border border-[#30363D]">
            <h3 className="font-bold text-sm text-[#F0F6FC] mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-400" />
              <span>Kỳ thi đã tham gia ({userExams.length})</span>
            </h3>

            {userExams.length === 0 ? (
              <p className="text-xs text-[#8B949E] py-4 text-center">Bạn chưa tham gia kỳ thi nào.</p>
            ) : (
              <div className="space-y-3">
                {userExams.map((ue) => {
                  const ex = exams.find((e) => e.id === ue.exam_id);
                  return (
                    <div
                      key={ue.id}
                      className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-[#E6EDF3]">{ex?.title || ue.exam_id}</p>
                        <p className="text-[11px] text-[#8B949E] mt-0.5 font-mono">
                          Trạng thái: {ue.status === 'SUBMITTED' ? 'Đã hoàn thành' : 'Đang làm'}
                        </p>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-green-400 font-extrabold text-sm">{ue.total_score}đ</span>
                        <span className="text-[#8B949E] text-[11px] block">/ {ex?.total_score}đ</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: EDIT PROFILE */}
      {activeTab === 'EDIT_PROFILE' && (
        <div className="p-6 rounded-2xl bg-[#161B22] border border-[#30363D] max-w-xl">
          <h3 className="font-bold text-base text-[#F0F6FC] mb-4 flex items-center gap-2">
            <Edit2 className="w-4 h-4 text-blue-400" />
            <span>Thông Tin Cá Nhân</span>
          </h3>

          {profileMsg && (
            <div
              className={`mb-4 p-3 rounded-xl border text-xs flex items-center gap-2 ${
                profileMsg.type === 'success'
                  ? 'bg-green-500/10 border-green-500/30 text-green-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {profileMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#C9D1D9] font-medium mb-1">Tên đăng nhập</label>
              <input
                type="text"
                disabled
                value={currentUser.username}
                className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-xl text-[#8B949E] font-mono opacity-70 cursor-not-allowed"
              />
              <p className="text-[10px] text-[#8B949E] mt-1">Tên đăng nhập là định danh cố định của tài khoản.</p>
            </div>

            <div>
              <label className="block text-[#C9D1D9] font-medium mb-1">Họ và Tên</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-xl text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[#C9D1D9] font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-xl text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[#C9D1D9] font-medium mb-1">Lớp / Đơn vị</label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="10A1"
                className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-xl text-white outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Thông Tin</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: SECURITY & PASSWORD */}
      {activeTab === 'SECURITY' && (
        <div className="p-6 rounded-2xl bg-[#161B22] border border-[#30363D] max-w-xl">
          <h3 className="font-bold text-base text-[#F0F6FC] mb-4 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>Đổi Mật Khẩu Tài Khoản</span>
          </h3>

          {passwordMsg && (
            <div
              className={`mb-4 p-3 rounded-xl border text-xs flex items-center gap-2 ${
                passwordMsg.type === 'success'
                  ? 'bg-green-500/10 border-green-500/30 text-green-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {passwordMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#C9D1D9] font-medium mb-1">Mật khẩu hiện tại</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Nhập mật khẩu hiện tại..."
                className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-xl text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[#C9D1D9] font-medium mb-1">Mật khẩu mới</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự..."
                className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-xl text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[#C9D1D9] font-medium mb-1">Nhập lại mật khẩu mới</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới..."
                className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-xl text-white outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={isChangingPass}
              className="py-2.5 px-5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Lock className="w-4 h-4" />
              <span>{isChangingPass ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
