from ninja import Router
from typing import List, Union
from supabase import Client

from app.core.db import get_supabase_client
from app.schemas.estatisticas import DadosEstatisticosTEA
from app.schemas.common import ErrorResponse

router = Router()


@router.get("/", response={200: List[DadosEstatisticosTEA], 500: ErrorResponse})
def get_dados_estatisticos(request) -> Union[List[DadosEstatisticosTEA], ErrorResponse]:
    """
    Get all TEA statistical data (dados estatísticos)
    
    Returns:
        List[DadosEstatisticosTEA]: List of all statistical data
        ErrorResponse: Error response with error details
    """
    try:
        supabase: Client = get_supabase_client()
        
        # Get all statistical data
        result = supabase.table("DadosEstatisticosTEA").select("*").execute()
        
        if result.data:
            return [DadosEstatisticosTEA(**dado) for dado in result.data]
        else:
            return []
            
    except Exception as e:
        return ErrorResponse(
            message=f"An error occurred while fetching statistical data: {str(e)}",
            error_code="FETCH_ESTATISTICAS_ERROR"
        )
