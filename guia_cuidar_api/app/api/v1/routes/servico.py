from ninja import Router
from typing import List, Union
from supabase import Client

from app.core.db import get_supabase_client
from app.schemas.servico import ServicoLocal, TipoServico
from app.schemas.common import ErrorResponse

router = Router()


@router.get("/", response={200: List[ServicoLocal], 500: ErrorResponse})
def get_servicos_locais(request) -> Union[List[ServicoLocal], ErrorResponse]:
    """
    Get all service locations (serviços locais)
    
    Returns:
        List[ServicoLocal]: List of all service locations
        ErrorResponse: Error response with error details
    """
    try:
        supabase: Client = get_supabase_client()
        
        # Get all service locations
        result = supabase.table("ServicoLocal").select("*").execute()
        
        if result.data:
            return [ServicoLocal(**servico) for servico in result.data]
        else:
            return []
            
    except Exception as e:
        return ErrorResponse(
            message=f"An error occurred while fetching service locations: {str(e)}",
            error_code="FETCH_SERVICOS_ERROR"
        )


@router.get("/tipos", response={200: List[TipoServico], 500: ErrorResponse})
def get_tipos_servico(request) -> Union[List[TipoServico], ErrorResponse]:
    """
    Get all service types (tipos de serviço)
    
    Returns:
        List[TipoServico]: List of all service types
        ErrorResponse: Error response with error details
    """
    try:
        supabase: Client = get_supabase_client()
        
        # Get all service types
        result = supabase.table("TipoServico").select("*").execute()
        
        if result.data:
            return [TipoServico(**tipo) for tipo in result.data]
        else:
            return []
            
    except Exception as e:
        return ErrorResponse(
            message=f"An error occurred while fetching service types: {str(e)}",
            error_code="FETCH_TIPOS_SERVICO_ERROR"
        )
