// ═══════════════════════════════════════════════════════════
// Prediction.jsx
// ═══════════════════════════════════════════════════════════

import { useState }    from 'react'
import { predire }     from '../api'
import {
  ShieldAlert, ShieldCheck,
  Loader, Zap, RefreshCw
} from 'lucide-react'

const CHAMPS = [
  { name:'step',          label:'Step (heure)',               ph:'1',           type:'number' },
  { name:'type',          label:'Type de transaction',        ph:'',            type:'select',
    options:['CASH_OUT','TRANSFER'] },
  { name:'amount',        label:'Montant (FCFA)',             ph:'9839.64',     type:'number' },
  { name:'oldbalanceOrg', label:'Solde avant — Émetteur',     ph:'170136.0',    type:'number' },
  { name:'newbalanceOrig',label:'Solde après — Émetteur',     ph:'160296.36',   type:'number' },
  { name:'oldbalanceDest',label:'Solde avant — Bénéficiaire', ph:'0.0',         type:'number' },
  { name:'newbalanceDest',label:'Solde après — Bénéficiaire', ph:'0.0',         type:'number' },
  { name:'nameDest',      label:'Compte bénéficiaire',        ph:'C1231006815', type:'text'   },
]

const EX_FRAUDE = {
  step:1, type:'CASH_OUT', amount:9839.64,
  oldbalanceOrg:170136.0, newbalanceOrig:0.0,
  oldbalanceDest:0.0,     newbalanceDest:9839.64,
  nameDest:'C1231006815'
}
const EX_NORMAL = {
  step:10, type:'CASH_OUT', amount:500.0,
  oldbalanceOrg:10000.0, newbalanceOrig:9500.0,
  oldbalanceDest:5000.0, newbalanceDest:5500.0,
  nameDest:'C9876543210'
}

function Champ({ label, name, type, ph, options, value, onChange }) {
  const base = `w-full rounded-xl border border-gray-200 bg-gray-50
                px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300
                focus:outline-none focus:ring-2 focus:ring-cyan/50
                focus:border-cyan transition-all duration-200`
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500
                        uppercase tracking-wide">
        {label}
      </label>
      {type === 'select' ? (
        <select name={name} value={value} onChange={onChange}
          className={base}>
          <option value="">-- Choisir --</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} name={name} value={value ?? ''}
          onChange={onChange} placeholder={ph} className={base} />
      )}
    </div>
  )
}

export default function Prediction({ ajouterHistorique }) {
  const [form,       setForm]       = useState({})
  const [resultat,   setResultat]   = useState(null)
  const [chargement, setChargement] = useState(false)
  const [erreur,     setErreur]     = useState(null)

  const handleChange = e => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
  }

  const handleSubmit = async () => {
    setChargement(true)
    setErreur(null)
    setResultat(null)
    try {
      const data = { ...form }
      for (const k of ['step','amount','oldbalanceOrg',
                        'newbalanceOrig','oldbalanceDest','newbalanceDest'])
        data[k] = parseFloat(data[k]) || 0

      const rep = await predire(data)
      const res = {
        ...rep.data,
        heure: new Date().toLocaleTimeString()
      }
      setResultat(res)
      ajouterHistorique?.(res)
    } catch {
      setErreur("Erreur — vérifie que le backend est lancé.")
    } finally {
      setChargement(false)
    }
  }

  const reset = () => { setForm({}); setResultat(null); setErreur(null) }

  return (
    <div className="space-y-8 max-w-3xl">

      {/* ── En-tête */}
      <div>
        <h2 className="text-3xl font-extrabold text-bleu">
          Test de Transaction
        </h2>
        <p className="text-gray-400 mt-1 text-sm">
          Saisie les données d'une transaction pour évaluer le risque de fraude
        </p>
      </div>

      {/* ── Boutons exemples */}
      <div className="flex gap-3 flex-wrap">
        <button onClick={() => { setForm(EX_FRAUDE); setResultat(null) }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                     bg-red-50 text-red-600 border border-red-200
                     text-sm font-semibold hover:bg-red-100
                     transition-all duration-200">
          <ShieldAlert size={16}/> Exemple Fraude
        </button>
        <button onClick={() => { setForm(EX_NORMAL); setResultat(null) }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                     bg-green-50 text-green-600 border border-green-200
                     text-sm font-semibold hover:bg-green-100
                     transition-all duration-200">
          <ShieldCheck size={16}/> Exemple Normal
        </button>
        <button onClick={reset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                     bg-gray-100 text-gray-500 border border-gray-200
                     text-sm font-semibold hover:bg-gray-200
                     transition-all duration-200 ml-auto">
          <RefreshCw size={15}/> Réinitialiser
        </button>
      </div>

      {/* ── Formulaire */}
      <div className="bg-white rounded-2xl shadow-sm p-7 space-y-6">
        <div className="grid grid-cols-2 gap-5">
          {CHAMPS.map(c => (
            <Champ key={c.name} {...c}
              value={form[c.name] ?? ''}
              onChange={handleChange} />
          ))}
        </div>

        <button onClick={handleSubmit} disabled={chargement}
          className="w-full flex items-center justify-center gap-3
                     py-4 bg-bleu text-white font-extrabold text-base
                     rounded-xl hover:bg-cyan shadow-lg shadow-bleu/20
                     transition-all duration-300 disabled:opacity-60
                     hover:-translate-y-0.5 active:translate-y-0">
          {chargement
            ? <><Loader size={20} className="animate-spin"/>
                Analyse en cours…</>
            : <><Zap size={20}/> Analyser la transaction</>
          }
        </button>
      </div>

      {/* ── Erreur */}
      {erreur && (
        <div className="bg-red-50 border border-red-200 rounded-2xl
                        p-4 text-red-700 text-sm font-medium">
          ⚠️ {erreur}
        </div>
      )}

      {/* ── Résultat */}
      {resultat && (
        <div className={`rounded-2xl shadow-md p-7 border-2 fade-in ${
          resultat.est_fraude
            ? 'bg-red-50  border-red-300'
            : 'bg-green-50 border-green-300'
        }`}>

          {/* Titre résultat */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-3 rounded-2xl ${
              resultat.est_fraude ? 'bg-red-100' : 'bg-green-100'
            }`}>
              {resultat.est_fraude
                ? <ShieldAlert size={36} className="text-red-500"/>
                : <ShieldCheck size={36} className="text-green-500"/>
              }
            </div>
            <div>
              <p className={`text-2xl font-extrabold ${
                resultat.est_fraude ? 'text-red-700' : 'text-green-700'
              }`}>
                {resultat.message}
              </p>
              <p className="text-gray-500 text-sm mt-0.5">
                Analysé à {resultat.heure}
              </p>
            </div>
          </div>

          {/* Barre de score */}
          <div className="mb-5">
            <div className="flex justify-between text-sm
                            font-semibold mb-2">
              <span className="text-gray-500">Score de fraude</span>
              <span className={`text-lg font-extrabold ${
                resultat.probabilite_fraude > 60 ? 'text-red-600'    :
                resultat.probabilite_fraude > 30 ? 'text-orange-500' :
                'text-green-600'
              }`}>
                {resultat.probabilite_fraude}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-5
                            overflow-hidden shadow-inner">
              <div className={`h-5 rounded-full transition-all
                              duration-1000 ease-out ${
                resultat.probabilite_fraude > 60
                  ? 'bg-gradient-to-r from-red-400 to-red-600'    :
                resultat.probabilite_fraude > 30
                  ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                  'bg-gradient-to-r from-green-400 to-green-600'
              }`}
                style={{ width: `${resultat.probabilite_fraude}%` }}
              />
            </div>
            <div className="flex justify-between text-xs
                            text-gray-400 mt-1.5">
              <span>Faible risque</span>
              <span>Risque élevé</span>
            </div>
          </div>

          {/* 3 Indicateurs */}
          <div className="grid grid-cols-3 gap-4">
            {[
              ['Classe prédite',   resultat.classe === 0
                                    ? 'Normale' : 'Fraude'],
              ['Probabilité',      `${resultat.probabilite_fraude}%`],
              ['Niveau de risque', resultat.niveau_risque],
            ].map(([label, val]) => (
              <div key={label}
                className="bg-white rounded-xl p-4 text-center shadow-sm
                           border border-gray-100">
                <p className="text-xs text-gray-400 font-medium">{label}</p>
                <p className={`text-lg font-extrabold mt-1 ${
                  label === 'Niveau de risque'
                    ? (val === 'ÉLEVÉ'  ? 'text-red-600'    :
                       val === 'MOYEN'  ? 'text-orange-500' :
                       'text-green-600')
                    : 'text-gray-800'
                }`}>
                  {val}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}