from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class PredictRequest(BaseModel):
    accident_cause: str = Field(..., example="Signal Failure")
    accident_type: str = Field(..., example="Derailment")
    rail_zone: str = Field(..., example="North Zone")
    weather_condition: str = Field(..., example="Rain")
    rescue_response_time_min: float = Field(..., ge=0, le=300, example=45.0)
    track_stiffness_index: float = Field(..., ge=0.0, le=1.0, example=0.35)
    speed_mph: float = Field(..., ge=0, le=200, example=85.0)
    equipment_age_years: float = Field(..., ge=0, le=50, example=12.5)
    human_error_flag: int = Field(..., ge=0, le=1, example=1)

class PredictResponse(BaseModel):
    predicted_reform: str
    confidence_score: float
    risk_level: str
    risk_score: float
    probabilities: Dict[str, float]
    safety_policy_directives: List[str]
    critical_factors: List[str]

class AccidentCreate(PredictRequest):
    pass

class AccidentOut(PredictRequest):
    id: int
    predicted_reform: str
    risk_level: str
    created_at: datetime

    class Config:
        from_attributes = True

class AlertOut(BaseModel):
    id: str
    rail_zone: str
    severity: str
    alert_title: str
    description: str
    recommended_reform: str
    timestamp: str
