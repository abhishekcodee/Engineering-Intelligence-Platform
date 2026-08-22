from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_org
from app.models.organization import Organization, OrganizationMember
from app.models.repository import Repository
from app.models.activity import Commit, PullRequest
from app.models.deployment import Deployment
from app.schemas.repository import RepositoryResponse, RepositoryDetailResponse

router = APIRouter()

@router.get("/", response_model=List[RepositoryResponse])
def list_repositories(
    org_tuple: tuple[Organization, OrganizationMember] = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    org, _ = org_tuple
    repos = db.query(Repository).filter(Repository.organization_id == org.id).order_by(Repository.name).all()
    return repos

@router.get("/{repo_id}", response_model=RepositoryDetailResponse)
def get_repository_detail(
    repo_id: str,
    org_tuple: tuple[Organization, OrganizationMember] = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    org, _ = org_tuple
    repo = db.query(Repository).filter(
        Repository.id == repo_id,
        Repository.organization_id == org.id
    ).first()
    
    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found")
        
    total_commits = db.query(Commit).filter(Commit.repository_id == repo.id).count()
    total_deployments = db.query(Deployment).filter(Deployment.repository_id == repo.id).count()
    
    recent_prs = db.query(PullRequest).filter(PullRequest.repository_id == repo.id).order_by(PullRequest.created_at.desc()).limit(5).all()
    recent_deploys = db.query(Deployment).filter(Deployment.repository_id == repo.id).order_by(Deployment.deployed_at.desc()).limit(5).all()
    
    prs_data = [
        {"id": p.id, "number": p.number, "title": p.title, "status": p.status, "author": p.author_username, "risk_level": p.risk_level}
        for p in recent_prs
    ]
    deploys_data = [
        {"id": d.id, "environment": d.environment, "status": d.status, "deployed_at": d.deployed_at.isoformat(), "sha": d.sha[:7]}
        for d in recent_deploys
    ]
    
    return RepositoryDetailResponse(
        id=repo.id,
        organization_id=repo.organization_id,
        project_id=repo.project_id,
        name=repo.name,
        full_name=repo.full_name,
        description=repo.description,
        url=repo.url,
        primary_language=repo.primary_language,
        stars_count=repo.stars_count,
        open_issues_count=repo.open_issues_count,
        open_prs_count=repo.open_prs_count,
        build_health=repo.build_health,
        engineering_health_score=repo.engineering_health_score,
        is_private=repo.is_private,
        created_at=repo.created_at,
        total_commits=total_commits,
        total_deployments=total_deployments,
        recent_prs=prs_data,
        recent_deployments=deploys_data
    )
