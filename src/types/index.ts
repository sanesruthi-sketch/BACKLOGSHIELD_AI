export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';
export type UserRole = 'student' | 'faculty' | 'admin';

export interface UserAuth {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  token?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  email: string;
  major: string;
  department: string;
  semester: string;
  university: string;
  rollNo: string;
  advisorName: string;
  academicStanding: string;
  cgpa: number;
  projectedCgpa: number;
  creditsEarned: number;
  totalCredits: number;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  instructor: string;
  instructorEmail: string;
  credits: number;
  currentGrade: string;
  projectedGrade: string;
  gradePercent: number;
  attendancePercent: number;
  riskLevel: RiskLevel;
  riskReason?: string;
  assignmentsCompleted: number;
  totalAssignments: number;
  nextEvaluation: string;
  evaluationDate: string;
  topicsStruggling: string[];
  topicsMastered: string[];
}

export interface MetricSummary {
  cgpa: number;
  projectedCgpa: number;
  gpaChange: number;
  retentionProbability: number;
  retentionChange: number;
  attendanceAverage: number;
  attendanceChange: number;
  assignmentRate: number;
  assignmentChange: number;
  studyHoursWeekly: number;
  classRankPercentile: number;
}

export interface PerformanceHistoryItem {
  week: string;
  studentScore: number;
  classAverage: number;
  studyHours: number;
  targetScore: number;
}

export interface TopicMasteryItem {
  id: string;
  course_id: string;
  course_code: string;
  course_name: string;
  topic_name: string;
  mastery_percent: number | null;
  status: 'NOT ASSESSED' | 'priority learning gap' | 'needs practice' | 'provisional mastery';
  status_label: string;
  badge_color: 'slate' | 'rose' | 'amber' | 'emerald';
  recommendation: string;
  attempt_count: number;
  last_assessed_at: string;
}

export interface QuizQuestionSanitized {
  id: string;
  course_id: string;
  topic_name: string;
  difficulty: string;
  question_text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

export interface QuizSessionData {
  quiz_session_id: string;
  course_id: string;
  topic_name: string;
  difficulty: string;
  total_questions: number;
  questions: QuizQuestionSanitized[];
}

export interface QuestionResultBreakdown {
  question_id: string;
  question_text: string;
  selected_option: string;
  correct_option: string;
  is_correct: boolean;
  explanation: string;
}

export interface QuizSubmitResult {
  attempt_id: string;
  course_id: string;
  topic_name: string;
  score_percent: number;
  correct_answers: number;
  total_questions: number;
  updated_mastery_percent: number | null;
  mastery_status: string;
  mastery_status_label: string;
  feedback: string;
  questions_result: QuestionResultBreakdown[];
}

export interface StudyTask {
  id: string;
  course_code: string;
  topic_name: string;
  title: string;
  description?: string;
  planned_minutes: number;
  actual_minutes: number;
  planned_date: string;
  priority: 'urgent' | 'recommended' | 'optional';
  status: 'planned' | 'completed' | 'rescheduled';
  completed_at?: string;
}

export interface StudyPlannerData {
  total_tasks: number;
  completed_tasks: number;
  completion_percent: number;
  total_planned_minutes: number;
  total_actual_minutes: number;
  planned_hours: number;
  actual_hours: number;
  tasks: StudyTask[];
}

export interface AiRecommendation {
  id: string;
  courseCode: string;
  title: string;
  description: string;
  priority: 'urgent' | 'recommended' | 'optional';
  impactEstimate: string;
  estimatedTimeMinutes: number;
  actionType: 'study_session' | 'mentor_meeting' | 'practice_quiz' | 'attendance_catchup';
  completed: boolean;
  createdAt: string;
}

export interface FacultyCohortStudent {
  id: string;
  name: string;
  rollNo: string;
  major: string;
  semester: string;
  riskLevel: RiskLevel;
  riskScore: number;
  attendance: number;
  avgGrade: number;
  flags: string[];
  lastActive: string;
}

export interface InterventionRecord {
  id: string;
  student_id: string;
  student_name: string;
  faculty_id: string;
  action: string;
  notes: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  follow_up_date?: string;
  created_at: string;
}

export interface CSVRowError {
  row: number;
  column: string;
  value: any;
  reason: string;
}

export interface CSVPreviewData {
  valid: boolean;
  filename: string;
  total_rows: number;
  valid_count: number;
  invalid_count: number;
  valid_rows: any[];
  errors: CSVRowError[];
}

export interface AuditEventItem {
  id: string;
  actor_email?: string;
  action: string;
  entity_type: string;
  details?: string;
  created_at: string;
}

export interface AdminUserItem {
  id?: string | number;
  name?: string;
  full_name?: string;
  email: string;
  role: string;
  status?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface BackendHealth {
  status: 'online' | 'offline' | 'checking';
  endpoint: string;
  responseTimeMs?: number;
  version?: string;
  message?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user' | string;
  text: string;
  timestamp?: string;
  suggestions?: string[];
}

export interface UpcomingTask {
  id: string;
  title: string;
  courseCode: string;
  dueDate: string;
  type: 'exam' | 'project' | 'assignment' | 'quiz' | string;
  difficulty: 'easy' | 'medium' | 'hard' | string;
  estHours: number;
  completed: boolean;
}

export interface AttendanceRecord {
  date: string;
  courseCode: string;
  status: 'present' | 'absent' | 'late' | 'excused';
}

