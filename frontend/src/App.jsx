// ═══════════════════════════════════════════════════════════
// App.jsx — Routeur principal (sans react-router)
// ═══════════════════════════════════════════════════════════

import { useState } from 'react'
import Sidebar      from './components/Sidebar'
import Dashboard    from './pages/Dashboard'
import Prediction   from './pages/Prediction'
import Statistiques from './pages/Statistiques'
import Historique   from './pages/Historique'

const PAGES = {
  dashboard    : Dashboard,
  prediction   : Prediction,
  statistiques : Statistiques,
  historique   : Historique,
}

export default function App() {
  const [page,       setPage]       = useState('dashboard')
  const [historique, setHistorique] = useState([])

  const PageActive = PAGES[page] || Dashboard

  const ajouterHistorique = (entree) => {
    setHistorique(prev => [
      { ...entree, heure: new Date().toLocaleTimeString() },
      ...prev,
    ])
  }

  return (
    <div className="flex min-h-screen bg-[#f0f4f8]">
      <Sidebar page={page} setPage={setPage} />

      {/* Décalage pour la sidebar fixe */}
      <main className="ml-64 flex-1 min-h-screen p-8">
        <div className="max-w-6xl mx-auto fade-in" key={page}>
          <PageActive
            ajouterHistorique={ajouterHistorique}
            historique={historique}
          />
        </div>
      </main>
    </div>
  )
}