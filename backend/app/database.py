from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from config import settings

engine = create_async_engine(url=settings.database_url, connect_args={"ssl": "require"})

async_session = async_sessionmaker(engine, expire_on_commit=False)

class Base(DeclarativeBase):
    """All database models inherit from this class."""
