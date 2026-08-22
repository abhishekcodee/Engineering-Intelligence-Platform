from sqlalchemy import Column, String, ForeignKey, Text, JSON, DateTime, Date
from app.db.base_class import Base, TimestampMixin

class AIInsight(Base, TimestampMixin):
    __tablename__ = "ai_insights"
    
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    category = Column(String(64), nullable=False)  # pr_bottleneck, review_delay, pr_size, context_switching, delivery_consistency
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    metrics_data = Column(JSON, nullable=True)
    generated_at = Column(DateTime, nullable=False)

class AIReport(Base, TimestampMixin):
    __tablename__ = "ai_reports"
    
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    executive_summary = Column(Text, nullable=False)
    health_analysis = Column(Text, nullable=False)
    delivery_analysis = Column(Text, nullable=False)
    pr_analysis = Column(Text, nullable=False)
    deployment_analysis = Column(Text, nullable=False)
    incident_analysis = Column(Text, nullable=False)
    recommendations = Column(JSON, nullable=False)
    generated_at = Column(DateTime, nullable=False)
