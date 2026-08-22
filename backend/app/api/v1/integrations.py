from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_org, require_role
from app.models.organization import Organization, OrganizationMember
from app.models.integration import Integration
from app.schemas.integration import IntegrationResponse, GitHubConnectRequest, GitHubSyncRequest, GitHubSyncResponse
from app.services.github_service import GitHubService

router = APIRouter()

@router.get("/", response_model=List[IntegrationResponse])
def list_integrations(
    org_tuple: tuple[Organization, OrganizationMember] = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    org, _ = org_tuple
    integrations = db.query(Integration).filter(Integration.organization_id == org.id).all()
    
    providers = ["github", "jira", "slack", "gitlab", "linear", "jenkins", "github-actions"]
    existing_map = {i.provider: i for i in integrations}
    
    res = []
    for p in providers:
        if p in existing_map:
            res.append(existing_map[p])
        else:
            status = "connected" if p == "github" else "not_connected"
            res.append(IntegrationResponse(
                id=f"integration-{p}",
                organization_id=org.id,
                provider=p,
                status=status,
                sync_status="idle",
                last_synced_at=None,
                config={"description": f"{p.capitalize()} Integration"}
            ))
    return res

@router.post("/github/connect", response_model=GitHubSyncResponse)
def connect_github(
    payload: GitHubConnectRequest = Body(...),
    org_tuple: tuple[Organization, OrganizationMember] = Depends(require_role(["OWNER", "ENGINEERING_MANAGER"])),
    db: Session = Depends(get_db)
):
    org, _ = org_tuple
    try:
        res = GitHubService.sync_organization_github(
            db=db,
            organization_id=org.id,
            access_token=payload.access_token,
            repo_slug=payload.repo_slug
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/github/sync", response_model=GitHubSyncResponse)
def sync_github(
    payload: Optional[GitHubSyncRequest] = None,
    org_tuple: tuple[Organization, OrganizationMember] = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    org, _ = org_tuple
    access_token = payload.access_token if payload else None
    repo_slug = payload.repo_slug if payload else None
    
    try:
        res = GitHubService.sync_organization_github(
            db=db,
            organization_id=org.id,
            access_token=access_token,
            repo_slug=repo_slug
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
