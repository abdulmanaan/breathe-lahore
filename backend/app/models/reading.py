from datetime import datetime
from sqlalchemy import DateTime, Integer, Float
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base

class AirQualityReading(Base):
    """One air quality measurement for Lahore at a specific hour."""

    __tablename__ = "air_quality_readings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    measured_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), unique=True, index=True)
    us_aqi: Mapped[int | None] = mapped_column(Integer)
    pm2_5: Mapped[float | None] = mapped_column(Float)
    pm10: Mapped[float | None] = mapped_column(Float)
    ozone: Mapped[float | None] = mapped_column(Float)
    nitrogen_dioxide: Mapped[float | None] = mapped_column(Float)
    sulphur_dioxide: Mapped[float | None] = mapped_column(Float)
    carbon_monoxide: Mapped[float | None] = mapped_column(Float)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
