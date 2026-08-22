from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_org
from app.models.organization import Organization, OrganizationMember
from app.models.repository import Repository
from app.models.deployment import Deployment
from app.schemas.deployment import DeploymentResponse

router = APIRouter()

@router.get("/", response_model=List[DeploymentResponse])
def list_deployments(
    org_tuple: tuple[Organization, OrganizationMember] = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    org, _ = org_tuple
    deploys = db.query(Deployment).join(Deployment.repository).filter(Repository.organization_id == org.id).order_by(Deployment.deployed_at.desc()).all()
    
    res = []
    for d in deploys:
        events = [
            {"id": e.id, "event_type": e.event_type, "status": e.status, "timestamp": e.timestamp.isoformat()}
            for e in d.events
        ]
        res.append(DeploymentResponse(
            id=d.id,
            repository_id=d.repository_id,
            repository_name=d.repository.name if d.repository else "Unknown",
            environment=d.environment,
            status=d.status,
            sha=d.sha,
            commit_message=d.commit_message,
            deployed_by=d.deployed_by,
            duration_seconds=d.duration_seconds,
            failure_reason=d.failure_reason,
            deployed_at=d.deployed_at,
            events=events
        ))
    return res
