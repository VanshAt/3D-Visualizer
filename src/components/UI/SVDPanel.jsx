import React, { useEffect, useRef } from 'react'
import useSVDStore from '../../state/useSVDStore'
import { SVD } from 'ml-matrix'
import './SVDPanel.css'

export default function SVDPanel() {
  const {
    matrix, animationProgress, isPlaying,
    setMatrix, setAnimationProgress, setIsPlaying
  } = useSVDStore()

  const animRef = useRef()

  useEffect(() => {
    if (isPlaying) {
      let lastTime = performance.now()
      const animate = (time) => {
        const delta = (time - lastTime) / 1000
        lastTime = time
        setAnimationProgress((prev) => {
          const next = prev + delta * 0.5 // complete in 6 seconds
          if (next >= 3) {
            setIsPlaying(false)
            return 3
          }
          return next
        })
        animRef.current = requestAnimationFrame(animate)
      }
      animRef.current = requestAnimationFrame(animate)
    } else {
      cancelAnimationFrame(animRef.current)
    }
    return () => cancelAnimationFrame(animRef.current)
  }, [isPlaying, setAnimationProgress, setIsPlaying])

  const handleMatrixChange = (row, col, value) => {
    const newMatrix = matrix.map(r => [...r])
    newMatrix[row][col] = parseFloat(value) || 0
    setMatrix(newMatrix)
  }

  let svdData = null
  try {
    const svd = new SVD(matrix)
    svdData = {
      U: svd.U.to2DArray(),
      Sigma: svd.diagonal,
      Vt: svd.V.transpose().to2DArray()
    }
  } catch(e) {
    // Math error (e.g. invalid matrix)
  }

  return (
    <div className="panel-container">
      <h2 className="panel-title">Singular Value Decomposition</h2>
      <p className="panel-description">
        Any matrix $A$ can be decomposed into $A = U \Sigma V^T$. This visually demonstrates the process: rotation, scaling, and a second rotation.
      </p>

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
                  step="0.5"
                  value={val}
                  onChange={(e) => handleMatrixChange(i, j, e.target.value)}
                  className="matrix-cell"
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Animation Controls */}
      <div className="control-group">
        <label className="group-label">Transformation Timeline</label>
        
        <div className="timeline-labels">
          <span className={animationProgress >= 0 && animationProgress < 1 ? 'active-stage' : ''}>$V^T$ (Rotate)</span>
          <span className={animationProgress >= 1 && animationProgress < 2 ? 'active-stage' : ''}>$\Sigma$ (Scale)</span>
          <span className={animationProgress >= 2 ? 'active-stage' : ''}>$U$ (Rotate)</span>
        </div>

        <input 
          type="range" 
          min="0" max="3" step="0.01" 
          value={animationProgress} 
          onChange={e => {
            setIsPlaying(false)
            setAnimationProgress(parseFloat(e.target.value))
          }} 
          className="slider"
        />

        <div className="playback-controls">
          <button className="play-btn" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? 'Pause' : (animationProgress >= 3 ? 'Restart' : 'Play')}
          </button>
          <button className="reset-btn" onClick={() => { setIsPlaying(false); setAnimationProgress(0) }}>
            Reset
          </button>
        </div>
      </div>

      {/* SVD Math Readout */}
      {svdData && (
        <div className="svd-readout">
          <div className="svd-matrix-box">
            <span className="matrix-label">$U$</span>
            {svdData.U.map((row, i) => (
              <div key={i} className="readout-row">
                {row.map((val, j) => <span key={j}>{val.toFixed(2)}</span>)}
              </div>
            ))}
          </div>
          
          <div className="svd-matrix-box">
            <span className="matrix-label">$\Sigma$</span>
            <div className="readout-row">
              <span>{svdData.Sigma[0].toFixed(2)}</span><span>0</span><span>0</span>
            </div>
            <div className="readout-row">
              <span>0</span><span>{svdData.Sigma[1].toFixed(2)}</span><span>0</span>
            </div>
            <div className="readout-row">
              <span>0</span><span>0</span><span>{svdData.Sigma[2].toFixed(2)}</span>
            </div>
          </div>

          <div className="svd-matrix-box">
            <span className="matrix-label">$V^T$</span>
            {svdData.Vt.map((row, i) => (
              <div key={i} className="readout-row">
                {row.map((val, j) => <span key={j}>{val.toFixed(2)}</span>)}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
