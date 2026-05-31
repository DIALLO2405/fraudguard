# ═══════════════════════════════════════════════════════════
# model_loader.py — Chargement du modèle
# ═══════════════════════════════════════════════════════════

import joblib
import json
import os

modele        = None
preprocesseur = None
metriques     = None

def trouver_dossier_models():
    """Cherche models/ depuis plusieurs emplacements possibles."""
    
    # Chemin du fichier actuel : backend/ml/model_loader.py
    # On remonte de 2 niveaux pour atteindre la racine du projet
    base = os.path.dirname(os.path.abspath(__file__))
    
    chemins = [
        # Local Windows : projet_fraude/models/
        os.path.join(base, '..', '..', 'models'),
        # Render : /opt/render/project/src/models/
        os.path.join(base, '..', '..', '..', 'models'),
        # Autres chemins possibles
        os.path.join(os.getcwd(), 'models'),
        os.path.join(os.getcwd(), '..', 'models'),
        '/opt/render/project/src/models',
        '/app/models',
    ]
    
    for chemin in chemins:
        chemin_abs = os.path.abspath(chemin)
        if os.path.exists(chemin_abs):
            pkl = os.path.join(chemin_abs, 'model.pkl')
            if os.path.exists(pkl):
                print(f"✅ Dossier models trouvé : {chemin_abs}")
                return chemin_abs
    
    # Debug : afficher tous les chemins testés
    print("❌ models/ introuvable. Chemins testés :")
    for chemin in chemins:
        chemin_abs = os.path.abspath(chemin)
        print(f"   {chemin_abs} → {'✅' if os.path.exists(chemin_abs) else '❌'}")
    
    return None

def charger_modele():
    global modele, preprocesseur, metriques

    dossier = trouver_dossier_models()

    if dossier is None:
        print("⚠️  Impossible de charger le modèle.")
        return

    try:
        modele        = joblib.load(os.path.join(dossier, 'model.pkl'))
        preprocesseur = joblib.load(os.path.join(dossier, 'preprocessor.pkl'))
        
        with open(os.path.join(dossier, 'metrics.json'), 'r') as f:
            metriques = json.load(f)

        print(f"✅ Modèle chargé     : {metriques['meilleur_modele']}")
        print(f"✅ Recall            : {metriques['recall']}")
        print(f"✅ AUC-ROC           : {metriques['auc_roc']}")

    except Exception as e:
        print(f"❌ Erreur chargement : {e}")

def get_modele():        return modele
def get_preprocesseur(): return preprocesseur
def get_metriques():     return metriques