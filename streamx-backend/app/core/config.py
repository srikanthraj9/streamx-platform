from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "StreamX API"
    JWT_SECRET: str = "change-me"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    DATABASE_URL: str = "sqlite:///./streamx.db"

    class Config:
        env_file = ".env"

settings = Settings()
