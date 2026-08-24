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

## 🚀 Quick Start (Local Development)

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

## 🐳 Docker Local Setup

To launch the local stack (Postgres, Redis, FastAPI Backend, Celery Worker, Next.js Frontend):

```bash
docker-compose up --build
```

---

## ☁️ 100% FREE Production Deployment Guide

Deploy the full-stack application using 100% free cloud tiers:

```text
GitHub Repository ➔ GitHub Actions ➔ Frontend (GitHub Pages)
                                              │
                                              ▼ HTTPS API
                                      Backend (Render Free)
                                              │
                                              ▼ DATABASE_URL
                                    PostgreSQL (Neon / Supabase Free)
```

---

### Step 1: Create Free PostgreSQL Database (Neon or Supabase)

1. Sign up for a free PostgreSQL database on [Neon.tech](https://neon.tech) or [Supabase.com](https://supabase.com).
2. Create a new database named `devpulse`.
3. Copy your Connection String (`DATABASE_URL`).
   - Example format: `postgresql://username:password@ep-cool-db-123456.us-east-2.aws.neon.tech/devpulse?sslmode=require`

---

### Step 2: Deploy Backend to Render (Free Web Service)

1. Log in to [Render.com](https://render.com).
2. Click **New +** ➔ **Blueprint**.
3. Connect your GitHub repository `Engineering-Intelligence-Platform`.
4. Render will automatically detect [`render.yaml`](file:///c:/Engineering%20Intelligence%20Platform/Engineering-Intelligence-Platform/render.yaml).
5. Set the environment variable `DATABASE_URL` in the Render dashboard to your Neon/Supabase PostgreSQL connection string.
6. Click **Apply**. Your backend will deploy to `https://<YOUR-RENDER-SERVICE>.onrender.com`.
7. Verify backend health by visiting `https://<YOUR-RENDER-SERVICE>.onrender.com/health` (should return `{"status":"ok"}`).

---

### Step 3: Enable GitHub Pages & GitHub Actions (Frontend)

1. Go to your GitHub repository: `https://github.com/abhishekcodee/Engineering-Intelligence-Platform`.
2. Go to **Settings** ➔ **Pages**.
3. Under **Build and deployment** ➔ **Source**, select **GitHub Actions**.
4. Go to **Settings** ➔ **Secrets and variables** ➔ **Actions**:
   - Add Repository Secret or Variable:
     - Name: `NEXT_PUBLIC_API_URL`
     - Value: `https://<YOUR-RENDER-SERVICE>.onrender.com/api/v1`
5. Push changes to the `main` branch. The GitHub Action [`.github/workflows/deploy-frontend.yml`](file:///c:/Engineering%20Intelligence%20Platform/Engineering-Intelligence-Platform/.github/workflows/deploy-frontend.yml) will build and deploy the frontend automatically.
6. Access your frontend at `https://abhishecodee.github.io/Engineering-Intelligence-Platform/`.

---

## 🔐 Required Production Environment Variables

| Variable | Scope / Where to Set | Required | Description |
| -------- | ------------------- | -------- | ----------- |
| `DATABASE_URL` | Render Environment Variables | **Yes** | Neon/Supabase PostgreSQL URL |
| `SECRET_KEY` | Render Environment Variables | **Yes** | JWT secret key for auth tokens |
| `CORS_ORIGINS` | Render Environment Variables | **Yes** | Allowed origins e.g. `https://abhishecodee.github.io` |
| `NEXT_PUBLIC_API_URL` | GitHub Repository Variables | **Yes** | Deployed Render API URL ending in `/api/v1` |
| `GITHUB_CLIENT_ID` | Render Environment Variables | Optional | GitHub OAuth App Client ID |
| `GITHUB_CLIENT_SECRET` | Render Environment Variables | Optional | GitHub OAuth App Client Secret |

---

## 🛠️ Troubleshooting & Common Issues

- **GitHub Pages Blank Screen or 404 Assets**:
  - Ensure `output: 'export'` and `trailingSlash: true` are enabled in `frontend/next.config.js`.
  - Check that `basePath` matches `/Engineering-Intelligence-Platform`.
- **CORS Error in Browser Console**:
  - Verify that `CORS_ORIGINS` on Render contains `https://abhishecodee.github.io` without trailing slashes.
- **Render Backend Database Connection Timeout**:
  - Make sure your Neon/Supabase connection string ends with `?sslmode=require`.
  - SQLAlchemy automatically converts `postgres://` URLs to `postgresql://`.
- **Render Cold Start Delay**:
  - Free Render web services sleep after 15 minutes of inactivity. The first API request may take ~30 seconds to spin up.
