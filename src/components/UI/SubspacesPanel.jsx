import React from 'react'
import useSubspacesStore from '../../state/useSubspacesStore'
import './SubspacesPanel.css'

export default function SubspacesPanel() {
  const {
    matrix, viewMode, selectedPreset,
    setMatrix, setPreset, setViewMode
  } = useSubspacesStore()

  const handleMatrixChange = (row, col, value) => {
    const newMatrix = matrix.map(r => [...r])
    newMatrix[row][col] = parseFloat(value) || 0
    setMatrix(newMatrix)
  }

  return (
    <div className="panel-container">
      <h2 className="panel-title">Fundamental Subspaces</h2>
      <p className="panel-description">
        Visualize the four fundamental subspaces of a 3x3 matrix.
      </p>

      {/* Preset Selection */}
      <div className="control-group">
        <label className="group-label">Preset Matrices</label>
        <select 
          className="preset-select" 
          value={selectedPreset} 
          onChange={(e) => setPreset(e.target.value)}
        >
          <option value="custom">Custom</option>
          <option value="invertible">Invertible (Rank 3)</option>
          <option value="rank2">Projection to Plane (Rank 2)</option>
          <option value="rank1">Projection to Line (Rank 1)</option>
          <option value="zero">Zero Matrix (Rank 0)</option>
        </select>
      </div>

      {/* Matrix Editor */}
      <div className="control-group">
        <label className="group-label">Matrix $A$</label>
        <div className="matrix-input">
          {matrix.map((row, i) => (
            <div key={i} className="matrix-row">
              {row.map((val, j) => (
                <input
                  key={j}
                  type="number"
                  step="1"
                  value={val}
                  onChange={(e) => handleMatrixChange(i, j, e.target.value)}
                  className="matrix-cell"
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* View Toggle */}
      <div className="control-group">
        <label className="group-label">Space Viewer</label>
        <div className="toggle-buttons">
          <button 
            className={`toggle-btn ${viewMode === 'domain' ? 'active' : ''}`}
            onClick={() => setViewMode('domain')}
          >
            Domain (Row Space ⊕ Null Space)
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'codomain' ? 'active' : ''}`}
            onClick={() => setViewMode('codomain')}
          >
            Codomain (Col Space ⊕ Left Null Space)
          </button>
        </div>
      </div>

      <div className="legend-group">
        <label className="group-label">Legend</label>
        {viewMode === 'domain' ? (
          <>
            <div className="legend-item">
              <div className="color-box" style={{ background: '#4dff4d' }}></div>
              <span>Row Space</span>
            </div>
            <div className="legend-item">
              <div className="color-box" style={{ background: '#ff4d4d' }}></div>
              <span>Null Space</span>
            </div>
          </>
        ) : (
          <>
            <div className="legend-item">
              <div className="color-box" style={{ background: '#4d4dff' }}></div>
              <span>Column Space</span>
            </div>
            <div className="legend-item">
              <div className="color-box" style={{ background: '#ffd166' }}></div>
              <span>Left Null Space</span>
            </div>
          </>
        )}
      </div>

    </div>
  )
}
