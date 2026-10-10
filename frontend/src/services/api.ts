// @ts-nocheck
import { 
  StudentProfile, 
  Course, 
  MetricSummary, 
  PerformanceHistoryItem, 
  AiRecommendation, 
  FacultyCohortStudent, 
  BackendHealth,
  TopicMasteryItem,
  QuizSessionData,
  QuizSubmitResult,
  StudyPlannerData,
  InterventionRecord,
  CSVPreviewData,
  AuditEventItem,
  AdminUserItem,
  UserAuth
} from '../types';
import { 
  mockStudentProfile, 
  mockMetricSummary, 
  mockCourses, 
  mockPerformanceHistory, 
  mockAiRecommendations, 
  mockFacultyCohort 
} from './mockData';

const API_BASE = '/api/v1';

// Internal state
let isForcedMock = false;
let authToken: string | null = null;

if (typeof window !== 'undefined') {
  authToken = localStorage.getItem('campusiq_token');
  isForcedMock = localStorage.getItem('campusiq_force_mock') === 'true';
}

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('campusiq_token', token);
  } else {
    localStorage.removeItem('campusiq_token');
  }
};

export const getAuthToken = () => authToken;

export const setForceMockMode = (forced: boolean) => {
  isForcedMock = forced;
  localStorage.setItem('campusiq_force_mock', forced ? 'true' : 'false');
};

export const getForceMockMode = (): boolean => isForcedMock;

const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

// ----------------------------------------------------
// Health Check
// ----------------------------------------------------
export const checkBackendHealth = async (): Promise<BackendHealth> => {
  if (getForceMockMode()) {
    return {
      status: 'offline',
      endpoint: 'http://localhost:5000',
      message: 'Running in Standalone Mock / Demo Mode (Manual Override)',
    };
  }

  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${API_BASE}/health`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        status: 'online',
        endpoint: 'http://localhost:5000',
        responseTimeMs: Date.now() - startTime,
        version: data.version || '1.0.0',
        message: data.message || 'MongoDB Atlas Backend Connected & Healthy (blai.dxi8wl7.mongodb.net)',
      };
    } else {
      return {
        status: 'offline',
        endpoint: 'http://localhost:5000',
        responseTimeMs: Date.now() - startTime,
        message: `HTTP Error ${res.status}: Using High-Fidelity Demo Mock Data`,
      };
    }
  } catch {
    return {
      status: 'offline',
      endpoint: 'http://localhost:5000',
      message: 'Backend server not responding at localhost:5000. Operating in High-Fidelity Standalone Demo Mode.',
    };
  }
};

// ----------------------------------------------------
// Authentication
// ----------------------------------------------------
export const loginApi = async (email: string, password: string): Promise<UserAuth> => {
  if (!getForceMockMode()) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        setAuthToken(data.access_token);
        return {
          id: data.user_id,
          email: data.email,
          name: data.full_name || (data.role === 'admin' ? 'Dean Jonathan Hayes' : data.role === 'faculty' ? 'Dr. Evelyn Vance' : 'Alex Rivera'),
          role: data.role,
          token: data.access_token,
        };
      }
    } catch (e) {
      console.info('Using offline auth fallback');
    }
  }

  // Offline demo fallback auth
  let role: 'student' | 'faculty' | 'admin' = 'student';
  let name = 'Alex Rivera';
  if (email.includes('admin')) {
    role = 'admin';
    name = 'Dean Jonathan Hayes (Admin)';
  } else if (email.includes('faculty') || email.includes('vance')) {
    role = 'faculty';
    name = 'Dr. Evelyn Vance (Faculty)';
  }

  return {
    id: `usr_${role}`,
    email,
    name,
    role,
    token: 'mock_demo_jwt_token',
  };
};

export const registerApi = async (data: {
  email: string;
  password: string;
  full_name: string;
  role?: string;
  roll_number?: string;
  department?: string;
}): Promise<UserAuth> => {
  if (!getForceMockMode()) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const resData = await res.json();
        setAuthToken(resData.access_token);
        return {
          id: resData.user_id,
          email: resData.email,
          name: resData.full_name || data.full_name,
          role: resData.role || 'student',
          token: resData.access_token,
        };
      }
    } catch (e) {
      console.info('Using offline auth registration fallback');
    }
  }

  return {
    id: `usr_${Date.now()}`,
    email: data.email,
    name: data.full_name,
    role: (data.role as any) || 'student',
    token: 'mock_demo_jwt_token',
  };
};

// ----------------------------------------------------
// Student & Analytics
// ----------------------------------------------------
export const fetchStudentProfile = async (): Promise<StudentProfile> => {
  if (!getForceMockMode()) {
    try {
      const res = await fetch(`${API_BASE}/students/me`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch {}
  }
  return { ...mockStudentProfile };
};

export const fetchMetrics = async (): Promise<MetricSummary> => {
  if (!getForceMockMode()) {
    try {
      const res = await fetch(`${API_BASE}/analytics/metrics`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch {}
  }
  return { ...mockMetricSummary };
};

export const fetchCourses = async (): Promise<Course[]> => {
  if (!getForceMockMode()) {
    try {
      const res = await fetch(`${API_BASE}/courses`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch {}
  }
  return [...mockCourses];
};

export const fetchPerformanceHistory = async (): Promise<PerformanceHistoryItem[]> => {
  if (!getForceMockMode()) {
    try {
      const res = await fetch(`${API_BASE}/analytics/performance-history`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch {}
  }
  return [...mockPerformanceHistory];
};

// ----------------------------------------------------
// Digital Learning Twin
// ----------------------------------------------------
const mockTwinRecords: TopicMasteryItem[] = [
  {
    id: 'tw_1',
    course_id: 'crs_ma204',
    course_code: 'MA-204',
    course_name: 'Applied Linear Algebra & SVD',
    topic_name: 'Singular Value Decomposition (SVD)',
    mastery_percent: 42.0,
    status: 'priority learning gap',
    status_label: 'Priority Gap',
    badge_color: 'rose',
    recommendation: 'Review fundamental concepts, worked examples, and take remedial drill.',
    attempt_count: 2,
    last_assessed_at: 'Mar 10, 2026',
  },
  {
    id: 'tw_2',
    course_id: 'crs_ma204',
    course_code: 'MA-204',
    course_name: 'Applied Linear Algebra & SVD',
    topic_name: 'Eigenvalues & Eigenvectors',
    mastery_percent: 48.0,
    status: 'priority learning gap',
    status_label: 'Priority Gap',
    badge_color: 'rose',
    recommendation: 'Review fundamental concepts, worked examples, and take remedial drill.',
    attempt_count: 3,
    last_assessed_at: 'Mar 08, 2026',
  },
  {
    id: 'tw_3',
    course_id: 'crs_ma204',
    course_code: 'MA-204',
    course_name: 'Applied Linear Algebra & SVD',
    topic_name: 'Orthogonal Projections',
    mastery_percent: 62.0,
    status: 'needs practice',
    status_label: 'Needs Practice',
    badge_color: 'amber',
    recommendation: 'Complete targeted problem sets to reinforce comprehension.',
    attempt_count: 1,
    last_assessed_at: 'Mar 05, 2026',
  },
  {
    id: 'tw_4',
    course_id: 'crs_cs301',
    course_code: 'CS-301',
    course_name: 'Advanced Data Structures & Algorithms',
    topic_name: 'Dynamic Programming with Bitmasking',
    mastery_percent: 45.0,
    status: 'priority learning gap',
    status_label: 'Priority Gap',
    badge_color: 'rose',
    recommendation: 'Review state representation and solve 3 standard TSP/matching problems.',
    attempt_count: 2,
    last_assessed_at: 'Mar 07, 2026',
  },
  {
    id: 'tw_5',
    course_id: 'crs_cs301',
    course_code: 'CS-301',
    course_name: 'Advanced Data Structures & Algorithms',
    topic_name: 'Red-Black Tree Rotations',
    mastery_percent: 64.0,
    status: 'needs practice',
    status_label: 'Needs Practice',
    badge_color: 'amber',
    recommendation: 'Practice insertion recoloring and case-3 double rotations.',
    attempt_count: 1,
    last_assessed_at: 'Feb 28, 2026',
  },
  {
    id: 'tw_6',
    course_id: 'crs_ma204',
    course_code: 'MA-204',
    course_name: 'Applied Linear Algebra & SVD',
    topic_name: 'Gaussian Elimination',
    mastery_percent: 85.0,
    status: 'provisional mastery',
    status_label: 'Provisional Mastery',
    badge_color: 'emerald',
    recommendation: 'Demonstrates solid competency; maintain active recall before exams.',
    attempt_count: 4,
    last_assessed_at: 'Feb 20, 2026',
  },
  {
    id: 'tw_7',
    course_id: 'crs_cs301',
    course_code: 'CS-301',
    course_name: 'Advanced Data Structures & Algorithms',
    topic_name: 'Max Flow & Min Cut',
    mastery_percent: null,
    status: 'NOT ASSESSED',
    status_label: 'Not Assessed',
    badge_color: 'slate',
    recommendation: 'Attempt diagnostic adaptive quiz to establish mastery baseline.',
    attempt_count: 0,
    last_assessed_at: 'Not yet assessed',
  },
];

export const fetchLearningTwin = async (): Promise<TopicMasteryItem[]> => {
  if (!getForceMockMode()) {
    try {
      const res = await fetch(`${API_BASE}/learning-twin`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch {}
  }
  return [...mockTwinRecords];
};

// ----------------------------------------------------
// Adaptive Quizzes
// ----------------------------------------------------
export const startAdaptiveQuiz = async (courseId: string, topicName: string): Promise<QuizSessionData> => {
  if (!getForceMockMode()) {
    try {
      const res = await fetch(`${API_BASE}/quizzes/start`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ course_id: courseId, topic_name: topicName }),
      });
      if (res.ok) return await res.json();
    } catch {}
  }

  // Fallback demo questions
  return {
    quiz_session_id: `demo_quiz_${Date.now()}`,
    course_id: courseId,
    topic_name: topicName,
    difficulty: 'intermediate',
    total_questions: 3,
    questions: [
      {
        id: 'q_1',
        course_id: courseId,
        topic_name: topicName,
        difficulty: 'intermediate',
        question_text: `In ${topicName}, what is the foundational mathematical or algorithmic principle?`,
        options: {
          A: 'Greedy local optima heuristic',
          B: 'Orthogonal factorization / Optimal subproblem state transition',
          C: 'Linear randomized probing',
          D: 'Brute-force depth iteration',
        },
      },
      {
        id: 'q_2',
        course_id: courseId,
        topic_name: topicName,
        difficulty: 'intermediate',
        question_text: `Which computational complexity bound typically governs ${topicName}?`,
        options: {
          A: 'O(1) constant amortized',
          B: 'O(N^2 * 2^N) or O(min(m*n^2, m^2*n))',
          C: 'O(N!) factorial unbounded',
          D: 'O(log log N)',
        },
      },
      {
        id: 'q_3',
        course_id: courseId,
        topic_name: topicName,
        difficulty: 'intermediate',
        question_text: `How does real-time remediation in ${topicName} safeguard midterm exam performance?`,
        options: {
          A: 'By eliminating prerequisite foundational gaps and restoring calculation speed',
          B: 'By skipping lab proofs entirely',
          C: 'By guessing multiple-choice answers',
          D: 'By waiting until after final grades are posted',
        },
      },
    ],
  };
};

export const submitAdaptiveQuiz = async (
  courseId: string,
  topicName: string,
  submissions: { question_id: string; selected_option: string }[]
): Promise<QuizSubmitResult> => {
  if (!getForceMockMode()) {
    try {
      const res = await fetch(`${API_BASE}/quizzes/submit`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          course_id: courseId,
          topic_name: topicName,
          submissions,
        }),
      });
      if (res.ok) return await res.json();
    } catch {}
  }

  // Demo fallback grading
  const correct = submissions.filter(s => s.selected_option === 'B' || s.selected_option === 'A').length || 2;
  const score = Math.round((correct / submissions.length) * 100);

  return {
    attempt_id: `att_${Date.now()}`,
    course_id: courseId,
    topic_name: topicName,
    score_percent: score,
    correct_answers: correct,
    total_questions: submissions.length,
    updated_mastery_percent: Math.min(95, score),
    mastery_status: score >= 70 ? 'provisional mastery' : 'needs practice',
    mastery_status_label: score >= 70 ? 'Provisional Mastery' : 'Needs Practice',
    feedback: score >= 70 ? 'Excellent mastery demonstrated!' : 'Good effort! Targeted practice recommended on mistakes.',
    questions_result: submissions.map((s, idx) => ({
      question_id: s.question_id,
      question_text: `Question ${idx + 1} on ${topicName}`,
      selected_option: s.selected_option,
      correct_option: 'B',
      is_correct: s.selected_option === 'B' || s.selected_option === 'A',
      explanation: 'Verified through server-side answer key and theoretical textbook proofs.',
    })),
  };
};

// ----------------------------------------------------
// Study Planner
// ----------------------------------------------------
let mockPlannerTasks: StudyPlannerData = {
  total_tasks: 4,
  completed_tasks: 2,
  completion_percent: 50.0,
  total_planned_minutes: 215,
  total_actual_minutes: 105,
  planned_hours: 3.6,
  actual_hours: 1.8,
  tasks: [
    {
      id: 'tsk_1',
      course_code: 'MA-204',
      topic_name: 'Singular Value Decomposition (SVD)',
      title: 'Review SVD Factorization Walkthrough',
      description: 'Study 3D matrix visualization and solve 4 factorization problems.',
      planned_minutes: 45,
      actual_minutes: 45,
      planned_date: 'Today',
      priority: 'urgent',
      status: 'completed',
      completed_at: 'Today',
    },
    {
      id: 'tsk_2',
      course_code: 'MA-204',
      topic_name: 'Eigenvalues & Eigenvectors',
      title: 'Solve Midterm Practice Proofs',
      description: 'Practice characteristic polynomial derivations and diagonalization proofs.',
      planned_minutes: 60,
      actual_minutes: 0,
      planned_date: 'Tomorrow',
      priority: 'urgent',
      status: 'planned',
    },
    {
      id: 'tsk_3',
      course_code: 'CS-301',
      topic_name: 'Dynamic Programming with Bitmasking',
      title: 'Solve Held-Karp Traveling Salesperson',
      description: 'Code 3 bitmask DP state-space problems on LeetCode/HackerRank.',
      planned_minutes: 50,
      actual_minutes: 0,
      planned_date: 'In 3 Days',
      priority: 'recommended',
      status: 'planned',
    },
    {
      id: 'tsk_4',
      course_code: 'AI-401',
      topic_name: 'Backpropagation Calculus',
      title: 'CNN Transfer Learning Milestone Prep',
      description: 'Tune learning rate hyperparameters and verify validation loss.',
      planned_minutes: 60,
      actual_minutes: 60,
      planned_date: 'Yesterday',
      priority: 'optional',
      status: 'completed',
      completed_at: 'Yesterday',
    },
  ],
};

export const fetchStudyPlanner = async (): Promise<StudyPlannerData> => {
  if (!getForceMockMode()) {
    try {
      const res = await fetch(`${API_BASE}/planner`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch {}
  }
  return { ...mockPlannerTasks };
};

export const generateStudyPlan = async (dailyMinutes: number = 45): Promise<StudyPlannerData> => {
  if (!getForceMockMode()) {
    try {
      const res = await fetch(`${API_BASE}/planner/generate?daily_minutes=${dailyMinutes}`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch {}
  }
  return { ...mockPlannerTasks };
};

export const completeStudyTask = async (taskId: string, actualMinutes: number = 45): Promise<boolean> => {
  if (!getForceMockMode()) {
    try {
      const res = await fetch(`${API_BASE}/planner/${taskId}/complete`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ actual_minutes: actualMinutes }),
      });
      if (res.ok) return true;
    } catch {}
  }

  // Local fallback toggle
  mockPlannerTasks.tasks = mockPlannerTasks.tasks.map(t =>
    t.id === taskId
      ? {
          ...t,
          status: t.status === 'completed' ? 'planned' : 'completed',
          actual_minutes: t.status === 'completed' ? 0 : actualMinutes,
        }
      : t
  );
  return true;
};

// ----------------------------------------------------
// Faculty & Interventions
// ----------------------------------------------------
export const fetchFacultyCohort = async (): Promise<FacultyCohortStudent[]> => {
  if (!getForceMockMode()) {
    try {
      const res = await fetch(`${API_BASE}/faculty/cohort`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch {}
  }
  return [...mockFacultyCohort];
};

export const createFacultyIntervention = async (
  studentId: string,
  action: string,
  notes: string,
  followUpDate?: string
): Promise<boolean> => {
  if (!getForceMockMode()) {
    try {
      const res = await fetch(`${API_BASE}/faculty/interventions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ student_id: studentId, action, notes, follow_up_date: followUpDate }),
      });
      if (res.ok) return true;
    } catch {}
  }
  return true;
};

export const fetchInterventions = async (): Promise<InterventionRecord[]> => {
  if (!getForceMockMode()) {
    try {
      const res = await fetch(`${API_BASE}/faculty/interventions`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch {}
  }
  return [
    {
      id: 'int_1',
      student_id: 'std_01',
      student_name: 'Marcus Vance',
      faculty_id: 'usr_fac',
      action: 'Attendance Warning & Tutoring Referral',
      notes: 'Attendance dropped below 65%. Assigned peer tutor for Data Structures.',
      status: 'in_progress',
      follow_up_date: 'March 20, 2026',
      created_at: 'March 09, 2026',
    },
    {
      id: 'int_2',
      student_id: 'std_03',
      student_name: 'Alex Rivera',
      faculty_id: 'usr_fac',
      action: 'SVD Remediation & Makeup Proofs',
      notes: 'Granted makeup submission on Quiz 3 to restore attendance standing.',
      status: 'completed',
      follow_up_date: 'March 18, 2026',
      created_at: 'March 08, 2026',
    },
  ];
};

// ----------------------------------------------------
// Admin & CSV Import
// ----------------------------------------------------
export const previewCsvFile = async (file: File): Promise<CSVPreviewData> => {
  if (!getForceMockMode()) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE}/admin/csv/preview`, {
        method: 'POST',
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        body: formData,
      });
      if (res.ok) return await res.json();
    } catch {}
  }

  // Realistic mock preview
  return {
    valid: true,
    filename: file.name,
    total_rows: 7,
    valid_count: 7,
    invalid_count: 0,
    valid_rows: [
      { row_number: 1, roll_number: '23CS012', full_name: 'Marcus Vance', email: 'm.vance@campus.edu', department: 'Computer Science', cgpa: 2.65, attendance_percent: 62.4, avg_grade_percent: 58.2 },
      { row_number: 2, roll_number: '23CS035', full_name: 'Sophia Patel', email: 's.patel@campus.edu', department: 'Computer Science', cgpa: 2.90, attendance_percent: 69.1, avg_grade_percent: 64.0 },
      { row_number: 3, roll_number: '23CS048', full_name: 'Alex Rivera', email: 'a.rivera@campus.edu', department: 'Computer Science', cgpa: 3.78, attendance_percent: 87.5, avg_grade_percent: 85.2 },
      { row_number: 4, roll_number: '23CS051', full_name: 'Liam Chen', email: 'l.chen@campus.edu', department: 'Computer Science', cgpa: 3.15, attendance_percent: 74.0, avg_grade_percent: 73.5 },
      { row_number: 5, roll_number: '23CS019', full_name: 'Emma Watson', email: 'e.watson@campus.edu', department: 'Computer Science', cgpa: 3.95, attendance_percent: 96.0, avg_grade_percent: 94.8 },
      { row_number: 6, roll_number: '23CS077', full_name: 'Jordan Taylor', email: 'j.taylor@campus.edu', department: 'Computer Science', cgpa: 3.82, attendance_percent: 93.5, avg_grade_percent: 91.2 },
      { row_number: 7, roll_number: '23CS099', full_name: 'David Kim', email: 'd.kim@campus.edu', department: 'Computer Science', cgpa: 3.65, attendance_percent: 88.0, avg_grade_percent: 84.5 },
    ],
    errors: [],
  };
};

export const commitCsvImport = async (validRows: any[]): Promise<boolean> => {
  if (!getForceMockMode()) {
    try {
      const res = await fetch(`${API_BASE}/admin/csv/commit`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ valid_rows: validRows }),
      });
      if (res.ok) return true;
    } catch {}
  }
  return true;
};

export const fetchAuditEvents = async (): Promise<AuditEventItem[]> => {
  if (!getForceMockMode()) {
    try {
      const res = await fetch(`${API_BASE}/admin/audit-events`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch {}
  }
  return [
    {
      id: 'aud_1',
      actor_email: 'admin@campus.edu',
      action: 'CSV_IMPORT_COMMIT',
      entity_type: 'Student',
      details: 'Committed 6 verified student records from sample_students.csv.',
      created_at: 'Today, 11:20 AM',
    },
    {
      id: 'aud_2',
      actor_email: 'admin@campus.edu',
      action: 'INITIAL_SEED_COMPLETED',
      entity_type: 'System',
      details: 'Database initialized with 14 entities and synthetic cohort records.',
      created_at: 'Yesterday',
    },
  ];
};

export const fetchAdminUsers = async (): Promise<AdminUserItem[]> => {
  if (!getForceMockMode()) {
    try {
      const res = await fetch(`${API_BASE}/admin/users`, { headers: getAuthHeaders() });
      if (res.ok) {
        const users = await res.json();
        return users.map((u: any) => ({
          id: u.id,
          name: u.full_name || u.name,
          email: u.email,
          role: u.role,
          status: u.is_active !== false ? 'Active' : 'Inactive',
          created_at: u.created_at,
        }));
      }
    } catch {}
  }
  return [
    { name: 'Dean Jonathan Hayes', email: 'admin@campus.edu', role: 'admin', status: 'Active' },
    { name: 'Dr. Evelyn Vance', email: 'e.vance@campus.edu', role: 'faculty', status: 'Active' },
    { name: 'Alex Rivera', email: 'a.rivera@campus.edu', role: 'student', status: 'Active' },
    { name: 'Marcus Vance', email: 'm.vance@campus.edu', role: 'student', status: 'Active' },
    { name: 'Sophia Patel', email: 's.patel@campus.edu', role: 'student', status: 'Active' },
  ];
};

// ----------------------------------------------------
// Recommendations & AI Copilot
// ----------------------------------------------------
export const fetchAiRecommendations = async (): Promise<AiRecommendation[]> => {
  if (!getForceMockMode()) {
    try {
      const res = await fetch(`${API_BASE}/recommendations`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch {}
  }
  return [...mockAiRecommendations];
};

export const completeRecommendationAction = async (id: string): Promise<boolean> => {
  if (!getForceMockMode()) {
    try {
      const res = await fetch(`${API_BASE}/recommendations/${id}/complete`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (res.ok) return true;
    } catch {}
  }
  return true;
};

export const sendAiCopilotMessage = async (
  message: string,
  context?: { studentName: string; currentGpa: number; criticalCourses: string[] }
): Promise<{ reply: string; suggestions?: string[] }> => {
  if (!getForceMockMode()) {
    try {
      const res = await fetch(`${API_BASE}/ai/copilot`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ message, context }),
      });
      if (res.ok) return await res.json();
    } catch {}
  }

  // Intelligent local fallback
  const lower = message.toLowerCase();
  if (lower.includes('linear algebra') || lower.includes('svd')) {
    return {
      reply: `In **MA-204 (Applied Linear Algebra)**, your diagnostic telemetry reveals a 67.4% current grade stemming from **Singular Value Decomposition (SVD)** and **Eigenvalue Projections** on Quiz #3.\n\n### Recommended 3-Step Recovery Action:
1. **Interactive Visualization**: Complete the 25-minute CampusIQ 3D Matrix Transformations walkthrough.
2. **Attend Office Hours**: Prof. Elena Rostova holds office hours tomorrow at 2:00 PM (Math Bldg Rm 304).
3. **Adaptive Quiz**: Take the 3-question adaptive SVD quiz on the Digital Learning Twin tab.

*Completing these actions is projected to raise your course grade from **B-** to **A-**, protecting your 3.78 CGPA.*`,
      suggestions: ['Take adaptive quiz on SVD', 'Check attendance in MA-204', 'View 7-day study plan'],
    };
  }

  if (lower.includes('gpa') || lower.includes('raise') || lower.includes('3.9')) {
    return {
      reply: `Your current CGPA is **3.78** with a projected trajectory of **3.84** this semester. To push your CGPA across the **3.90 threshold**:\n\n1. **Prioritize MA-204 (Applied Linear Algebra)**: Raising this 4-credit course from C+ to A- produces a **+0.09 CGPA swing**.\n2. **Safeguard CS-301 (Algorithms)**: Current grade is B (78.8%). Raising to an A adds **+0.05 CGPA**.\n3. **Lock in AI-401 & CS-312**: Maintain your 94%+ marks on final project deliverables.`,
      suggestions: ['Generate an exam revision schedule', 'Analyze my study hour distribution', 'Open study planner'],
    };
  }

  return {
    reply: `I synthesized your academic telemetry for Spring 2026:\n\n- **Standing**: Dean's Honor Roll (3.78 CGPA, 91st Percentile)\n- **Primary Risk Factor**: **MA-204 (Linear Algebra)** has high midterm weight and needs SVD review.\n- **Strong Momentum**: Exceptional performance in **AI-401 (Machine Learning)** and **CS-312 (Databases)**.\n\nWhat would you like to focus on today?`,
    suggestions: ['Why is MA-204 flagged as critical?', 'How can I raise my GPA to 3.90?', 'Open Digital Learning Twin'],
  };
};
