# Railway Accident Analysis & Safety Reform Prediction System (XGBoost)

[![Python](https://img.shields.io/badge/Python-3.14-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com/)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.0+-orange.svg)](https://xgboost.readthedocs.io/)
[![React](https://img.shields.io/badge/React-18.2-sky.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan.svg)](https://tailwindcss.com/)
[![Accuracy](https://img.shields.io/badge/Model_Accuracy-98.33%25-emerald.svg)]()

A data-driven machine learning system designed to anticipate and predict necessary safety reforms in the railway sector. Based on the JETIR (2025) research study, this system uses **XGBoost (Extreme Gradient Boosting)** to analyze historical railway accident telemetry, pinpoint critical risk factors, and recommend proactive safety measures.

---

## 📄 Abstract & Theoretical Background

Railway accidents pose a serious threat to public safety, often resulting in loss of life, injuries, and significant infrastructure damage. Analyzing past incidents and identifying key patterns can help in formulating effective safety measures and preventive strategies. This study employs machine learning techniques to predict necessary reforms and improvements in railway safety.

By leveraging advanced predictive models, the system identifies critical factors contributing to accidents (such as signal errors, track stiffness loss, rescue response delays, and human error) and suggests corrective actions to mitigate future risks. The system achieves **98.33% predictive accuracy** using XGBoost, significantly outperforming conventional manual inspection and reactive risk assessment methods.

**Keywords**: Railway accidents, machine learning, XGBoost, predictive modeling, accident prevention, railway safety, risk analysis, policy reforms, data-driven insights.

---

## 🛠️ System Architecture & Features

```
railways project/
├── backend/                  # FastAPI REST API & Machine Learning Engine
│   ├── app/
│   │   ├── main.py           # REST API endpoints & CORS middleware
│   │   ├── database.py       # SQLAlchemy SQLite ORM models
│   │   ├── ml_engine.py      # XGBoost inference & risk calculator
│   │   └── schemas.py        # Pydantic data validation schemas
│   ├── data/
│   │   ├── railway_accidents.csv # Synthesized incident dataset (1,500 rows)
│   │   └── railway_safety.db # SQLite database
│   ├── models/
│   │   ├── xgboost_model.pkl # Trained XGBoost classifier
│   │   ├── scaler.pkl        # Feature scaler
│   │   └── metrics.json      # Accuracy (98.33%), Confusion Matrix, ROC curves
│   ├── train_model.py        # Standalone ML training & evaluation script
│   └── requirements.txt      # Python dependencies
├── frontend/                 # Interactive React + Vite Web Dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # App navigation & model status
│   │   │   ├── PredictorForm.jsx    # Real-time safety reform predictor
│   │   │   ├── AnalyticsDashboard.jsx# Charts: Feature importance, Confusion Matrix, ROC, Loss curves
│   │   │   ├── RiskAlertCenter.jsx  # Real-time alert feed & decision support
│   │   │   ├── DatasetViewer.jsx    # SQLite accident logs table
│   │   │   └── ModelComparison.jsx  # Benchmarks: XGBoost vs RF, DT, SVM
│   │   ├── App.jsx                  # Main page router
│   │   └── index.css                # Tailwind styling
│   └── package.json
└── README.md
```

### Key Modules:
1. **Real-time Safety Reform Predictor**: Interactive input form allowing users to select incident parameters and execute XGBoost model inference.
2. **Paper Analytics & Visualizations**:
   - **Feature Importance Analysis Graph (Figure 1)**: Identifies accident cause, response time, and track stiffness as key predictors.
   - **Confusion Matrix Visualizer (Figure 2)**: True vs predicted classifications demonstrating zero significant misclassifications.
   - **ROC & AUC Curves**: Area under the curve ≈ 0.99 across all reform categories.
   - **Training vs Validation Loss Curves**: Proves convergence and absence of overfitting.
3. **Risk Alert & Decision Support Center**: Live notification feed and automated policy directives.
4. **Historical Accident Logs**: Database table with real-time searching, filtering, and inspection.
5. **Model Benchmarks**: Direct performance comparison highlighting why XGBoost (98.33%) exceeds Random Forest (~94.3%), Decision Trees (~91.2%), and SVM (~88.5%).

---

## ⚡ Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm

### 1. Backend Setup & Server Launch
```bash
cd backend
python train_model.py
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Documentation: `http://127.0.0.1:8000/docs`

### 2. Frontend Launch
```bash
cd frontend
npm install
npm run dev
```
- Open `http://localhost:3000` in your web browser.

---

## 🔬 Target Safety Reform Categories
1. **Automated Signaling & Digital Twin Upgrade**: Interlocking AI signals & telemetry.
2. **Track Stiffness Repair & Inspection**: Remediation of track stiffness loss & in-service sensors.
3. **Staff Retraining & Operational Protocol**: Simulator training & adherence to safety guidelines.
4. **Emergency Rescue Response Optimization**: Dedicated zone dispatch hubs reducing rescue latency under 30 mins.
5. **Speed Restriction & Level Crossing Guard**: Temporary speed limits (45 mph) & automated crossing barriers.

---

## 📚 Reference Citation
```bibtex
@article{jetir2025railway,
  title={Railway Accident Analysis and Reform Prediction Using Machine Learning},
  journal={Journal of Emerging Technologies and Innovative Research (JETIR)},
  volume={12},
  number={4},
  pages={f393--f397},
  year={2025},
  issn={2349-5162}
}
```
