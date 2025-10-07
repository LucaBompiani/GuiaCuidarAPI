from ninja import Router
from ninja.responses import Response
from typing import Union
from supabase import Client

from app.core.db import get_supabase_client
from app.schemas.auth import (
    SignInRequest, 
    LoginRequest, 
    AuthResponse, 
    ErrorResponse
)

router = Router()


@router.post("/signin", response={200: AuthResponse, 400: ErrorResponse, 500: ErrorResponse})
def signin(request, signin_data: SignInRequest) -> Union[AuthResponse, ErrorResponse]:
    """
    Create a new user account (sign up)
    
    Args:
        signin_data: User signin information including email, password, first_name, last_name
        
    Returns:
        AuthResponse: Success response with user data and tokens
        ErrorResponse: Error response with error details
    """
    try:
        supabase: Client = get_supabase_client()
        
        # Create user with Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": signin_data.email,
            "password": signin_data.password,
            "options": {
                "data": {
                    "first_name": signin_data.first_name,
                    "last_name": signin_data.last_name
                }
            }
        })
        
        if auth_response.user:
            return AuthResponse(
                success=True,
                message="User created successfully. Please check your email to verify your account.",
                user_id=auth_response.user.id,
                access_token=auth_response.session.access_token if auth_response.session else None,
                refresh_token=auth_response.session.refresh_token if auth_response.session else None
            )
        else:
            return ErrorResponse(
                message="Failed to create user account",
                error_code="SIGNUP_FAILED"
            )
            
    except Exception as e:
        error_message = str(e)
        if "User already registered" in error_message:
            return ErrorResponse(
                message="User with this email already exists",
                error_code="USER_EXISTS"
            )
        elif "Password should be at least" in error_message:
            return ErrorResponse(
                message="Password must be at least 6 characters long",
                error_code="WEAK_PASSWORD"
            )
        elif "Invalid email" in error_message:
            return ErrorResponse(
                message="Please provide a valid email address",
                error_code="INVALID_EMAIL"
            )
        else:
            return ErrorResponse(
                message=f"An error occurred during signup: {error_message}",
                error_code="SIGNUP_ERROR"
            )


@router.post("/login", response={200: AuthResponse, 401: ErrorResponse, 500: ErrorResponse})
def login(request, login_data: LoginRequest) -> Union[AuthResponse, ErrorResponse]:
    """
    Authenticate user and return access tokens
    
    Args:
        login_data: User login information including email and password
        
    Returns:
        AuthResponse: Success response with user data and tokens
        ErrorResponse: Error response with error details
    """
    try:
        supabase: Client = get_supabase_client()
        
        # Authenticate user with Supabase Auth
        auth_response = supabase.auth.sign_in_with_password({
            "email": login_data.email,
            "password": login_data.password
        })
        
        if auth_response.user and auth_response.session:
            return AuthResponse(
                success=True,
                message="Login successful",
                user_id=auth_response.user.id,
                access_token=auth_response.session.access_token,
                refresh_token=auth_response.session.refresh_token
            )
        else:
            return ErrorResponse(
                message="Authentication failed",
                error_code="AUTH_FAILED"
            )
            
    except Exception as e:
        error_message = str(e)
        if "Invalid login credentials" in error_message:
            return ErrorResponse(
                message="Invalid email or password",
                error_code="INVALID_CREDENTIALS"
            )
        elif "Email not confirmed" in error_message:
            return ErrorResponse(
                message="Please verify your email address before logging in",
                error_code="EMAIL_NOT_CONFIRMED"
            )
        else:
            return ErrorResponse(
                message=f"An error occurred during login: {error_message}",
                error_code="LOGIN_ERROR"
            )


@router.post("/logout", response={200: AuthResponse, 401: ErrorResponse})
def logout(request) -> Union[AuthResponse, ErrorResponse]:
    """
    Logout the current user
    
    Returns:
        AuthResponse: Success response
        ErrorResponse: Error response with error details
    """
    try:
        supabase: Client = get_supabase_client()
        
        # Sign out the current user
        supabase.auth.sign_out()
        
        return AuthResponse(
            success=True,
            message="Logout successful"
        )
        
    except Exception as e:
        return ErrorResponse(
            message=f"An error occurred during logout: {str(e)}",
            error_code="LOGOUT_ERROR"
        )


@router.get("/me", response={200: dict, 401: ErrorResponse})
def get_current_user(request) -> Union[dict, ErrorResponse]:
    """
    Get current authenticated user information
    
    Returns:
        dict: User information
        ErrorResponse: Error response with error details
    """
    try:
        supabase: Client = get_supabase_client()
        
        # Get current user
        user = supabase.auth.get_user()
        
        if user.user:
            return {
                "id": user.user.id,
                "email": user.user.email,
                "email_confirmed_at": user.user.email_confirmed_at,
                "created_at": user.user.created_at,
                "user_metadata": user.user.user_metadata
            }
        else:
            return ErrorResponse(
                message="No authenticated user found",
                error_code="NO_USER"
            )
            
    except Exception as e:
        return ErrorResponse(
            message=f"An error occurred while fetching user: {str(e)}",
            error_code="USER_FETCH_ERROR"
        )
