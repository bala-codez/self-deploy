from fastapi import APIRouter, Depends
from starlette import status
from app.common.responses import success_response
from app.dependencies.services import get_auth_service
from app.services.auth_service import AuthService
from app.schemas.auth_schema import LoginSchema,RegisterSchema,VerifyOtpSchema,ResendOtpSchema
router = APIRouter(prefix="/auth", tags=["auth"])



@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(
    body: RegisterSchema,
    auth_service: AuthService = Depends(get_auth_service),
):
    result = auth_service.register_user(body)
    return success_response(
        message=result["message"],
        status=status.HTTP_201_CREATED,
        data={"email": result["email"]},
    )


@router.post("/login", status_code=status.HTTP_200_OK)
def login(
    body: LoginSchema,
    auth_service: AuthService = Depends(get_auth_service),
):
    result = auth_service.login_user(body)
    return success_response(
        message="Login successful.",
        status=status.HTTP_200_OK,
        data=result,
    )


@router.post("/email/verify-otp", status_code=status.HTTP_200_OK)
def verify_otp(
    body: VerifyOtpSchema,
    auth_service: AuthService = Depends(get_auth_service),
):
    result = auth_service.verify_otp(body)
    return success_response(
        message="Email verified successfully.",
        status=status.HTTP_200_OK,
        data=result,
    )


@router.post("/email/resend-otp", status_code=status.HTTP_200_OK)
def resend_otp(
    body: ResendOtpSchema,
    auth_service: AuthService = Depends(get_auth_service),
):
    result = auth_service.resend_otp(body)
    return success_response(
        message=result["message"],
        status=status.HTTP_200_OK,
    )
