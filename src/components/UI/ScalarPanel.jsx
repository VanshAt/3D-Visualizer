import { useMemo } from 'react'
import { useScalarStore, SCALAR_LABELS } from '../../state/useScalarStore'
import { magnitude, fmt } from '../../lib/math'
import { useExportPng } from '../../hooks/useExportPng'
import './ScalarPanel.css'

// ─── Shared: small component-input row (reuses VectorPanel patterns) ─────────
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

// ─── Single base-vector card ─────────────────────────────────────────────────
function BaseVecCard({ vector, index, canRemove }) {
  const updateVector = useScalarStore((s) => s.updateVector)
  const removeVector = useScalarStore((s) => s.removeVector)
  const { id, label, x, y, z, color } = vector

  return (
    <div className="base-vec-card" style={{ borderColor: `${color}22` }}>
      {/* Header */}
      <div className="base-vec-header">
        <span className="bv-swatch" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
        <input
          className="bv-label-input"
          value={label}
          maxLength={8}
          onChange={(e) => updateVector(id, { label: e.target.value })}
          style={{ color }}
        />
        <span className="vec-mag">|v| = {fmt(magnitude([x, y, z]))}</span>
        <div className="bv-actions">
          <label className="icon-btn" title="Colour" style={{ cursor: 'pointer' }}>
            <input
              type="color"
              value={color}
              onChange={(e) => updateVector(id, { color: e.target.value })}
              className="color-picker"
              style={{ width: 0, height: 0, visibility: 'hidden', position: 'absolute' }}
            />
            🎨
          </label>
          {canRemove && (
            <button
              className="icon-btn danger"
              title="Remove last vector"
              onClick={removeVector}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* x/y/z sliders */}
      <div className="bv-controls">
        <ComponentInput label="x" value={x} onChange={(v) => updateVector(id, { x: v })} />
        <ComponentInput label="y" value={y} onChange={(v) => updateVector(id, { y: v })} />
        <ComponentInput label="z" value={z} onChange={(v) => updateVector(id, { z: v })} />
      </div>
    </div>
  )
}

// ─── Scalar slider row ────────────────────────────────────────────────────────
function ScalarRow({ index, vector, scalar }) {
  const setScalar    = useScalarStore((s) => s.setScalar)
  const sweepActive  = useScalarStore((s) => s.sweepActive)
  const sweepTarget  = useScalarStore((s) => s.sweepTarget)
  const toggleSweep  = useScalarStore((s) => s.toggleSweep)

  const greek   = SCALAR_LABELS[index] ?? `s${index}`
  const color   = vector.color
  const isSwept = sweepActive && sweepTarget === index

  return (
    <div className="scalar-row">
      <div className="scalar-row-header">
        <span className="scalar-greek" style={{ color }}>{greek}</span>
        <span className="scalar-value-badge">{scalar.toFixed(2)}</span>
        <button
          className={`sweep-btn ${isSwept ? 'active' : ''}`}
          style={isSwept ? {} : { borderColor: `${color}55`, color }}
          onClick={() => toggleSweep(index)}
          title={isSwept ? 'Stop sweep' : `Sweep ${greek}`}
        >
          {isSwept ? '⏹ Stop' : `⟳ Sweep`}
        </button>
      </div>
      <div className="scalar-slider-wrap">
        <input
          type="range"
          min={-4}
          max={4}
          step={0.05}
          value={scalar}
          onChange={(e) => setScalar(index, parseFloat(e.target.value))}
          className="scalar-slider"
          style={{ '--thumb-color': color }}
          aria-label={`${greek} scalar for ${vector.label}`}
        />
        <input
          type="number"
          min={-4}
          max={4}
          step={0.05}
          value={parseFloat(scalar.toFixed(3))}
          onChange={(e) => setScalar(index, parseFloat(e.target.value) || 0)}
          className="scalar-number"
        />
      </div>
    </div>
  )
}

// ─── Result info box ──────────────────────────────────────────────────────────
function ResultBox({ vectors, scalars }) {
  const { rx, ry, rz, mag, equation } = useMemo(() => {
    let rx = 0, ry = 0, rz = 0
    const parts = vectors.map((v, i) => {
      const s = scalars[i] ?? 1
      rx += v.x * s
      ry += v.y * s
      rz += v.z * s
      const sStr = s >= 0 ? `${s.toFixed(2)}` : `(${s.toFixed(2)})`
      return `${sStr}·${v.label}`
    })
    const equation = parts.join(' + ')
    const mag = magnitude([rx, ry, rz])
    return { rx, ry, rz, mag, equation }
  }, [vectors, scalars])

  return (
    <div className="result-section">
      <div className="result-box">
        <span className="result-box-title">Result r = Σ αᵢvᵢ</span>
        <span className="result-equation">r = {equation}</span>
        <span className="result-coords">
          ({fmt(rx)}, {fmt(ry)}, {fmt(rz)})
        </span>
        <span className="result-mag">|r| = {mag.toFixed(3)}</span>
      </div>
    </div>
  )
}

// ─── Sweep controls ────────────────────────────────────────────────────────────
function SweepControls() {
  const sweepSpeed    = useScalarStore((s) => s.sweepSpeed)
  const setSweepSpeed = useScalarStore((s) => s.setSweepSpeed)

  return (
    <div className="sweep-section">
      <p className="scalar-section-title">Sweep speed</p>
      <div className="sweep-speed-row">
        <span className="sweep-speed-label">slow</span>
        <input
          type="range"
          min={0.2}
          max={3}
          step={0.1}
          value={sweepSpeed}
          onChange={(e) => setSweepSpeed(parseFloat(e.target.value))}
          className="sweep-speed-slider"
          aria-label="Sweep speed"
        />
        <span className="sweep-speed-label">fast</span>
      </div>
    </div>
  )
}

// ─── Main panel ───────────────────────────────────────────────────────────────
export default function ScalarPanel() {
  const vectors   = useScalarStore((s) => s.vectors)
  const scalars   = useScalarStore((s) => s.scalars)
  const addVector = useScalarStore((s) => s.addVector)
  const exportPng = useExportPng()

  const canAdd    = vectors.length < 3
  const canRemove = vectors.length > 1

  return (
    <aside className="scalar-panel">
      {/* Header */}
      <div className="panel-header">
        <span className="panel-title">Linear Combinations</span>
        <button
          id="export-scalars-btn"
          className="scalar-export-btn"
          onClick={() => exportPng('linalg-viz-scalars.png')}
          title="Export scene to PNG [E]"
        >
          📷
        </button>
      </div>

      {/* ── Base vectors ─────────────────────────────────────────────── */}
      <div className="scalar-section">
        <p className="scalar-section-title">Base Vectors</p>
        <div className="base-vec-list">
          {vectors.map((v, i) => (
            <BaseVecCard
              key={v.id}
              vector={v}
              index={i}
              canRemove={canRemove && i === vectors.length - 1}
            />
          ))}
        </div>
        <button
          className="add-base-btn"
          onClick={addVector}
          disabled={!canAdd}
          title={canAdd ? 'Add base vector [A]' : 'Maximum 3 vectors'}
        >
          + Add vector {!canAdd ? '(max 3)' : `(${vectors.length}/3)`}
        </button>
      </div>

      {/* ── Scalar sliders ────────────────────────────────────────────── */}
      <div className="scalars-section">
        <p className="scalar-section-title">Scalar Multipliers</p>
        {vectors.map((v, i) => (
          <ScalarRow
            key={v.id}
            index={i}
            vector={v}
            scalar={scalars[i] ?? 1}
          />
        ))}
      </div>

      {/* ── Result ───────────────────────────────────────────────────── */}
      <ResultBox vectors={vectors} scalars={scalars} />

      {/* ── Sweep controls ────────────────────────────────────────────── */}
      <SweepControls />

      {/* Footer hint */}
      <p className="panel-hint">
        Adjust sliders · click ⟳ Sweep to animate · <kbd className="kbd-inline">A</kbd> add vector · <kbd className="kbd-inline">E</kbd> export
      </p>
    </aside>
  )
}
