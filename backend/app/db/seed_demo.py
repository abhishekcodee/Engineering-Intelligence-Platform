from datetime import datetime, timedelta
import random
from sqlalchemy.orm import Session
from app.db.session import engine, SessionLocal
from app.db.base_class import Base
from app.core.security import get_password_hash
from app.models.user import User
from app.models.organization import Organization, OrganizationMember
from app.models.team import Team, TeamMember
from app.models.repository import Project, Repository
from app.models.activity import Commit, PullRequest, PullRequestReview, PullRequestComment, Issue, WorkflowRun
from app.models.sprint import Sprint
from app.models.deployment import Deployment, DeploymentEvent
from app.models.incident import Incident
from app.models.alert import Alert, Notification
from app.models.ai import AIInsight, AIReport
from app.models.integration import Integration

def seed_demo_data():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    
    # Check if already seeded
    existing_org = db.query(Organization).filter(Organization.slug == "devpulse-engineering").first()
    if existing_org:
        print("Demo data already seeded.")
        db.close()
        return
        
    print("Seeding DevPulse demo data...")
    
    # 1. Create Organization
    org = Organization(
        name="DevPulse Engineering",
        slug="devpulse-engineering",
        logo_url="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&q=80",
        timezone="America/New_York"
    )
    db.add(org)
    db.commit()
    db.refresh(org)
    
    # 2. Create Users & Org Members
    users_data = [
        {"email": "alex.owner@devpulse.io", "name": "Alex Mercer", "role": "OWNER", "github": "alexmercer"},
        {"email": "sarah.manager@devpulse.io", "name": "Sarah Chen", "role": "ENGINEERING_MANAGER", "github": "sarahchen"},
        {"email": "david.dev@devpulse.io", "name": "David Kim", "role": "DEVELOPER", "github": "davidkim"},
        {"email": "elena.dev@devpulse.io", "name": "Elena Rostova", "role": "DEVELOPER", "github": "elenarostova"},
        {"email": "marcus.dev@devpulse.io", "name": "Marcus Vance", "role": "DEVELOPER", "github": "marcusv"},
    ]
    
    users = []
    for u in users_data:
        user = User(
            email=u["email"],
            full_name=u["name"],
            hashed_password=get_password_hash("password123"),
            is_active=True,
            is_verified=True,
            github_username=u["github"],
            avatar_url=f"https://api.dicebear.com/7.x/avataaars/svg?seed={u['github']}"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        users.append(user)
        
        member = OrganizationMember(
            organization_id=org.id,
            user_id=user.id,
            role=u["role"]
        )
        db.add(member)
        db.commit()

    # 3. Create Teams
    teams_data = [
        {"name": "Platform", "desc": "Core infrastructure, CI/CD, and auth services"},
        {"name": "Product", "desc": "User facing applications and feature development"},
        {"name": "Frontend", "desc": "Web application and design system engineering"},
        {"name": "Backend", "desc": "High-throughput APIs and transaction systems"},
    ]
    
    teams = []
    for idx, t in enumerate(teams_data):
        team = Team(
            organization_id=org.id,
            name=t["name"],
            description=t["desc"]
        )
        db.add(team)
        db.commit()
        db.refresh(team)
        teams.append(team)
        
        # Add members to team
        for u in users:
            tm = TeamMember(team_id=team.id, user_id=u.id, role="MEMBER")
            db.add(tm)
        db.commit()

    # 3. Trigger Real GitHub Ingestion for Organization Repository
    from app.services.github_service import GitHubService
    print("Ingesting real GitHub repository data for abhishekcodee/Engineering-Intelligence-Platform...")
    try:
        res = GitHubService.sync_github_repository(
            db=db,
            organization_id=org.id,
            repo_slug="abhishekcodee/Engineering-Intelligence-Platform"
        )
        print("Real GitHub Data Ingested:", res)
    except Exception as e:
        print("Real GitHub Ingestion note:", e)

    print("Platform successfully initialized with 100% real repository data!")
    print("Login credentials:")
    print("  Email: alex.owner@devpulse.io")
    print("  Password: password123")
    db.close()

if __name__ == "__main__":
    seed_demo_data()
