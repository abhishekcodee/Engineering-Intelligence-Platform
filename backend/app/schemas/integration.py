from typing import Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

class IntegrationResponse(BaseModel):
    id: str
    organization_id: str
    provider: str
    status: str
    sync_status: str
    last_synced_at: Optional[datetime] = None
    config: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class GitHubConnectRequest(BaseModel):
    code: Optional[str] = None
    access_token: Optional[str] = None
    repo_slug: Optional[str] = "abhishekcodee/Engineering-Intelligence-Platform"

class GitHubSyncRequest(BaseModel):
    access_token: Optional[str] = None
    repo_slug: Optional[str] = None

class GitHubSyncResponse(BaseModel):
    status: str
    message: str
    repository: Optional[str] = None
    repos_synced: int
    prs_synced: int
    commits_synced: int
