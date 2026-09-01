import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import {
  Code2,
  Lock,
  User,
  Mail,
  GraduationCap,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Shield,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, register } = useAuth();
  const { setCurrentView } = useApp();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Form states
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register extra states
  const [fullName, setFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regClass, setRegClass] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Feedback states
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit迷 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await login(usernameOrEmail, password);
      if (!res.success) {
        setError(res.message || 'Đăng nhập không thành công.');
      }
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra trong quá trình đăng nhập.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (regPassword !== regConfirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Mật khẩu phải có độ dài tối thiểu 6 ký tự.');
      return;
    }

    setIsLoading(true);

    try {
      const res拼 = await register({
        full_name: fullName,
        username: regUsername,
        email: regEmail || undefined,
        password: regPassword,
        class_name: regClass || 'Người dùng tự do',
      });

      if (!res拼.success) {
        setError(res拼.message || 'Đăng ký không thành công.');
      } else {
        setSuccessMsg('Đăng ký tài khoản thành công! Đang chuyển hướng...');
      }
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra trong quá trình đăng ký.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center p-4 sm:p-6 bg-[#0A0C10] text-[#E6EDF3]">
      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          type="button"
          onClick={() => setCurrentView('landing')}
          className="inline-flex items-center gap-1.5 text-xs text-[#8B949E] hover:text-[#F0F6FC] mb-5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang chủ</span>
        </button>

        {/* Auth Card */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

          {/* Logo & Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 mx-auto flex items-center justify-center text-blue-400 mb-3 shadow-inner">
              <Code2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-[#F0F6FC] tracking-tight">
              {mode === 'LOGIN' ? 'Đăng nhập AlgoMaster' : 'Đăng ký tài khoản mới'}
            </h1>
            <p className="text-xs text-[#8B949E] mt-1">
              {mode === 'LOGIN'
                ? 'Hệ thống luyện thuật toán và chấm bài tự động'
                : 'Tạo tài khoản học tập để bắt đầu luyện thuật toán'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-[#0D1117] p-1 rounded-xl border border-[#30363D] mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('LOGIN');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mode === 'LOGIN'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-[#8B949E] hover:text-[#F0F6FC]'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng nhập</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('REGISTER');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mode === 'REGISTER'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-[#8B949E] hover:text-[#F0F6FC]'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Đăng ký</span>
            </button>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{successMsg}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'LOGIN' ? (
            <form onSubmit={handleLoginSubmit迷} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#C9D1D9] mb-1.5">
                  Tên đăng nhập hoặc Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8B949E]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    placeholder="Nhập tên đăng nhập hoặc email..."
                    className="w-full pl-9 pr-3 py-2.5 bg-[#0D1117] border border-[#30363D] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-xs text-[#F0F6FC] placeholder-[#6E7681] outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C9D1D9] mb-1.5">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8B949E]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu..."
                    className="w-full pl-9 pr-10 py-2.5 bg-[#0D1117] border border-[#30363D] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-xs text-[#F0F6FC] placeholder-[#6E7681] outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8B949E] hover:text-[#F0F6FC] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl font-semibold text-xs text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
              >
                <span>{isLoading ? 'Đang xác thực...' : 'Đăng nhập vào hệ thống'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <p className="text-[11px] text-[#8B949E]">
                  Chưa có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('REGISTER');
                      setError(null);
                    }}
                    className="text-blue-400 hover:underline font-medium cursor-pointer"
                  >
                    Đăng ký ngay
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Role information banner */}
              <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-500/20 text-[11px] text-blue-300 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Tài khoản đăng ký mới sẽ có vai trò: <strong>Người dùng (USER)</strong></span>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C9D1D9] mb-1">
                  Họ và Tên <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8B949E]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn An"
                    className="w-full pl-9 pr-3 py-2 bg-[#0D1117] border border-[#30363D] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-xs text-[#F0F6FC] placeholder-[#6E7681] outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C9D1D9] mb-1">
                  Tên đăng nhập (Username) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8B949E]">
                    <span className="text-xs font-mono font-bold text-[#8B949E]">@</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    placeholder="nguyenvanan (viết liền, không dấu)"
                    className="w-full pl-9 pr-3 py-2 bg-[#0D1117] border border-[#30363D] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-xs text-[#F0F6FC] placeholder-[#6E7681] outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#C9D1D9] mb-1">
                    Email <span className="text-[#8B949E] text-[10px]">(Tùy chọn)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8B949E]">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="an.nguyen@email.com"
                      className="w-full pl-9 pr-2.5 py-2 bg-[#0D1117] border border-[#30363D] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-xs text-[#F0F6FC] placeholder-[#6E7681] outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#C9D1D9] mb-1">
                    Lớp / Trường <span className="text-[#8B949E] text-[10px]">(Tùy chọn)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8B949E]">
                      <GraduationCap className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      value={regClass}
                      onChange={(e) => setRegClass(e.target.value)}
                      placeholder="10A1 hoặc Tự do"
                      className="w-full pl-9 pr-2.5 py-2 bg-[#0D1117] border border-[#30363D] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-xs text-[#F0F6FC] placeholder-[#6E7681] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C9D1D9] mb-1">
                  Mật khẩu <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8B949E]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full pl-9 pr-10 py-2 bg-[#0D1117] border border-[#30363D] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-xs text-[#F0F6FC] placeholder-[#6E7681] outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8B949E] hover:text-[#F0F6FC] cursor-pointer"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C9D1D9] mb-1">
                  Xác nhận mật khẩu <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8B949E]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full pl-9 pr-3 py-2 bg-[#0D1117] border border-[#30363D] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-xs text-[#F0F6FC] placeholder-[#6E7681] outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl font-semibold text-xs text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
              >
                <span>{isLoading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản học tập'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-1">
                <p className="text-[11px] text-[#8B949E]">
                  Đã có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('LOGIN');
                      setError(null);
                    }}
                    className="text-blue-400 hover:underline font-medium cursor-pointer"
                  >
                    Đăng nhập ngay
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
