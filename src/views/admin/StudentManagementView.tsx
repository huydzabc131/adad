import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { User, UserRole } from '../../types';
import {
  Users,
  UserPlus,
  Search,
  Lock,
  Unlock,
  KeyRound,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Upload,
  FileSpreadsheet,
  X,
  ShieldCheck,
  GraduationCap,
  ShieldAlert,
  Mail,
} from 'lucide-react';

export const StudentManagementView: React.FC = () => {
  const {
    users,
    addUser,
    updateUser,
    toggleUserStatus,
    resetUserPassword,
    deleteUser,
  } = useApp();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modals state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showBatchModal, setShowBatchModal] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [resetPassUser, setResetPassUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState<string>('123456');

  // Single Add Form
  const [formData, setFormData] = useState<{
    username: string;
    full_name: string;
    email: string;
    class_name: string;
    role: UserRole;
    password: string;
  }>({
    username: '',
    full_name: '',
    email: '',
    class_name: '10A1',
    role: 'USER',
    password: '123456',
  });

  // Batch Form
  const [batchText, setBatchText] = useState<string>(
    'nguyenvanc, Nguyễn Văn C, 10A1, c.nguyen@email.com\nlethid, Lê Thị D, 10A2, d.le@email.com\nphamvane, Phạm Văn E, 11 Chuyên Tin, e.pham@email.com'
  );

  // Extract unique classes
  const classList = useMemo(() => {
    const set = new Set<string>();
    users.forEach((u) => {
      if (u.class_name) set.add(u.class_name);
    });
    return Array.from(set).sort();
  }, [users]);

  // Filter accounts
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (selectedRole !== 'ALL') {
        if (selectedRole === 'ADMIN' && u.role !== 'ADMIN') return false;
        if (selectedRole === 'USER' && u.role === 'ADMIN') return false;
      }
      if (selectedClass !== 'ALL' && u.class_name !== selectedClass) return false;
      if (selectedStatus !== 'ALL' && u.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          u.full_name.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          (u.email && u.email.toLowerCase().includes(q)) ||
          (u.class_name && u.class_name.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [users, selectedRole, selectedClass, selectedStatus, searchQuery]);

  // Handle Add Single User
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.full_name) return;

    addUser({
      username: formData.username.trim().toLowerCase().replace(/\s+/g, ''),
      full_name: formData.full_name.trim(),
      email: formData.email.trim() || `${formData.username.toLowerCase()}@algomaster.edu.vn`,
      role: formData.role,
      class_name: formData.class_name.trim() || 'Người dùng',
      password_hash: formData.password || '123456',
      status: 'ACTIVE',
      avatar_url: `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 500)}?w=100&auto=format&fit=crop&q=80`,
    });

    setFormData({
      username: '',
      full_name: '',
      email: '',
      class_name: '10A1',
      role: 'USER',
      password: '123456',
    });
    setShowAddModal(false);
  };

  // Handle Batch Add
  const handleBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = batchText.split('\n');
    lines.forEach((line) => {
      const parts = line.split(',').map((p) => p.trim());
      if (parts.length >= 2 && parts[0] && parts[1]) {
        addUser({
          username: parts[0].toLowerCase().replace(/\s+/g, ''),
          full_name: parts[1],
          class_name: parts[2] || '10A1',
          email: parts[3] || `${parts[0].toLowerCase()}@algomaster.user`,
          role: 'USER',
          password_hash: '123456',
          status: 'ACTIVE',
        });
      }
    });
    setShowBatchModal(false);
  };

  // Handle Edit Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    updateUser(editingUser.id, {
      full_name: editingUser.full_name,
      class_name: editingUser.class_name,
      username: editingUser.username,
      email: editingUser.email,
      role: editingUser.role,
    });
    setEditingUser(null);
  };

  // Handle Reset Password Submit
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPassUser) return;
    resetUserPassword(resetPassUser.id, newPassword);
    setResetPassUser(null);
    setNewPassword('123456');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            <span>Quản Lý Người Dùng & Phân Quyền</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#8B949E] mt-1">
            Quản trị danh sách tài khoản, phân quyền vai trò (ADMIN / USER), cấp lại mật khẩu và khóa/mở khóa tài khoản.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowBatchModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-[#E6EDF3] text-xs font-semibold flex items-center gap-1.5 border border-[#30363D] transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4 text-blue-400" />
            <span>Thêm hàng loạt (Batch)</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tạo tài khoản mới</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#161B22] border border-[#30363D] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B949E]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo họ tên, username, email..."
            className="w-full pl-9 pr-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-xl text-xs text-white placeholder-[#6E7681] focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Role Filter */}
        <div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-xl text-xs text-[#E6EDF3] focus:outline-none focus:border-purple-500"
          >
            <option value="ALL">Tất cả vai trò</option>
            <option value="ADMIN">🛡️ Quản trị viên (ADMIN)</option>
            <option value="USER">🎓 Người dùng (USER / STUDENT)</option>
          </select>
        </div>

        {/* Class Filter */}
        <div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-xl text-xs text-[#E6EDF3] focus:outline-none focus:border-purple-500"
          >
            <option value="ALL">Tất cả lớp / tổ chức ({classList.length})</option>
            {classList.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-xl text-xs text-[#E6EDF3] focus:outline-none focus:border-purple-500"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">🟢 Đang hoạt động (Active)</option>
            <option value="LOCKED">🔴 Đã khóa (Locked)</option>
          </select>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="rounded-2xl bg-[#161B22] border border-[#30363D] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-[#8B949E] uppercase bg-[#0D1117] border-b border-[#30363D]">
              <tr>
                <th className="py-3 px-4">Họ và Tên</th>
                <th className="py-3 px-4">Username & Email</th>
                <th className="py-3 px-4">Vai trò</th>
                <th className="py-3 px-4">Lớp / Tổ chức</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-center">Tiến độ bài</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8B949E]">
                    Không tìm thấy tài khoản nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isLocked = u.status === 'LOCKED';
                  const isCurAdmin = u.id === currentUser?.id;
                  const isAdm = u.role === 'ADMIN';

                  return (
                    <tr key={u.id} className="hover:bg-[#21262D]/50 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                            alt={u.full_name}
                            className="w-8 h-8 rounded-full object-cover border border-[#30363D]"
                          />
                          <div>
                            <p className="font-semibold text-white flex items-center gap-1.5">
                              <span>{u.full_name}</span>
                              {isCurAdmin && (
                                <span className="text-[9px] px-1 py-0.2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded">
                                  Bạn
                                </span>
                              )}
                            </p>
                            <p className="text-[10px] text-[#8B949E] font-mono">ID: {u.id.slice(0, 10)}</p>
                          </div>
                        </div>
                      </td>

                      {/* Username & Email */}
                      <td className="py-3 px-4 font-mono">
                        <p className="text-purple-300 font-semibold">@{u.username}</p>
                        <p className="text-[10px] text-[#8B949E]">{u.email || '—'}</p>
                      </td>

                      {/* Role */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            isAdm
                              ? 'bg-purple-900/30 text-purple-400 border border-purple-500/30'
                              : 'bg-blue-900/30 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {isAdm ? <ShieldCheck className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
                          <span>{isAdm ? 'ADMIN' : 'USER'}</span>
                        </span>
                      </td>

                      {/* Class */}
                      <td className="py-3 px-4 font-mono text-[#C9D1D9]">
                        <span className="px-2 py-0.5 rounded bg-[#0D1117] border border-[#30363D] text-[11px]">
                          {u.class_name}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {isLocked ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            <XCircle className="w-3 h-3" />
                            <span>Đã khóa</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Hoạt động</span>
                          </span>
                        )}
                      </td>

                      {/* Solved Count */}
                      <td className="py-3 px-4 text-center font-mono text-green-400 font-bold">
                        {u.solved_count || 0} bài
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          {/* Edit info */}
                          <button
                            type="button"
                            onClick={() => setEditingUser(u)}
                            title="Chỉnh sửa thông tin & vai trò"
                            className="p-1.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] hover:text-white cursor-pointer transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Reset Password */}
                          <button
                            type="button"
                            onClick={() => setResetPassUser(u)}
                            title="Đặt lại mật khẩu"
                            className="p-1.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-amber-400 hover:text-amber-300 cursor-pointer transition-colors"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>

                          {/* Toggle Lock / Unlock (Cannot lock own account) */}
                          <button
                            type="button"
                            disabled={isCurAdmin}
                            onClick={() => toggleUserStatus(u.id)}
                            title={isCurAdmin ? 'Không thể khóa tài khoản đang đăng nhập' : isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                              isLocked
                                ? 'bg-green-950/60 hover:bg-green-900/80 text-green-400'
                                : 'bg-rose-950/60 hover:bg-rose-900/80 text-rose-400'
                            }`}
                          >
                            {isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                          </button>

                          {/* Delete user (Cannot delete self) */}
                          <button
                            type="button"
                            disabled={isCurAdmin}
                            onClick={() => {
                              if (confirm(`Bạn có chắc muốn xóa tài khoản "${u.full_name}" (@${u.username}) khỏi hệ thống?`)) {
                                deleteUser(u.id);
                              }
                            }}
                            title={isCurAdmin ? 'Không thể xóa tài khoản của chính mình' : 'Xóa tài khoản'}
                            className="p-1.5 rounded-lg bg-[#21262D] hover:bg-rose-900/60 text-[#8B949E] hover:text-rose-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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

      {/* Modal 1: Add User Single */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#30363D]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-400" />
                <span>Tạo Tài Khoản Mới</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[#8B949E] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#C9D1D9] font-medium mb-1">
                  Vai trò (Role) <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'USER' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      formData.role === 'USER'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-[#0D1117] border-[#30363D] text-[#8B949E]'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>USER (Học sinh)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'ADMIN' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      formData.role === 'ADMIN'
                        ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                        : 'bg-[#0D1117] border-[#30363D] text-[#8B949E]'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>ADMIN (Quản trị)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#C9D1D9] font-medium mb-1">
                  Họ và Tên <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Ví dụ: Hoàng Đức Duy"
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-xl text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[#C9D1D9] font-medium mb-1">
                  Tên đăng nhập (Username) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Ví dụ: hoangducduy"
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-xl text-white outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#C9D1D9] font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-xl text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[#C9D1D9] font-medium mb-1">Lớp / Ban</label>
                  <input
                    type="text"
                    value={formData.class_name}
                    onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
                    placeholder="10A1 hoặc Tổ Tin"
                    className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-xl text-white outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#C9D1D9] font-medium mb-1">
                  Mật khẩu ban đầu <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="123456"
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-xl text-white outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-lg shadow-purple-600/30 cursor-pointer"
                >
                  Tạo tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Batch Add */}
      {showBatchModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#30363D]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-400" />
                <span>Thêm Tài Khoản Hàng Loạt</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowBatchModal(false)}
                className="text-[#8B949E] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#8B949E]">
              Nhập danh sách theo định dạng: <code className="text-purple-400 font-mono">username, Họ và Tên, Lớp, Email</code> (Mỗi người 1 dòng, mật khẩu mặc định là 123456, vai trò mặc định là USER).
            </p>

            <form onSubmit={handleBatchSubmit} className="space-y-3 text-xs">
              <textarea
                rows={6}
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
                className="w-full p-3 bg-[#0D1117] border border-[#30363D] rounded-xl text-white font-mono outline-none focus:border-purple-500 resize-none text-xs"
              />

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  Nhập danh sách tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Edit User */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#30363D]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-400" />
                <span>Chỉnh Sửa Thông Tin & Vai Trò</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-[#8B949E] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#C9D1D9] font-medium mb-1">Vai trò</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-xl text-white outline-none focus:border-purple-500"
                >
                  <option value="USER">USER (Người dùng / Học sinh)</option>
                  <option value="ADMIN">ADMIN (Quản trị viên)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#C9D1D9] font-medium mb-1">Họ và Tên</label>
                <input
                  type="text"
                  required
                  value={editingUser.full_name}
                  onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-xl text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[#C9D1D9] font-medium mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-xl text-white outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[#C9D1D9] font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={editingUser.email || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-xl text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[#C9D1D9] font-medium mb-1">Lớp / Tổ chức</label>
                <input
                  type="text"
                  value={editingUser.class_name || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, class_name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-xl text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-2.5 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Reset Password */}
      {resetPassUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#30363D]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <span>Đặt Lại Mật Khẩu</span>
              </h3>
              <button
                type="button"
                onClick={() => setResetPassUser(null)}
                className="text-[#8B949E] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#8B949E]">
              Đặt lại mật khẩu mới cho tài khoản <span className="font-bold text-white">{resetPassUser.full_name}</span> (@{resetPassUser.username}):
            </p>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#C9D1D9] font-medium mb-1">Mật khẩu mới</label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-xl text-white outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setResetPassUser(null)}
                  className="flex-1 py-2.5 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold cursor-pointer"
                >
                  Xác nhận đặt lại
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
