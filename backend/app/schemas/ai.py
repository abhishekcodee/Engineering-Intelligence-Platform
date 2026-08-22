from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime, date

class AIInsightResponse(BaseModel):
    id: str
    category: str
    title: str
    description: str
    metrics_data: Optional[Dict[str, Any]] = None
    generated_at: datetime

    class Config:
        from_attributes = True

class AIAssistantQuery(BaseModel):
    prompt: str

class AIAssistantResponse(BaseModel):
    answer: str
    data_context_used: List[str]
    suggested_followups: List[str]

class AIReportResponse(BaseModel):
    id: str
    title: str
    period_start: date
    period_end: date
    executive_summary: str
    health_analysis: str
    delivery_analysis: str
    pr_analysis: str
    deployment_analysis: str
    incident_analysis: str
    recommendations: List[str]
    generated_at: datetime

    class Config:
        from_attributes = True
