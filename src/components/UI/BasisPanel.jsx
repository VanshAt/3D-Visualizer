import React from 'react'
import useBasisStore from '../../state/useBasisStore'
import './BasisPanel.css'

export default function BasisPanel() {
  const {
    b1, b2, b3, v,
    showStandardGrid, showCustomGrid, morphValue,
    setB1, setB2, setB3, setV,
    setShowStandardGrid, setShowCustomGrid, setMorphValue, reset
  } = useBasisStore()

  const handleVectorChange = (setter, vec, index, value) => {
    const newVec = [...vec]
    newVec[index] = parseFloat(value) || 0
    setter(newVec)
  }

  return (
    <div className="panel-container">
      <h2 className="panel-title">Change of Basis</h2>
      <p className="panel-description">
        Observe how a vector $\vec{v}$ exists independently of the coordinate system, but its coordinates change when you change the basis.
      </p>

      {/* Basis Vectors */}
      <div className="control-group">
        <label className="group-label">Custom Basis Vectors</label>
        <div className="vector-input-row">
          <span className="vector-label" style={{ color: '#ff4d4d' }}>$\hat{b}_1$</span>
          <input type="number" step="0.1" value={b1[0]} onChange={e => handleVectorChange(setB1, b1, 0, e.target.value)} />
          <input type="number" step="0.1" value={b1[1]} onChange={e => handleVectorChange(setB1, b1, 1, e.target.value)} />
          <input type="number" step="0.1" value={b1[2]} onChange={e => handleVectorChange(setB1, b1, 2, e.target.value)} />
        </div>
        <div className="vector-input-row">
          <span className="vector-label" style={{ color: '#4dff4d' }}>$\hat{b}_2$</span>
          <input type="number" step="0.1" value={b2[0]} onChange={e => handleVectorChange(setB2, b2, 0, e.target.value)} />
          <input type="number" step="0.1" value={b2[1]} onChange={e => handleVectorChange(setB2, b2, 1, e.target.value)} />
          <input type="number" step="0.1" value={b2[2]} onChange={e => handleVectorChange(setB2, b2, 2, e.target.value)} />
        </div>
        <div className="vector-input-row">
          <span className="vector-label" style={{ color: '#4d4dff' }}>$\hat{b}_3$</span>
          <input type="number" step="0.1" value={b3[0]} onChange={e => handleVectorChange(setB3, b3, 0, e.target.value)} />
          <input type="number" step="0.1" value={b3[1]} onChange={e => handleVectorChange(setB3, b3, 1, e.target.value)} />
          <input type="number" step="0.1" value={b3[2]} onChange={e => handleVectorChange(setB3, b3, 2, e.target.value)} />
        </div>
      </div>

      {/* Vector v */}
      <div className="control-group">
        <label className="group-label">Vector $[\vec{v}]_B$ (in custom basis)</label>
        <div className="vector-input-row">
          <span className="vector-label" style={{ color: '#ffd166' }}>$\vec{v}$</span>
          <input type="number" step="0.1" value={v[0]} onChange={e => handleVectorChange(setV, v, 0, e.target.value)} />
          <input type="number" step="0.1" value={v[1]} onChange={e => handleVectorChange(setV, v, 1, e.target.value)} />
          <input type="number" step="0.1" value={v[2]} onChange={e => handleVectorChange(setV, v, 2, e.target.value)} />
        </div>
      </div>

      {/* Morph Slider */}
      <div className="control-group">
        <label className="group-label">Morph Grid (Standard → Custom)</label>
        <input 
          type="range" 
          min="0" max="1" step="0.01" 
          value={morphValue} 
          onChange={e => setMorphValue(parseFloat(e.target.value))} 
          className="slider"
        />
      </div>

      {/* Toggles */}
      <div className="toggle-group">
        <label className="checkbox-label">
          <input type="checkbox" checked={showStandardGrid} onChange={e => setShowStandardGrid(e.target.checked)} />
          Show Standard Grid
        </label>
        <label className="checkbox-label" style={{ color: '#c77dff' }}>
          <input type="checkbox" checked={showCustomGrid} onChange={e => setShowCustomGrid(e.target.checked)} />
          Show Custom Grid
        </label>
      </div>

      <button className="reset-btn" onClick={reset}>Reset</button>
    </div>
  )
}
