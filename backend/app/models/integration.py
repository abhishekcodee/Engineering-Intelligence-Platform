from sqlalchemy import Column, String, ForeignKey, Text, JSON, DateTime
from sqlalchemy.orm import relationship
from app.db.base_class import Base, TimestampMixin

class Integration(Base, TimestampMixin):
    __tablename__ = "integrations"
    
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    provider = Column(String(64), nullable=False)  # github, jira, slack, gitlab, linear, jenkins
    status = Column(String(32), default="connected")  # connected, disconnected, error
    sync_status = Column(String(32), default="idle")  # idle, syncing, synced, failed
    last_synced_at = Column(DateTime, nullable=True)
    config = Column(JSON, nullable=True)
    
    organization = relationship("Organization", back_populates="integrations")
    credentials = relationship("IntegrationCredentials", back_populates="integration", uselist=False, cascade="all, delete-orphan")

class IntegrationCredentials(Base, TimestampMixin):
    __tablename__ = "integration_credentials"
    
    integration_id = Column(String(36), ForeignKey("integrations.id", ondelete="CASCADE"), nullable=False)
    access_token = Column(Text, nullable=False)
    refresh_token = Column(Text, nullable=True)
    token_expires_at = Column(DateTime, nullable=True)
    
    integration = relationship("Integration", back_populates="credentials")
