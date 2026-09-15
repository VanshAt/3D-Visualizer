import React from 'react'
import { useEquationsStore } from '../../state/useEquationsStore'
import { useExportPng } from '../../hooks/useExportPng'
import { det3, fmt } from '../../lib/math'
import './EquationsPanel.css'

function EquationInput({ row, A, b, setA, setB }) {
  const rowOffset = row * 3
  
  return (
    <div className="equation-row">
      <input
        type="number"
        step={0.1}
        className="eq-cell eq-coeff"
        value={parseFloat(A[rowOffset].toFixed(3))}
        onChange={(e) => setA(rowOffset, parseFloat(e.target.value))}
      />
      <span className="eq-var">x</span>
      <span className="eq-plus">+</span>
      
      <input
        type="number"
        step={0.1}
        className="eq-cell eq-coeff"
        value={parseFloat(A[rowOffset + 1].toFixed(3))}
        onChange={(e) => setA(rowOffset + 1, parseFloat(e.target.value))}
      />
      <span className="eq-var">y</span>
      <span className="eq-plus">+</span>
      
      <input
        type="number"
        step={0.1}
        className="eq-cell eq-coeff"
        value={parseFloat(A[rowOffset + 2].toFixed(3))}
        onChange={(e) => setA(rowOffset + 2, parseFloat(e.target.value))}
      />
      <span className="eq-var">z</span>
      <span className="eq-equals">=</span>
      
      <input
        type="number"
        step={0.1}
        className="eq-cell eq-const"
        value={parseFloat(b[row].toFixed(3))}
        onChange={(e) => setB(row, parseFloat(e.target.value))}
      />
    </div>
  )
}

export default function EquationsPanel() {
  const A = useEquationsStore((s) => s.A)
  const b = useEquationsStore((s) => s.b)
  const setA = useEquationsStore((s) => s.setA)
  const setB = useEquationsStore((s) => s.setB)
  const reset = useEquationsStore((s) => s.reset)
  const getSolution = useEquationsStore((s) => s.getSolution)
  
  const handleExport = useExportPng()
  
  const solution = getSolution()
  const det = det3(A)
  const isSingular = Math.abs(det) < 1e-6
  
  return (
    <div className="panel-container">
      <div className="panel-header">
        <h2 className="panel-title">Systems of Equations</h2>
        <div className="header-actions">
          <button className="icon-btn" onClick={handleExport} title="Export screenshot (E)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="equations-grid">
        <EquationInput row={0} A={A} b={b} setA={setA} setB={setB} />
        <EquationInput row={1} A={A} b={b} setA={setA} setB={setB} />
        <EquationInput row={2} A={A} b={b} setA={setA} setB={setB} />
      </div>
      
      <div className="equations-actions">
        <button className="btn-secondary" onClick={reset}>Reset</button>
      </div>
      
      <div className="equations-result">
        <div className="det-row">
          <span className="det-label">det(A)</span>
          <span className={`det-value ${isSingular ? 'det-zero' : ''}`}>{det.toFixed(3)}</span>
        </div>
        
        <div className="solution-box">
          <p className="annotation-title">Solution Vector</p>
          {isSingular ? (
            <div className="solution-error">
              <span className="error-icon">⚠️</span>
              <p>No unique solution</p>
            </div>
          ) : (
            <div className="solution-coords">
              <div className="coord-row">
                <span className="coord-label">x</span>
                <span className="coord-val">{solution ? fmt(solution.x[0]) : '-'}</span>
              </div>
              <div className="coord-row">
                <span className="coord-label">y</span>
                <span className="coord-val">{solution ? fmt(solution.x[1]) : '-'}</span>
              </div>
              <div className="coord-row">
                <span className="coord-label">z</span>
                <span className="coord-val">{solution ? fmt(solution.x[2]) : '-'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
