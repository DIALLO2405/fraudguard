# ═══════════════════════════════════════════════════════════
# routes.py — Endpoints de l'API
# ═══════════════════════════════════════════════════════════

from fastapi             import APIRouter, HTTPException
from api.schemas         import (
    TransactionInput, BatchInput,
    PredictionOutput, HealthOutput
)
from ml.predictor        import predire, predire_batch
from ml.model_loader     import get_modele, get_metriques

router = APIRouter()


# ── GET /health ─────────────────────────────────────────────
@router.get("/health", response_model=HealthOutput,
            summary="Vérifier l'état de l'API")
def health():
    """Vérifie que l'API est opérationnelle et le modèle chargé."""
    return {
        "statut"        : "ok",
        "modele_charge" : get_modele() is not None,
        "version"       : "1.0.0"
    }


# ── POST /predict ────────────────────────────────────────────
@router.post("/predict", response_model=PredictionOutput,
             summary="Prédire si une transaction est frauduleuse")
def predict(transaction: TransactionInput):
    """
    Analyse une transaction et retourne :
    - La classe prédite (0 = normale, 1 = fraude)
    - La probabilité de fraude (%)
    - Le niveau de risque (FAIBLE / MOYEN / ÉLEVÉ)
    """
    try:
        data      = transaction.model_dump()
        resultat  = predire(data)
        return resultat
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── POST /batch_predict ──────────────────────────────────────
@router.post("/batch_predict",
             summary="Prédire pour plusieurs transactions")
def batch_predict(batch: BatchInput):
    """
    Analyse une liste de transactions en une seule requête.
    Retourne une liste de prédictions.
    """
    try:
        transactions = [t.model_dump() for t in batch.transactions]
        resultats    = predire_batch(transactions)
        nb_fraudes   = sum(1 for r in resultats if r['est_fraude'])
        return {
            "total"        : len(resultats),
            "fraudes"      : nb_fraudes,
            "taux_fraude"  : round(nb_fraudes / len(resultats) * 100, 2),
            "predictions"  : resultats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── GET /model_metrics ───────────────────────────────────────
@router.get("/model_metrics",
            summary="Métriques du modèle entraîné")
def model_metrics():
    """
    Retourne les métriques de performance du modèle
    sélectionné lors de l'entraînement.
    """
    metriques = get_metriques()
    if metriques is None:
        raise HTTPException(
            status_code=503,
            detail="Métriques non disponibles"
        )
    return metriques