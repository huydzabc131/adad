import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Topic,
  Problem,
  Exam,
  Submission,
  ExamParticipant,
  TestCase,
  StudentProgressStats,
  Difficulty,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_TOPICS,
  INITIAL_PROBLEMS,
  INITIAL_EXAMS,
  INITIAL_SUBMISSIONS,
  INITIAL_EXAM_PARTICIPANTS,
} from '../data/initialData';

import { hashPassword } from '../utils/crypto';
import { supabase } from '../lib/supabase';

interface AppContextType {
  // Data lists
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  topics: Topic[];
  problems: Problem[];
  exams: Exam[];
  submissions: Submission[];
  examParticipants: ExamParticipant[];
  
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Active view navigation
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedProblemId: string | null;
  setSelectedProblemId: (id: string | null) => void;
  selectedExamId: string | null;
  setSelectedExamId: (id: string | null) => void;

  // Admin User operations
  createUser: (userData: Omit<User, 'id' | 'created_at' | 'solved_count' | 'total_score'>) => User;
  addUser: (userData: Omit<User, 'id' | 'created_at' | 'solved_count' | 'total_score'>) => User;
  bulkCreateUsers: (userList: Array<{ full_name: string; username: string; class_name: string; email?: string; password?: string }>) => User[];
  updateUser: (userId: string, updates: Partial<User>) => void;
  resetUserPassword: (userId: string, newPassword?: string) => string;
  toggleUserLock: (userId: string) => void;
  toggleUserStatus: (userId: string) => void;
  deleteUser: (userId: string) => void;

  // Problem operations
  createProblem: (problemData: Omit<Problem, 'id' | 'created_at' | 'total_submissions' | 'accepted_submissions'>) => Problem;
  addProblem: (problemData: Omit<Problem, 'id' | 'created_at' | 'total_submissions' | 'accepted_submissions'>) => Problem;
  updateProblem: (problemId: string, updates: Partial<Problem>) => void;
  deleteProblem: (problemId: string) => void;
  addTestCase: (problemId: string, testCase: Omit<TestCase, 'id' | 'problem_id'>) => void;
  updateTestCase: (problemId: string, testCaseId: string, updates: Partial<TestCase>) => void;
  deleteTestCase: (problemId: string, testCaseId: string, isHidden?: boolean) => void;

  // Exam operations
  createExam: (examData: Omit<Exam, 'id' | 'created_at'>) => Exam;
  addExam: (examData: Omit<Exam, 'id' | 'created_at'>) => Exam;
  updateExam: (examId: string, updates: Partial<Exam>) => void;
  deleteExam: (examId: string) => void;
  togglePublishExam: (examId: string) => void;

  // Student Submissions & Exam Actions
  addSubmission: (submission: Omit<Submission, 'id' | 'created_at'>) => Submission;
  startExam: (examId: string, student: User) => ExamParticipant;
  startExamForStudent: (examId: string, studentId: string, studentName?: string, studentClass?: string) => ExamParticipant;
  submitExamForStudent: (examId: string, studentId: string, submissionsList: any[], isTimedOut?: boolean) => void;
  submitExamProblem: (
    examId: string,
    studentId: string,
    problemId: string,
    submissionId: string,
    score: number,
    status: any
  ) => void;
  finishExam: (examId: string, studentId: string) => void;

  // Analytics Helpers
  getStudentProgress: (studentId: string) => StudentProgressStats;
  getGlobalStats: () => {
    totalStudents: number;
    total_students: number;
    totalProblems: number;
    total_problems: number;
    basic_problems: number;
    medium_problems: number;
    advanced_problems: number;
    totalExams: number;
    total_exams: number;
    totalSubmissions: number;
    total_submissions: number;
    acceptedSubmissions: number;
    accepted_submissions: number;
    acceptanceRate: number;
    acceptance_rate: number;
    topicStats: Array<{ name: string; count: number; acceptedRate: number }>;
    topStudents: User[];
  };
  getLeaderboard: (filterClass?: string) => Array<User & { rank: number; passRate: number }>;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = 'algomaster_data_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('algomaster_theme');
    return saved ? saved === 'dark' : true;
  });

  // Navigation
  const [currentView, setCurrentView] = useState<string>('landing');
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

  // Stored state
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [topics, setTopics] = useState<Topic[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_topics');
    return saved ? JSON.parse(saved) : INITIAL_TOPICS;
  });

  const [problems, setProblems] = useState<Problem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_problems');
    return saved ? JSON.parse(saved) : INITIAL_PROBLEMS;
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_exams');
    return saved ? JSON.parse(saved) : INITIAL_EXAMS;
  });

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [examParticipants, setExamParticipants] = useState<ExamParticipant[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_exam_participants');
    return saved ? JSON.parse(saved) : INITIAL_EXAM_PARTICIPANTS;
  });

  // Theme effect
  useEffect(() => {
    localStorage.setItem('algomaster_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_problems', JSON.stringify(problems));
  }, [problems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_exam_participants', JSON.stringify(examParticipants));
  }, [examParticipants]);

  // Admin User operations
  const createUser = (userData: Omit<User, 'id' | 'created_at' | 'solved_count' | 'total_score'>): User => {
    const rawPassword = userData.password_hash || '123456';
    const finalHash = rawPassword.startsWith('sha256:') ? rawPassword : 'sha256:temp_will_hash';

    const newUser: User = {
      ...userData,
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      password_hash: finalHash,
      created_at: new Date().toISOString(),
      solved_count: 0,
      total_score: 0,
    };

    // Calculate async hash and save
    if (!rawPassword.startsWith('sha256:')) {
      hashPassword(rawPassword).then((h) => {
        setUsers((prev) => prev.map((u) => (u.id === newUser.id ? { ...u, password_hash: h } : u)));
      });
    }

    setUsers(prev => [newUser, ...prev]);
    return newUser;
  };

  const bulkCreateUsers = (userList: Array<{ full_name: string; username: string; class_name: string; email?: string; password?: string }>): User[] => {
    const created: User[] = userList.map((item, idx) => {
      const rawPass = item.password || '123456';
      const id = 'usr_' + (Date.now() + idx) + '_' + Math.random().toString(36).substr(2, 4);

      hashPassword(rawPass).then((h) => {
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, password_hash: h } : u)));
      });

      return {
        id,
        full_name: item.full_name,
        username: item.username.trim().toLowerCase().replace(/\s+/g, ''),
        password_hash: rawPass,
        email: item.email || `${item.username.toLowerCase()}@algomaster.user`,
        class_name: item.class_name || '10A1',
        role: 'USER' as const,
        status: 'ACTIVE' as const,
        created_at: new Date().toISOString(),
        solved_count: 0,
        total_score: 0,
      };
    });

    setUsers(prev => [...created, ...prev]);
    return created;
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
  };

  const resetUserPassword = (userId: string, newPassword?: string): string => {
    const generated = newPassword || 'Pass@' + Math.floor(100000 + Math.random() * 900000);
    hashPassword(generated).then((h) => {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, password_hash: h } : u)));
    });
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, password_hash: generated } : u));
    return generated;
  };

  const toggleUserLock = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          status: u.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE',
        };
      }
      return u;
    }));
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  // Problem operations
  const createProblem = (problemData: Omit<Problem, 'id' | 'created_at' | 'total_submissions' | 'accepted_submissions'>): Problem => {
    const newProb: Problem = {
      ...problemData,
      id: 'prob_' + Date.now(),
      created_at: new Date().toISOString(),
      total_submissions: 0,
      accepted_submissions: 0,
    };
    setProblems(prev => [newProb, ...prev]);
    return newProb;
  };

  const updateProblem = (problemId: string, updates: Partial<Problem>) => {
    setProblems(prev => prev.map(p => p.id === problemId ? { ...p, ...updates } : p));
  };

  const deleteProblem = (problemId: string) => {
    setProblems(prev => prev.filter(p => p.id !== problemId));
  };

  const addTestCase = (problemId: string, testCase: Omit<TestCase, 'id' | 'problem_id'>) => {
    const newTC: TestCase = {
      ...testCase,
      id: 'tc_' + Date.now(),
      problem_id: problemId,
    };
    setProblems(prev => prev.map(p => {
      if (p.id !== problemId) return p;
      if (newTC.is_hidden) {
        return { ...p, hidden_tests: [...p.hidden_tests, newTC] };
      }
      return { ...p, sample_tests: [...p.sample_tests, newTC] };
    }));
  };

  const updateTestCase = (problemId: string, testCaseId: string, updates: Partial<TestCase>) => {
    setProblems(prev => prev.map(p => {
      if (p.id !== problemId) return p;
      return {
        ...p,
        sample_tests: p.sample_tests.map(tc => tc.id === testCaseId ? { ...tc, ...updates } : tc),
        hidden_tests: p.hidden_tests.map(tc => tc.id === testCaseId ? { ...tc, ...updates } : tc),
      };
    }));
  };

  const deleteTestCase = (problemId: string, testCaseId: string) => {
    setProblems(prev => prev.map(p => {
      if (p.id !== problemId) return p;
      return {
        ...p,
        sample_tests: p.sample_tests.filter(tc => tc.id !== testCaseId),
        hidden_tests: p.hidden_tests.filter(tc => tc.id !== testCaseId),
      };
    }));
  };

  // Exam operations
  const createExam = (examData: Omit<Exam, 'id' | 'created_at'>): Exam => {
    const newExam: Exam = {
      ...examData,
      id: 'exam_' + Date.now(),
      created_at: new Date().toISOString(),
    };
    setExams(prev => [newExam, ...prev]);
    return newExam;
  };

  const updateExam = (examId: string, updates: Partial<Exam>) => {
    setExams(prev => prev.map(e => e.id === examId ? { ...e, ...updates } : e));
  };

  const deleteExam = (examId: string) => {
    setExams(prev => prev.filter(e => e.id !== examId));
  };

  const togglePublishExam = (examId: string) => {
    setExams(prev => prev.map(e => e.id === examId ? { ...e, is_published: !e.is_published } : e));
  };

  // Submission operations
  const addSubmission = (subData: Omit<Submission, 'id' | 'created_at'>): Submission => {
    const newSub: Submission = {
      ...subData,
      id: 'sub_' + Date.now(),
      created_at: new Date().toISOString(),
    };

    setSubmissions(prev => [newSub, ...prev]);

    // Update Problem stats
    setProblems(prev => prev.map(p => {
      if (p.id !== newSub.problem_id) return p;
      const isAc = newSub.status === 'ACCEPTED';
      return {
        ...p,
        total_submissions: (p.total_submissions || 0) + 1,
        accepted_submissions: isAc ? (p.accepted_submissions || 0) + 1 : (p.accepted_submissions || 0),
      };
    }));

    // Update User solved stats
    if (newSub.status === 'ACCEPTED') {
      setUsers(prev => prev.map(u => {
        if (u.id !== newSub.user_id) return u;
        // Check if user already solved this problem
        const previousAc = submissions.some(s => s.user_id === u.id && s.problem_id === newSub.problem_id && s.status === 'ACCEPTED');
        if (!previousAc) {
          return {
            ...u,
            solved_count: (u.solved_count || 0) + 1,
            total_score: (u.total_score || 0) + 100,
          };
        }
        return u;
      }));
    }

    return newSub;
  };

  // Exam participation
  const startExam = (examId: string, student: User): ExamParticipant => {
    const existing = examParticipants.find(p => p.exam_id === examId && p.student_id === student.id);
    if (existing) return existing;

    const newParticipant: ExamParticipant = {
      id: 'ep_' + Date.now(),
      exam_id: examId,
      student_id: student.id,
      student_name: student.full_name,
      student_class: student.class_name,
      started_at: new Date().toISOString(),
      total_score: 0,
      status: 'IN_PROGRESS',
      problem_submissions: {},
    };

    setExamParticipants(prev => [newParticipant, ...prev]);
    return newParticipant;
  };

  const startExamForStudent = (
    examId: string,
    studentId: string,
    studentName?: string,
    studentClass?: string
  ): ExamParticipant => {
    const existing = examParticipants.find(p => p.exam_id === examId && p.student_id === studentId);
    if (existing) return existing;

    const targetUser = users.find(u => u.id === studentId);
    const newParticipant: ExamParticipant = {
      id: 'ep_' + Date.now(),
      exam_id: examId,
      student_id: studentId,
      student_name: studentName || targetUser?.full_name || 'Học sinh',
      student_class: studentClass || targetUser?.class_name || '10 Tin',
      started_at: new Date().toISOString(),
      total_score: 0,
      status: 'IN_PROGRESS',
      problem_submissions: {},
    };

    setExamParticipants(prev => [newParticipant, ...prev]);
    return newParticipant;
  };

  const submitExamForStudent = (
    examId: string,
    studentId: string,
    submissionsList: any[],
    isTimedOut = false
  ) => {
    setExamParticipants(prev => prev.map(p => {
      if (p.exam_id !== examId || p.student_id !== studentId) return p;

      const subMap: Record<string, any> = {};
      let total = 0;
      if (Array.isArray(submissionsList)) {
        submissionsList.forEach((s) => {
          subMap[s.problem_id] = {
            problem_id: s.problem_id,
            submission_id: 'sub_exam_' + Date.now() + '_' + s.problem_id,
            score_obtained: s.score || 0,
            status: s.status || 'SUBMITTED',
            submitted_at: s.submitted_at || new Date().toISOString(),
          };
          total += (s.score || 0);
        });
      }

      return {
        ...p,
        problem_submissions: subMap,
        total_score: total,
        status: isTimedOut ? 'TIMED_OUT' : 'SUBMITTED',
        submitted_at: new Date().toISOString(),
      };
    }));
  };

  const submitExamProblem = (
    examId: string,
    studentId: string,
    problemId: string,
    submissionId: string,
    score: number,
    status: any
  ) => {
    setExamParticipants(prev => prev.map(p => {
      if (p.exam_id !== examId || p.student_id !== studentId) return p;
      const prevSub = p.problem_submissions[problemId];
      const previousScore = prevSub ? prevSub.score_obtained : 0;
      const newScore = Math.max(previousScore, score);

      const updatedSubmissions = {
        ...p.problem_submissions,
        [problemId]: {
          problem_id: problemId,
          submission_id: submissionId,
          score_obtained: newScore,
          status,
          submitted_at: new Date().toISOString(),
        },
      };

      const calculatedTotalScore = Object.values(updatedSubmissions).reduce((sum: number, item: any) => sum + (item.score_obtained || 0), 0);

      return {
        ...p,
        problem_submissions: updatedSubmissions,
        total_score: calculatedTotalScore,
      };
    }));
  };

  const finishExam = (examId: string, studentId: string) => {
    setExamParticipants(prev => prev.map(p => {
      if (p.exam_id !== examId || p.student_id !== studentId) return p;
      return {
        ...p,
        status: 'SUBMITTED',
        submitted_at: new Date().toISOString(),
      };
    }));
  };

  // Student progress calculation
  const getStudentProgress = (studentId: string): StudentProgressStats => {
    const userSubs = submissions.filter(s => s.user_id === studentId);
    const solvedProblemIds = new Set(userSubs.filter(s => s.status === 'ACCEPTED').map(s => s.problem_id));
    const attemptedProblemIds = new Set(userSubs.map(s => s.problem_id));

    const basicProblems = problems.filter(p => p.difficulty === 'BASIC');
    const mediumProblems = problems.filter(p => p.difficulty === 'MEDIUM');
    const advancedProblems = problems.filter(p => p.difficulty === 'ADVANCED');

    const basicSolved = basicProblems.filter(p => solvedProblemIds.has(p.id)).length;
    const mediumSolved = mediumProblems.filter(p => solvedProblemIds.has(p.id)).length;
    const advancedSolved = advancedProblems.filter(p => solvedProblemIds.has(p.id)).length;

    // Topics breakdown
    const topicsStats = topics.map(t => {
      const topicProblems = problems.filter(p => p.topic_id === t.id);
      const solved = topicProblems.filter(p => solvedProblemIds.has(p.id)).length;
      const total = topicProblems.length;
      return {
        topic_id: t.id,
        topic_name: t.name,
        solved,
        total,
        percentage: total > 0 ? Math.round((solved / total) * 100) : 0,
      };
    });

    // Find weak topics (topics with problems attempted or available with low solve rate)
    const weakTopics = topicsStats
      .filter(t => t.total > 0 && t.percentage < 60)
      .slice(0, 3)
      .map(t => ({
        topic_id: t.topic_id,
        topic_name: t.topic_name,
        solve_rate: t.percentage,
        advice: t.percentage === 0
          ? `Bạn chưa bắt đầu chủ đề này. Hãy bắt đầu từ các bài cơ bản!`
          : `Bạn đã giải được ${t.percentage}% chủ đề này. Hãy luyện thêm để hoàn thiện kỹ năng!`,
      }));

    return {
      basic_solved: basicSolved,
      basic_total: basicProblems.length,
      medium_solved: mediumSolved,
      medium_total: mediumProblems.length,
      advanced_solved: advancedSolved,
      advanced_total: advancedProblems.length,
      total_solved: solvedProblemIds.size,
      total_attempted: attemptedProblemIds.size,
      total_submissions: userSubs.length,
      acceptance_rate: userSubs.length > 0 ? Math.round((userSubs.filter(s => s.status === 'ACCEPTED').length / userSubs.length) * 100) : 0,
      topics_stats: topicsStats,
      weak_topics: weakTopics,
    };
  };

  // Global admin statistics
  const getGlobalStats = () => {
    const students = users.filter(u => u.role === 'STUDENT');
    const totalSubmissions = submissions.length;
    const acceptedSubmissions = submissions.filter(s => s.status === 'ACCEPTED').length;
    const acceptanceRate = totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0;

    const topicStats = topics.map(t => {
      const topicProblems = problems.filter(p => p.topic_id === t.id);
      const probIds = new Set(topicProblems.map(p => p.id));
      const topicSubs = submissions.filter(s => probIds.has(s.problem_id));
      const acSubs = topicSubs.filter(s => s.status === 'ACCEPTED').length;
      const rate = topicSubs.length > 0 ? Math.round((acSubs / topicSubs.length) * 100) : 0;
      return {
        name: t.name,
        count: topicProblems.length,
        acceptedRate: rate,
      };
    });

    const basicProblems = problems.filter(p => p.difficulty === 'BASIC').length;
    const mediumProblems = problems.filter(p => p.difficulty === 'MEDIUM').length;
    const advancedProblems = problems.filter(p => p.difficulty === 'ADVANCED').length;
    const topStudents = [...students].sort((a, b) => (b.solved_count || 0) - (a.solved_count || 0)).slice(0, 5);

    return {
      totalStudents: students.length,
      total_students: students.length,
      totalProblems: problems.length,
      total_problems: problems.length,
      basic_problems: basicProblems,
      medium_problems: mediumProblems,
      advanced_problems: advancedProblems,
      totalExams: exams.length,
      total_exams: exams.length,
      totalSubmissions,
      total_submissions: totalSubmissions,
      acceptedSubmissions,
      accepted_submissions: acceptedSubmissions,
      acceptanceRate,
      acceptance_rate: acceptanceRate,
      topicStats,
      topStudents,
    };
  };

  // Leaderboard with ranks
  const getLeaderboard = (filterClass?: string) => {
    let studentList = users.filter(u => u.role === 'STUDENT');
    if (filterClass && filterClass !== 'ALL') {
      studentList = studentList.filter(u => u.class_name === filterClass);
    }

    const sorted = [...studentList].sort((a, b) => {
      if ((b.solved_count || 0) !== (a.solved_count || 0)) {
        return (b.solved_count || 0) - (a.solved_count || 0);
      }
      return (b.total_score || 0) - (a.total_score || 0);
    });

    return sorted.map((std, idx) => {
      const userSubs = submissions.filter(s => s.user_id === std.id);
      const acCount = userSubs.filter(s => s.status === 'ACCEPTED').length;
      const passRate = userSubs.length > 0 ? Math.round((acCount / userSubs.length) * 100) : 0;
      return {
        ...std,
        rank: idx + 1,
        passRate,
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        users,
        setUsers,
        topics,
        problems,
        exams,
        submissions,
        examParticipants,
        isDarkMode,
        toggleDarkMode,
        currentView,
        setCurrentView,
        selectedProblemId,
        setSelectedProblemId,
        selectedExamId,
        setSelectedExamId,
        createUser,
        addUser: createUser,
        bulkCreateUsers,
        updateUser,
        resetUserPassword,
        toggleUserLock,
        toggleUserStatus: toggleUserLock,
        deleteUser,
        createProblem,
        addProblem: createProblem,
        updateProblem,
        deleteProblem,
        addTestCase,
        updateTestCase,
        deleteTestCase,
        createExam,
        addExam: createExam,
        updateExam,
        deleteExam,
        togglePublishExam,
        addSubmission,
        startExam,
        startExamForStudent,
        submitExamForStudent,
        submitExamProblem,
        finishExam,
        getStudentProgress,
        getGlobalStats,
        getLeaderboard,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
