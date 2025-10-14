from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TipoServico(BaseModel):
    id: int
    name: str
    descricao: Optional[str] = None
    data_criacao: datetime

    class Config:
        from_attributes = True


class ServicoLocal(BaseModel):
    id: int
    name: str
    endereco: Optional[str] = None
    tipo_servico_id: Optional[int] = None
    data_criacao: datetime
    data_atualizacao: datetime

    class Config:
        from_attributes = True
