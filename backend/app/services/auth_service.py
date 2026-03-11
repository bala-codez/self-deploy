from datetime import datetime, timedelta, timezone
from app.core.security import hash_password, verify_password
from app.common.exceptions import AppException
from app.repositories.user_repository import UserRepository
from app.services.email_service import EmailService
from app.services.jwt_service import JWTService
from app.utils.otp_generator import generate_otp
from app.core.config import settings

class AuthService:

    def __init__(
        self,
        user_repository: UserRepository,
        email_service: EmailService,
        jwt_service: JWTService,
    ):
        self.user_repository = user_repository
        self.email_service = email_service
        self.jwt_service = jwt_service


    def register_user(self, register_data) -> dict:
        existing = self.user_repository.get_user_by_email(register_data.email)

        if existing:
            if existing.is_verified:
                raise AppException("An account with this email already exists.", 409)
            # Unverified → resend a fresh OTP
            otp = generate_otp()
            expires = datetime.now(timezone.utc) + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)
            self.user_repository.set_otp(existing, otp, expires)
            self._send_otp(existing.email, otp)
            return {
                "message": "Account already exists but is unverified. A new OTP has been sent.",
                "email": existing.email,
            }

        hashed = hash_password(register_data.password)
        otp = generate_otp()
        expires = datetime.now(timezone.utc) + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)

        user = self.user_repository.create_user(
            name=register_data.name,
            email=register_data.email,
            password=hashed,
            is_verified=False,
        )
        self.user_repository.set_otp(user, otp, expires)
        self._send_otp(user.email, otp)

        return {
            "message": "Registration successful. Please verify your email.",
            "email": user.email,
        }


    def login_user(self, login_data) -> dict:
        user = self.user_repository.get_user_by_email(login_data.email)

        if not user or not user.password:
            raise AppException("Invalid email or password.", 401)
        print(login_data)
        if not verify_password(login_data.password, user.password):
            raise AppException("Invalid email or password.", 401)

        if not user.is_verified:
            # Resend a fresh OTP so they can complete verification
            otp = generate_otp()
            expires = datetime.now(timezone.utc) + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)
            self.user_repository.set_otp(user, otp, expires)
            self._send_otp(user.email, otp)
            raise AppException(
                "Email not verified. A new OTP has been sent to your email.", 403
            )

        access_token = self.jwt_service.create_access_token(user.id)
        refresh_token = self.jwt_service.create_refresh_token(user.id)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "is_verified": user.is_verified,
                "profile": user.profile,
                "auth_provider": user.auth_provider,
            },
        }


    def resend_otp(self, resend_data) -> dict:
        user = self.user_repository.get_user_by_email(resend_data.email)

        if not user:
            # Don't reveal whether the account exists
            return {"message": "If the email is registered, an OTP has been sent."}

        if user.is_verified:
            raise AppException("Email is already verified.", 400)

        otp = generate_otp()
        expires = datetime.now(timezone.utc) + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)
        self.user_repository.set_otp(user, otp, expires)
        self._send_otp(user.email, otp)

        return {"message": "A new OTP has been sent to your email."}


    def verify_otp(self, verify_data) -> dict:
        user = self.user_repository.get_user_by_email(verify_data.email)

        if not user:
            raise AppException("Invalid OTP or email.", 400)

        if user.is_verified:
            raise AppException("Email is already verified. Please log in.", 400)

        if not user.otp_code or user.otp_code != verify_data.otp:
            raise AppException("Invalid OTP.", 400)

        now = datetime.now(timezone.utc)
        otp_expires = user.otp_expires
        if otp_expires is not None and otp_expires.tzinfo is None:
            otp_expires = otp_expires.replace(tzinfo=timezone.utc)

        if otp_expires is None or now > otp_expires:
            raise AppException("OTP has expired. Please request a new one.", 400)

        self.user_repository.verify_user(user)

        access_token = self.jwt_service.create_access_token(user.id)
        refresh_token = self.jwt_service.create_refresh_token(user.id)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "is_verified": user.is_verified,
                "profile": user.profile,
                "auth_provider": user.auth_provider,
            },
        }

    def _send_otp(self, email: str, otp: str) -> None:
        try:
            self.email_service.send_otp_email(email, otp)
        except Exception as exc:
            print("OTP email delivery failed for %s: %s", email, exc)