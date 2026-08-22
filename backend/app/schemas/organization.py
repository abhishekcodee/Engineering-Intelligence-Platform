from typing import Optional, List
from pydantic import BaseModel, EmailStr
from datetime import datetime

class OrganizationCreate(BaseModel):
    name: str
    slug: Optional[str] = None
    timezone: Optional[str] = "UTC"

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None
    timezone: Optional[str] = None

class OrganizationResponse(BaseModel):
    id: str
    name: str
    slug: str
    logo_url: Optional[str] = None
    timezone: str
    created_at: datetime

    class Config:
        from_attributes = True

class MemberResponse(BaseModel):
    id: str
    user_id: str
    email: str
    full_name: str
    role: str
    avatar_url: Optional[str] = None
    joined_at: datetime

class InviteMemberRequest(BaseModel):
    email: EmailStr
    role: str = "DEVELOPER"
