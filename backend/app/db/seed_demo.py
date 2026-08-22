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

    # 4. Create Repositories
    repos_data = [
        {"name": "payments-api", "lang": "Python", "desc": "High-throughput Payment Gateway & Stripe Integration API", "prs": 4, "issues": 3, "score": 82.5},
        {"name": "web-platform", "lang": "TypeScript", "desc": "Next.js Main Customer Portal & Analytics Web App", "prs": 6, "issues": 5, "score": 91.0},
        {"name": "mobile-app", "lang": "React Native", "desc": "Cross-platform mobile application for iOS & Android", "prs": 2, "issues": 2, "score": 88.5},
        {"name": "auth-service", "lang": "Go", "desc": "OAuth2 / OIDC Single Sign-On Authentication microservice", "prs": 1, "issues": 1, "score": 94.0},
    ]
    
    repos = []
    for r in repos_data:
        repo = Repository(
            organization_id=org.id,
            name=r["name"],
            full_name=f"devpulse-org/{r['name']}",
            description=r["desc"],
            url=f"https://github.com/devpulse-org/{r['name']}",
            primary_language=r["lang"],
            stars_count=random.randint(45, 180),
            open_issues_count=r["issues"],
            open_prs_count=r["prs"],
            build_health="passing",
            engineering_health_score=r["score"],
            is_private=True
        )
        db.add(repo)
        db.commit()
        db.refresh(repo)
        repos.append(repo)

    # 5. Create Pull Requests & Commits
    prs_samples = [
        {"title": "refactor: optimize database connection pooling & retry logic", "repo": repos[0], "author": users[2], "risk": "Medium", "add": 320, "del": 140, "status": "open"},
        {"title": "feat: add multi-factor authentication SMS fallback endpoint", "repo": repos[3], "author": users[3], "risk": "High", "add": 540, "del": 80, "status": "open"},
        {"title": "fix: resolve memory leak in web analytics dashboard charts", "repo": repos[1], "author": users[4], "risk": "Low", "add": 85, "del": 42, "status": "merged"},
        {"title": "chore: upgrade Next.js 14 to latest security patch release", "repo": repos[1], "author": users[0], "risk": "Low", "add": 45, "del": 30, "status": "merged"},
        {"title": "feat: integrate Stripe Webhook idempotency keys for checkout", "repo": repos[0], "author": users[2], "risk": "Critical", "add": 780, "del": 210, "status": "open"},
    ]
    
    for idx, p in enumerate(prs_samples):
        pr = PullRequest(
            repository_id=p["repo"].id,
            number=101 + idx,
            title=p["title"],
            body=f"This PR implements {p['title']}. Please review transaction boundaries carefully.",
            status=p["status"],
            author_id=p["author"].id,
            author_username=p["author"].github_username,
            created_at=datetime.utcnow() - timedelta(days=random.randint(1, 5)),
            merged_at=datetime.utcnow() - timedelta(days=1) if p["status"] == "merged" else None,
            review_time_hours=4.2,
            cycle_time_hours=18.5,
            additions=p["add"],
            deletions=p["del"],
            files_changed=random.randint(3, 12),
            risk_level=p["risk"],
            risk_factors=["Large changeset", "Modifies payment security logic"],
            ai_recommendations=["Add retry failure tests", "Validate transaction rollback edge cases"],
            reviewer_username="sarahchen"
        )
        db.add(pr)
        db.commit()
        db.refresh(pr)
        
        # Add review & comment
        rev = PullRequestReview(
            pull_request_id=pr.id,
            reviewer_id=users[1].id,
            reviewer_username=users[1].github_username,
            state="APPROVED" if p["status"] == "merged" else "CHANGES_REQUESTED",
            submitted_at=datetime.utcnow() - timedelta(hours=3),
            time_to_review_hours=3.5
        )
        db.add(rev)
        
        # Add commit
        cmt = Commit(
            repository_id=p["repo"].id,
            sha=f"c7f{idx}8a9b2d4e6f1c8a",
            message=p["title"],
            author_name=p["author"].full_name,
            author_email=p["author"].email,
            author_id=p["author"].id,
            committed_at=datetime.utcnow() - timedelta(days=idx + 1),
            additions=p["add"],
            deletions=p["del"]
        )
        db.add(cmt)
        db.commit()

    # 6. Create Deployments & Deployment Events
    for r in repos:
        for d_idx in range(3):
            dep = Deployment(
                repository_id=r.id,
                environment="production" if d_idx == 0 else "staging",
                status="success" if d_idx != 1 else "failure",
                sha=f"dep{d_idx}f9a8b7c6d5",
                commit_message=f"Deploy release v1.{d_idx}.0 to {r.name}",
                deployed_by="GitHub Actions",
                duration_seconds=random.randint(120, 450),
                failure_reason="Integration test timeout on database migration step" if d_idx == 1 else None,
                deployed_at=datetime.utcnow() - timedelta(days=d_idx * 2 + 1)
            )
            db.add(dep)
            db.commit()
            db.refresh(dep)
            
            # Events
            evt1 = DeploymentEvent(deployment_id=dep.id, event_type="build", status="passed", timestamp=dep.deployed_at)
            evt2 = DeploymentEvent(deployment_id=dep.id, event_type="test", status="passed" if d_idx != 1 else "failed", timestamp=dep.deployed_at + timedelta(seconds=60))
            db.add_all([evt1, evt2])
            db.commit()

    # 7. Create Sprints
    sprint1 = Sprint(
        organization_id=org.id,
        team_id=teams[0].id,
        name="Sprint 48 - Platform Resilience",
        goal="Improve database connection pooling and achieve 99.99% API availability",
        start_date=datetime.utcnow() - timedelta(days=8),
        end_date=datetime.utcnow() + timedelta(days=6),
        planned_issues=24,
        completed_issues=19,
        velocity=38.5,
        completion_percentage=79.2,
        status="active",
        risk_level="Low",
        ai_predicted_completion=88.5,
        ai_prediction_reason="PR review wait times are healthy (3.8 hrs avg). 3 remaining issues in QA verification phase."
    )
    db.add(sprint1)
    db.commit()

    # 8. Create Incidents
    inc = Incident(
        organization_id=org.id,
        repository_id=repos[0].id,
        title="Stripe Webhook Rate Limit Spike causing payment delays",
        severity="P2",
        status="resolved",
        root_cause="Unbounded webhook retry loop during third-party API outage",
        resolution="Implemented exponential backoff with jitter and circuit breaker pattern",
        resolved_at=datetime.utcnow() - timedelta(days=2),
        mttr_minutes=84.0
    )
    db.add(inc)
    db.commit()

    # 9. Create Alerts & Notifications
    alert1 = Alert(
        organization_id=org.id,
        type="PR_BOTTLENECK",
        title="PR Review Waiting Time Surge",
        message="5 pull requests in payments-api have been waiting for review for > 24 hours.",
        severity="warning",
        status="active"
    )
    alert2 = Alert(
        organization_id=org.id,
        type="CI_HEALTH",
        title="Build Failure Rate Spike",
        message="Build failure rate increased 18% in web-platform over the past 48 hours.",
        severity="info",
        status="acknowledged",
        acknowledged_at=datetime.utcnow() - timedelta(hours=4)
    )
    db.add_all([alert1, alert2])
    db.commit()

    # 10. Integration status
    integ = Integration(
        organization_id=org.id,
        provider="github",
        status="connected",
        sync_status="synced",
        last_synced_at=datetime.utcnow()
    )
    db.add(integ)
    db.commit()

    print("Demo data successfully seeded!")
    print("Demo login credentials:")
    print("  Email: alex.owner@devpulse.io")
    print("  Password: password123")
    db.close()

if __name__ == "__main__":
    seed_demo_data()
