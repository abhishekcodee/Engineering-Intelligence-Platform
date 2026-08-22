from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_org
from app.models.organization import Organization, OrganizationMember
from app.models.sprint import Sprint
from app.schemas.sprint import SprintResponse

router = APIRouter()

@router.get("/", response_model=List[SprintResponse])
def list_sprints(
    org_tuple: tuple[Organization, OrganizationMember] = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    org, _ = org_tuple
    sprints = db.query(Sprint).filter(Sprint.organization_id == org.id).order_by(Sprint.start_date.desc()).all()
    
    res = []
    for s in sprints:
        res.append(SprintResponse(
            id=s.id,
            organization_id=s.organization_id,
            team_id=s.team_id,
            team_name=s.team.name if s.team else "Platform",
            name=s.name,
            goal=s.goal,
            start_date=s.start_date,
            end_date=s.end_date,
            planned_issues=s.planned_issues,
            completed_issues=s.completed_issues,
            velocity=s.velocity,
            completion_percentage=s.completion_percentage,
            status=s.status,
            risk_level=s.risk_level,
            ai_predicted_completion=s.ai_predicted_completion,
            ai_prediction_reason=s.ai_prediction_reason
        ))
    return res
