from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.config import settings

engine = create_async_engine(
    settings.database_url,
    connect_args={"ssl": "require"},
    pool_pre_ping=True,
    pool_recycle=300,
)
async_session = async_sessionmaker(engine, expire_on_commit=False)

class Base(DeclarativeBase):
    """All database models inherit from this class."""
