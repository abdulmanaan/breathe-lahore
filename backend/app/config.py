from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """Load application settings from environment variable"""

    database_url: str

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
