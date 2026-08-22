import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "DevPulse"

def test_login_demo_user():
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "alex.owner@devpulse.io", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "alex.owner@devpulse.io"

def test_unauthorized_access():
    response = client.get("/api/v1/repositories/")
    assert response.status_code == 401

def test_authenticated_flow():
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "alex.owner@devpulse.io", "password": "password123"}
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test repositories
    repo_resp = client.get("/api/v1/repositories/", headers=headers)
    assert repo_resp.status_code == 200
    repos = repo_resp.json()
    assert len(repos) >= 1
    
    # Test pull requests
    pr_resp = client.get("/api/v1/pull-requests/", headers=headers)
    assert pr_resp.status_code == 200
    prs = pr_resp.json()
    assert len(prs) >= 1
    
    # Test AI assistant
    ai_resp = client.post(
        "/api/v1/ai/query",
        headers=headers,
        json={"prompt": "Why did sprint performance decrease?"}
    )
    assert ai_resp.status_code == 200
    assert "answer" in ai_resp.json()
