from ninja import Router
from typing import List, Union
from supabase import Client

from app.core.db import get_supabase_client
from app.schemas.depoimento import DepoimentoResponsavel, DepoimentoResponsavelCreate
from app.schemas.common import ErrorResponse, SuccessResponse

router = Router()


@router.get("/", response={200: List[DepoimentoResponsavel], 500: ErrorResponse})
def get_depoimentos(request) -> Union[List[DepoimentoResponsavel], ErrorResponse]:
    """
    Get all approved testimonials (depoimentos)
    
    Returns:
        List[DepoimentoResponsavel]: List of approved testimonials
        ErrorResponse: Error response with error details
    """
    try:
        supabase: Client = get_supabase_client()
        
        # Get all approved testimonials
        result = supabase.table("DepoimentoResponsavel").select("*").eq("aprovado", True).execute()
        
        if result.data:
            return [DepoimentoResponsavel(**depoimento) for depoimento in result.data]
        else:
            return []
            
    except Exception as e:
        return ErrorResponse(
            message=f"An error occurred while fetching testimonials: {str(e)}",
            error_code="FETCH_DEPOIMENTOS_ERROR"
        )


@router.post("/", response={201: DepoimentoResponsavel, 400: ErrorResponse, 500: ErrorResponse})
def create_depoimento(request, depoimento_data: DepoimentoResponsavelCreate) -> Union[DepoimentoResponsavel, ErrorResponse]:
    """
    Create a new testimonial (depoimento)
    
    Args:
        depoimento_data: Testimonial data including text and optional category
        
    Returns:
        DepoimentoResponsavel: Created testimonial
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
        
        # Create testimonial
        testimonial_data = {
            "texto": depoimento_data.texto,
            "aprovado": False,  # New testimonials need approval
            "responsavel_id": user.user.id,
            "categoria_id": depoimento_data.categoria_id
        }
        
        result = supabase.table("DepoimentoResponsavel").insert(testimonial_data).execute()
        
        if result.data:
            return DepoimentoResponsavel(**result.data[0])
        else:
            return ErrorResponse(
                message="Failed to create testimonial",
                error_code="CREATE_DEPOIMENTO_FAILED"
            )
            
    except Exception as e:
        return ErrorResponse(
            message=f"An error occurred while creating testimonial: {str(e)}",
            error_code="CREATE_DEPOIMENTO_ERROR"
        )
