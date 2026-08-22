from sqlalchemy import Column, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base, TimestampMixin

class Team(Base, TimestampMixin):
    __tablename__ = "teams"
    
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    organization = relationship("Organization", back_populates="teams")
    members = relationship("TeamMember", back_populates="team", cascade="all, delete-orphan")
    sprints = relationship("Sprint", back_populates="team")

class TeamMember(Base, TimestampMixin):
    __tablename__ = "team_members"
    
    team_id = Column(String(36), ForeignKey("teams.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(64), default="MEMBER")
    
    team = relationship("Team", back_populates="members")
    user = relationship("User", back_populates="team_memberships")
