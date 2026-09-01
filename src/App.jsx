import { useState } from 'react'
import VectorsPage   from './pages/VectorsPage'
import MatricesPage  from './pages/MatricesPage'
import ScalarsPage   from './pages/ScalarsPage'
import ShortcutOverlay from './components/UI/ShortcutOverlay'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import './App.css'

const PAGES = ['Vectors', 'Matrices', 'Scalars']



export default function App() {
  const [activePage, setActivePage]       = useState('Vectors')
  const [showShortcuts, setShowShortcuts] = useState(false)

  // ── Global keyboard shortcuts ─────────────────────────────────────
  useKeyboardShortcuts(activePage, setActivePage, setShowShortcuts)

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="title-gradient">LinAlg</span>
            <span className="title-accent">Viz</span>
          </h1>
          <p className="app-subtitle">Interactive 3D Linear Algebra Explorer</p>
        </div>

        <nav className="module-nav">
          {PAGES.map((name) => (
            <button
              key={name}
              className={`nav-btn ${activePage === name ? 'active' : ''}`}
              onClick={() => setActivePage(name)}
            >
              {name}
            </button>
          ))}
        </nav>

        {/* Keyboard shortcut toggle */}
        <button
          id="shortcut-help-btn"
          className={`shortcut-help-btn ${showShortcuts ? 'active' : ''}`}
          onClick={() => setShowShortcuts(prev => !prev)}
          title="Keyboard shortcuts (?)"
          aria-label="Show keyboard shortcuts"
        >
          <span className="shortcut-help-icon">⌨</span>
          <span className="shortcut-help-label">Shortcuts</span>
        </button>
      </header>

      {/* Page content */}
      <main className="page-host">
        {activePage === 'Vectors'  && <VectorsPage />}
        {activePage === 'Matrices' && <MatricesPage />}
        {activePage === 'Scalars'  && <ScalarsPage />}
      </main>

      {/* Shortcut overlay */}
      {showShortcuts && (
        <ShortcutOverlay onClose={() => setShowShortcuts(false)} />
      )}
    </div>
  )
}
