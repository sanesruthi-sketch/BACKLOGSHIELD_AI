import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
    Index
)
from sqlalchemy.orm import relationship
from backend.app.db.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

# ----------------------------------------------------
# 1. Users & Authentication
# ----------------------------------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    avatar = Column(String(500), nullable=True)
    role = Column(String(50), default="student", index=True)  # 'student' | 'faculty' | 'admin'
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    student_profile = relationship("Student", back_populates="user", uselist=False, cascade="all, delete-orphan")
    assigned_interventions = relationship("Intervention", back_populates="faculty")
    audit_events = relationship("AuditEvent", back_populates="actor")

# ----------------------------------------------------
# 2. Students Profile
# ----------------------------------------------------
class Student(Base):
    __tablename__ = "students"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, unique=True)
    roll_number = Column(String(50), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    department = Column(String(255), nullable=False, default="School of Computing")
    semester = Column(String(100), nullable=False, default="Semester 6 (Spring 2026)")
    university = Column(String(255), default="Imperial Tech University")
    advisor_name = Column(String(255), default="Dr. Evelyn Vance")
    academic_standing = Column(String(100), default="Dean's Honor Roll")
    cgpa = Column(Float, default=3.78)
    projected_cgpa = Column(Float, default=3.84)
    credits_earned = Column(Integer, default=96)
    total_credits = Column(Integer, default=128)
    weekly_study_hours = Column(Float, default=24.5)
    class_rank_percentile = Column(Integer, default=91)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="student_profile")
    enrollments = relationship("Enrollment", back_populates="student", cascade="all, delete-orphan")
    topic_masteries = relationship("TopicMastery", back_populates="student", cascade="all, delete-orphan")
    study_sessions = relationship("StudySession", back_populates="student", cascade="all, delete-orphan")
    quiz_attempts = relationship("QuizAttempt", back_populates="student", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="student", cascade="all, delete-orphan")
    performance_history = relationship("PerformanceHistory", back_populates="student", cascade="all, delete-orphan")
    interventions = relationship("Intervention", back_populates="student", cascade="all, delete-orphan")
    lms_activities = relationship("LMSActivity", back_populates="student", cascade="all, delete-orphan")

# ----------------------------------------------------
# 3. Courses & Faculty Allocation
# ----------------------------------------------------
class Course(Base):
    __tablename__ = "courses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    course_code = Column(String(50), unique=True, index=True, nullable=False)
    course_name = Column(String(255), nullable=False)
    instructor = Column(String(255), nullable=False)
    instructor_email = Column(String(255), nullable=False)
    credits = Column(Integer, default=4)
    semester = Column(String(100), default="Spring 2026")
    faculty_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    description = Column(Text, nullable=True)

    # Relationships
    enrollments = relationship("Enrollment", back_populates="course", cascade="all, delete-orphan")
    topic_masteries = relationship("TopicMastery", back_populates="course", cascade="all, delete-orphan")
    quiz_questions = relationship("QuizQuestion", back_populates="course", cascade="all, delete-orphan")

# ----------------------------------------------------
# 4. Enrollments & Course Telemetry
# ----------------------------------------------------
class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    student_id = Column(String(36), ForeignKey("students.id"), nullable=False)
    course_id = Column(String(36), ForeignKey("courses.id"), nullable=False)
    semester = Column(String(100), default="Spring 2026")

    grade_percent = Column(Float, default=85.0)
    current_letter_grade = Column(String(10), default="B")
    projected_letter_grade = Column(String(10), default="B+")
    attendance_percent = Column(Float, default=90.0)
    assignment_rate = Column(Float, default=90.0)
    
    risk_level = Column(String(20), default="low")  # 'low' | 'moderate' | 'high' | 'critical'
    risk_reason = Column(Text, nullable=True)
    
    assignments_completed = Column(Integer, default=5)
    total_assignments = Column(Integer, default=6)
    next_evaluation = Column(String(255), nullable=True)
    evaluation_date = Column(String(100), nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    student = relationship("Student", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")
    assessments = relationship("Assessment", back_populates="enrollment", cascade="all, delete-orphan")

# ----------------------------------------------------
# 5. Assessments & Coursework
# ----------------------------------------------------
class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    enrollment_id = Column(String(36), ForeignKey("enrollments.id"), nullable=False)
    title = Column(String(255), nullable=False)
    assessment_type = Column(String(50), default="assignment")  # 'quiz' | 'assignment' | 'exam' | 'project'
    score = Column(Float, nullable=True)
    max_score = Column(Float, default=100.0)
    due_date = Column(String(100), nullable=False)
    submitted_at = Column(DateTime, nullable=True)

    enrollment = relationship("Enrollment", back_populates="assessments")

# ----------------------------------------------------
# 6. LMS Activity & Heatmap Data
# ----------------------------------------------------
class LMSActivity(Base):
    __tablename__ = "lms_activity"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    student_id = Column(String(36), ForeignKey("students.id"), nullable=False)
    activity_date = Column(String(20), nullable=False)  # 'YYYY-MM-DD'
    login_count = Column(Integer, default=1)
    minutes_active = Column(Integer, default=45)
    submissions_on_time = Column(Boolean, default=True)

    student = relationship("Student", back_populates="lms_activities")

# ----------------------------------------------------
# 7. Topic Mastery & Digital Learning Twin
# ----------------------------------------------------
class TopicMastery(Base):
    __tablename__ = "topic_mastery"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    student_id = Column(String(36), ForeignKey("students.id"), nullable=False)
    course_id = Column(String(36), ForeignKey("courses.id"), nullable=False)
    topic_name = Column(String(255), nullable=False)
    mastery_percent = Column(Float, nullable=True)  # None = NOT ASSESSED
    attempt_count = Column(Integer, default=0)
    last_assessed_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    student = relationship("Student", back_populates="topic_masteries")
    course = relationship("Course", back_populates="topic_masteries")

# ----------------------------------------------------
# 8. Adaptive Quiz Question Bank
# ----------------------------------------------------
class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    course_id = Column(String(36), ForeignKey("courses.id"), nullable=False)
    topic_name = Column(String(255), nullable=False)
    difficulty = Column(String(50), default="intermediate")  # 'beginner' | 'intermediate' | 'advanced'
    question_text = Column(Text, nullable=False)
    option_a = Column(String(500), nullable=False)
    option_b = Column(String(500), nullable=False)
    option_c = Column(String(500), nullable=False)
    option_d = Column(String(500), nullable=False)
    correct_option = Column(String(5), nullable=False)  # 'A', 'B', 'C', or 'D'
    explanation = Column(Text, nullable=False)

    course = relationship("Course", back_populates="quiz_questions")

# ----------------------------------------------------
# 9. Quiz Attempts History
# ----------------------------------------------------
class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    student_id = Column(String(36), ForeignKey("students.id"), nullable=False)
    course_id = Column(String(36), ForeignKey("courses.id"), nullable=False)
    topic_name = Column(String(255), nullable=False)
    difficulty = Column(String(50), default="intermediate")
    score_percent = Column(Float, nullable=False)
    total_questions = Column(Integer, default=3)
    correct_answers = Column(Integer, default=2)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="quiz_attempts")

# ----------------------------------------------------
# 10. Study Sessions & Rolling Planner
# ----------------------------------------------------
class StudySession(Base):
    __tablename__ = "study_sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    student_id = Column(String(36), ForeignKey("students.id"), nullable=False)
    course_code = Column(String(50), nullable=False)
    topic_name = Column(String(255), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    planned_minutes = Column(Integer, default=45)
    actual_minutes = Column(Integer, default=0)
    planned_date = Column(String(50), nullable=False)
    priority = Column(String(20), default="recommended")  # 'urgent' | 'recommended' | 'optional'
    status = Column(String(20), default="planned")  # 'planned' | 'completed' | 'rescheduled'
    completed_at = Column(DateTime, nullable=True)

    student = relationship("Student", back_populates="study_sessions")

# ----------------------------------------------------
# 11. Recommendations
# ----------------------------------------------------
class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    student_id = Column(String(36), ForeignKey("students.id"), nullable=False)
    course_code = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    reason = Column(Text, nullable=True)
    priority = Column(String(20), default="recommended")  # 'urgent' | 'recommended' | 'optional'
    impact_estimate = Column(String(255), nullable=False)
    estimated_minutes = Column(Integer, default=30)
    action_type = Column(String(50), default="study_session")  # 'practice_quiz' | 'mentor_meeting' | 'study_session'
    status = Column(String(20), default="pending")  # 'pending' | 'completed'
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="recommendations")

# ----------------------------------------------------
# 12. Longitudinal Performance History
# ----------------------------------------------------
class PerformanceHistory(Base):
    __tablename__ = "performance_history"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    student_id = Column(String(36), ForeignKey("students.id"), nullable=False)
    week = Column(String(20), nullable=False)
    student_score = Column(Float, nullable=False)
    class_average = Column(Float, nullable=False)
    study_hours = Column(Float, nullable=False)
    target_score = Column(Float, default=85.0)
    recorded_at = Column(DateTime, default=datetime.utcnow)
    formula_version = Column(String(20), default="v1.0")

    student = relationship("Student", back_populates="performance_history")

# ----------------------------------------------------
# 13. Interventions
# ----------------------------------------------------
class Intervention(Base):
    __tablename__ = "interventions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    student_id = Column(String(36), ForeignKey("students.id"), nullable=False)
    faculty_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    action = Column(String(255), nullable=False)  # 'tutoring_referral' | 'attendance_warning' | 'study_plan'
    notes = Column(Text, nullable=False)
    status = Column(String(50), default="planned")  # 'planned' | 'in_progress' | 'completed' | 'cancelled'
    follow_up_date = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    student = relationship("Student", back_populates="interventions")
    faculty = relationship("User", back_populates="assigned_interventions")

# ----------------------------------------------------
# 14. Audit Events
# ----------------------------------------------------
class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    actor_user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(String(100), nullable=True)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    actor = relationship("User", back_populates="audit_events")
