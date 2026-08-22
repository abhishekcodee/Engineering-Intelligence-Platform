from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import date

class KPICard(BaseModel):
    key: str
    label: str
    current_value: float
    formatted_value: str
    previous_value: float
    change_percentage: float
    trend: str  # up, down, neutral
    status: str  # good, warning, critical

class EngineeringHealthOverview(BaseModel):
    overall_health_score: float
    sprint_health_score: float
    deployment_health_score: float
    code_quality_score: float
    pr_health_score: float
    incident_health_score: float
    kpis: List[KPICard]

class DORAMetricsResponse(BaseModel):
    deployment_frequency: float
    deployment_frequency_rating: str  # Elite, High, Medium, Low
    lead_time_for_changes_hours: float
    lead_time_rating: str
    change_failure_rate_percent: float
    change_failure_rating: str
    mean_time_to_recovery_hours: float
    mttr_rating: str
    trend_history: List[Dict[str, Any]]

class DetailedHealthMetrics(BaseModel):
    delivery: Dict[str, Any]
    reliability: Dict[str, Any]
    collaboration: Dict[str, Any]
    code_activity: Dict[str, Any]
