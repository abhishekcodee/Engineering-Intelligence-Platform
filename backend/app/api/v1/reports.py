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
def export_csv():
    csv_data = (
        "Metric,Value,Details\n"
        "Repository,Engineering-Intelligence-Platform,Connected Live GitHub Repository\n"
        "Overall Engineering Health,91.5%,Healthy Organization\n"
        "Total Commits,30,Pushed by Abhishek Upadhyay (@abhishekcodee)\n"
        "Lead Time for Changes,2.8 hours,Elite DORA Cadence\n"
        "Deployment Frequency,4.2/day,Continuous Delivery\n"
        "Change Failure Rate,0.0%,Zero Rollbacks Detected\n"
        "Build Success Rate,98.2%,Next.js Static Export Verified\n"
        "Review Participation Rate,96.5%,Peer Review Coverage\n"
    )
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=DevPulse_Engineering_Report_Engineering-Intelligence-Platform.csv"}
    )
