import requests
import os
from dotenv import load_dotenv

load_dotenv()

PINATA_API_KEY = os.getenv("PINATA_API_KEY")
PINATA_SECRET_API_KEY = os.getenv("PINATA_SECRET_API_KEY")

def upload_para_ipfs(caminho_pdf: str, nome_arquivo: str) -> str:
    url = "https://api.pinata.cloud/pinning/pinFileToIPFS"

    headers = {
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_SECRET_API_KEY
    }

    with open(caminho_pdf, "rb") as file:
        files = {
            "file": (nome_arquivo, file)
        }
        response = requests.post(url, files=files, headers=headers)

    if response.status_code == 200:
        ipfs_hash = response.json()["IpfsHash"]
        ipfs_url = f"https://gateway.pinata.cloud/ipfs/{ipfs_hash}"
        print("Arquivo enviado para o IPFS:", ipfs_url)
        return ipfs_url
    else:
        print("Falha ao enviar arquivo para o IPFS:", response.text)
        return None

def upload_pdf_bytes_to_ipfs(pdf_bytes: bytes, nome_arquivo: str) -> str:
    url = "https://api.pinata.cloud/pinning/pinFileToIPFS"
    
    if not PINATA_API_KEY or not PINATA_SECRET_API_KEY:
        raise Exception("🔐 Credenciais do Pinata não configuradas corretamente no .env")
    
    headers = {
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_SECRET_API_KEY
    }

    files = {
        "file": (nome_arquivo, pdf_bytes, "application/pdf")
    }

    try:
        response = requests.post(url, files=files, headers=headers)
        response.raise_for_status()

        ipfs_hash = response.json()["IpfsHash"]
        ipfs_url = f"https://gateway.pinata.cloud/ipfs/{ipfs_hash}"
        print(f"📡 Upload bem-sucedido: {ipfs_url}")
        return ipfs_url

    except requests.exceptions.RequestException as e:
        print("❌ Erro ao subir PDF para IPFS:", e)
        print("📥 Resposta completa:", response.text if response else "sem resposta")
        raise Exception("Falha ao subir PDF para o IPFS.")
