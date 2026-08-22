from sqlalchemy import Column, String, ForeignKey, Text, Integer, Boolean, Float
from sqlalchemy.orm import relationship
from app.db.base_class import Base, TimestampMixin

class Project(Base, TimestampMixin):
    __tablename__ = "projects"
    
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    organization = relationship("Organization", back_populates="projects")
    repositories = relationship("Repository", back_populates="project")

class Repository(Base, TimestampMixin):
    __tablename__ = "repositories"
    
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="SET NULL"), nullable=True)
    name = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    url = Column(String(512), nullable=True)
    primary_language = Column(String(64), default="TypeScript")
    stars_count = Column(Integer, default=0)
    open_issues_count = Column(Integer, default=0)
    open_prs_count = Column(Integer, default=0)
    build_health = Column(String(32), default="passing")  # passing, failing, unstable
    engineering_health_score = Column(Float, default=85.0)
    is_private = Column(Boolean, default=True)
    
    organization = relationship("Organization", back_populates="repositories")
    project = relationship("Project", back_populates="repositories")
    commits = relationship("Commit", back_populates="repository", cascade="all, delete-orphan")
    pull_requests = relationship("PullRequest", back_populates="repository", cascade="all, delete-orphan")
    deployments = relationship("Deployment", back_populates="repository", cascade="all, delete-orphan")
    incidents = relationship("Incident", back_populates="repository")
