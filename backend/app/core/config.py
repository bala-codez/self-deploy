from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):

    APP_NAME: str
    API_VERSION : str
    DATABASE_HOST :str
    DATABASE_PORT :int
    DATABASE_USER :str
    DATABASE_PASSWORD :str
    DATABASE_NAME : str
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str
    ACCESS_TOKEN_EXPIRE: int
    REFRESH_TOKEN_EXPIRE: int
    SMTP_USER: str
    SMTP_PASSWORD: str
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    FRONTEND_ORIGINS: str
    DEBUG: bool = False

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()