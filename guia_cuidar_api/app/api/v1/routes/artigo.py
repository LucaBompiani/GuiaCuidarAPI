from ninja import Router
from typing import List, Union
from supabase import Client

from app.core.db import get_supabase_client
from app.schemas.artigo import ArtigoInformativo
from app.schemas.common import ErrorResponse

router = Router()


@router.get("/", response={200: List[ArtigoInformativo], 500: ErrorResponse})
def get_artigos_informativos(request) -> Union[List[ArtigoInformativo], ErrorResponse]:
    """
    Get all informative articles (artigos informativos)
    
    Returns:
        List[ArtigoInformativo]: List of all informative articles
        ErrorResponse: Error response with error details
    """
    try:
        supabase: Client = get_supabase_client()
        
        # Get all informative articles
        result = supabase.table("ArtigoInformativo").select("*").execute()
        
        if result.data:
            return [ArtigoInformativo(**artigo) for artigo in result.data]
        else:
            return []
            
    except Exception as e:
        return ErrorResponse(
            message=f"An error occurred while fetching informative articles: {str(e)}",
            error_code="FETCH_ARTIGOS_ERROR"
        )
