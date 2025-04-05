from app.utils.pdf import gerar_pdf_from_html_bytes
from app.utils.ipfs import upload_pdf_bytes_to_ipfs
from app.services.ia_service import gerar_clausulas_ia
from app.core.templates import render_template
from app.db.database import SessionLocal
from app.db.crud import salvar_contrato

async def gerar_contrato_pdf(dados: dict, nome_arquivo: str) -> str:
    # 1. Gera cláusulas personalizadas via IA
    clausulas = await gerar_clausulas_ia(dados)
    dados_completos = {**dados, "clausulas": clausulas}

    # 2. Renderiza contrato com base no template (tudo em inglês)
    contrato_texto = render_template("estrutura_base.txt", dados_completos)
    contrato_com_br = contrato_texto.replace('\n', '<br>')  # para HTML

    html = f"""
    <html>
      <head>
        <meta charset="utf-8">
        <style>
        body {{ font-family: Arial, sans-serif; padding: 30px; line-height: 1.6; }}
        </style>
      </head>
      <body>
        <h1 style="text-align:center;">Purchase Agreement</h1>
        <div>{contrato_com_br}</div>
      </body>
    </html>
    """

    # 3. Gera PDF em memória
    pdf_bytes = gerar_pdf_from_html_bytes(html)

    # 4. Envia para IPFS (via Pinata)
    url_ipfs = upload_pdf_bytes_to_ipfs(pdf_bytes, nome_arquivo)
    dados_completos["ipfs_url"] = url_ipfs

    # 5. Salva no banco de dados
    db = SessionLocal()
    try:
        salvar_contrato(db, dados_completos)
    finally:
        db.close()

    # 6. Retorna a URL pública do contrato no IPFS
    return url_ipfs
