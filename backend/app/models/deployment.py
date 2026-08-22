from sqlalchemy import Column, String, ForeignKey, Text, Integer, DateTime
from sqlalchemy.orm import relationship
from app.db.base_class import Base, TimestampMixin

class Deployment(Base, TimestampMixin):
    __tablename__ = "deployments"
    
    repository_id = Column(String(36), ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False)
    environment = Column(String(64), default="production")  # production, staging, dev
    status = Column(String(32), default="success")  # success, failure, rollback, in_progress
    sha = Column(String(64), nullable=False)
    commit_message = Column(Text, nullable=True)
    deployed_by = Column(String(255), default="Automated CI/CD")
    duration_seconds = Column(Integer, default=0)
    failure_reason = Column(Text, nullable=True)
    deployed_at = Column(DateTime, nullable=False)
    
    repository = relationship("Repository", back_populates="deployments")
    events = relationship("DeploymentEvent", back_populates="deployment", cascade="all, delete-orphan")
    incidents = relationship("Incident", back_populates="deployment")

class DeploymentEvent(Base, TimestampMixin):
    __tablename__ = "deployment_events"
    
    deployment_id = Column(String(36), ForeignKey("deployments.id", ondelete="CASCADE"), nullable=False)
    event_type = Column(String(64), nullable=False)  # build, test, deploy, verify, rollback
    status = Column(String(32), nullable=False)  # passed, failed, pending
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, nullable=False)
    
    deployment = relationship("Deployment", back_populates="events")
