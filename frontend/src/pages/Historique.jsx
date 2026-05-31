// ═══════════════════════════════════════════════════════════
// Historique.jsx
// ═══════════════════════════════════════════════════════════

import { Trash2, ClipboardList, ShieldAlert, ShieldCheck } from 'lucide-react'

export default function Historique({ historique = [], setHistorique }) {
  const nbFraudes  = historique.filter(h => h.est_fraude).length
  const nbNormales = historique.length - nbFraudes
  const tauxFraude = historique.length > 0
    ? ((nbFraudes / historique.length) * 100).toFixed(1)
    : 0

  return (
    <div className="space-y-8">

      {/* ── En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-bleu">
            Historique
          </h2>
          <p className="text-gray-400 mt-1 text-sm">
            Prédictions effectuées pendant cette session
          </p>
        </div>
        {historique.length > 0 && (
          <button
            onClick={() => setHistorique?.([])}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-50
                       text-red-600 border border-red-200 rounded-xl
                       text-sm font-semibold hover:bg-red-100 transition">
            <Trash2 size={15}/> Effacer
          </button>
        )}
      </div>

      {/* ── Résumé en 3 cartes */}
      <div className="grid grid-cols-3 gap-5">
        {[
          { label:'Total analysées', val:historique.length, style:'text-bleu',
            bg:'bg-blue-50', border:'border-cyan' },
          { label:'Fraudes détectées', val:nbFraudes, style:'text-red-600',
            bg:'bg-red-50',  border:'border-red-400' },
          { label:'Transactions normales', val:nbNormales, style:'text-vert',
            bg:'bg-green-50', border:'border-vert' },
        ].map(({ label, val, style, bg, border }) => (
          <div key={label}
            className={`${bg} border-l-4 ${border} bg-white rounded-2xl
                        shadow-sm p-6 text-center`}>
            <p className="text-xs text-gray-400 font-semibold
                          uppercase tracking-wide">{label}</p>
            <p className={`text-5xl font-extrabold mt-2 ${style}`}>{val}</p>
          </div>
        ))}
      </div>

      {/* ── Taux de fraude session */}
      {historique.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex justify-between text-sm
                          font-semibold mb-2">
            <span className="text-gray-500">
              Taux de fraude (session)
            </span>
            <span className="text-red-600 font-extrabold">
              {tauxFraude}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div className="h-3 rounded-full bg-gradient-to-r
                            from-red-400 to-red-600 transition-all
                            duration-700"
              style={{ width: `${tauxFraude}%` }}/>
          </div>
        </div>
      )}

      {/* ── Tableau ou état vide */}
      {historique.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
          <ClipboardList size={56}
            className="text-gray-200 mx-auto mb-4"/>
          <p className="text-lg font-bold text-gray-300">
            Aucune prédiction effectuée
          </p>
          <p className="text-sm text-gray-300 mt-1">
            Va dans "Test Transaction" pour analyser une transaction
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#1B3A6B] text-white">
              <tr>
                {['#','Statut','Score','Niveau risque','Heure'].map(h => (
                  <th key={h}
                    className="px-5 py-3.5 text-left font-semibold
                               text-xs uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {historique.map((h, i) => (
                <tr key={i}
                  className={`hover:bg-blue-50/30 transition-colors
                              ${i%2===0 ? 'bg-gray-50/50' : 'bg-white'}`}>
                  <td className="px-5 py-4 text-gray-400 font-mono text-xs">
                    #{String(i+1).padStart(3,'0')}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5
                                     px-3 py-1.5 rounded-full text-xs
                                     font-bold ${
                      h.est_fraude
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {h.est_fraude
                        ? <><ShieldAlert size={12}/>Fraude</>
                        : <><ShieldCheck size={12}/>Normale</>
                      }
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-100 rounded-full h-2">
                        <div className={`h-2 rounded-full ${
                          h.probabilite_fraude > 60 ? 'bg-red-500'    :
                          h.probabilite_fraude > 30 ? 'bg-orange-400' :
                          'bg-green-500'
                        }`}
                          style={{ width:`${h.probabilite_fraude}%` }}/>
                      </div>
                      <span className="font-bold text-gray-700 text-xs">
                        {h.probabilite_fraude}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`font-bold text-xs ${
                      h.niveau_risque === 'ÉLEVÉ'  ? 'text-red-600'    :
                      h.niveau_risque === 'MOYEN'  ? 'text-orange-500' :
                      'text-green-600'
                    }`}>
                      {h.niveau_risque}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-400
                                 font-mono text-xs">
                    {h.heure}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}