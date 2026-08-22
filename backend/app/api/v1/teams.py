from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_org
from app.models.organization import Organization, OrganizationMember
from app.models.team import Team

router = APIRouter()

@router.get("/")
def list_teams(
    org_tuple: tuple[Organization, OrganizationMember] = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    org, _ = org_tuple
    teams = db.query(Team).filter(Team.organization_id == org.id).all()
    
    res = []
    for t in teams:
        res.append({
            "id": t.id,
            "name": t.name,
            "description": t.description,
            "members_count": len(t.members),
            "health_score": 88.0,
            "pr_throughput": 24,
            "deployment_frequency": "3.8/day",
            "avg_review_time": "3.9 hrs"
        })
    return res
