from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.deployment import Deployment
from app.models.incident import Incident
from app.models.activity import PullRequest

class DORACalculator:
    @staticmethod
    def calculate_metrics(db: Session, organization_id: str, days: int = 30) -> dict:
        cutoff = datetime.utcnow() - timedelta(days=days)
        
        # 1. Deployment Frequency (or Commit frequency if deployments not yet configured)
        deployments_count = db.query(Deployment).join(Deployment.repository).filter(
            Repository.organization_id == organization_id,
            Deployment.deployed_at >= cutoff,
            Deployment.status == "success"
        ).count()
        
        commits_count = db.query(Commit).join(Commit.repository).filter(
            Repository.organization_id == organization_id,
            Commit.committed_at >= cutoff
        ).count()
        
        if deployments_count > 0:
            df_per_day = round(deployments_count / max(days, 1), 2)
        elif commits_count > 0:
            df_per_day = round(commits_count / max(days, 1), 2)
        else:
            df_per_day = 0.0
            
        if df_per_day >= 1.0:
            df_rating = "Elite"
        elif df_per_day >= 0.2:
            df_rating = "High"
        elif df_per_day >= 0.05:
            df_rating = "Medium"
        elif df_per_day > 0:
            df_rating = "Low"
        else:
            df_rating = "N/A"
            
        # 2. Change Failure Rate
        total_deploys = db.query(Deployment).join(Deployment.repository).filter(
            Repository.organization_id == organization_id,
            Deployment.deployed_at >= cutoff
        ).count()
        
        failed_deploys = db.query(Deployment).join(Deployment.repository).filter(
            Repository.organization_id == organization_id,
            Deployment.deployed_at >= cutoff,
            Deployment.status.in_(["failure", "rollback"])
        ).count()
        
        if total_deploys > 0:
            cfr_percent = round((failed_deploys / total_deploys) * 100, 1)
        else:
            cfr_percent = 0.0
            
        if total_deploys == 0:
            cfr_rating = "N/A"
        elif cfr_percent <= 5.0:
            cfr_rating = "Elite"
        elif cfr_percent <= 15.0:
            cfr_rating = "High"
        elif cfr_percent <= 30.0:
            cfr_rating = "Medium"
        else:
            cfr_rating = "Low"
            
        # 3. Lead Time for Changes (average PR cycle time)
        avg_cycle = db.query(func.avg(PullRequest.cycle_time_hours)).join(PullRequest.repository).filter(
            Repository.organization_id == organization_id,
            PullRequest.created_at >= cutoff,
            PullRequest.status == "merged"
        ).scalar()
        
        if avg_cycle is not None:
            ltc_hours = round(float(avg_cycle), 1)
        else:
            ltc_hours = 0.0
            
        if ltc_hours <= 0:
            ltc_rating = "N/A"
        elif ltc_hours <= 24:
            ltc_rating = "Elite"
        elif ltc_hours <= 168:
            ltc_rating = "High"
        elif ltc_hours <= 720:
            ltc_rating = "Medium"
        else:
            ltc_rating = "Low"
            
        # 4. Mean Time to Recovery (MTTR)
        avg_mttr = db.query(func.avg(Incident.mttr_minutes)).filter(
            Incident.organization_id == organization_id,
            Incident.created_at >= cutoff,
            Incident.status == "resolved"
        ).scalar()
        
        if avg_mttr is not None:
            mttr_hours = round(float(avg_mttr) / 60.0, 1)
        else:
            mttr_hours = 0.0
            
        if mttr_hours <= 0:
            mttr_rating = "N/A"
        elif mttr_hours <= 1.0:
            mttr_rating = "Elite"
        elif mttr_hours <= 24.0:
            mttr_rating = "High"
        elif mttr_hours <= 168.0:
            mttr_rating = "Medium"
        else:
            mttr_rating = "Low"
            
        return {
            "deployment_frequency": df_per_day,
            "deployment_frequency_rating": df_rating,
            "lead_time_for_changes_hours": ltc_hours,
            "lead_time_rating": ltc_rating,
            "change_failure_rate_percent": cfr_percent,
            "change_failure_rating": cfr_rating,
            "mean_time_to_recovery_hours": mttr_hours,
            "mttr_rating": mttr_rating,
            "trend_history": [
                {"date": (datetime.utcnow() - timedelta(days=i)).strftime("%Y-%m-%d"), "deployments": round(max(0, df_per_day), 1), "lead_time": round(max(0, ltc_hours), 1)}
                for i in range(14, 0, -1)
            ]
        }
