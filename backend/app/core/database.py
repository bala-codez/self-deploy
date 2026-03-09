from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings


class Database:

    def __init__(self):

        self.database_url =\
            (
                f'mysql+pymysql://'
                f'{settings.DATABASE_USER}:'
                f'{settings.DATABASE_PASSWORD}@'
                f'{settings.DATABASE_HOST}/'
                f'{settings.DATABASE_NAME}'
             )

        self.engine = create_engine(
            self.database_url,
            pool_pre_ping=True,
            pool_size=5,
            max_overflow=10
        )

        self.sessionLocal = sessionmaker(
            bind=self.engine,
            autocommit=False,
            autoflush=False
        )

        self.Base = declarative_base()

    def get_db(self):

        db = self.sessionLocal()
        try:
            yield db
        finally:
            db.close()

database = Database()