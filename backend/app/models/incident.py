from sqlalchemy import Column, String, ForeignKey, Text, Integer, Float, DateTime
from sqlalchemy.orm import relationship
from app.db.base_class import Base, TimestampMixin

class Incident(Base, TimestampMixin):
    __tablename__ = "incidents"
    
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    repository_id = Column(String(36), ForeignKey("repositories.id", ondelete="SET NULL"), nullable=True)
    deployment_id = Column(String(36), ForeignKey("deployments.id", ondelete="SET NULL"), nullable=True)
    assigned_team_id = Column(String(36), ForeignKey("teams.id", ondelete="SET NULL"), nullable=True)
    
    title = Column(String(255), nullable=False)
    severity = Column(String(16), default="P2")  # P1, P2, P3, P4
    status = Column(String(32), default="open")  # open, investigating, resolved
    root_cause = Column(Text, nullable=True)
    resolution = Column(Text, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    mttr_minutes = Column(Float, default=0.0)
    
    organization = relationship("Organization", back_populates="incidents")
    repository = relationship("Repository", back_populates="incidents")
    deployment = relationship("Deployment", back_populates="incidents")
