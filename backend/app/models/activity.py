from sqlalchemy import Column, String, ForeignKey, Text, Integer, Float, DateTime, JSON
from sqlalchemy.orm import relationship
from app.db.base_class import Base, TimestampMixin

class Commit(Base, TimestampMixin):
    __tablename__ = "commits"
    
    repository_id = Column(String(36), ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False)
    sha = Column(String(64), index=True, nullable=False)
    message = Column(Text, nullable=False)
    author_name = Column(String(255), nullable=False)
    author_email = Column(String(255), nullable=False)
    author_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    committed_at = Column(DateTime, nullable=False)
    additions = Column(Integer, default=0)
    deletions = Column(Integer, default=0)
    branch_name = Column(String(255), default="main")
    
    repository = relationship("Repository", back_populates="commits")

class PullRequest(Base, TimestampMixin):
    __tablename__ = "pull_requests"
    
    repository_id = Column(String(36), ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False)
    number = Column(Integer, nullable=False)
    title = Column(String(512), nullable=False)
    body = Column(Text, nullable=True)
    status = Column(String(32), default="open", index=True)  # open, merged, closed
    author_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    author_username = Column(String(128), nullable=False)
    merged_at = Column(DateTime, nullable=True)
    closed_at = Column(DateTime, nullable=True)
    review_time_hours = Column(Float, default=0.0)
    cycle_time_hours = Column(Float, default=0.0)
    additions = Column(Integer, default=0)
    deletions = Column(Integer, default=0)
    files_changed = Column(Integer, default=0)
    risk_level = Column(String(32), default="Low")  # Low, Medium, High, Critical
    risk_factors = Column(JSON, nullable=True)  # list of AI risk factor reasons
    ai_recommendations = Column(JSON, nullable=True)
    reviewer_username = Column(String(128), nullable=True)
    
    repository = relationship("Repository", back_populates="pull_requests")
    reviews = relationship("PullRequestReview", back_populates="pull_request", cascade="all, delete-orphan")
    comments = relationship("PullRequestComment", back_populates="pull_request", cascade="all, delete-orphan")

class PullRequestReview(Base, TimestampMixin):
    __tablename__ = "pull_request_reviews"
    
    pull_request_id = Column(String(36), ForeignKey("pull_requests.id", ondelete="CASCADE"), nullable=False)
    reviewer_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    reviewer_username = Column(String(128), nullable=False)
    state = Column(String(32), nullable=False)  # APPROVED, CHANGES_REQUESTED, COMMENTED
    submitted_at = Column(DateTime, nullable=False)
    time_to_review_hours = Column(Float, default=0.0)
    
    pull_request = relationship("PullRequest", back_populates="reviews")

class PullRequestComment(Base, TimestampMixin):
    __tablename__ = "pull_request_comments"
    
    pull_request_id = Column(String(36), ForeignKey("pull_requests.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    body = Column(Text, nullable=False)
    
    pull_request = relationship("PullRequest", back_populates="comments")

class Issue(Base, TimestampMixin):
    __tablename__ = "issues"
    
    repository_id = Column(String(36), ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False)
    number = Column(Integer, nullable=False)
    title = Column(String(512), nullable=False)
    body = Column(Text, nullable=True)
    state = Column(String(32), default="open")  # open, closed
    author_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    assignee_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    closed_at = Column(DateTime, nullable=True)
    labels = Column(JSON, nullable=True)

class WorkflowRun(Base, TimestampMixin):
    __tablename__ = "workflow_runs"
    
    repository_id = Column(String(36), ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    status = Column(String(32), nullable=False)  # completed, in_progress, queued
    conclusion = Column(String(32), nullable=True)  # success, failure, cancelled
    run_number = Column(Integer, nullable=False)
    event = Column(String(64), nullable=False)  # push, pull_request, schedule
    duration_seconds = Column(Integer, default=0)
