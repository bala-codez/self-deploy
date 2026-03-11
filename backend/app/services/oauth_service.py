from authlib.integrations.starlette_client import OAuth
from starlette.requests import Request
from app.core.config import settings
from app.common.exceptions import AppException
from app.repositories.user_repository import UserRepository
from app.services.jwt_service import JWTService

oauth = OAuth()

oauth.register(
    name="google",
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={
        "scope": "openid email profile",
        "prompt": "consent",
    },
)


class OAuthService:

    def __init__(self, user_repository: UserRepository, jwt_service: JWTService):
        self.user_repository = user_repository
        self.jwt_service = jwt_service


    async def get_google_redirect(self, request: Request):
        return await oauth.google.authorize_redirect(
            request,
            redirect_uri=settings.GOOGLE_REDIRECT_URI,
        )


    async def handle_google_callback(self, request: Request) -> dict:
        try:
            token = await oauth.google.authorize_access_token(request)
        except Exception as exc:
            print("Authlib token exchange error: %s", exc)
            raise AppException("Google authentication failed. Please try again.", 502)

        user_info = token.get("userinfo")
        if not user_info:
            user_info = await oauth.google.userinfo(token=token)

        google_id = user_info.get("sub")
        email = user_info.get("email")
        email_verified = user_info.get("email_verified", False)
        name = user_info.get("name") or (email.split("@")[0] if email else "User")
        picture = user_info.get("picture")

        if not email or not email_verified:
            raise AppException("Google account email is not verified.", 400)

        user = self.user_repository.get_user_by_google_id(google_id)

        if not user:
            existing = self.user_repository.get_user_by_email(email)
            if existing:
                if existing.auth_provider == "email":
                    raise AppException(
                        "This email is already registered with a password. "
                        "Please sign in with email and password.",
                        409,
                    )
                existing.google_id = google_id
                user = existing
            else:
                user = self.user_repository.create_user(
                    name=name,
                    email=email,
                    google_id=google_id,
                    profile=picture,
                    auth_provider="google",
                    is_verified=True,
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
