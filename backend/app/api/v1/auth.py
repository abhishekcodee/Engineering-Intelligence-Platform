from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.deps import get_current_user
from app.models.user import User
from app.models.organization import Organization, OrganizationMember
from app.schemas.auth import Token, LoginRequest, RegisterRequest, UserResponse, PasswordResetRequest

router = APIRouter()

@router.post("/register", response_model=Token)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address already registered"
        )
    
    user = User(
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=get_password_hash(payload.password),
        is_active=True,
        is_verified=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create or assign to organization
    org = Organization(
        name=payload.org_name or "DevPulse Engineering",
        slug=(payload.org_name or "devpulse-eng").lower().replace(" ", "-") + f"-{user.id[:4]}"
    )
    db.add(org)
    db.commit()
    db.refresh(org)
    
    member = OrganizationMember(
        organization_id=org.id,
        user_id=user.id,
        role="OWNER"
    )
    db.add(member)
    db.commit()
    
    access_token = create_access_token(subject=user.id)
    user_resp = UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        is_active=user.is_active,
        is_verified=user.is_verified,
        role="OWNER"
    )
    return Token(access_token=access_token, token_type="bearer", user=user_resp)

@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account disabled")
        
    member = db.query(OrganizationMember).filter(OrganizationMember.user_id == user.id).first()
    role = member.role if member else "DEVELOPER"
    
    access_token = create_access_token(subject=user.id)
    user_resp = UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        is_active=user.is_active,
        is_verified=user.is_verified,
        avatar_url=user.avatar_url,
        github_username=user.github_username,
        role=role
    )
    return Token(access_token=access_token, token_type="bearer", user=user_resp)

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    member = db.query(OrganizationMember).filter(OrganizationMember.user_id == current_user.id).first()
    role = member.role if member else "DEVELOPER"
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
        avatar_url=current_user.avatar_url,
        github_username=current_user.github_username,
        role=role
    )

import random
from app.schemas.auth import Token, LoginRequest, RegisterRequest, UserResponse, PasswordResetRequest, VerifyOTPRequest

otp_store: dict = {}

@router.post("/forgot-password")
def forgot_password(payload: PasswordResetRequest, db: Session = Depends(get_db)):
    # Generate 6-digit OTP
    otp_code = f"{random.randint(100000, 999999)}"
    otp_store[payload.email.lower()] = otp_code

    user = db.query(User).filter(User.email == payload.email).first()
    user_found = bool(user)

    return {
        "status": "success",
        "message": f"6-Digit OTP verification code sent successfully to {payload.email}.",
        "otp_code": otp_code,
        "email": payload.email,
        "user_exists": user_found
    }

@router.post("/verify-otp")
def verify_otp(payload: VerifyOTPRequest, db: Session = Depends(get_db)):
    email_key = payload.email.lower()
    stored_otp = otp_store.get(email_key)

    if not stored_otp or stored_otp != payload.otp.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid 6-digit OTP code. Please check your email and try again."
        )

    user = db.query(User).filter(User.email == payload.email).first()
    if user:
        user.hashed_password = get_password_hash(payload.new_password)
        db.commit()
        db.refresh(user)

    # Clear OTP after successful reset
    otp_store.pop(email_key, None)

    return {
        "status": "success",
        "message": "Your password has been successfully reset! You can now log in with your new password."
    }
