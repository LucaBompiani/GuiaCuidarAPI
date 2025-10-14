from pydantic import BaseModel
from typing import Optional


class ErrorResponse(BaseModel):
    message: str
    error_code: Optional[str] = None


class SuccessResponse(BaseModel):
    success: bool
    message: str
