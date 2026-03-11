from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from app.core.database import Base


class User(Base):

    __tablename__ = "users"

    # general
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=True)        # NULL for OAuth users
    is_verified = Column(Boolean, default=False, nullable=False)
    profile = Column(String(500), nullable=True)

    # OAuth
    google_id = Column(String(255), unique=True, nullable=True, index=True)
    auth_provider = Column(String(20), default="email", nullable=False)  # email | google

    # OTP
    otp_code = Column(String(10), nullable=True)
    otp_expires = Column(DateTime, nullable=True)

    # Timestamps
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
