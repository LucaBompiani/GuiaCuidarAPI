from ninja import NinjaAPI
from django.http import HttpRequest

from app.api.v1.routes.auth import router as auth_router
from app.api.v1.routes.depoimento import router as depoimento_router
from app.api.v1.routes.servico import router as servico_router
from app.api.v1.routes.estatisticas import router as estatisticas_router
from app.api.v1.routes.artigo import router as artigo_router
from app.api.v1.routes.material import router as material_router

# Create the main API instance
api = NinjaAPI(
    title="Guia Cuidar API",
    version="1.0.0",
    description="API for Guia Cuidar application"
)

# Include all route modules
api.add_router("/auth", auth_router, tags=["Authentication"])
api.add_router("/depoimentos", depoimento_router, tags=["Depoimentos"])
api.add_router("/servicos", servico_router, tags=["Serviços"])
api.add_router("/estatisticas", estatisticas_router, tags=["Estatísticas"])
api.add_router("/artigos", artigo_router, tags=["Artigos"])
api.add_router("/materiais", material_router, tags=["Materiais"])

# Health check endpoint
@api.get("/health", tags=["Health"])
def health_check(request: HttpRequest):
    """Health check endpoint"""
    return {"status": "healthy", "message": "Guia Cuidar API is running"}
