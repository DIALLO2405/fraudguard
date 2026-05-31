// ═══════════════════════════════════════════════════════════
// Dashboard.jsx
// ═══════════════════════════════════════════════════════════

import { useEffect, useState } from 'react'
import { getMetrics }          from '../api'
import {
  ShieldAlert, ShieldCheck, Activity,
  Trophy, TrendingUp, Zap
} from 'lucide-react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell
} from 'recharts'

/* ── Carte métrique ──────────────────────────────────────── */
function CarteMetrique({ titre, valeur, soustitre, Icon, couleurBg,
                         couleurTexte, couleurBorder }) {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm
                     border-l-4 ${couleurBorder}
                     hover:shadow-md transition-shadow duration-300`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400
                        uppercase tracking-wider">
            {titre}
          </p>
          <p className={`text-4xl font-extrabold mt-2 ${couleurTexte}`}>
            {valeur}
          </p>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            {soustitre}
          </p>
        </div>
        <div className={`${couleurBg} p-3.5 rounded-2xl`}>
          <Icon size={24} className={couleurTexte} />
        </div>
      </div>
    </div>
  )
}

/* ── Badge modèle ────────────────────────────────────────── */
function BadgeModele({ nom, estMeilleur }) {
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1
                      rounded-full text-xs font-bold
                      ${estMeilleur
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'}`}>
      {estMeilleur && '🏆 '}{nom}
    </span>
  )
}

/* ── Composant principal ─────────────────────────────────── */
export default function Dashboard() {
  const [metriques, setMetriques] = useState(null)
  const [erreur,    setErreur]    = useState(false)

  useEffect(() => {
    getMetrics()
      .then(r => setMetriques(r.data))
      .catch(() => setErreur(true))
  }, [])

  if (erreur) return (
    <div className="bg-red-50 border-2 border-red-200 rounded-2xl
                    p-8 text-center">
      <ShieldAlert size={48} className="text-red-400 mx-auto mb-3" />
      <p className="text-red-700 font-bold text-lg">
        Backend non disponible
      </p>
      <p className="text-red-500 text-sm mt-1">
        Lance <code className="bg-red-100 px-2 py-0.5 rounded">
          uvicorn main:app --reload
        </code> dans le dossier backend
      </p>
    </div>
  )

  if (!metriques) return (
    <div className="flex flex-col items-center justify-center h-72 gap-4">
      <div className="animate-spin rounded-full h-14 w-14
                      border-4 border-cyan border-t-transparent"/>
      <p className="text-gray-400 text-sm animate-pulse">
        Chargement des métriques…
      </p>
    </div>
  )

  const cartes = [
    {
      titre       : 'Recall — Fraude',
      valeur      : `${(metriques.recall * 100).toFixed(1)}%`,
      soustitre   : 'Fraudes correctement détectées sur 100',
      Icon        : ShieldAlert,
      couleurBg   : 'bg-red-50',
      couleurTexte: 'text-red-600',
      couleurBorder:'border-red-500',
    },
    {
      titre       : 'Précision',
      valeur      : `${(metriques.precision * 100).toFixed(1)}%`,
      soustitre   : 'Alertes émises réellement frauduleuses',
      Icon        : ShieldCheck,
      couleurBg   : 'bg-blue-50',
      couleurTexte: 'text-cyan',
      couleurBorder:'border-cyan',
    },
    {
      titre       : 'F1-Score',
      valeur      : `${(metriques.f1_score * 100).toFixed(1)}%`,
      soustitre   : 'Équilibre Recall / Précision',
      Icon        : Activity,
      couleurBg   : 'bg-orange-50',
      couleurTexte: 'text-orange',
      couleurBorder:'border-orange',
    },
    {
      titre       : 'AUC-ROC',
      valeur      : `${(metriques.auc_roc * 100).toFixed(1)}%`,
      soustitre   : 'Capacité discriminante globale',
      Icon        : TrendingUp,
      couleurBg   : 'bg-green-50',
      couleurTexte: 'text-vert',
      couleurBorder:'border-vert',
    },
  ]

  const comparaison = Object.entries(metriques.comparaison || {}).map(
    ([nom, v]) => ({
      nom,
      Recall    : parseFloat((v.recall    * 100).toFixed(1)),
      Précision : parseFloat((v.precision * 100).toFixed(1)),
      F1        : parseFloat((v.f1        * 100).toFixed(1)),
      AUC       : parseFloat((v.auc       * 100).toFixed(1)),
    })
  )

  const COULEURS = ['#2E75B6','#C0392B','#27AE60','#E67E22']

  return (
    <div className="space-y-8">

      {/* ── En-tête ──────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-bleu">
            Dashboard
          </h2>
          <p className="text-gray-400 mt-1 text-sm">
            Performances du système de détection de fraude
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border
                        border-green-200 rounded-xl px-4 py-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full
                             w-full rounded-full bg-green-400 opacity-75"/>
            <span className="relative inline-flex rounded-full h-2.5
                             w-2.5 bg-green-500"/>
          </span>
          <span className="text-green-700 text-sm font-semibold">
            {metriques.meilleur_modele} actif
          </span>
        </div>
      </div>

      {/* ── 4 Cartes métriques ───────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        {cartes.map(c => <CarteMetrique key={c.titre} {...c} />)}
      </div>

      {/* ── Bannière meilleur modèle ─────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-r
                      from-[#1B3A6B] to-[#2E75B6] rounded-2xl p-6
                      text-white shadow-lg">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5
                        rounded-full -translate-y-1/2 translate-x-1/4"/>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={18} className="text-yellow-400" />
            <p className="text-white/70 text-sm font-medium">
              Meilleur modèle sélectionné
            </p>
          </div>
          <p className="text-2xl font-extrabold">
            {metriques.meilleur_modele}
          </p>
          <div className="grid grid-cols-4 gap-3 mt-4">
            {[
              ['Recall',    metriques.recall],
              ['Précision', metriques.precision],
              ['F1-Score',  metriques.f1_score],
              ['AUC-ROC',   metriques.auc_roc],
            ].map(([label, val]) => (
              <div key={label}
                className="bg-white/10 backdrop-blur rounded-xl
                           p-3 text-center border border-white/10">
                <p className="text-white/60 text-xs">{label}</p>
                <p className="text-xl font-extrabold mt-0.5">
                  {(val * 100).toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Graphiques côte à côte ───────────────── */}
      <div className="grid grid-cols-2 gap-6">

        {/* Bar chart Recall */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Zap size={16} className="text-orange" />
            <h3 className="font-bold text-bleu">Recall par modèle</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={comparaison} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="nom" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
              <Tooltip formatter={v => `${v}%`} />
              <Bar dataKey="Recall" radius={[8, 8, 0, 0]}>
                {comparaison.map((_, i) => (
                  <Cell key={i} fill={COULEURS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity size={16} className="text-cyan" />
            <h3 className="font-bold text-bleu">
              Vue radar — 4 métriques
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={comparaison}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="nom"
                tick={{ fontSize: 10, fill: '#6b7280' }} />
              <Tooltip formatter={v => `${v}%`} />
              <Radar name="Recall" dataKey="Recall"
                stroke="#C0392B" fill="#C0392B" fillOpacity={0.15}
                strokeWidth={2} />
              <Radar name="F1" dataKey="F1"
                stroke="#27AE60" fill="#27AE60" fillOpacity={0.15}
                strokeWidth={2} />
              <Legend iconSize={10} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}