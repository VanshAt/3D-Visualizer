import { useCrossStore } from '../../state/useCrossStore'
import { cross, magnitude, dot, fmt } from '../../lib/math'
import './CrossPanel.css'

export default function CrossPanel() {
  const { u, v, updateU, updateV } = useCrossStore()

  const uVec = [u.x, u.y, u.z]
  const vVec = [v.x, v.y, v.z]
  
  const crossProduct = cross(uVec, vVec)
  const area = magnitude(crossProduct)
  
  const isOrthogonalToU = Math.abs(dot(crossProduct, uVec)) < 1e-6
  const isOrthogonalToV = Math.abs(dot(crossProduct, vVec)) < 1e-6

  const renderSlider = (val, setVal, color) => (
    <input
      type="range"
      className="comp-slider"
      min="-5" max="5" step="0.1"
      value={val}
      onChange={(e) => setVal(parseFloat(e.target.value))}
      style={{ '--thumb-color': color }}
    />
  )

  const renderNumber = (val, setVal) => (
    <input
      type="number"
      className="comp-number"
      value={fmt(val)}
      step="0.1"
      onChange={(e) => {
        const n = parseFloat(e.target.value)
        if (!isNaN(n)) setVal(n)
      }}
    />
  )

  return (
    <div className="cross-panel">
      <div className="panel-header">
        <h2 className="panel-title">Cross Product</h2>
      </div>

      <div className="cross-section">
        <h3 className="cross-section-title">Base Vectors</h3>
        
        <div className="cross-vec-list">
          {/* Vector U */}
          <div className="cross-vec-card">
            <div className="cross-vec-header">
              <span className="cross-vec-label" style={{ color: u.color }}>u</span>
            </div>
            <div className="cross-vec-controls">
              <div className="comp-row">
                <span className="comp-label">x</span>
                {renderSlider(u.x, (x) => updateU({ x }), u.color)}
                {renderNumber(u.x, (x) => updateU({ x }))}
              </div>
              <div className="comp-row">
                <span className="comp-label">y</span>
                {renderSlider(u.y, (y) => updateU({ y }), u.color)}
                {renderNumber(u.y, (y) => updateU({ y }))}
              </div>
              <div className="comp-row">
                <span className="comp-label">z</span>
                {renderSlider(u.z, (z) => updateU({ z }), u.color)}
                {renderNumber(u.z, (z) => updateU({ z }))}
              </div>
            </div>
          </div>

          {/* Vector V */}
          <div className="cross-vec-card">
            <div className="cross-vec-header">
              <span className="cross-vec-label" style={{ color: v.color }}>v</span>
            </div>
            <div className="cross-vec-controls">
              <div className="comp-row">
                <span className="comp-label">x</span>
                {renderSlider(v.x, (x) => updateV({ x }), v.color)}
                {renderNumber(v.x, (x) => updateV({ x }))}
              </div>
              <div className="comp-row">
                <span className="comp-label">y</span>
                {renderSlider(v.y, (y) => updateV({ y }), v.color)}
                {renderNumber(v.y, (y) => updateV({ y }))}
              </div>
              <div className="comp-row">
                <span className="comp-label">z</span>
                {renderSlider(v.z, (z) => updateV({ z }), v.color)}
                {renderNumber(v.z, (z) => updateV({ z }))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cross-stats-box">
        <h3 className="cross-stats-title">u × v</h3>
        <div className="cross-stat-row">
          <span className="cross-stat-label">Vector:</span>
          <span className="cross-stat-coords">
            [{fmt(crossProduct[0])}, {fmt(crossProduct[1])}, {fmt(crossProduct[2])}]
          </span>
        </div>
        <div className="cross-stat-row">
          <span className="cross-stat-label">Area |u × v|:</span>
          <span className="cross-stat-value">{fmt(area)}</span>
        </div>
        <div className="cross-stat-row" style={{ marginTop: '4px' }}>
          <span className="cross-stat-label" style={{ fontSize: '0.65rem' }}>
            Orthogonal to u: {isOrthogonalToU ? '✅' : '❌'}<br />
            Orthogonal to v: {isOrthogonalToV ? '✅' : '❌'}
          </span>
        </div>
      </div>
    </div>
  )
}
