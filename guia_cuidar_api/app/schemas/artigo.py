from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ArtigoInformativo(BaseModel):
    id: int
    titulo: str
    corpo: str
    autor: Optional[str] = None
    data_criacao: datetime
    data_atualizacao: datetime

    class Config:
        from_attributes = True
