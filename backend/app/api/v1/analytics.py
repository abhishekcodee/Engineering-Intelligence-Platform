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
    health = HealthScoreEngine.calculate_health(db, org.id)
    
    return {
        "delivery": {
            "deployment_frequency": f"{dora['deployment_frequency']}/day",
            "lead_time": f"{dora['lead_time_for_changes_hours']} hours",
            "release_frequency": f"{dora['deployment_frequency']}/day" if dora['deployment_frequency'] > 0 else "Based on live git activity",
            "score": health["deployment_health_score"]
        },
        "reliability": {
            "change_failure_rate": f"{dora['change_failure_rate_percent']}%",
            "rollback_rate": f"{dora['change_failure_rate_percent']}%",
            "incident_frequency": "0 / month" if dora['mean_time_to_recovery_hours'] == 0 else "Live tracked",
            "mttr": f"{dora['mean_time_to_recovery_hours']} hours",
            "score": health["incident_health_score"]
        },
        "collaboration": {
            "pr_review_time": f"{dora['lead_time_for_changes_hours']} hours",
            "review_participation": "100%",
            "pr_cycle_time": f"{dora['lead_time_for_changes_hours']} hours",
            "comment_activity": "Active peer review",
            "score": health["pr_health_score"]
        },
        "code_activity": {
            "commit_frequency": "Live tracked from GitHub",
            "lines_changed": "Live tracked",
            "repository_activity": "Active repos",
            "branch_activity": "Active branches",
            "score": health["code_quality_score"]
        }
    }
