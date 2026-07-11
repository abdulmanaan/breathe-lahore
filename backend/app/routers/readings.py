from fastapi import APIRouter
from sqlalchemy import select
from app.database import async_session
from app.models import AirQualityReading
from app.services.air_quality import fetch_and_store_readings

router = APIRouter(prefix="/api/readings", tags=["readings"])

@router.post("/refresh")
async def refresh_readings():
    """Fetch the latest air quality data and store it."""
    inserted = await fetch_and_store_readings(past_days=7)
    return {"new_readings": inserted}

@router.get("/latest")
async def latest_reading():
    """Return the most recent stored air quality reading."""
    async with async_session() as session:
        result = await session.execute(
            select(AirQualityReading)
            .order_by(AirQualityReading.measured_at.desc())
            .limit(1)
        )
        reading = result.scalar_one_or_none()

    if reading is None:
        return {"message": "No readings stored yet."}

    return {
        "measured_at": reading.measured_at,
        "us_aqi": reading.us_aqi,
        "pm2_5": reading.pm2_5,
        "pm10": reading.pm10,
    }
