# ═══════════════════════════════════════════════════════════
# model_loader.py — Chargement du modèle et du préprocesseur
# ═══════════════════════════════════════════════════════════

import joblib
import json
import os

# Variables globales
modele        = None
preprocesseur = None
metriques     = None

# Chemin vers les fichiers sauvegardés
DOSSIER_MODELS = os.path.join(
    os.path.dirname(__file__), '..', '..', 'models'
)

def charger_modele():
    global modele, preprocesseur, metriques

    chemin_modele = os.path.join(DOSSIER_MODELS, 'model.pkl')
    chemin_prep   = os.path.join(DOSSIER_MODELS, 'preprocessor.pkl')
    chemin_metr   = os.path.join(DOSSIER_MODELS, 'metrics.json')

    if not os.path.exists(chemin_modele):
        raise FileNotFoundError(
            f"❌ model.pkl introuvable dans {DOSSIER_MODELS}\n"
            "Lance d'abord le notebook pour entraîner le modèle."
        )

    modele        = joblib.load(chemin_modele)
    preprocesseur = joblib.load(chemin_prep)

    with open(chemin_metr, 'r') as f:
        metriques = json.load(f)

    print(f"✅ Modèle chargé     : {metriques['meilleur_modele']}")
    print(f"✅ Recall            : {metriques['recall']}")
    print(f"✅ AUC-ROC           : {metriques['auc_roc']}")

def get_modele():
    return modele

def get_preprocesseur():
    return preprocesseur

def get_metriques():
    return metriques