import Reacted from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, Home, LogIn } from 'lucide-react';

export const Forbidden403View: React.FC = () => {
  const { setCurrentView } = useApp();
  const { currentUser, logout } = useAuth();

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center p-4 sm:p-6 bg-[#0A0C10] text-[#E6EDF3]">
      <div className="max-w-lg w-full bg-[#161B22] border border-rose-500/30 rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8 flex-shrink-0" size={32} />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-mono font-bold uppercase tracking-wider">
            HTTP 403 • FORBIDDEN
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Quyền Truy Cập Bị Từ Chối
          </h1>
          <p className="text-xs sm:text-sm text-[#8B949E] leading-relaxed max-w-md mx-auto">
            Khu vực này yêu cầu quyền <strong>Quản trị viên (ADMIN)</strong>.
            {currentUser ? (
              <> Tài khoản của bạn hiện có vai trò <strong>{currentUser.role}</strong> và không được cấp quyền xem hoặc chỉnh sửa dữ liệu quản trị hệ thống.</>
            ) : (
              <> Bạn cần đăng nhập bằng tài khoản Quản trị viên để tiếp tục.</>
            )}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          {currentUser ? (
            <button
              type="button"
              onClick={() => setCurrentView('student-dashboard')}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-blue-500/20"
            >
              <Home className="w-4 h-4" />
              <span>Về Bảng Điều Khiển Học Tập</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentView('login')}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-blue-500/20"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập hệ thống</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setCurrentView('landing')}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#21262D] hover:bg-[#30363D] text-[#E6EDF3] border border-[#30363D] rounded-xl text-xs font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về Trang Chủ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
