from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.database import engine, Base
from sqlalchemy import text
from app.models import AirQualityReading
from app.routers.readings import router as readings_router
from app.routers.insights import router as insights_router
from app.scheduler import start_scheduler, stop_scheduler
import logging
from app.config import settings
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create missing tables and start the hourly scheduler on startup.
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    start_scheduler()
    yield
    # Stop the scheduler and close all database connections cleanly.
    stop_scheduler()
    await engine.dispose()

app = FastAPI(
    title="BreatheLahore API",
    description="Air quality intelligence for Lahore: trends, insights, and health guidance.",
    version="0.1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(readings_router)
app.include_router(insights_router)

@app.get("/")
def root():
    """API welcome message with pointers to documentation."""
    return {
        "service": "BreatheLahore API",
        "docs": "/docs",
        "health": "/health",
    }

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
