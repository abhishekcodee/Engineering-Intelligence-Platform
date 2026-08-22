from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_user, get_current_org
from app.models.user import User
from app.models.organization import Organization, OrganizationMember
from app.models.alert import Notification
from app.schemas.alert import NotificationResponse

router = APIRouter()

@router.get("/", response_model=List[NotificationResponse])
def list_notifications(
    current_user: User = Depends(get_current_user),
    org_tuple: tuple[Organization, OrganizationMember] = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    org, _ = org_tuple
    notifications = db.query(Notification).filter(
        Notification.organization_id == org.id,
        Notification.user_id == current_user.id
    ).order_by(Notification.created_at.desc()).all()
    return notifications

@router.post("/read-all")
def mark_all_read(
    current_user: User = Depends(get_current_user),
    org_tuple: tuple[Organization, OrganizationMember] = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    org, _ = org_tuple
    db.query(Notification).filter(
        Notification.organization_id == org.id,
        Notification.user_id == current_user.id
    ).update({"is_read": True})
    db.commit()
    return {"message": "All notifications marked as read"}
