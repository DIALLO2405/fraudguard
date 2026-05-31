// ═══════════════════════════════════════════════════════════
// Statistiques.jsx
// ═══════════════════════════════════════════════════════════

import { useEffect, useState } from 'react'
import { getMetrics }          from '../api'
import { BarChart2, Award }    from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts'

export default function Statistiques() {
  const [metriques, setMetriques] = useState(null)

  useEffect(() => {
    getMetrics().then(r => setMetriques(r.data)).catch(() => {})
  }, [])

  if (!metriques) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12
                      border-4 border-cyan border-t-transparent"/>
    </div>
  )

  const data = Object.entries(metriques.comparaison || {}).map(
    ([nom, v]) => ({
      nom,
      Recall    : parseFloat((v.recall    * 100).toFixed(1)),
      Précision : parseFloat((v.precision * 100).toFixed(1)),
      F1        : parseFloat((v.f1        * 100).toFixed(1)),
      AUC       : parseFloat((v.auc       * 100).toFixed(1)),
    })
  )

  const COULEURS = ['#2E75B6','#C0392B','#27AE60','#E67E22']

  const METRIQUES_COLS = [
    { key:'Recall',    label:'Recall',    couleur:'text-red-600'   },
    { key:'Précision', label:'Précision', couleur:'text-cyan'      },
    { key:'F1',        label:'F1-Score',  couleur:'text-orange'    },
    { key:'AUC',       label:'AUC-ROC',   couleur:'text-vert'      },
  ]

  return (
    <div className="space-y-8">

      {/* ── En-tête */}
      <div>
        <h2 className="text-3xl font-extrabold text-bleu">
          Statistiques
        </h2>
        <p className="text-gray-400 mt-1 text-sm">
          Comparaison détaillée des {data.length} modèles entraînés
        </p>
      </div>

      {/* ── Graphique toutes métriques */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <BarChart2 size={18} className="text-cyan" />
          <h3 className="font-bold text-bleu text-lg">
            Comparaison globale — 4 métriques
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} barSize={18}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="nom" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
            <Tooltip formatter={v => `${v}%`}
              contentStyle={{ borderRadius:'12px', fontSize:'12px' }} />
            <Legend iconSize={12} />
            <Bar dataKey="Recall"    fill="#C0392B" radius={[6,6,0,0]} />
            <Bar dataKey="Précision" fill="#2E75B6" radius={[6,6,0,0]} />
            <Bar dataKey="F1"        fill="#27AE60" radius={[6,6,0,0]} />
            <Bar dataKey="AUC"       fill="#E67E22" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Tableau récap */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4
                        border-b border-gray-100">
          <Award size={18} className="text-yellow-500" />
          <h3 className="font-bold text-bleu">
            Tableau récapitulatif
          </h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-[#1B3A6B] text-white">
            <tr>
              {['Modèle','Recall','Précision','F1-Score','AUC-ROC'].map(h => (
                <th key={h}
                  className="px-5 py-3.5 text-left font-semibold text-xs
                             uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((row, i) => {
              const estMeilleur = row.nom === metriques.meilleur_modele
              return (
                <tr key={row.nom}
                  className={`transition-colors hover:bg-blue-50/40
                              ${estMeilleur ? 'bg-green-50' : i%2===0
                                ? 'bg-gray-50/50' : 'bg-white'}`}>
                  <td className="px-5 py-4 font-semibold text-bleu">
                    <div className="flex items-center gap-2">
                      {estMeilleur && (
                        <span className="text-yellow-500 text-base">🏆</span>
                      )}
                      {row.nom}
                      {estMeilleur && (
                        <span className="text-[10px] bg-green-100
                                        text-green-700 px-2 py-0.5
                                        rounded-full font-bold">
                          Retenu
                        </span>
                      )}
                    </div>
                  </td>
                  {METRIQUES_COLS.map(({ key, couleur }) => (
                    <td key={key}
                      className={`px-5 py-4 font-extrabold ${couleur}`}>
                      {row[key]}%
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}