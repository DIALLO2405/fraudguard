# ═══════════════════════════════════════════════════════════
# predictor.py — Logique de prédiction
# ═══════════════════════════════════════════════════════════

import numpy as np
import pandas as pd
from ml.model_loader import get_modele, get_preprocesseur

# Colonnes attendues par le modèle (même ordre que le notebook)
FEATURES_NUMERIQUES = [
    'amount',
    'oldbalanceOrg',
    'newbalanceOrig',
    'oldbalanceDest',
    'newbalanceDest',
    'ecart_solde_emetteur',
    'ecart_solde_beneficiaire',
    'heure_transaction',
    'ratio_montant',
]
FEATURES_BINAIRES  = ['est_transaction_nocturne', 'beneficiaire_est_client']
FEATURE_CATEGORIE  = ['type']
TOUTES_FEATURES    = FEATURES_NUMERIQUES + FEATURES_BINAIRES + FEATURE_CATEGORIE


def construire_features(data: dict) -> pd.DataFrame:
    """
    Reconstruit les features engineerées à partir des
    données brutes envoyées par l'utilisateur.
    """
    step   = data.get('step', 0)
    heure  = int(step) % 24

    row = {
        'amount'                  : data['amount'],
        'oldbalanceOrg'           : data['oldbalanceOrg'],
        'newbalanceOrig'          : data['newbalanceOrig'],
        'oldbalanceDest'          : data['oldbalanceDest'],
        'newbalanceDest'          : data['newbalanceDest'],

        # Feature engineering — identique au notebook
        'ecart_solde_emetteur'    : (
            data['oldbalanceOrg'] - data['amount'] - data['newbalanceOrig']
        ),
        'ecart_solde_beneficiaire': (
            data['oldbalanceDest'] + data['amount'] - data['newbalanceDest']
        ),
        'heure_transaction'       : heure,
        'ratio_montant'           : (
            data['amount'] / (data['oldbalanceOrg'] + 1)
        ),
        'est_transaction_nocturne': int(heure >= 22 or heure <= 6),
        'beneficiaire_est_client' : int(
            str(data.get('nameDest', 'C')).startswith('C')
        ),
        'type'                    : data['type'],
    }

    return pd.DataFrame([row])[TOUTES_FEATURES]


def predire(data: dict) -> dict:
    """
    Prédit si une transaction est frauduleuse.
    Retourne la classe, la probabilité et le niveau de risque.
    """
    modele        = get_modele()
    preprocesseur = get_preprocesseur()

    # Construction + prétraitement
    df_input = construire_features(data)
    X_prep   = preprocesseur.transform(df_input)

    # Prédiction
    classe     = int(modele.predict(X_prep)[0])
    proba      = float(modele.predict_proba(X_prep)[0][1])

    # Niveau de risque
    if proba < 0.3:
        niveau_risque = "FAIBLE"
        couleur       = "green"
    elif proba < 0.6:
        niveau_risque = "MOYEN"
        couleur       = "orange"
    else:
        niveau_risque = "ÉLEVÉ"
        couleur       = "red"

    return {
        'est_fraude'          : bool(classe),
        'classe'              : classe,
        'probabilite_fraude'  : round(proba * 100, 2),
        'niveau_risque'       : niveau_risque,
        'couleur_risque'      : couleur,
        'message'             : (
            "🚨 FRAUDE DÉTECTÉE" if classe == 1
            else "✅ Transaction normale"
        ),
    }


def predire_batch(transactions: list) -> list:
    """
    Prédit pour une liste de transactions.
    """
    return [predire(t) for t in transactions]