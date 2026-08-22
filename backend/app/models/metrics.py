from sqlalchemy import Column, String, ForeignKey, Float, Integer, Date
from app.db.base_class import Base, TimestampMixin

class EngineeringMetric(Base, TimestampMixin):
    __tablename__ = "engineering_metrics"
    
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    team_id = Column(String(36), ForeignKey("teams.id", ondelete="SET NULL"), nullable=True)
    repository_id = Column(String(36), ForeignKey("repositories.id", ondelete="SET NULL"), nullable=True)
    metric_date = Column(Date, nullable=False, index=True)
    
    overall_health_score = Column(Float, default=87.0)
    sprint_health_score = Column(Float, default=90.0)
    deployment_health_score = Column(Float, default=92.0)
    code_quality_score = Column(Float, default=88.0)
    pr_health_score = Column(Float, default=82.0)
    incident_health_score = Column(Float, default=85.0)
    
    deployment_frequency = Column(Float, default=4.2)  # deploys per day
    lead_time_hours = Column(Float, default=18.5)
    change_failure_rate = Column(Float, default=3.2)  # percentage
    mttr_hours = Column(Float, default=1.4)
    pr_cycle_time_hours = Column(Float, default=22.0)
    pr_review_time_hours = Column(Float, default=4.2)
    build_success_rate = Column(Float, default=94.5)
    bug_resolution_hours = Column(Float, default=12.0)

class DeveloperMetric(Base, TimestampMixin):
    __tablename__ = "developer_metrics"
    
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    
    commits_count = Column(Integer, default=0)
    prs_created_count = Column(Integer, default=0)
    prs_reviewed_count = Column(Integer, default=0)
    avg_pr_cycle_time_hours = Column(Float, default=0.0)
    avg_review_time_hours = Column(Float, default=0.0)
    lines_added = Column(Integer, default=0)
    lines_deleted = Column(Integer, default=0)

class TeamMetric(Base, TimestampMixin):
    __tablename__ = "team_metrics"
    
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    team_id = Column(String(36), ForeignKey("teams.id", ondelete="CASCADE"), nullable=False)
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    
    throughput = Column(Integer, default=0)
    velocity = Column(Float, default=0.0)
    lead_time_hours = Column(Float, default=0.0)
    change_failure_rate = Column(Float, default=0.0)
