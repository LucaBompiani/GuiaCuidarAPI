from ninja import Schema
from typing import Optional


class SignInRequest(Schema):
    """Schema for user signin request"""
    email: str
    password: str
    first_name: str
    last_name: str


class LoginRequest(Schema):
    """Schema for user login request"""
    email: str
    password: str


class AuthResponse(Schema):
    """Schema for authentication response"""
    success: bool
    message: str
    user_id: Optional[str] = None
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None


class ErrorResponse(Schema):
    """Schema for error response"""
    success: bool = False
    message: str
    error_code: Optional[str] = None
