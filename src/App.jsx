import { useState } from 'react'
import VectorsPage from './pages/VectorsPage'
import './App.css'

const PAGES = ['Vectors', 'Matrices', 'Scalars']

function ComingSoon({ name }) {
  return (
    <div className="coming-soon">
      <span className="cs-icon">🚧</span>
      <h2>{name}</h2>
      <p>Coming soon</p>
    </div>
  )
}

export default function App() {
  const [activePage, setActivePage] = useState('Vectors')

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
      </header>

      {/* Page content */}
      <main className="page-host">
        {activePage === 'Vectors'  && <VectorsPage />}
        {activePage === 'Matrices' && <ComingSoon name="Matrices" />}
        {activePage === 'Scalars'  && <ComingSoon name="Scalars" />}
      </main>
    </div>
  )
}
