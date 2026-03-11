from app.common.response_schema import APIResponse

def success_response(message: str, status: int = 200, data=None) -> APIResponse:
    return APIResponse(
        status_code=status,
        success=True,
        message=message,
        data=data,
    )

def error_response(message: str, status: int = 400, error=None) -> APIResponse:
    return APIResponse(
        status_code=status,
        success=False,
        message=message,
        errors=error,
    )