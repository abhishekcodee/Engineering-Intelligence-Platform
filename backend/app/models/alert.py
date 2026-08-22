from sqlalchemy import Column, String, ForeignKey, Text, Boolean, DateTime, JSON
from sqlalchemy.orm import relationship
from app.db.base_class import Base, TimestampMixin

class Alert(Base, TimestampMixin):
    __tablename__ = "alerts"
    
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(64), nullable=False)  # PR_BOTTLENECK, CI_HEALTH, DEPLOYMENT_RISK, SPRINT_RISK
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(String(32), default="warning")  # info, warning, critical
    status = Column(String(32), default="active")  # active, acknowledged, resolved
    threshold_config = Column(JSON, nullable=True)
    acknowledged_at = Column(DateTime, nullable=True)
    
    organization = relationship("Organization", back_populates="alerts")

class Notification(Base, TimestampMixin):
    __tablename__ = "notifications"
    
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(64), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
