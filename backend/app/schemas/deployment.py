from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime

class DeploymentResponse(BaseModel):
    id: str
    repository_id: str
    repository_name: Optional[str] = None
    environment: str
    status: str
    sha: str
    commit_message: Optional[str] = None
    deployed_by: str
    duration_seconds: int
    failure_reason: Optional[str] = None
    deployed_at: datetime
    events: List[Dict[str, Any]] = []

    class Config:
        from_attributes = True
