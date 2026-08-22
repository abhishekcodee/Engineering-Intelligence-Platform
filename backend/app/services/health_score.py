from sqlalchemy.orm import Session
from app.services.dora_calculator import DORACalculator
from app.models.sprint import Sprint
from app.models.activity import PullRequest

class HealthScoreEngine:
    @staticmethod
    def calculate_health(db: Session, organization_id: str) -> dict:
        dora = DORACalculator.calculate_metrics(db, organization_id, days=30)
        
class HealthScoreEngine:
    @staticmethod
    def calculate_health(db: Session, organization_id: str) -> dict:
        dora = DORACalculator.calculate_metrics(db, organization_id, days=30)
        
        # Calculate individual health dimensions (0-100) dynamically
        cfr = dora["change_failure_rate_percent"]
        deploy_health = max(50.0, min(100.0, 100.0 - (cfr * 2.5))) if dora["deployment_frequency"] > 0 else 100.0
        
        # Sprint health based on active sprint completion
        active_sprint = db.query(Sprint).filter(
            Sprint.organization_id == organization_id,
            Sprint.status == "active"
        ).first()
        
        if active_sprint and active_sprint.planned_issues > 0:
            sprint_health = round((active_sprint.completed_issues / active_sprint.planned_issues) * 100, 1)
        else:
            sprint_health = 100.0
            
        # PR health based on review time & cycle time
        avg_review = dora["lead_time_for_changes_hours"]
        if avg_review > 0:
            pr_health = max(50.0, min(100.0, 100.0 - (avg_review * 0.8)))
        else:
            pr_health = 100.0
            
        # Code quality & incident health from real DB metrics
        total_prs = db.query(PullRequest).join(PullRequest.repository).filter(
            PullRequest.repository.has(organization_id=organization_id)
        ).count()
        low_risk_prs = db.query(PullRequest).join(PullRequest.repository).filter(
            PullRequest.repository.has(organization_id=organization_id),
            PullRequest.risk_level == "Low"
        ).count()
        
        if total_prs > 0:
            code_quality = round(max(60.0, (low_risk_prs / total_prs) * 100.0), 1)
        else:
            code_quality = 100.0

        mttr = dora["mean_time_to_recovery_hours"]
        if mttr > 0:
            incident_health = max(60.0, min(100.0, 100.0 - (mttr * 3.0)))
        else:
            incident_health = 100.0
        
        overall = round(
            (deploy_health * 0.25) +
            (sprint_health * 0.25) +
            (pr_health * 0.20) +
            (code_quality * 0.15) +
            (incident_health * 0.15),
            1
        )
        
        kpis = [
            {
                "key": "deployment_frequency",
                "label": "Deployment Frequency",
                "current_value": dora["deployment_frequency"],
                "formatted_value": f"{dora['deployment_frequency']}/day" if dora['deployment_frequency'] > 0 else "0/day",
                "previous_value": round(dora["deployment_frequency"] * 0.9, 2),
                "change_percentage": 0.0,
                "trend": "neutral",
                "status": "good"
            },
            {
                "key": "lead_time",
                "label": "Lead Time for Changes",
                "current_value": dora["lead_time_for_changes_hours"],
                "formatted_value": f"{dora['lead_time_for_changes_hours']} hours" if dora['lead_time_for_changes_hours'] > 0 else "0.0 hours",
                "previous_value": dora["lead_time_for_changes_hours"],
                "change_percentage": 0.0,
                "trend": "neutral",
                "status": "good"
            },
            {
                "key": "change_failure_rate",
                "label": "Change Failure Rate",
                "current_value": dora["change_failure_rate_percent"],
                "formatted_value": f"{dora['change_failure_rate_percent']}%",
                "previous_value": dora["change_failure_rate_percent"],
                "change_percentage": 0.0,
                "trend": "neutral",
                "status": "good"
            },
            {
                "key": "mttr",
                "label": "Mean Time to Recovery",
                "current_value": dora["mean_time_to_recovery_hours"],
                "formatted_value": f"{dora['mean_time_to_recovery_hours']} hours" if dora['mean_time_to_recovery_hours'] > 0 else "0.0 hours",
                "previous_value": dora["mean_time_to_recovery_hours"],
                "change_percentage": 0.0,
                "trend": "neutral",
                "status": "good"
            },
            {
                "key": "pr_review_time",
                "label": "PR Review Time",
                "current_value": dora["lead_time_for_changes_hours"],
                "formatted_value": f"{dora['lead_time_for_changes_hours']} hours" if dora['lead_time_for_changes_hours'] > 0 else "0.0 hours",
                "previous_value": dora["lead_time_for_changes_hours"],
                "change_percentage": 0.0,
                "trend": "neutral",
                "status": "good"
            },
            {
                "key": "build_success_rate",
                "label": "Build Success Rate",
                "current_value": 100.0 if dora["change_failure_rate_percent"] == 0 else round(100.0 - dora["change_failure_rate_percent"], 1),
                "formatted_value": f"{100.0 if dora['change_failure_rate_percent'] == 0 else round(100.0 - dora['change_failure_rate_percent'], 1)}%",
                "previous_value": 100.0,
                "change_percentage": 0.0,
                "trend": "neutral",
                "status": "good"
            }
        ]
        
        return {
            "overall_health_score": overall,
            "sprint_health_score": sprint_health,
            "deployment_health_score": round(deploy_health, 1),
            "code_quality_score": code_quality,
            "pr_health_score": round(pr_health, 1),
            "incident_health_score": round(incident_health, 1),
            "kpis": kpis
        }
