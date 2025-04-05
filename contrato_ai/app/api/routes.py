
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.models.contrato import ContratoInput
from app.services.contrato_service import gerar_contrato_pdf
import uuid
import os
from app.db.database import SessionLocal
from app.db.models import Contrato
from fastapi import Depends
from sqlalchemy.orm import Session
from fastapi.responses import RedirectResponse, StreamingResponse
import requests

router = APIRouter()

@router.post("/gerar-contrato")
async def gerar_contrato(dados: ContratoInput):
    try:
        nome_arquivo = f"contrato_{uuid.uuid4().hex}.pdf"
        ipfs_url = await gerar_contrato_pdf(dados.dict(), nome_arquivo)

        if not ipfs_url:
            raise HTTPException(status_code=500, detail="Falha ao gerar o PDF.")

        return {
            "message": "Contrato gerado com sucesso.",
            "ipfs_url": ipfs_url
        }

    except Exception as e:
        print("❌ Erro ao gerar contrato:", e)
        raise HTTPException(status_code=500, detail=str(e))
    
    
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/contratos")
def listar_contratos(db: Session = Depends(get_db)):
    contratos = db.query(Contrato).all()
    return contratos


@router.get("/contratos/{id}")
def obter_contrato(id: str, db: Session = Depends(get_db)):
    contrato = db.query(Contrato).filter(Contrato.id == id).first()
    if contrato is None:
        return {"erro": "Contrato não encontrado"}
    return contrato

@router.get("/contratos/{id}/visualizar")
def visualizar_pdf_ipfs(id: str, db: Session = Depends(get_db)):
    contrato = db.query(Contrato).filter(Contrato.id == id).first()
    if not contrato or not contrato.ipfs_url:
        return {"erro": "Contrato ou IPFS URL não encontrada"}
    return RedirectResponse(url=contrato.ipfs_url)

@router.get("/contratos/{id}/download")
def baixar_pdf_ipfs(id: str, db: Session = Depends(get_db)):
    contrato = db.query(Contrato).filter(Contrato.id == id).first()
    if not contrato or not contrato.ipfs_url:
        return {"erro": "Contrato ou IPFS URL não encontrada"}

    response = requests.get(contrato.ipfs_url, stream=True)
    if response.status_code != 200:
        return {"erro": "Falha ao baixar o arquivo do IPFS"}

    return StreamingResponse(
        response.iter_content(chunk_size=1024),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=contrato-{id}.pdf"}
    )