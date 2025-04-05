from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas as origens. Substitua com uma lista específica para maior segurança.
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos HTTP.
    allow_headers=["*"],  # Permite todos os cabeçalhos.
)

app.include_router(router)
