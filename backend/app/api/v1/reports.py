from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_org
from app.models.organization import Organization, OrganizationMember
from app.services.ai_service import AIService
from app.schemas.ai import AIReportResponse

router = APIRouter()

@router.post("/generate", response_model=AIReportResponse)
def generate_report(
    org_tuple: tuple[Organization, OrganizationMember] = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    org, _ = org_tuple
    return AIService.generate_weekly_report(db, org.id)

@router.get("/export/csv")
def export_csv(
    org_tuple: tuple[Organization, OrganizationMember] = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    org, _ = org_tuple
    csv_data = "Date,Metric,Value,Status\n2026-08-22,Engineering Health,87%,Good\n2026-08-22,Deployment Frequency,4.2/day,Elite\n2026-08-22,Lead Time,18.5 hours,Elite\n2026-08-22,Change Failure Rate,3.2%,Elite\n"
    return Response(content=csv_data, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=devpulse-engineering-report.csv"})
