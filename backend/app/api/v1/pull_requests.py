from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_org
from app.models.organization import Organization, OrganizationMember
from app.models.repository import Repository
from app.models.activity import PullRequest, PullRequestReview, PullRequestComment
from app.schemas.pull_request import PullRequestResponse, PullRequestDetailResponse
from app.services.ai_service import AIService

router = APIRouter()

@router.get("/", response_model=List[PullRequestResponse])
def list_pull_requests(
    status: Optional[str] = Query(None),
    repository_id: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None),
    org_tuple: tuple[Organization, OrganizationMember] = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    org, _ = org_tuple
    query = db.query(PullRequest).join(PullRequest.repository).filter(Repository.organization_id == org.id)
    
    if status:
        query = query.filter(PullRequest.status == status)
    if repository_id:
        query = query.filter(PullRequest.repository_id == repository_id)
    if risk_level:
        query = query.filter(PullRequest.risk_level == risk_level)
        
    prs = query.order_by(PullRequest.created_at.desc()).all()
    
    res = []
    for p in prs:
        res.append(PullRequestResponse(
            id=p.id,
            repository_id=p.repository_id,
            repository_name=p.repository.name if p.repository else "Unknown",
            number=p.number,
            title=p.title,
            body=p.body,
            status=p.status,
            author_username=p.author_username,
            created_at=p.created_at,
            merged_at=p.merged_at,
            closed_at=p.closed_at,
            review_time_hours=p.review_time_hours,
            cycle_time_hours=p.cycle_time_hours,
            additions=p.additions,
            deletions=p.deletions,
            files_changed=p.files_changed,
            risk_level=p.risk_level,
            risk_factors=p.risk_factors or [],
            ai_recommendations=p.ai_recommendations or [],
            reviewer_username=p.reviewer_username
        ))
    return res

@router.get("/{pr_id}", response_model=PullRequestDetailResponse)
def get_pull_request_detail(
    pr_id: str,
    org_tuple: tuple[Organization, OrganizationMember] = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    org, _ = org_tuple
    pr = db.query(PullRequest).join(PullRequest.repository).filter(
        PullRequest.id == pr_id,
        Repository.organization_id == org.id
    ).first()
    
    if not pr:
        raise HTTPException(status_code=404, detail="Pull Request not found")
        
    reviews = db.query(PullRequestReview).filter(PullRequestReview.pull_request_id == pr.id).all()
    comments = db.query(PullRequestComment).filter(PullRequestComment.pull_request_id == pr.id).all()
    
    reviews_data = [
        {"id": r.id, "reviewer": r.reviewer_username, "state": r.state, "submitted_at": r.submitted_at.isoformat(), "time_hours": r.time_to_review_hours}
        for r in reviews
    ]
    comments_data = [
        {"id": c.id, "author": "Reviewer", "body": c.body, "created_at": c.created_at.isoformat()}
        for c in comments
    ]
    
    # Calculate live AI risk analysis
    ai_risk = AIService.analyze_pr_risk(pr.title, pr.body or "", pr.additions, pr.deletions, pr.files_changed)
    
    return PullRequestDetailResponse(
        id=pr.id,
        repository_id=pr.repository_id,
        repository_name=pr.repository.name if pr.repository else "Unknown",
        number=pr.number,
        title=pr.title,
        body=pr.body,
        status=pr.status,
        author_username=pr.author_username,
        created_at=pr.created_at,
        merged_at=pr.merged_at,
        closed_at=pr.closed_at,
        review_time_hours=pr.review_time_hours,
        cycle_time_hours=pr.cycle_time_hours,
        additions=pr.additions,
        deletions=pr.deletions,
        files_changed=pr.files_changed,
        risk_level=ai_risk["risk_level"],
        risk_factors=ai_risk["risk_factors"],
        ai_recommendations=ai_risk["recommendations"],
        reviewer_username=pr.reviewer_username,
        reviews=reviews_data,
        comments=comments_data,
        ci_status="passing",
        deployment_impact="Low impact on staging & production pipelines"
    )
