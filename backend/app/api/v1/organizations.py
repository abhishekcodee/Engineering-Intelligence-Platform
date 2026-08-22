from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_user, get_current_org, require_role
from app.models.user import User
from app.models.organization import Organization, OrganizationMember
from app.schemas.organization import OrganizationResponse, MemberResponse, InviteMemberRequest

router = APIRouter()

@router.get("/me", response_model=OrganizationResponse)
def get_my_org(org_tuple: tuple[Organization, OrganizationMember] = Depends(get_current_org)):
    org, _ = org_tuple
    return org

@router.get("/members", response_model=List[MemberResponse])
def list_members(
    org_tuple: tuple[Organization, OrganizationMember] = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    org, _ = org_tuple
    members = db.query(OrganizationMember).filter(OrganizationMember.organization_id == org.id).all()
    res = []
    for m in members:
        user = db.query(User).filter(User.id == m.user_id).first()
        if user:
            res.append(MemberResponse(
                id=m.id,
                user_id=user.id,
                email=user.email,
                full_name=user.full_name,
                role=m.role,
                avatar_url=user.avatar_url,
                joined_at=m.created_at
            ))
    return res

@router.post("/invite", response_model=MemberResponse)
def invite_member(
    payload: InviteMemberRequest,
    org_tuple: tuple[Organization, OrganizationMember] = Depends(require_role(["OWNER", "ENGINEERING_MANAGER"])),
    db: Session = Depends(get_db)
):
    org, _ = org_tuple
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        user = User(
            email=payload.email,
            full_name=payload.email.split("@")[0].capitalize(),
            hashed_password="invited-user-password-placeholder",
            is_active=True,
            is_verified=False
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
    existing_m = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org.id,
        OrganizationMember.user_id == user.id
    ).first()
    
    if existing_m:
        existing_m.role = payload.role
        db.commit()
        db.refresh(existing_m)
        m = existing_m
    else:
        m = OrganizationMember(
            organization_id=org.id,
            user_id=user.id,
            role=payload.role
        )
        db.add(m)
        db.commit()
        db.refresh(m)
        
    return MemberResponse(
        id=m.id,
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=m.role,
        avatar_url=user.avatar_url,
        joined_at=m.created_at
    )
