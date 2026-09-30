import os
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
os.makedirs(DATA_DIR, exist_ok=True)
DB_PATH = os.path.join(DATA_DIR, 'railway_safety.db')

DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class AccidentRecord(Base):
    __tablename__ = "accident_records"

    id = Column(Integer, primary_key=True, index=True)
    accident_cause = Column(String, nullable=False)
    accident_type = Column(String, nullable=False)
    rail_zone = Column(String, nullable=False)
    weather_condition = Column(String, nullable=False)
    rescue_response_time_min = Column(Float, nullable=False)
    track_stiffness_index = Column(Float, nullable=False)
    speed_mph = Column(Float, nullable=False)
    equipment_age_years = Column(Float, nullable=False)
    human_error_flag = Column(Integer, nullable=False)
    predicted_reform = Column(String, nullable=False)
    risk_level = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
