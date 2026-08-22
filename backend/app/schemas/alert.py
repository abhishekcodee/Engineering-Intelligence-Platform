from typing import Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

class AlertResponse(BaseModel):
    id: str
    organization_id: str
    type: str
    title: str
    message: str
    severity: str
    status: str
    threshold_config: Optional[Dict[str, Any]] = None
    created_at: datetime
    acknowledged_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class NotificationResponse(BaseModel):
    id: str
    type: str
    title: str
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
