from fastapi import APIRouter, Query
from app.services.insights import get_current_summary, get_daily_trend, get_safest_hours

router = APIRouter(prefix="/api/insights", tags=["insights"])

@router.get("/summary")
async def current_summary():
    """Current air quality with category, health advice, and 24h change."""
    summary = await get_current_summary()
    if summary is None:
        return {"message": "No data available yet."}
    return summary

@router.get("/safest-hours")
async def safest_hours(days: int = Query(default=7, ge=1, le=30)):
    """Average AQI by hour of day, find cleanest time for outdoor activity."""
    return {"days_analyzed": days, "hours": await get_safest_hours(days)}

@router.get("/daily-trend")
async def daily_trend(days: int = Query(default=14, ge=1, le=90)):
    """Daily average, best, and worst AQI for trend visualization."""
    return {"days_analyzed": days, "trend": await get_daily_trend(days)}
