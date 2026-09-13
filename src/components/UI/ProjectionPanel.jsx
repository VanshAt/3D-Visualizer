import { useMemo } from 'react'
import { useProjectionStore, GS_OUTPUT } from '../../state/useProjectionStore'
import { useExportPng } from '../../hooks/useExportPng'
import {
  magnitude, dot, scale, sub, normalize, fmt,
} from '../../lib/math'
import './ProjectionPanel.css'

// ─── Projection computations (pure) ──────────────────────────────────────────

function project1D(b, a) {
  const d = dot(a, a)
  if (d < 1e-12) return [0, 0, 0]
  return scale(a, dot(b, a) / d)
}

function projectSubspace(b, bases) {
  if (bases.length === 0) return [0, 0, 0]
  if (bases.length === 1) return project1D(b, bases[0])
  const a1 = bases[0]
  const a2orth = sub(bases[1], project1D(bases[1], a1))
  return [
    project1D(b, a1)[0] + project1D(b, a2orth)[0],
    project1D(b, a1)[1] + project1D(b, a2orth)[1],
    project1D(b, a1)[2] + project1D(b, a2orth)[2],
  ]
}

// ─── Slider row (x / y / z) ──────────────────────────────────────────────────

function CompRow({ axis, value, onChange, color }) {
  return (
    <div className="comp-row">
      <span className="comp-label" style={{ color }}>{axis}</span>
      <input
        type="range"
        className="comp-slider"
        min={-5} max={5} step={0.1}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <input
        type="number"
        className="comp-number"
        min={-10} max={10} step={0.1}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      />
    </div>
  )
}

// ─── Vector card ──────────────────────────────────────────────────────────────

function VectorCard({ vec, onUpdate, removable, onRemove }) {
  return (
    <div className="proj-vec-card">
      <div className="proj-vec-header">
        <span className="bv-swatch" style={{ background: vec.color }} />
        <span className="proj-vec-label">{vec.label}</span>
        {removable && (
          <button className="proj-vec-remove" onClick={onRemove} title="Remove">✕</button>
        )}
      </div>
      <div className="proj-vec-controls">
        <CompRow axis="x" value={vec.x} onChange={(v) => onUpdate({ x: v })} color="#ef4444" />
        <CompRow axis="y" value={vec.y} onChange={(v) => onUpdate({ y: v })} color="#22c55e" />
        <CompRow axis="z" value={vec.z} onChange={(v) => onUpdate({ z: v })} color="#3b82f6" />
      </div>
    </div>
  )
}

// ─── Stats computed for projection mode ───────────────────────────────────────

function ProjectionStats({ bVec, bases }) {
  const proj     = useMemo(() => projectSubspace(bVec, bases), [bVec, bases])
  const residual = useMemo(() => sub(bVec, proj), [bVec, proj])
  const magProj  = magnitude(proj)
  const magErr   = magnitude(residual)
  const magB     = magnitude(bVec)
  const cosTheta = magB > 1e-8 && magProj > 1e-8
    ? dot(bVec, proj) / (magB * magnitude(proj) + 1e-12)
    : 0
  const angleDeg = Math.acos(Math.min(1, Math.max(-1, cosTheta))) * (180 / Math.PI)

  return (
    <div className="proj-stats-box">
      <p className="proj-stats-title">Computed</p>
      <div className="proj-stat-row">
        <span className="proj-stat-label">|proj|</span>
        <span className="proj-stat-value" style={{ color: '#22d3ee' }}>{fmt(magProj)}</span>
      </div>
      <div className="proj-stat-row">
        <span className="proj-stat-label">|error|</span>
        <span className="proj-stat-value" style={{ color: '#ff6b6b' }}>{fmt(magErr)}</span>
      </div>
      <div className="proj-stat-row">
        <span className="proj-stat-label">cos θ</span>
        <span className="proj-stat-value">{fmt(cosTheta)}</span>
      </div>
      <div className="proj-stat-row">
        <span className="proj-stat-label">θ</span>
        <span className="proj-stat-value">{fmt(angleDeg)}°</span>
      </div>
      <div className="proj-stat-row">
        <span className="proj-stat-label">proj</span>
        <span className="proj-stat-value proj-stat-coords">
          ({fmt(proj[0])}, {fmt(proj[1])}, {fmt(proj[2])})
        </span>
      </div>
    </div>
  )
}

// ─── GS step results display ──────────────────────────────────────────────────

function GsResults({ gsVectors, gsStep }) {
  const { steps } = useMemo(() => {
    const eps   = 1e-6
    const basis = []
    const steps = []

    for (const v of gsVectors) {
      const raw = [v.x, v.y, v.z]
      if (magnitude(raw) < eps) {
        steps.push({ output: [0, 0, 0] })
        continue
      }
      let w = [...raw]
      for (const b of basis) w = sub(w, scale(b, dot(w, b)))
      const normed = magnitude(w) > eps ? normalize(w) : [0, 0, 0]
      if (magnitude(w) > eps) basis.push(normed)
      steps.push({ output: normed })
    }
    return { steps }
  }, [gsVectors])

  return (
    <div className="gs-results-box">
      <p className="proj-stats-title">Orthonormal Basis</p>
      {steps.map((s, i) => {
        const active  = i < gsStep
        const color   = GS_OUTPUT[i % GS_OUTPUT.length]
        const [x, y, z] = s.output
        return (
          <div
            key={i}
            className={`gs-result-row ${active ? 'active' : 'dim'}`}
            style={{ '--gs-color': color }}
          >
            <span className="gs-result-label" style={{ color }}>e{i + 1}</span>
            <span className="gs-result-coords">
              ({fmt(x)}, {fmt(y)}, {fmt(z)})
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Main Panel ───────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

export default function ProjectionPanel() {
  const mode       = useProjectionStore((s) => s.mode)
  const setMode    = useProjectionStore((s) => s.setMode)
  const exportPng  = useExportPng()

  return (
    <aside className="proj-panel">
      {/* Header */}
      <div className="panel-header">
        <h2 className="panel-title">Project</h2>
        <button
          className="export-btn"
          onClick={() => exportPng('linalg-viz-project.png')}
          title="Export scene to PNG"
        >
          📷
        </button>
      </div>

      {/* Mode toggle pill */}
      <div className="mode-pill-wrap">
        <button
          className={`mode-pill-btn ${mode === 'project' ? 'active' : ''}`}
          onClick={() => setMode('project')}
        >
          Projection
        </button>
        <button
          className={`mode-pill-btn ${mode === 'gram-schmidt' ? 'active' : ''}`}
          onClick={() => setMode('gram-schmidt')}
        >
          Gram-Schmidt
        </button>
      </div>

      {mode === 'project' ? <ProjectionMode /> : <GramSchmidtMode />}
    </aside>
  )
}

// ─── Projection sub-panel ─────────────────────────────────────────────────────

function ProjectionMode() {
  const baseVectors  = useProjectionStore((s) => s.baseVectors)
  const targetVector = useProjectionStore((s) => s.targetVector)
  const addBase      = useProjectionStore((s) => s.addBase)
  const removeBase   = useProjectionStore((s) => s.removeBase)
  const updateBase   = useProjectionStore((s) => s.updateBase)
  const updateTarget = useProjectionStore((s) => s.updateTarget)

  const bVec = [targetVector.x, targetVector.y, targetVector.z]
  const bases = baseVectors.map((v) => [v.x, v.y, v.z])

  return (
    <>
      {/* Base vectors section */}
      <div className="proj-section">
        <p className="proj-section-title">Base Vectors (span)</p>
        <div className="proj-vec-list">
          {baseVectors.map((v, i) => (
            <VectorCard
              key={v.id}
              vec={v}
              onUpdate={(patch) => updateBase(v.id, patch)}
              removable={baseVectors.length > 1}
              onRemove={removeBase}
            />
          ))}
        </div>
        <button
          className="add-base-btn"
          disabled={baseVectors.length >= 2}
          onClick={addBase}
        >
          + Add Base Vector
        </button>
      </div>

      {/* Target vector */}
      <div className="proj-section">
        <p className="proj-section-title">Target Vector</p>
        <VectorCard
          vec={targetVector}
          onUpdate={(patch) => updateTarget(patch)}
          removable={false}
        />
      </div>

      {/* Stats */}
      <ProjectionStats bVec={bVec} bases={bases} />
    </>
  )
}

// ─── Gram-Schmidt sub-panel ───────────────────────────────────────────────────

function GramSchmidtMode() {
  const gsVectors      = useProjectionStore((s) => s.gsVectors)
  const gsStep         = useProjectionStore((s) => s.gsStep)
  const gsPlaying      = useProjectionStore((s) => s.gsPlaying)
  const addGsVector    = useProjectionStore((s) => s.addGsVector)
  const removeGsVector = useProjectionStore((s) => s.removeGsVector)
  const updateGsVector = useProjectionStore((s) => s.updateGsVector)
  const nextGsStep     = useProjectionStore((s) => s.nextGsStep)
  const prevGsStep     = useProjectionStore((s) => s.prevGsStep)
  const toggleGsPlay   = useProjectionStore((s) => s.toggleGsPlay)
  const setGsStep      = useProjectionStore((s) => s.setGsStep)

  return (
    <>
      {/* Input vectors */}
      <div className="proj-section">
        <p className="proj-section-title">Input Vectors</p>
        <div className="proj-vec-list">
          {gsVectors.map((v) => (
            <VectorCard
              key={v.id}
              vec={v}
              onUpdate={(patch) => updateGsVector(v.id, patch)}
              removable={gsVectors.length > 1}
              onRemove={removeGsVector}
            />
          ))}
        </div>
        <button
          className="add-base-btn"
          disabled={gsVectors.length >= 3}
          onClick={addGsVector}
        >
          + Add Vector
        </button>
      </div>

      {/* Step controls */}
      <div className="proj-section">
        <p className="proj-section-title">Step Control</p>
        <div className="gs-step-display">
          Step {gsStep} / {gsVectors.length}
        </div>
        <div className="gs-step-buttons">
          <button
            className="gs-ctrl-btn"
            onClick={prevGsStep}
            disabled={gsStep <= 0}
          >
            ◀ Prev
          </button>
          <button
            className="gs-ctrl-btn"
            onClick={nextGsStep}
            disabled={gsStep >= gsVectors.length}
          >
            Next ▶
          </button>
          <button
            className={`gs-ctrl-btn gs-play-btn ${gsPlaying ? 'active' : ''}`}
            onClick={toggleGsPlay}
          >
            {gsPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button
            className="gs-ctrl-btn"
            onClick={() => setGsStep(0)}
          >
            ↺ Reset
          </button>
        </div>
      </div>

      {/* Results */}
      <GsResults gsVectors={gsVectors} gsStep={gsStep} />
    </>
  )
}
