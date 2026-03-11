from pydantic import BaseModel
from typing import Optional, Generic, TypeVar

T = TypeVar("T")

class APIResponse(BaseModel, Generic[T]):
    status_code: int
    success: bool
    message: str
    data: Optional[T] = None
    errors: Optional[T] = None