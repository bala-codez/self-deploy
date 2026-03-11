from datetime import datetime
from sqlalchemy.orm import Session
from app.models.user_model import User


class UserRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_user_by_email(self, email: str) -> User | None:
        return self.db.query(User).filter(User.email == email).first()

    def get_user_by_id(self, user_id: int) -> User | None:
        return self.db.query(User).filter(User.id == user_id).first()

    def get_user_by_google_id(self, google_id: str) -> User | None:
        return self.db.query(User).filter(User.google_id == google_id).first()

    def create_user(
        self,
        name: str,
        email: str,
        password: str | None = None,
        google_id: str | None = None,
        profile: str | None = None,
        auth_provider: str = "email",
        is_verified: bool = False,
    ) -> User:
        user = User(
            name=name,
            email=email,
            password=password,
            google_id=google_id,
            profile=profile,
            auth_provider=auth_provider,
            is_verified=is_verified,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def set_otp(self, user: User, otp: str, expires: datetime) -> User:
        user.otp_code = otp
        user.otp_expires = expires
        self.db.commit()
        self.db.refresh(user)
        return user

    def clear_otp(self, user: User) -> User:
        user.otp_code = None
        user.otp_expires = None
        self.db.commit()
        self.db.refresh(user)
        return user

    def verify_user(self, user: User) -> User:
        user.is_verified = True
        user.otp_code = None
        user.otp_expires = None
        self.db.commit()
        self.db.refresh(user)
        return user
