from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class DeveloperProfileResponse(BaseModel):
    user_id: str
    full_name: str
    email: str
    github_username: Optional[str] = None
    avatar_url: Optional[str] = None
    role: str
    team_name: Optional[str] = "Platform"
    commits_count: int
    prs_created_count: int
    prs_reviewed_count: int
    avg_pr_cycle_time_hours: float
    avg_review_time_hours: float
    lines_added: int
    lines_deleted: int
    insights: List[str]
    contribution_history: List[Dict[str, Any]]
