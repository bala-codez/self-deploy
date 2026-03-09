from sys import api_version

from fastapi import FastAPI
from app.core.config import settings
from fastapi.middleware.cors import CORSMiddleware
from app.controllers.auth_controller import router as auth_router
from app.controllers.oauth_controller import router as oauth_router
app = FastAPI(title=settings.APP_NAME)

# allow frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router , prefix=settings.API_VERSION)
app.include_router(oauth_router , prefix=settings.API_VERSION)