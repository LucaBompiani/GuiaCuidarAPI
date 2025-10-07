from ninja import NinjaAPI
from django.http import HttpRequest

from app.api.v1.routes.auth import router as auth_router

# Create the main API instance
api = NinjaAPI(
    title="Guia Cuidar API",
    version="1.0.0",
    description="API for Guia Cuidar application"
)

# Include auth routes
api.add_router("/auth", auth_router, tags=["Authentication"])

# Health check endpoint
@api.get("/health", tags=["Health"])
def health_check(request: HttpRequest):
    """Health check endpoint"""
    return {"status": "healthy", "message": "Guia Cuidar API is running"}
