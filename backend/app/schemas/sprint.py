from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class SprintResponse(BaseModel):
    id: str
    organization_id: str
    team_id: str
    team_name: Optional[str] = None
    name: str
    goal: Optional[str] = None
    start_date: datetime
    end_date: datetime
    planned_issues: int
    completed_issues: int
    velocity: float
    completion_percentage: float
    status: str
    risk_level: str
    ai_predicted_completion: float
    ai_prediction_reason: Optional[str] = None

    class Config:
        from_attributes = True
