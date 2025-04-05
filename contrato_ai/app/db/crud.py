
from sqlalchemy.orm import Session
from app.db import models

def salvar_contrato(db: Session, dados: dict):
    contrato = models.Contrato(**dados)
    db.add(contrato)
    db.commit()
    db.refresh(contrato)
    return contrato
