from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class NivelSuporteTEA(BaseModel):
    id: int
    nome: str
    descricao: Optional[str] = None
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


class MaterialDeApoio(BaseModel):
    id: int
    titulo: str
    corpo: Optional[str] = None
    categoria_id: Optional[int] = None
    nivel_suporte_tea_id: Optional[int] = None
    data_criacao: datetime
    data_atualizacao: datetime

    class Config:
        from_attributes = True


class MaterialFavoritoCreate(BaseModel):
    material_id: int
    dependente_id: int


class MaterialFavorito(BaseModel):
    responsavel_id: str
    material_id: int
    dependente_id: int
    data_favoritado: datetime

    class Config:
        from_attributes = True
