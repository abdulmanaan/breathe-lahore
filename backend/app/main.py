from fastapi import FastAPI
from database import engine
from sqlalchemy import text

app = FastAPI(
    title="BreatheLahore API",
    description="Air quality intelligence for Lahore - trends, insights, and health guidance.",
    version="0.1.0"
)

@app.get("/health")
def health_check():
    """Simple endpoint to confirm the API is running."""
    return {"status": "ok"}

@app.get("/health/db")
async def database_health_check():
    """Confirms the API can reach the PostgreSQL database."""
    async with engine.connect() as conn:
        result = await conn.execute(text("SELECT 1"))
        result.scalar()
    return {"database": "connected"}
