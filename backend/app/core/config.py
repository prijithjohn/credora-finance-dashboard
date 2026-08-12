from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    project_name: str = 'Credora'
    environment: str = 'development'
    api_v1_prefix: str = '/api/v1'
    database_url: str = Field(
        default='postgresql+psycopg://credora:credora_pass@localhost:5434/credora',
        alias='DATABASE_URL',
    )

    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        case_sensitive=False,
        extra='ignore',
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
