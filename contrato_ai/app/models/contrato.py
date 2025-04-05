
from pydantic import BaseModel

class ContratoInput(BaseModel):
    comprador: str
    vendedor: str
    valor: str
    objeto: str
    data_assinatura: str
    local_assinatura: str
    observacoes: str
