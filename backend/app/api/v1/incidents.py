from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_org
from app.models.organization import Organization, OrganizationMember
from app.models.incident import Incident
from app.schemas.incident import IncidentResponse, IncidentCreate

router = APIRouter()

@router.get("/", response_model=List[IncidentResponse])
def list_incidents(
    org_tuple: tuple[Organization, OrganizationMember] = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    org, _ = org_tuple
    incidents = db.query(Incident).filter(Incident.organization_id == org.id).order_by(Incident.created_at.desc()).all()
    
    res = []
    for inc in incidents:
        res.append(IncidentResponse(
            id=inc.id,
            organization_id=inc.organization_id,
            repository_id=inc.repository_id,
            repository_name=inc.repository.name if inc.repository else "payments-api",
            deployment_id=inc.deployment_id,
            assigned_team_id=inc.assigned_team_id,
            title=inc.title,
            severity=inc.severity,
            status=inc.status,
            root_cause=inc.root_cause,
            resolution=inc.resolution,
            created_at=inc.created_at,
            resolved_at=inc.resolved_at,
            mttr_minutes=inc.mttr_minutes
        ))
    return res

@router.post("/", response_model=IncidentResponse)
def create_incident(
    payload: IncidentCreate,
    org_tuple: tuple[Organization, OrganizationMember] = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    org, _ = org_tuple
    inc = Incident(
        organization_id=org.id,
        repository_id=payload.repository_id,
        deployment_id=payload.deployment_id,
        assigned_team_id=payload.assigned_team_id,
        title=payload.title,
        severity=payload.severity,
        status="open",
        root_cause=payload.root_cause
    )
    db.add(inc)
    db.commit()
    db.refresh(inc)
    
    return IncidentResponse(
        id=inc.id,
        organization_id=inc.organization_id,
        repository_id=inc.repository_id,
        repository_name=inc.repository.name if inc.repository else "Unknown",
        deployment_id=inc.deployment_id,
        assigned_team_id=inc.assigned_team_id,
        title=inc.title,
        severity=inc.severity,
        status=inc.status,
        root_cause=inc.root_cause,
        resolution=inc.resolution,
        created_at=inc.created_at,
        resolved_at=inc.resolved_at,
        mttr_minutes=inc.mttr_minutes
    )
