from fastapi import Depends
from app.dependencies.repositories import get_user_repository
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService
from app.services.email_service import EmailService
from app.services.jwt_service import JWTService
from app.services.oauth_service import OAuthService


def get_email_service() -> EmailService:
    return EmailService()


def get_jwt_service() -> JWTService:
    return JWTService()


def get_auth_service(
    user_repo: UserRepository = Depends(get_user_repository),
    email_service: EmailService = Depends(get_email_service),
    jwt_service: JWTService = Depends(get_jwt_service),
) -> AuthService:
    return AuthService(user_repo, email_service, jwt_service)


def get_oauth_service(
    user_repo: UserRepository = Depends(get_user_repository),
    jwt_service: JWTService = Depends(get_jwt_service),
) -> OAuthService:
    return OAuthService(user_repo, jwt_service)
