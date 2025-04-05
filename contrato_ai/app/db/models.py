
from sqlalchemy import Column, String, DateTime
from app.db.database import Base
from datetime import datetime
import uuid

class Contrato(Base):
    __tablename__ = "contratos"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    comprador = Column(String, nullable=False)
    vendedor = Column(String, nullable=False)
    valor = Column(String, nullable=False)
    objeto = Column(String, nullable=False)
    data_assinatura = Column(String)
    local_assinatura = Column(String)
    observacoes = Column(String)
    clausulas = Column(String)
    ipfs_url = Column(String)  
    criado_em = Column(DateTime, default=datetime.utcnow)
