from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_org
from app.models.organization import Organization, OrganizationMember
from app.models.ai import AIInsight, AIReport
from app.schemas.ai import AIAssistantQuery, AIAssistantResponse, AIInsightResponse, AIReportResponse
from app.services.ai_service import AIService

router = APIRouter()

@router.get("/insights", response_model=List[AIInsightResponse])
def list_insights(
    org_tuple: tuple[Organization, OrganizationMember] = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    org, _ = org_tuple
    insights = db.query(AIInsight).filter(AIInsight.organization_id == org.id).order_by(AIInsight.generated_at.desc()).all()
    return insights

@router.post("/query", response_model=AIAssistantResponse)
def query_assistant(
    payload: AIAssistantQuery,
    org_tuple: tuple[Organization, OrganizationMember] = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    org, _ = org_tuple
    response = AIService.answer_assistant_query(db, org.id, payload.prompt)
    return response

@router.get("/latest-report", response_model=AIReportResponse)
def get_latest_report(
    org_tuple: tuple[Organization, OrganizationMember] = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    org, _ = org_tuple
    report = AIService.generate_weekly_report(db, org.id)
    return report
