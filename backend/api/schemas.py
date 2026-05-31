# ═══════════════════════════════════════════════════════════
# schemas.py — Modèles de données (validation des entrées)
# ═══════════════════════════════════════════════════════════

from pydantic import BaseModel, Field
from typing   import List, Optional


class TransactionInput(BaseModel):
    """Données d'une transaction à analyser."""
    step                    : float = Field(..., description="Heure de la transaction (step PaySim)")
    type                    : str   = Field(..., description="Type : CASH_OUT ou TRANSFER")
    amount                  : float = Field(..., description="Montant de la transaction")
    oldbalanceOrg           : float = Field(..., description="Solde avant — émetteur")
    newbalanceOrig          : float = Field(..., description="Solde après — émetteur")
    oldbalanceDest          : float = Field(..., description="Solde avant — bénéficiaire")
    newbalanceDest          : float = Field(..., description="Solde après — bénéficiaire")
    nameDest                : Optional[str] = Field("C123456", description="Compte bénéficiaire")

    class Config:
        json_schema_extra = {
            "example": {
                "step"          : 1,
                "type"          : "CASH_OUT",
                "amount"        : 9839.64,
                "oldbalanceOrg" : 170136.0,
                "newbalanceOrig": 160296.36,
                "oldbalanceDest": 0.0,
                "newbalanceDest": 0.0,
                "nameDest"      : "C1231006815"
            }
        }


class BatchInput(BaseModel):
    """Liste de transactions pour la prédiction en lot."""
    transactions: List[TransactionInput]


class PredictionOutput(BaseModel):
    """Résultat d'une prédiction."""
    est_fraude          : bool
    classe              : int
    probabilite_fraude  : float
    niveau_risque       : str
    couleur_risque      : str
    message             : str


class HealthOutput(BaseModel):
    """Statut de l'API."""
    statut          : str
    modele_charge   : bool
    version         : str