from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

class RepositoryResponse(BaseModel):
    id: str
    organization_id: str
    project_id: Optional[str] = None
    name: str
    full_name: str
    description: Optional[str] = None
    url: Optional[str] = None
    primary_language: str
    stars_count: int
    open_issues_count: int
    open_prs_count: int
    build_health: str
    engineering_health_score: float
    is_private: bool
    created_at: datetime

    class Config:
        from_attributes = True

class RepositoryDetailResponse(RepositoryResponse):
    total_commits: int
    total_deployments: int
    recent_prs: List[dict]
    recent_deployments: List[dict]
