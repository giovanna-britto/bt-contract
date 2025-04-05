
from openai import OpenAI
from app.core.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY, timeout=15)

async def gerar_clausulas_ia(dados: dict) -> str:
    prompt = f"""
Você é um especialista jurídico. Gere cláusulas para contrato de compra e venda considerando:

- Vendedor: {dados['vendedor']}
- Comprador: {dados['comprador']}
- Valor: {dados['valor']}
- Objeto: {dados['objeto']}
- Observações: {dados['observacoes']}

Use linguagem jurídica formal, com estrutura de cláusulas conforme contratos profissionais.
"""

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4,
        max_tokens=1000,
    )

    return response.choices[0].message.content
