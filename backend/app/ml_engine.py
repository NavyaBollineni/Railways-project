import os
import json
import joblib
import numpy as np

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models')

# Category mapping lists
CAUSES = ['Signal Failure', 'Track Stiffness Loss', 'Human Error', 'Equipment Malfunction', 'Weather/Crossing Hazard']
TYPES = ['Derailment', 'Collision', 'Crossing Incident', 'Fall/Slip/Trip', 'Station Anomaly']
ZONES = ['North Zone', 'South Zone', 'East Zone', 'West Zone', 'Central Zone']
WEATHERS = ['Clear', 'Rain', 'Fog', 'Storm', 'Heatwave']

REFORMS = [
    'Automated Signaling & Digital Twin Upgrade',
    'Track Stiffness Repair & Inspection',
    'Staff Retraining & Operational Protocol',
    'Emergency Rescue Response Optimization',
    'Speed Restriction & Level Crossing Guard'
]

class MLEngine:
    def __init__(self):
        self.model_path = os.path.join(MODELS_DIR, 'xgboost_model.pkl')
        self.scaler_path = os.path.join(MODELS_DIR, 'scaler.pkl')
        self.metrics_path = os.path.join(MODELS_DIR, 'metrics.json')
        
        self.model = None
        self.scaler = None
        self.metrics = None
        self.load_artifacts()

    def load_artifacts(self):
        if os.path.exists(self.model_path) and os.path.exists(self.scaler_path):
            self.model = joblib.load(self.model_path)
            self.scaler = joblib.load(self.scaler_path)
        if os.path.exists(self.metrics_path):
            with open(self.metrics_path, 'r') as f:
                self.metrics = json.load(f)

    def encode_categorical(self, val, cat_list):
        if val in cat_list:
            return cat_list.index(val)
        return 0

    def predict(self, req_data):
        if self.model is None or self.scaler is None:
            self.load_artifacts()
            if self.model is None:
                raise Exception("Trained ML model missing. Run train_model.py first.")

        cause_idx = self.encode_categorical(req_data.accident_cause, CAUSES)
        type_idx = self.encode_categorical(req_data.accident_type, TYPES)
        zone_idx = self.encode_categorical(req_data.rail_zone, ZONES)
        weather_idx = self.encode_categorical(req_data.weather_condition, WEATHERS)

        features = np.array([[
            cause_idx,
            type_idx,
            zone_idx,
            weather_idx,
            req_data.rescue_response_time_min,
            req_data.track_stiffness_index,
            req_data.speed_mph,
            req_data.equipment_age_years,
            req_data.human_error_flag
        ]])

        features_scaled = self.scaler.transform(features)
        
        pred_idx = self.model.predict(features_scaled)[0]
        probas = self.model.predict_proba(features_scaled)[0]
        
        predicted_reform = REFORMS[int(pred_idx)]
        confidence = float(np.max(probas))

        # Risk score calculation formula (0 - 100)
        risk_score = 0.0
        risk_score += (req_data.speed_mph / 120.0) * 30.0
        risk_score += (min(req_data.rescue_response_time_min, 120) / 120.0) * 25.0
        risk_score += ((1.0 - req_data.track_stiffness_index)) * 25.0
        risk_score += (req_data.equipment_age_years / 30.0) * 10.0
        if req_data.human_error_flag:
            risk_score += 10.0

        risk_score = round(min(100.0, max(5.0, risk_score)), 1)

        if risk_score > 75:
            risk_level = "CRITICAL"
        elif risk_score > 50:
            risk_level = "HIGH"
        elif risk_score > 30:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        # Directives & critical factors
        directives = self.generate_directives(predicted_reform, req_data, risk_level)
        critical_factors = self.extract_critical_factors(req_data)

        prob_dict = {REFORMS[i]: round(float(probas[i]) * 100, 2) for i in range(len(REFORMS))}

        return {
            "predicted_reform": predicted_reform,
            "confidence_score": round(confidence * 100, 2),
            "risk_level": risk_level,
            "risk_score": risk_score,
            "probabilities": prob_dict,
            "safety_policy_directives": directives,
            "critical_factors": critical_factors
        }

    def extract_critical_factors(self, data):
        factors = []
        if data.rescue_response_time_min > 45:
            factors.append(f"Extended emergency response time ({data.rescue_response_time_min} mins)")
        if data.track_stiffness_index < 0.4:
            factors.append(f"Critical track stiffness loss ({data.track_stiffness_index} index score)")
        if data.speed_mph > 85:
            factors.append(f"High-speed train operation ({data.speed_mph} mph)")
        if data.equipment_age_years > 20:
            factors.append(f"Aging rail infrastructure ({data.equipment_age_years} years old)")
        if data.human_error_flag == 1:
            factors.append("Human error / signal operational deviation detected")
        if not factors:
            factors.append("Nominal operational baseline parameters")
        return factors

    def generate_directives(self, reform, data, risk_level):
        directives = []
        if "Signaling" in reform:
            directives.append("Deploy automated AI-assisted interlocking signal control systems.")
            directives.append("Implement digital twin process mining for real-time signaling telemetry.")
        elif "Stiffness" in reform:
            directives.append("Schedule immediate track ballasting and stiffness remediation.")
            directives.append("Deploy in-service train accelerometer sensor nodes for continuous stiffness monitoring.")
        elif "Staff" in reform:
            directives.append("Mandate emergency simulator retraining for crew and dispatch operators.")
            directives.append("Review standard operating protocols for signal adherence and human error prevention.")
        elif "Rescue" in reform:
            directives.append("Reallocate emergency response units to shorten rescue arrival latency under 30 mins.")
            directives.append("Establish dedicated rail corridor emergency dispatch hubs.")
        elif "Speed" in reform:
            directives.append("Enforce temporary speed restriction (TSR) of 45 mph in the target rail sector.")
            directives.append("Upgrade automated level crossing barrier guards and vision surveillance cameras.")

        if risk_level in ["HIGH", "CRITICAL"]:
            directives.append(f"ALERT ({risk_level}): Dispatch safety audit team to {data.rail_zone} immediately.")

        return directives

ml_engine = MLEngine()
