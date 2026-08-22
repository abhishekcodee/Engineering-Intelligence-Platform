# DevPulse - 100% Free & Open-Source Engineering Intelligence Platform

DevPulse is a 100% Free & Open-Source Engineering Intelligence platform that connects software development tools (GitHub, Jira, Slack, CI/CD) and converts raw engineering activity into real-time DORA performance metrics, PR risk intelligence, developer growth insights, sprint prediction, deployment analytics, and AI-powered executive reports. All features are completely free with zero subscription fees or paywalls.

---

## 🌟 Key Features

1. **DORA & Engineering Health Scoring**: Calculates Deployment Frequency, Lead Time for Changes, Change Failure Rate, and Mean Time to Recovery (MTTR) with weighted composite health scores.
2. **AI Pull Request Risk Intelligence**: Analyzes PR changeset size, domain sensitivity (payments, auth, migrations), regression risks, and suggests specific test focus.
3. **Context-Aware AI Assistant**: Interactive natural-language assistant querying real PostgreSQL metrics before generating responses.
4. **Automated AI Weekly Engineering Reports**: Synthesizes executive summaries, delivery stats, incident breakdowns, and recommendations with PDF & CSV export options.
5. **Multi-Tenant & Role-Based Access Control**: Strict organization-level data isolation with `OWNER`, `ENGINEERING_MANAGER`, and `DEVELOPER` permissions.
6. **Live Demo Environment**: Pre-seeded with **"DevPulse Engineering"** demo workspace, 4 projects (`payments-api`, `web-platform`, `mobile-app`, `auth-service`), teams, commits, PRs, deployments, and incidents out of the box.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide Icons, Recharts, TanStack Query.
- **Backend**: Python 3.11+, FastAPI, Pydantic v2, SQLAlchemy 2.0, Alembic, Pytest.
- **Database & Cache**: PostgreSQL 16 (Multi-tenant isolated schemas), Redis 7 (Caching & Celery worker).
- **Background Jobs**: Celery worker for GitHub background sync, metric recalculation, and automated alerts.

---

## 🚀 Quick Start (Development Setup)

### 1. Backend Setup & Data Seeding

```bash
cd backend
pip install -r requirements.txt
python -m app.db.seed_demo
uvicorn app.main:app --reload --port 8000
```

Backend API Docs will be available at: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend Application will be available at: `http://localhost:3001`

---

## 🐳 Docker Deployment

To launch the complete production stack (Postgres, Redis, FastAPI Backend, Celery Worker, Next.js Frontend):

```bash
docker-compose up --build
```

---

## 🔑 Demo Login Credentials

- **Email**: `alex.owner@devpulse.io`
- **Password**: `password123`
- **Role**: Organization Owner

---

## ☁️ AWS Production Deployment Strategy

- **Frontend**: Deployed on AWS Amplify or Vercel with CDN edge caching.
- **Backend APIs**: Containerized on AWS ECS Fargate behind an Application Load Balancer (ALB).
- **Database**: Managed AWS RDS PostgreSQL with Multi-AZ failover and automated backups.
- **Cache & Workers**: AWS ElastiCache for Redis + Celery worker task queues running on ECS.
