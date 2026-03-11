from datetime import datetime, timedelta, timezone

from jose import jwt, JWTError

from app.core.config import settings
from app.common.exceptions import AppException


class JWTService:

    def create_access_token(self, user_id: int) -> str:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE)
        payload = {"sub": str(user_id), "type": "access", "exp": expire}
        return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

    def create_refresh_token(self, user_id: int) -> str:
        expire = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE)
        payload = {"sub": str(user_id), "type": "refresh", "exp": expire}
        return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

    def verify_token(self, token: str, expected_type: str = "access") -> dict:
        try:
            payload = jwt.decode(
                token,
                settings.JWT_SECRET_KEY,
                algorithms=[settings.JWT_ALGORITHM],
            )
            if payload.get("type") != expected_type:
                raise AppException("Invalid token type", 401)
            return payload
        except JWTError:
            raise AppException("Invalid or expired token", 401)

    def get_user_id(self, token: str) -> int:
        payload = self.verify_token(token)
        return int(payload["sub"])
