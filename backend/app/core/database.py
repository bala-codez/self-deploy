from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

database_url =\
(
    f'mysql+pymysql://'
    f'{settings.DATABASE_USER}:'
    f'{settings.DATABASE_PASSWORD}@'
    f'{settings.DATABASE_HOST}/'
    f'{settings.DATABASE_NAME}'
)

engine = create_engine(
    database_url,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10
)

sessionLocal = sessionmaker(bind=engine,autocommit=False,autoflush=False)

Base = declarative_base()