import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { useApp } from './AppContext';
import { hashPassword, verifyPassword } from '../utils/crypto';
import { supabase } from '../lib/supabase';

interface RegisterData {
  full_name: string;
  username: string;
  email?: string;
  password: string;
  class_name?: string;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (updates: { full_name?: string; email?: string; avatar_url?: string; class_name?: string }) => { success: boolean; message?: string };
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { users, setUsers, setCurrentView } = useApp();

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('algomaster_auth_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed && parsed.id ? parsed : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('algomaster_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('algomaster_auth_user');
    }
  }, [currentUser]);

  // Keep currentUser synced with latest state updates from AppContext users
  useEffect(() => {
    if (currentUser) {
      const fresh = users.find((u) => u.id === currentUser.id);
      if (fresh) {
        // If user was locked or deleted by admin while logged in
        if (fresh.status === 'LOCKED') {
          setCurrentUser(null);
          setCurrentView('login');
          return;
        }
        if (
          fresh.status !== currentUser.status ||
          fresh.role !== currentUser.role ||
          fresh.full_name !== currentUser.full_name ||
          fresh.solved_count !== currentUser.solved_count ||
          fresh.total_score !== currentUser.total_score ||
          fresh.class_name !== currentUser.class_name ||
          fresh.email !== currentUser.email ||
          fresh.avatar_url !== currentUser.avatar_url
        ) {
          setCurrentUser(fresh);
        }
      } else {
        // User was deleted
        setCurrentUser(null);
        setCurrentView('landing');
      }
    }
  }, [users]);

  /**
   * Login handler:
   * Validates username/email, account status, and hashes/verifies password securely.
   */
  const login = async (usernameOrEmail: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const trimmed = (usernameOrEmail || '').trim().toLowerCase();
    if (!trimmed || !password) {
      return { success: false, message: 'Vui lòng điền đầy đủ tên đăng nhập và mật khẩu.' };
    }

    const user = users.find(
      (u) => u.username.toLowerCase() === trimmed || (u.email && u.email.toLowerCase() === trimmed)
    );

    if (!user) {
      return { success: false, message: 'Tên đăng nhập hoặc email không tồn tại trong hệ thống.' };
    }

    if (user.status === 'LOCKED') {
      return {
        success: false,
        message: 'Tài khoản của bạn đã bị khóa bởi Quản trị viên. Vui lòng liên hệ để được hỗ trợ mở khóa.',
      };
    }

    // Verify hashed password
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return { success: false, message: 'Mật khẩu không chính xác. Vui lòng thử lại.' };
    }

    // If legacy plain-text password was used, automatically upgrade stored hash to SHA-256
    if (!user.password_hash.startsWith('sha256:')) {
      const secureHash = await hashPassword(password);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, password_hash: secureHash } : u)));
    }

    setCurrentUser(user);

    // Route according to verified role
    if (user.role === 'ADMIN') {
      setCurrentView('admin-dashboard');
    } else {
      setCurrentView('student-dashboard');
    }

    return { success: true };
  };

  /**
   * User Registration:
   * Strictly enforces default role = USER.
   * Client-side cannot inject or request ADMIN role.
   */
  const register = async (data: RegisterData): Promise<{ success: boolean; message?: string }> => {
    const fullName = (data.full_name || '').trim();
    const rawUsername = (data.username || '').trim().toLowerCase().replace(/\s+/g, '');
    const email = (data.email || '').trim().toLowerCase();
    const password = (data.password || '').trim();
    const className = (data.class_name || '').trim() || 'Người dùng mới';

    if (!fullName) {
      return { success: false, message: 'Vui lòng nhập Họ và Tên.' };
    }
    if (!rawUsername || rawUsername.length < 3) {
      return { success: false, message: 'Tên đăng nhập phải có ít nhất 3 ký tự (chữ cái và số).' };
    }
    if (!/^[a-z0-9_.-]+$/.test(rawUsername)) {
      return { success: false, message: 'Tên đăng nhập chỉ được chứa chữ thường, số, dấu gạch dưới hoặc dấu chấm.' };
    }
    if (!password || password.length < 6) {
      return { success: false, message: 'Mật khẩu phải có độ dài tối thiểu 6 ký tự.' };
    }

    // Check uniqueness of username and email
    const usernameExists = users.some((u) => u.username.toLowerCase() === rawUsername);
    if (usernameExists) {
      return { success: false, message: `Tên đăng nhập "@${rawUsername}" đã được sử dụng. Vui lòng chọn tên khác.` };
    }

    if (email) {
      const emailExists = users.some((u) => u.email && u.email.toLowerCase() === email);
      if (emailExists) {
        return { success: false, message: `Email "${email}" đã được đăng ký trong hệ thống.` };
      }
    }

    // Hash password securely with SHA-256
    const passwordHash = await hashPassword(password);

    // Enforce role: 'USER' (strictly never ADMIN)
    const newUser: User = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      full_name: fullName,
      username: rawUsername,
      password_hash: passwordHash,
      email: email || `${rawUsername}@algomaster.user`,
      class_name: className,
      role: 'USER', // STRICT DEFAULT ROLE
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
      solved_count: 0,
      total_score: 0,
      avatar_url: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 500)}?w=150&auto=format&fit=crop&q=80`,
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    setCurrentView('student-dashboard');

    return { success: true };
  };

  /**
   * Logout handler
   */
  const logout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
  };

  /**
   * Self profile management for current user
   */
  const updateProfile = (updates: { full_name?: string; email?: string; avatar_url?: string; class_name?: string }): { success: boolean; message?: string } => {
    if (!currentUser) {
      return { success: false, message: 'Bạn chưa đăng nhập.' };
    }

    const updatedUser = {
      ...currentUser,
      ...(updates.full_name ? { full_name: updates.full_name.trim() } : {}),
      ...(updates.email !== undefined ? { email: updates.email.trim() } : {}),
      ...(updates.avatar_url ? { avatar_url: updates.avatar_url.trim() } : {}),
      ...(updates.class_name ? { class_name: updates.class_name.trim() } : {}),
    };

    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    setCurrentUser(updatedUser);
    return { success: true };
  };

  /**
   * Self password change for current user
   */
  const changePassword = async (oldPassword: string, newPassword: string): Promise<{ success: boolean; message?: string }> => {
    if (!currentUser) {
      return { success: false, message: 'Bạn chưa đăng nhập.' };
    }

    if (!oldPassword || !newPassword) {
      return { success: false, message: 'Vui lòng nhập đầy đủ mật khẩu cũ và mới.' };
    }

    if (newPassword.length < 6) {
      return { success: false, message: 'Mật khẩu mới phải có tối thiểu 6 ký tự.' };
    }

    const isOldValid = await verifyPassword(oldPassword, currentUser.password_hash);
    if (!isOldValid) {
      return { success: false, message: 'Mật khẩu hiện tại không đúng.' };
    }

    const newHash = await hashPassword(newPassword);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? { ...u, password_hash: newHash } : u)));
    setCurrentUser((prev) => (prev ? { ...prev, password_hash: newHash } : null));

    return { success: true };
  };

  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.role === 'ADMIN';
  const isStudent = !isAdmin && isAuthenticated; // Any authenticated non-admin user

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isAdmin,
        isStudent,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
