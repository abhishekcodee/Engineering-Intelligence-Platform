from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_org
from app.models.organization import Organization, OrganizationMember
from app.services.health_score import HealthScoreEngine
from app.services.dora_calculator import DORACalculator
from app.schemas.metrics import EngineeringHealthOverview, DORAMetricsResponse

router = APIRouter()

@router.get("/health", response_model=EngineeringHealthOverview)
def get_health_overview(
    org_tuple: tuple[Organization, OrganizationMember] = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    org, _ = org_tuple
    health = HealthScoreEngine.calculate_health(db, org.id)
    return health

@router.get("/dora", response_model=DORAMetricsResponse)
def get_dora_metrics(
    days: int = Query(30),
    org_tuple: tuple[Organization, OrganizationMember] = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    org, _ = org_tuple
    dora = DORACalculator.calculate_metrics(db, org.id, days=days)
    return dora

@router.get("/detailed")
def get_detailed_health(
    org_tuple: tuple[Organization, OrganizationMember] = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    org, _ = org_tuple
    dora = DORACalculator.calculate_metrics(db, org.id, days=30)
    
    return {
        "delivery": {
            "deployment_frequency": f"{dora['deployment_frequency']}/day",
            "lead_time": f"{dora['lead_time_for_changes_hours']} hours",
            "release_frequency": "Every 4.8 hours",
            "score": 92.0
        },
        "reliability": {
            "change_failure_rate": f"{dora['change_failure_rate_percent']}%",
            "rollback_rate": "0.4%",
            "incident_frequency": "2 / month",
            "mttr": f"{dora['mean_time_to_recovery_hours']} hours",
            "score": 94.0
        },
        "collaboration": {
            "pr_review_time": "4.2 hours",
            "review_participation": "91.5%",
            "pr_cycle_time": "22.0 hours",
            "comment_activity": "3.8 comments / PR",
            "score": 84.0
        },
        "code_activity": {
            "commit_frequency": "48 commits / week",
            "lines_changed": "14,820 / week",
            "repository_activity": "4 active repos",
            "branch_activity": "12 active branches",
            "score": 88.0
        }
    }
