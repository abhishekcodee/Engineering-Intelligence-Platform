from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class IncidentCreate(BaseModel):
    title: str
    severity: str = "P2"
    repository_id: Optional[str] = None
    deployment_id: Optional[str] = None
    assigned_team_id: Optional[str] = None
    root_cause: Optional[str] = None

class IncidentResponse(BaseModel):
    id: str
    organization_id: str
    repository_id: Optional[str] = None
    repository_name: Optional[str] = None
    deployment_id: Optional[str] = None
    assigned_team_id: Optional[str] = None
    title: str
    severity: str
    status: str
    root_cause: Optional[str] = None
    resolution: Optional[str] = None
    created_at: datetime
    resolved_at: Optional[datetime] = None
    mttr_minutes: float

    class Config:
        from_attributes = True
