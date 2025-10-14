from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DadosEstatisticosTEA(BaseModel):
    id: int
    conteudo: str
    nome: str
    fonte: Optional[str] = None
    descricao: Optional[str] = None
    data_criacao: datetime

    class Config:
        from_attributes = True
