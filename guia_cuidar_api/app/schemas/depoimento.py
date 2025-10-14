from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DepoimentoResponsavelBase(BaseModel):
    texto: str
    categoria_id: Optional[int] = None


class DepoimentoResponsavelCreate(DepoimentoResponsavelBase):
    pass


class DepoimentoResponsavel(DepoimentoResponsavelBase):
    id: int
    aprovado: bool
    responsavel_id: str
    data_criacao: datetime

    class Config:
        from_attributes = True


class CategoriaMaterial(BaseModel):
    id: int
    nome: str
    descricao: Optional[str] = None
    data_criacao: datetime

    class Config:
        from_attributes = True
