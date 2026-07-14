from datetime import datetime
from zoneinfo import ZoneInfo
import httpx
from sqlalchemy.dialects.postgresql import insert
from app.database import async_session
from app.models import AirQualityReading

# Coordinates for Lahore
LAHORE_LAT = 31.5497
LAHORE_LON = 74.3436

LAHORE_TZ = ZoneInfo("Asia/Karachi")

API_URL = "https://air-quality-api.open-meteo.com/v1/air-quality"

# Pollutants to request from the API
POLLUTANTS = [
    "us_aqi",
    "pm2_5",
    "pm10",
    "ozone",
    "nitrogen_dioxide",
    "sulphur_dioxide",
    "carbon_monoxide",
]

async def fetch_and_store_readings(past_days: int = 1) -> int:
    """Fetch hourly air quality data for Lahore, store it and
    return the number of new readings inserted."""

    params = {
        "latitude": LAHORE_LAT,
        "longitude": LAHORE_LON,
        "hourly": ",".join(POLLUTANTS), # Convert list to comma-separated string
        "past_days": past_days,
        "forecast_days": 1,
        "timezone": "Asia/Karachi",
    }

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.get(API_URL, params=params)
        response.raise_for_status()
        data = response.json()

    hourly = data["hourly"]
    timestamps = hourly["time"]
    now = datetime.now(LAHORE_TZ).replace(tzinfo=None)

    rows = []
    # Loop through each hourly reading
    for i, ts in enumerate(timestamps):
        measured_at = datetime.fromisoformat(ts)
        # Skip future (forecast) hours
        if measured_at > now:
            continue
        # Build one database row
        rows.append(
            {
                "measured_at": measured_at,
                "us_aqi": hourly["us_aqi"][i],
                "pm2_5": hourly["pm2_5"][i],
                "pm10": hourly["pm10"][i],
                "ozone": hourly["ozone"][i],
                "nitrogen_dioxide": hourly["nitrogen_dioxide"][i],
                "sulphur_dioxide": hourly["sulphur_dioxide"][i],
                "carbon_monoxide": hourly["carbon_monoxide"][i],
            }
        )

    if not rows:
        return 0

    # Insert rows and ignore duplicates
    statement = (
        insert(AirQualityReading)
        .values(rows)
        .on_conflict_do_nothing(index_elements=["measured_at"])
    )

    # Execute query and save changes
    async with async_session() as session:
        result = await session.execute(statement)
        await session.commit()
        return result.rowcount or 0
