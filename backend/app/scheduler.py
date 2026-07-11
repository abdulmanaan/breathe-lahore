import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from app.services.air_quality import fetch_and_store_readings

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler(timezone="Asia/Karachi")

async def scheduled_fetch():
    """Job that runs every hour to pull fresh air quality data."""
    try:
        inserted = await fetch_and_store_readings(past_days=1)
        logger.info("Scheduled fetch complete: %s new readings stored.", inserted)
    except Exception:
        # Log errors but keep the scheduler running
        logger.exception("Scheduled air quality fetch failed.")

def start_scheduler() -> None:
    """Register jobs and start the scheduler."""
    scheduler.add_job(
        scheduled_fetch,
        trigger=CronTrigger(minute=10),
        id="hourly_air_quality_fetch",
    )
    scheduler.start()
    logger.info("Scheduler started with hourly air quality fetch job.")

def stop_scheduler() -> None:
    """Shut down the scheduler cleanly."""
    scheduler.shutdown(wait=False)
