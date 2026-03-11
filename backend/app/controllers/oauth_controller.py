from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse
from starlette import status
from starlette.requests import Request
from app.dependencies.services import get_oauth_service
from app.services.oauth_service import OAuthService
from app.core.config import settings

router = APIRouter(prefix="/oauth", tags=["OAuth"])


@router.get("/google", summary="Redirect to Google OAuth consent screen")
async def google_login(
    request: Request,
    oauth_service: OAuthService = Depends(get_oauth_service),
):
    return await oauth_service.get_google_redirect(request)


@router.get("/google/callback", summary="Handle Google OAuth callback")
async def google_callback(
    request: Request,
    oauth_service: OAuthService = Depends(get_oauth_service),
):
    result = await oauth_service.handle_google_callback(request)

    redirect_url = (
        f"{settings.FRONTEND_URL}/oauth/callback"
        f"?access_token={result['access_token']}"
        f"&refresh_token={result['refresh_token']}"
    )
    return RedirectResponse(url=redirect_url, status_code=status.HTTP_302_FOUND)