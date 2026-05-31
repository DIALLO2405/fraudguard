# ═══════════════════════════════════════════════════════════
# main.py — Point d'entrée de l'API FastAPI
# ═══════════════════════════════════════════════════════════

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
from ml.model_loader import charger_modele

app = FastAPI(
    title       = "API Détection de Fraude",
    description = "API de détection de fraude bancaire & Mobile Money — PaySim",
    version     = "1.0.0"
)

# ── CORS : autorise le frontend React à appeler l'API
app.add_middleware(
    CORSMiddleware,
    allow_origins     = ["*"],
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)

# ── Chargement du modèle au démarrage
@app.on_event("startup")
async def startup_event():
    charger_modele()
    print("✅ Modèle chargé au démarrage")

# ── Inclusion des routes
app.include_router(router)