# ═══════════════════════════════════════════════════════════
# model_loader.py — Chargement du modèle (local + Render)
# ═══════════════════════════════════════════════════════════

import joblib
import json
import os

modele        = None
preprocesseur = None
metriques     = None

def trouver_dossier_models():
    """Cherche le dossier models/ depuis plusieurs emplacements."""
    chemins_possibles = [
        # En local
        os.path.join(os.path.dirname(__file__), '..', '..', 'models'),
        # Sur Render
        os.path.join('/app', 'models'),
        os.path.join(os.getcwd(), 'models'),
    ]
    for chemin in chemins_possibles:
        chemin = os.path.abspath(chemin)
        if os.path.exists(chemin):
            return chemin
    return None

def charger_modele():
    global modele, preprocesseur, metriques

    dossier = trouver_dossier_models()

    if dossier is None:
        print("⚠️  Dossier models/ introuvable")
        return

    chemin_modele = os.path.join(dossier, 'model.pkl')
    chemin_prep   = os.path.join(dossier, 'preprocessor.pkl')
    chemin_metr   = os.path.join(dossier, 'metrics.json')

    if not os.path.exists(chemin_modele):
        print(f"⚠️  model.pkl introuvable dans {dossier}")
        print("   Lance d'abord le notebook pour entraîner le modèle.")
        return

    modele        = joblib.load(chemin_modele)
    preprocesseur = joblib.load(chemin_prep)

    with open(chemin_metr, 'r') as f:
        metriques = json.load(f)

    print(f"✅ Modèle chargé     : {metriques['meilleur_modele']}")
    print(f"✅ Recall            : {metriques['recall']}")
    print(f"✅ AUC-ROC           : {metriques['auc_roc']}")

def get_modele():        return modele
def get_preprocesseur(): return preprocesseur
def get_metriques():     return metriques