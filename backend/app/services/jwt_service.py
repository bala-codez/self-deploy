from datetime import datetime, timedelta
from app.core.config import settings
from jose import jwt


class JWTService:

    def create_access_token(self, user_id: int):

        expire = datetime.utcnow() + timedelta(settings.ACCESS_TOKEN_EXPIRE)

        payload = {
            "sub": user_id,
            "type": "access",
            "exp": expire
        }

        token = jwt.encode(
            payload,
            settings.JWT_SECRET_KEY,
            algorithm=settings.JWT_ALGORITHM
        )

        return token


    def verify_token(self, token: str):

        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=settings.JWT_ALGORITHM
        )

        return payload


    def create_refresh_token(self, user_id: int):

        expire = datetime.utcnow() + timedelta(
            days=settings.REFRESH_TOKEN_EXPIRE
        )

        payload = {
            "sub": user_id,
            "type": "refresh",
            "exp": expire
        }

        token = jwt.encode(
            payload,
            settings.JWT_SECRET_KEY,
            algorithm=settings.JWT_ALGORITHM
        )

        return token