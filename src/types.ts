export type UserRole = 'ADMIN' | 'USER' | 'STUDENT';
export type UserStatus = 'ACTIVE' | 'LOCKED';

export interface User {
  id: string;
  full_name: string;
  username: string;
  password_hash: string;
  email?: string;
  class_name: string;
  role: UserRole;
  status: UserStatus;
  avatar_url?: string;
  created_at: string;
  solved_count?: number;
  total_score?: number;
}

export type Difficulty = 'BASIC' | 'MEDIUM' | 'ADVANCED';

export type TopicTier = 'BASIC' | 'MEDIUM' | 'ADVANCED';

export interface Topic {
  id: string;
  name: string;
  slug: string;
  tier: TopicTier;
  description: string;
  icon?: string;
  order: number;
}

export interface TestCase {
  id: string;
  problem_id?: string;
  input: string;
  expected_output: string;
  is_hidden: boolean;
  explanation?: string;
}

export type SupportedLanguage = 'python' | 'cpp' | 'c' | 'java';

export interface Problem {
  id: string;
  title: string;
  slug: string;
  topic_id: string;
  difficulty: Difficulty;
  description: string;
  input_description: string;
  output_description: string;
  constraints: string;
  time_limit: number; // in seconds (e.g. 1.0)
  memory_limit: number; // in MB (e.g. 256)
  points?: number;
  created_by: string;
  created_at: string;
  sample_tests: TestCase[];
  hidden_tests: TestCase[];
  starter_code: Record<SupportedLanguage, string>;
  solution_code?: Record<SupportedLanguage, string>;
  hints?: string[];
  tags: string[];
  total_submissions: number;
  accepted_submissions: number;
}

export type SubmissionStatus =
  | 'ACCEPTED'
  | 'WRONG_ANSWER'
  | 'TIME_LIMIT_EXCEEDED'
  | 'MEMORY_LIMIT_EXCEEDED'
  | 'RUNTIME_ERROR'
  | 'COMPILATION_ERROR'
  | 'RUNNING'
  | 'PENDING';

export interface TestCaseResult {
  test_case_id: string;
  is_hidden: boolean;
  passed: boolean;
  status: SubmissionStatus;
  input: string;
  expected_output: string;
  actual_output?: string;
  execution_time_ms: number;
  memory_used_kb: number;
  error_message?: string;
}

export interface Submission {
  id: string;
  user_id: string;
  user_name: string;
  user_class: string;
  problem_id: string;
  problem_title: string;
  language: SupportedLanguage;
  source_code: string;
  status: SubmissionStatus;
  execution_time: number; // in ms
  memory_used: number; // in KB or MB
  test_cases_passed: number;
  total_test_cases: number;
  test_case_results?: TestCaseResult[];
  error_details?: string;
  created_at: string;
  submitted_at?: string;
  exam_id?: string;
}

export interface ExamProblem {
  problem_id: string;
  score?: number;
  points?: number;
}

export type ExamProblemItem = ExamProblem;
export type ExamSubmission = Submission;

export interface Exam {
  id: string;
  title: string;
  description: string;
  start_time: string; // ISO string
  end_time: string; // ISO string
  duration_minutes: number;
  created_by: string;
  created_by_name: string;
  created_at: string;
  is_published: boolean;
  allow_view_result: boolean;
  problems: ExamProblem[];
  total_score: number;
  target_classes?: string[];
}

export interface ExamSubmissionRecord {
  problem_id: string;
  submission_id: string;
  score_obtained: number;
  status: SubmissionStatus;
  submitted_at: string;
}

export interface ExamParticipant {
  id: string;
  exam_id: string;
  student_id: string;
  student_name: string;
  student_class: string;
  started_at: string;
  submitted_at?: string;
  total_score: number;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'TIMED_OUT';
  problem_submissions: Record<string, ExamSubmissionRecord>;
}

export interface StudentProgressStats {
  basic_solved: number;
  basic_total: number;
  medium_solved: number;
  medium_total: number;
  advanced_solved: number;
  advanced_total: number;
  total_solved: number;
  total_attempted: number;
  total_submissions: number;
  acceptance_rate: number;
  topics_stats: {
    topic_id: string;
    topic_name: string;
    solved: number;
    total: number;
    percentage: number;
  }[];
  weak_topics: {
    topic_id: string;
    topic_name: string;
    solve_rate: number;
    advice: string;
  }[];
}
