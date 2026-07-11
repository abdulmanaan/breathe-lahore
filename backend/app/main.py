from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.database import engine, Base
from sqlalchemy import text
from app.models import AirQualityReading
from app.routers.readings import router as readings_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Runs once at startup, create table that don't exist ye.
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Runs once at shutdown, close all database connections cleanly.
    await engine.dispose()

app = FastAPI(
    title="BreatheLahore API",
    description="Air quality intelligence for Lahore - trends, insights, and health guidance.",
    version="0.1.0",
    lifespan=lifespan
)

app.include_router(readings_router)

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
