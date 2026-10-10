from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from backend.app.db.database import get_db
from backend.app.db.models import Student
from backend.app.api.deps import get_current_student
from backend.app.services.learning_twin import LearningTwinService
from backend.app.schemas.models import TopicMasteryItem

router = APIRouter()

@router.get("", response_model=List[TopicMasteryItem])
def get_my_learning_twin(
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Returns the student's Digital Learning Twin topic-level profile.
    Identifies priority learning gaps (<50), topics needing practice (50-69),
    provisional mastery (>=70), and unassessed competencies.
    """
    return LearningTwinService.get_student_twin_profile(db=db, student_id=student.id)
