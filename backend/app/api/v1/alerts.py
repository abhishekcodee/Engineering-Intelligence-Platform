from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_org
from app.models.organization import Organization, OrganizationMember
from app.models.alert import Alert
from app.schemas.alert import AlertResponse

router = APIRouter()

@router.get("/", response_model=List[AlertResponse])
def list_alerts(
    org_tuple: tuple[Organization, OrganizationMember] = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    org, _ = org_tuple
    alerts = db.query(Alert).filter(Alert.organization_id == org.id).order_by(Alert.created_at.desc()).all()
    return alerts

@router.post("/acknowledge/{alert_id}", response_model=AlertResponse)
def acknowledge_alert(
    alert_id: str,
    org_tuple: tuple[Organization, OrganizationMember] = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    org, _ = org_tuple
    alert = db.query(Alert).filter(
        Alert.id == alert_id,
        Alert.organization_id == org.id
    ).first()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    alert.status = "acknowledged"
    alert.acknowledged_at = datetime.utcnow()
    db.commit()
    db.refresh(alert)
    return alert
