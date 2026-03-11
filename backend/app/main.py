from sys import api_version

from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware

from app.core.config import settings
from fastapi.middleware.cors import CORSMiddleware
from app.controllers.auth_controller import router as auth_router
from app.controllers.oauth_controller import router as oauth_router
app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None
)

# allow frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# oauth session
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.JWT_SECRET_KEY
)

# routers
app.include_router(auth_router , prefix=settings.API_VERSION)
app.include_router(oauth_router , prefix=settings.API_VERSION)

# simple api testing
@app.get(settings.API_VERSION)
def test():
    return {"message": "Hello World"}