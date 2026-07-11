from datetime import datetime, timedelta
from sqlalchemy import func, select
from app.database import async_session
from app.models import AirQualityReading

def aqi_category(aqi: int) -> dict:
    """Translate a US AQI number into a category and health advice."""
    if aqi <= 50:
        return {
            "level": "Good",
            "color": "#22c55e",
            "advice": "Air quality is great. Perfect time for outdoor activities.",
        }

    if aqi <= 100:
        return {
            "level": "Moderate",
            "color": "#eab308",
            "advice": "Acceptable for most people. Unusually sensitive individuals should limit prolonged outdoor exertion.",
        }
    if aqi <= 200:
        return {
            "level": "Unhealthy",
            "color": "#ef4444",
            "advice": "Everyone should limit prolonged outdoor exertion. Consider wearing a mask outside.",
        }
    if aqi <= 300:
        return {
            "level": "Very Unhealthy",
            "color": "#a855f7",
            "advice": "Avoid outdoor activity. Keep windows closed and use an air purifier if available.",
        }
    return {
        "level": "Hazardous",
        "color": "#7f1d1d",
        "advice": "Health emergency conditions. Stay indoors with windows sealed.",
    }

async def get_safest_hours(days: int = 7) -> list[dict]:
    """Average AQI for each hour of the day over the last N days."""
    since = datetime.now() - timedelta(days=days)
    hour = func.extract("hour", AirQualityReading.measured_at).label("hour")

    query = (
        select(hour, func.avg(AirQualityReading.us_aqi).label("avg_aqi"))
        .where(AirQualityReading.measured_at >= since)
        .group_by(hour)
        .order_by(hour)
    )

    async with async_session() as session:
        result = await session.execute(query)
        rows = result.all()

    return [
        {"hour": int(row.hour), "avg_aqi": round(row.avg_aqi)}
        for row in rows
        if row.avg_aqi is not None
    ]

async def get_daily_trend(days: int = 14) -> list[dict]:
    """Daily average, best and worst AQI for the last N days."""

    since = datetime.now() - timedelta(days=days)
    day = func.date(AirQualityReading.measured_at).label("day")

    query = (
        select(
            day,
            func.avg(AirQualityReading.us_aqi).label("avg_aqi"),
            func.min(AirQualityReading.us_aqi).label("best_aqi"),
            func.max(AirQualityReading.us_aqi).label("worst_aqi"),
        )
        .where(AirQualityReading.measured_at >= since)
        .group_by(day)
        .order_by(day)
    )

    async with async_session() as session:
        result = await session.execute(query)
        rows = result.all()

    return [
        {
           "date": str(row.day),
            "avg_aqi": round(row.avg_aqi),
            "best_aqi": row.best_aqi,
            "worst_aqi": row.worst_aqi,
        }
        for row in rows
        if row is not None
    ]

async def get_current_summary() -> dict | None:
    """Latest reading enriched with category, advice, and 24h comparison."""

    async with async_session() as session:
        result = await session.execute(
            select(AirQualityReading)
            .order_by(AirQualityReading.measured_at.desc())
            .limit(1)
        )
        latest = result.scalar_one_or_none()

        if latest is None or latest.us_aqi is None:
            return None

        day_ago = latest.measured_at - timedelta(hours=24)
        result = await session.execute(
            select(AirQualityReading.us_aqi)
            .where(AirQualityReading.measured_at <= day_ago)
            .order_by(AirQualityReading.measured_at.desc())
            .limit(1)
        )
        yesterday_aqi = result.scalar_one_or_none()

    change_24 = None
    if yesterday_aqi is not None:
        change_24 = latest.us_aqi - yesterday_aqi

    return {
        "measured_at": latest.measured_at,
        "us_aqi": latest.us_aqi,
        "pm2_5": latest.pm2_5,
        "pm10": latest.pm10,
        "category": aqi_category(latest.us_aqi),
        "change_24h": change_24,
    }
