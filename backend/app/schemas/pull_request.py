from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime

class PullRequestResponse(BaseModel):
    id: str
    repository_id: str
    repository_name: Optional[str] = None
    number: int
    title: str
    body: Optional[str] = None
    status: str  # open, merged, closed
    author_username: str
    created_at: datetime
    merged_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None
    review_time_hours: float
    cycle_time_hours: float
    additions: int
    deletions: int
    files_changed: int
    risk_level: str  # Low, Medium, High, Critical
    risk_factors: Optional[List[str]] = None
    ai_recommendations: Optional[List[str]] = None
    reviewer_username: Optional[str] = None

    class Config:
        from_attributes = True

class PullRequestDetailResponse(PullRequestResponse):
    reviews: List[Dict[str, Any]]
    comments: List[Dict[str, Any]]
    ci_status: str
    deployment_impact: str
