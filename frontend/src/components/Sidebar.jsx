// ═══════════════════════════════════════════════════════════
// Sidebar.jsx — Barre latérale fixe
// ═══════════════════════════════════════════════════════════

import {
  Shield, LayoutDashboard, Search,
  BarChart2, History, Activity
} from 'lucide-react'

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',         icon: LayoutDashboard },
  { id: 'prediction',   label: 'Test Transaction',   icon: Search          },
  { id: 'statistiques', label: 'Statistiques',       icon: BarChart2       },
  { id: 'historique',   label: 'Historique',         icon: History         },
]

export default function Sidebar({ page, setPage }) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col
                      bg-gradient-to-b from-[#1B3A6B] to-[#0f2347]
                      shadow-2xl z-50">

      {/* ── Logo ───────────────────────────────────── */}
      <div className="flex items-center gap-3 px-6 py-7
                      border-b border-white/10">
        <div className="relative flex items-center justify-center
                        w-10 h-10 bg-cyan rounded-xl shadow-lg">
          <Shield size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-none">
            FraudGuard
          </h1>
          <p className="text-blue-300 text-[11px] mt-0.5">
            ML Detection System
          </p>
        </div>
      </div>

      {/* ── Statut en direct ───────────────────────── */}
      <div className="mx-4 mt-5 mb-2 px-4 py-3 bg-white/5
                      rounded-xl border border-white/10">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full
                             rounded-full bg-green-400 opacity-75"/>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5
                             bg-green-500"/>
          </span>
          <span className="text-green-400 text-xs font-semibold">
            API opérationnelle
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <Activity size={11} className="text-blue-300" />
          <span className="text-blue-300 text-[11px]">
            Modèle ML actif
          </span>
        </div>
      </div>

      {/* ── Navigation ─────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-bold text-blue-400/60
                      uppercase tracking-widest px-3 mb-3">
          Navigation
        </p>
        {NAV.map(({ id, label, icon: Icon }) => {
          const actif = page === id
          return (
            <button
              key={id}
              onClick={() => setPage(id)}
              className={`w-full flex items-center gap-3 px-4 py-3
                          rounded-xl text-sm font-medium transition-all
                          duration-200 group
                          ${actif
                            ? 'bg-cyan text-white shadow-lg shadow-cyan/30'
                            : 'text-blue-200 hover:bg-white/8 hover:text-white'
                          }`}
            >
              <Icon size={18}
                className={actif ? 'text-white'
                                 : 'text-blue-300 group-hover:text-white'} />
              {label}
              {actif && (
                <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full"/>
              )}
            </button>
          )
        })}
      </nav>

      {/* ── Pied de sidebar ────────────────────────── */}
      <div className="px-4 py-5 border-t border-white/10">
        <div className="bg-white/5 rounded-xl px-4 py-3">
          <p className="text-blue-300 text-[11px] font-medium">
            INP-HB Yamoussoukro
          </p>
          <p className="text-blue-400/60 text-[10px] mt-0.5">
            Projet ML • 2025 – 2026
          </p>
        </div>
      </div>
    </aside>
  )
}