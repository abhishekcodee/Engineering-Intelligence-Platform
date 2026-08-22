from sqlalchemy import Column, String, ForeignKey, Text, Integer, Float, DateTime
from sqlalchemy.orm import relationship
from app.db.base_class import Base, TimestampMixin

class Sprint(Base, TimestampMixin):
    __tablename__ = "sprints"
    
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    team_id = Column(String(36), ForeignKey("teams.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    goal = Column(Text, nullable=True)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    planned_issues = Column(Integer, default=0)
    completed_issues = Column(Integer, default=0)
    velocity = Column(Float, default=0.0)
    completion_percentage = Column(Float, default=0.0)
    status = Column(String(32), default="active")  # active, completed, planning
    risk_level = Column(String(32), default="Low")  # Low, Medium, High
    ai_predicted_completion = Column(Float, default=90.0)
    ai_prediction_reason = Column(Text, nullable=True)
    
    organization = relationship("Organization", back_populates="sprints")
    team = relationship("Team", back_populates="sprints")
