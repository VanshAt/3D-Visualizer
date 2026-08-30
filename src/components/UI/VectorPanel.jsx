import { useMemo } from 'react'
import { useStore } from '../../state/useStore'
import { magnitude, dot, cross, fmt, gramSchmidtRank } from '../../lib/math'
import './VectorPanel.css'

// ─── Sub-components ───────────────────────────────────────────────────────────

function Swatch({ color }) {
  return (
    <span
      className="vec-swatch"
      style={{ background: color }}
    />
  )
}

function ComponentInput({ label, value, onChange }) {
  return (
    <label className="comp-row">
      <span className="comp-label">{label}</span>
      <input
        type="range"
        min={-5}
        max={5}
        step={0.1}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="comp-slider"
      />
      <input
        type="number"
        min={-5}
        max={5}
        step={0.1}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="comp-number"
      />
    </label>
  )
}

function VectorCard({ vector, isSelected, onSelect }) {
  const { updateVector, removeVector, toggleVector } = useStore()
  const { id, label, x, y, z, color, visible } = vector
  const mag = magnitude([x, y, z])

  return (
    <div
      className={`vec-card ${isSelected ? 'selected' : ''} ${!visible ? 'hidden' : ''}`}
      onClick={onSelect}
    >
      {/* ── Header row ─────────────────────────────────────────────────── */}
      <div className="vec-card-header">
        <Swatch color={color} />

        <input
          className="vec-label-input"
          value={label}
          maxLength={8}
          onChange={(e) => updateVector(id, { label: e.target.value })}
          onClick={(e) => e.stopPropagation()}
          style={{ color }}
        />

        <span className="vec-mag">|v| = {fmt(mag)}</span>

        <div className="vec-card-actions">
          <button
            className={`icon-btn ${visible ? '' : 'dim'}`}
            title={visible ? 'Hide' : 'Show'}
            onClick={(e) => { e.stopPropagation(); toggleVector(id) }}
          >
            {visible ? '👁' : '🙈'}
          </button>
          <button
            className="icon-btn danger"
            title="Delete"
            onClick={(e) => { e.stopPropagation(); removeVector(id) }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── Component sliders (only when selected) ────────────────────── */}
      {isSelected && (
        <div className="vec-controls" onClick={(e) => e.stopPropagation()}>
          <ComponentInput label="x" value={x} onChange={(v) => updateVector(id, { x: v })} />
          <ComponentInput label="y" value={y} onChange={(v) => updateVector(id, { y: v })} />
          <ComponentInput label="z" value={z} onChange={(v) => updateVector(id, { z: v })} />

          <label className="comp-row">
            <span className="comp-label">colour</span>
            <input
              type="color"
              value={color}
              onChange={(e) => updateVector(id, { color: e.target.value })}
              className="color-picker"
            />
          </label>

          <div className="vec-coords">
            ({fmt(x)}, {fmt(y)}, {fmt(z)})
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Operations panel (shown when exactly 2 vectors are present) ─────────────
function OpsPanel({ vectors }) {
  if (vectors.length < 2) return null
  const [a, b] = vectors
  const va = [a.x, a.y, a.z]
  const vb = [b.x, b.y, b.z]

  const dotVal   = dot(va, vb).toFixed(3)
  const crossVal = cross(va, vb).map(fmt).join(', ')
  const angleDeg = (() => {
    const ma = magnitude(va), mb = magnitude(vb)
    if (ma === 0 || mb === 0) return '—'
    const cos = Math.min(1, Math.max(-1, dot(va, vb) / (ma * mb)))
    return (Math.acos(cos) * (180 / Math.PI)).toFixed(1) + '°'
  })()

  return (
    <div className="ops-panel">
      <h3 className="ops-title">Vector Operations</h3>
      <div className="ops-grid">
        <span className="ops-label">v1 · v2</span>
        <span className="ops-value">{dotVal}</span>

        <span className="ops-label">v1 × v2</span>
        <span className="ops-value">({crossVal})</span>

        <span className="ops-label">angle</span>
        <span className="ops-value">{angleDeg}</span>
      </div>
    </div>
  )
}

// ─── Span info panel ──────────────────────────────────────────────────────────
const SPAN_DESC = ['—', 'a line through origin', 'a plane through origin', 'all of ℝ³']
const SPAN_BADGE = ['', 'ℝ¹', 'ℝ²', 'ℝ³']

function SpanInfo({ vectors }) {
  const rank = useMemo(() => {
    const vis = vectors.filter((v) => v.visible)
    return gramSchmidtRank(vis.map((v) => [v.x, v.y, v.z]))
  }, [vectors])

  return (
    <div className="span-info">
      <h3 className="ops-title">Span</h3>
      <div className="span-rank-row">
        <span className="span-badge">{SPAN_BADGE[rank] || '—'}</span>
        <span className="span-desc">{SPAN_DESC[rank] || '—'}</span>
      </div>
    </div>
  )
}

// ─── Main panel ───────────────────────────────────────────────────────────────
export default function VectorPanel() {
  const { vectors, selectedId, setSelectedId, addVector, showSpan, setShowSpan } = useStore()

  return (
    <aside className="vector-panel">
      {/* Header */}
      <div className="panel-header">
        <span className="panel-title">Vectors</span>
        <div className="header-actions">
          <button
            id="span-toggle-btn"
            className={`span-btn ${showSpan ? 'active' : ''}`}
            onClick={() => setShowSpan(!showSpan)}
            title="Toggle span visualisation"
          >
            ∑ Span
          </button>
          <button
            className="add-btn"
            onClick={addVector}
            title="Add vector"
          >
            + Add
          </button>
        </div>
      </div>

      {/* Vector list */}
      <div className="vec-list">
        {vectors.length === 0 && (
          <p className="empty-hint">No vectors yet. Click + Add.</p>
        )}
        {vectors.map((v) => (
          <VectorCard
            key={v.id}
            vector={v}
            isSelected={v.id === selectedId}
            onSelect={() => setSelectedId(v.id === selectedId ? null : v.id)}
          />
        ))}
      </div>

      {/* Ops */}
      <OpsPanel vectors={vectors} />

      {/* Span info */}
      {showSpan && <SpanInfo vectors={vectors} />}

      {/* Footer hint */}
      <p className="panel-hint">Click a card to edit · Drag scene to orbit</p>
    </aside>
  )
}
