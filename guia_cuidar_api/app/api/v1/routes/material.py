from ninja import Router
from typing import List, Union
from supabase import Client

from app.core.db import get_supabase_client
from app.schemas.material import (
    MaterialDeApoio, 
    MaterialFavorito, 
    MaterialFavoritoCreate,
    NivelSuporteTEA,
    CategoriaMaterial
)
from app.schemas.common import ErrorResponse, SuccessResponse

router = Router()


@router.get("/", response={200: List[MaterialDeApoio], 500: ErrorResponse})
def get_materiais(request) -> Union[List[MaterialDeApoio], ErrorResponse]:
    """
    Get all support materials (materiais de apoio)
    
    Returns:
        List[MaterialDeApoio]: List of all support materials
        ErrorResponse: Error response with error details
    """
    try:
        supabase: Client = get_supabase_client()
        
        # Get all support materials
        result = supabase.table("MaterialDeApoio").select("*").execute()
        
        if result.data:
            return [MaterialDeApoio(**material) for material in result.data]
        else:
            return []
            
    except Exception as e:
        return ErrorResponse(
            message=f"An error occurred while fetching support materials: {str(e)}",
            error_code="FETCH_MATERIAIS_ERROR"
        )


@router.get("/favoritos", response={200: List[MaterialFavorito], 500: ErrorResponse})
def get_materiais_favoritos(request) -> Union[List[MaterialFavorito], ErrorResponse]:
    """
    Get all favorite materials for the current user
    
    Returns:
        List[MaterialFavorito]: List of user's favorite materials
        ErrorResponse: Error response with error details
    """
    try:
        supabase: Client = get_supabase_client()
        
        # Get current user
        user = supabase.auth.get_user()
        if not user.user:
            return ErrorResponse(
                message="User not authenticated",
                error_code="NOT_AUTHENTICATED"
            )
        
        # Get user's favorite materials
        result = supabase.table("MaterialFavorito").select("*").eq("responsavel_id", user.user.id).execute()
        
        if result.data:
            return [MaterialFavorito(**favorito) for favorito in result.data]
        else:
            return []
            
    except Exception as e:
        return ErrorResponse(
            message=f"An error occurred while fetching favorite materials: {str(e)}",
            error_code="FETCH_FAVORITOS_ERROR"
        )


@router.post("/favoritar", response={201: MaterialFavorito, 400: ErrorResponse, 500: ErrorResponse})
def favoritar_material(request, favorito_data: MaterialFavoritoCreate) -> Union[MaterialFavorito, ErrorResponse]:
    """
    Add a material to favorites
    
    Args:
        favorito_data: Material and dependent information for favoriting
        
    Returns:
        MaterialFavorito: Created favorite material
        ErrorResponse: Error response with error details
    """
    try:
        supabase: Client = get_supabase_client()
        
        # Get current user
        user = supabase.auth.get_user()
        if not user.user:
            return ErrorResponse(
                message="User not authenticated",
                error_code="NOT_AUTHENTICATED"
            )
        
        # Check if material exists
        material_result = supabase.table("MaterialDeApoio").select("id").eq("id", favorito_data.material_id).execute()
        if not material_result.data:
            return ErrorResponse(
                message="Material not found",
                error_code="MATERIAL_NOT_FOUND"
            )
        
        # Check if dependent belongs to user
        dependente_result = supabase.table("Dependente").select("id").eq("id", favorito_data.dependente_id).eq("responsavel_id", user.user.id).execute()
        if not dependente_result.data:
            return ErrorResponse(
                message="Dependent not found or does not belong to user",
                error_code="DEPENDENTE_NOT_FOUND"
            )
        
        # Create favorite material
        favorito_material_data = {
            "responsavel_id": user.user.id,
            "material_id": favorito_data.material_id,
            "dependente_id": favorito_data.dependente_id
        }
        
        result = supabase.table("MaterialFavorito").insert(favorito_material_data).execute()
        
        if result.data:
            return MaterialFavorito(**result.data[0])
        else:
            return ErrorResponse(
                message="Failed to add material to favorites",
                error_code="FAVORITAR_FAILED"
            )
            
    except Exception as e:
        error_message = str(e)
        if "duplicate key" in error_message.lower():
            return ErrorResponse(
                message="Material is already in favorites",
                error_code="ALREADY_FAVORITED"
            )
        return ErrorResponse(
            message=f"An error occurred while adding material to favorites: {error_message}",
            error_code="FAVORITAR_ERROR"
        )


@router.delete("/favoritar/{material_id}/{dependente_id}", response={200: SuccessResponse, 400: ErrorResponse, 500: ErrorResponse})
def desfavoritar_material(request, material_id: int, dependente_id: int) -> Union[SuccessResponse, ErrorResponse]:
    """
    Remove a material from favorites
    
    Args:
        material_id: ID of the material to remove from favorites
        dependente_id: ID of the dependent
        
    Returns:
        SuccessResponse: Success response
        ErrorResponse: Error response with error details
    """
    try:
        supabase: Client = get_supabase_client()
        
        # Get current user
        user = supabase.auth.get_user()
        if not user.user:
            return ErrorResponse(
                message="User not authenticated",
                error_code="NOT_AUTHENTICATED"
            )
        
        # Remove favorite material
        result = supabase.table("MaterialFavorito").delete().eq("responsavel_id", user.user.id).eq("material_id", material_id).eq("dependente_id", dependente_id).execute()
        
        if result.data:
            return SuccessResponse(
                success=True,
                message="Material removed from favorites successfully"
            )
        else:
            return ErrorResponse(
                message="Material not found in favorites",
                error_code="FAVORITE_NOT_FOUND"
            )
            
    except Exception as e:
        return ErrorResponse(
            message=f"An error occurred while removing material from favorites: {str(e)}",
            error_code="DESFAVORITAR_ERROR"
        )


@router.get("/categorias", response={200: List[CategoriaMaterial], 500: ErrorResponse})
def get_categorias_material(request) -> Union[List[CategoriaMaterial], ErrorResponse]:
    """
    Get all material categories
    
    Returns:
        List[CategoriaMaterial]: List of all material categories
        ErrorResponse: Error response with error details
    """
    try:
        supabase: Client = get_supabase_client()
        
        # Get all material categories
        result = supabase.table("CategoriaMaterial").select("*").execute()
        
        if result.data:
            return [CategoriaMaterial(**categoria) for categoria in result.data]
        else:
            return []
            
    except Exception as e:
        return ErrorResponse(
            message=f"An error occurred while fetching material categories: {str(e)}",
            error_code="FETCH_CATEGORIAS_ERROR"
        )


@router.get("/niveis-suporte", response={200: List[NivelSuporteTEA], 500: ErrorResponse})
def get_niveis_suporte(request) -> Union[List[NivelSuporteTEA], ErrorResponse]:
    """
    Get all TEA support levels
    
    Returns:
        List[NivelSuporteTEA]: List of all TEA support levels
        ErrorResponse: Error response with error details
    """
    try:
        supabase: Client = get_supabase_client()
        
        # Get all TEA support levels
        result = supabase.table("NivelSuporteTEA").select("*").execute()
        
        if result.data:
            return [NivelSuporteTEA(**nivel) for nivel in result.data]
        else:
            return []
            
    except Exception as e:
        return ErrorResponse(
            message=f"An error occurred while fetching TEA support levels: {str(e)}",
            error_code="FETCH_NIVEIS_ERROR"
        )
