import React, { useState, useMemo } from 'react'
import { useMatrixStore, PRESETS } from '../../state/useMatrixStore'
import { det3, smoothStep, fmt, eigenSolve3, eigenColor, complexEigenColor, mat3Inverse, cramerSolve } from '../../lib/math'
import { useExportPng } from '../../hooks/useExportPng'
import './MatrixPanel.css'

// ─── Individual matrix cell input ─────────────────────────────────────────────
function MatrixCell({ value, index, onChange, isIdentityDiag }) {
  const [focused, setFocused] = useState(false)

  return (
    <input
      type="number"
      step={0.1}
      className={`matrix-cell ${isIdentityDiag ? 'diag' : ''}`}
      value={focused ? value : parseFloat(value.toFixed(3))}
      onChange={(e) => onChange(index, parseFloat(e.target.value))}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      aria-label={`matrix cell ${index}`}
    />
  )
}

// ─── Column-to-basis annotation ───────────────────────────────────────────────
function BasisAnnotation({ matrix }) {
  // For row-major M, basis images are columns:
  // î → (M[0], M[3], M[6])   ĵ → (M[1], M[4], M[7])   k̂ → (M[2], M[5], M[8])
  const fmtV = (n) => (Math.abs(n) < 1e-10 ? '0' : parseFloat(n.toFixed(2)))
  const cols = [
    { label: 'î', color: '#ff4d6d', v: [matrix[0], matrix[3], matrix[6]] },
    { label: 'ĵ', color: '#4dff88', v: [matrix[1], matrix[4], matrix[7]] },
    { label: 'k̂', color: '#4da6ff', v: [matrix[2], matrix[5], matrix[8]] },
  ]

  return (
    <div className="basis-annotation">
      <p className="annotation-title">Basis images</p>
      {cols.map(({ label, color, v }) => (
        <div key={label} className="annotation-row">
          <span className="ann-label" style={{ color }}>{label} →</span>
          <code className="ann-vec">
            ({fmtV(v[0])}, {fmtV(v[1])}, {fmtV(v[2])})
          </code>
        </div>
      ))}
    </div>
  )
}

// ─── Eigenvalues section ────────────────────────────────────────────────────────
function EigenSection({ matrix, showEigenvectors, setShowEigenvectors }) {
  const { real, complex } = useMemo(() => eigenSolve3(matrix), [matrix])
  const hasAny = real.length > 0 || complex.length > 0

  return (
    <div className="eigen-section">
      <div className="eigen-section-header">
        <p className="annotation-title">Eigenvalues</p>
        <button
          id="eigen-toggle-btn"
          className={`eigen-vis-btn ${showEigenvectors ? 'active' : ''}`}
          onClick={() => setShowEigenvectors(!showEigenvectors)}
          title={showEigenvectors ? 'Hide eigenvector arrows' : 'Show eigenvector arrows'}
        >
          {showEigenvectors ? '👁 Hide' : '👁 Show'}
        </button>
      </div>

      {!hasAny && (
        <p className="eigen-empty">Matrix contains non-finite values</p>
      )}

      {real.map(({ lambda, vec }, i) => (
        <div key={`real-${i}`} className="eigen-row">
          <span className="eigen-dot" style={{ background: eigenColor(lambda) }} />
          <div className="eigen-info">
            <span className="eigen-lambda">λ = {lambda.toFixed(3)}</span>
            <span className="eigen-vec">
              ({fmt(vec[0])}, {fmt(vec[1])}, {fmt(vec[2])})
            </span>
          </div>
        </div>
      ))}

      {complex.map(({ re, im, magnitude: mod, angleDeg }, i) => (
        <div key={`cx-${i}`} className="eigen-row eigen-complex-row">
          <span className="eigen-dot" style={{ background: complexEigenColor(mod) }} />
          <div className="eigen-info">
            <span className="eigen-lambda">
              λ = {re.toFixed(2)} ± {im.toFixed(2)}i
            </span>
            <span className="eigen-complex-badge">
              |λ| = {mod.toFixed(3)} · ∠{angleDeg.toFixed(1)}°
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Inverse matrix section ──────────────────────────────────────────────────
function InverseSection({ matrix, showInverse, toggleInverse }) {
  const inv = useMemo(() => mat3Inverse(matrix), [matrix])
  const isSingular = inv === null
  const fmtV = (n) => (Math.abs(n) < 1e-10 ? '0' : parseFloat(n.toFixed(4)))

  return (
    <div className="inverse-section">
      <div className="inverse-section-header">
        <p className="annotation-title">Inverse M⁻¹</p>
        <button
          id="inverse-toggle-btn"
          className={`eigen-vis-btn ${showInverse ? 'active' : ''}`}
          onClick={toggleInverse}
          title={showInverse ? 'Hide inverse' : 'Show inverse'}
        >
          {showInverse ? '▾ Hide' : '▸ Show'}
        </button>
      </div>

      {showInverse && (
        <div className="inverse-body">
          {isSingular ? (
            <p className="inverse-singular">⚠ No inverse (singular matrix)</p>
          ) : (
            <div className="inverse-grid">
              {[0, 1, 2].map((row) => (
                <React.Fragment key={row}>
                  {[0, 1, 2].map((col) => {
                    const idx = row * 3 + col
                    return (
                      <span
                        key={idx}
                        className={`inverse-cell ${row === col ? 'diag' : ''}`}
                      >
                        {fmtV(inv[idx])}
                      </span>
                    )
                  })}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Cramer's Rule section ───────────────────────────────────────────────────
function CramerSection({ matrix, showCramer, toggleCramer }) {
  const cramerB    = useMatrixStore((s) => s.cramerB)
  const setCramerB = useMatrixStore((s) => s.setCramerB)
  const result     = useMemo(() => cramerSolve(matrix, cramerB), [matrix, cramerB])
  const isSingular = result === null
  const fmtV       = (n) => parseFloat(n.toFixed(4))
  const labels     = ['x₁', 'x₂', 'x₃']
  const bLabels    = ['b₁', 'b₂', 'b₃']

  return (
    <div className="cramer-section">
      <div className="cramer-section-header">
        <p className="annotation-title">Solve Ax = b</p>
        <button
          id="cramer-toggle-btn"
          className={`eigen-vis-btn ${showCramer ? 'active' : ''}`}
          onClick={toggleCramer}
          title={showCramer ? 'Hide solver' : 'Show solver'}
        >
          {showCramer ? '▾ Hide' : '▸ Show'}
        </button>
      </div>

      {showCramer && (
        <div className="cramer-body">
          {/* b-vector inputs */}
          <div className="cramer-b-row">
            <span className="cramer-b-label">b =</span>
            <span className="cramer-b-paren">(</span>
            {[0, 1, 2].map((i) => (
              <React.Fragment key={i}>
                <div className="cramer-b-input-wrap">
                  <label className="cramer-b-sub">{bLabels[i]}</label>
                  <input
                    type="number"
                    step={0.1}
                    className="cramer-input"
                    value={cramerB[i]}
                    onChange={(e) => setCramerB(i, parseFloat(e.target.value))}
                    aria-label={bLabels[i]}
                  />
                </div>
                {i < 2 && <span className="cramer-b-comma">,</span>}
              </React.Fragment>
            ))}
            <span className="cramer-b-paren">)</span>
          </div>

          {/* Solution */}
          {isSingular ? (
            <p className="cramer-singular">⚠ System has no unique solution (det = 0)</p>
          ) : (
            <div className="cramer-solution">
              <p className="cramer-sol-title">Solution x = M⁻¹b</p>
              {result.x.map((xi, i) => (
                <div key={i} className="cramer-sol-row">
                  <span className="cramer-sol-label">{labels[i]}</span>
                  <span className="cramer-sol-value">{fmtV(xi)}</span>
                  <span className="cramer-sol-ratio">
                    det(A{i+1}) / det(A) = {fmtV(result.dets[i])} / {fmtV(result.detA)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main panel ───────────────────────────────────────────────────────────────
export default function MatrixPanel() {
  const matrix             = useMatrixStore((s) => s.matrix)
  const animating          = useMatrixStore((s) => s.animating)
  const progress           = useMatrixStore((s) => s.progress)
  const setCell            = useMatrixStore((s) => s.setCell)
  const setPreset          = useMatrixStore((s) => s.setPreset)
  const startAnimation     = useMatrixStore((s) => s.startAnimation)
  const resetTransform     = useMatrixStore((s) => s.resetTransform)
  const showEigenvectors   = useMatrixStore((s) => s.showEigenvectors)
  const setShowEigenvectors = useMatrixStore((s) => s.setShowEigenvectors)
  const showParallelepiped  = useMatrixStore((s) => s.showParallelepiped)
  const setShowParallelepiped = useMatrixStore((s) => s.setShowParallelepiped)
  const showInverse        = useMatrixStore((s) => s.showInverse)
  const toggleInverse      = useMatrixStore((s) => s.toggleInverse)
  const showCramer         = useMatrixStore((s) => s.showCramer)
  const toggleCramer       = useMatrixStore((s) => s.toggleCramer)

  const det      = det3(matrix)
  const detStr   = Math.abs(det) < 1e-9 ? '0' : det.toFixed(3)
  const isSingular = Math.abs(det) < 0.001
  const displayPct = Math.round(smoothStep(progress) * 100)
  const exportPng  = useExportPng()

  return (
    <aside className="matrix-panel">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="panel-header">
        <span className="panel-title">Matrix Transform</span>
      </div>

      {/* ── Preset picker ────────────────────────────────────────────── */}
      <div className="preset-row">
        <span className="preset-label">Preset</span>
        <select
          className="preset-select"
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) setPreset(e.target.value)
          }}
        >
          <option value="" disabled>Choose…</option>
          {Object.keys(PRESETS).map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      {/* ── 3 × 3 matrix with bracket styling ───────────────────────── */}
      <div className="matrix-bracket-wrap">
        <div className="bracket-container">
          {/* Left bracket */}
          <div className="bracket bracket-left" />

          {/* Grid */}
          <div className="matrix-grid">
            {/* Row/col header labels */}
            <div className="mat-hdr" />
            <div className="mat-hdr" style={{ color: '#ff4d6d' }}>î</div>
            <div className="mat-hdr" style={{ color: '#4dff88' }}>ĵ</div>
            <div className="mat-hdr" style={{ color: '#4da6ff' }}>k̂</div>

            {/* Rows x / y / z */}
            {['x', 'y', 'z'].map((axis, row) => (
              <React.Fragment key={axis}>
                <div className="mat-row-lbl">{axis}</div>
                {[0, 1, 2].map((col) => {
                  const idx = row * 3 + col
                  return (
                    <MatrixCell
                      key={idx}
                      index={idx}
                      value={matrix[idx]}
                      onChange={setCell}
                      isIdentityDiag={row === col}
                    />
                  )
                })}
              </React.Fragment>
            ))}
          </div>

          {/* Right bracket */}
          <div className="bracket bracket-right" />
        </div>
      </div>

      {/* ── Determinant ──────────────────────────────────────────────── */}
      <div className="matrix-info">
        <span className="info-label">det(M)</span>
        <span className={`info-value ${isSingular ? 'det-zero' : ''}`}>
          {detStr}
        </span>
        {isSingular && (
          <span className="det-warn" title="This matrix collapses space — no inverse exists">
            ⚠ singular
          </span>
        )}
        <button
          id="piped-toggle-btn"
          className={`piped-toggle ${showParallelepiped ? 'active' : ''}`}
          onClick={() => setShowParallelepiped(!showParallelepiped)}
          title={showParallelepiped ? 'Hide parallelepiped' : 'Show parallelepiped'}
        >
          {showParallelepiped ? '🧊' : '▢'}
        </button>
      </div>

      {/* ── Basis image annotations ──────────────────────────────────── */}
      <BasisAnnotation matrix={matrix} />

      {/* ── Eigenvalues section ──────────────────────────────────────── */}
      <EigenSection
        matrix={matrix}
        showEigenvectors={showEigenvectors}
        setShowEigenvectors={setShowEigenvectors}
      />

      {/* ── Inverse section ───────────────────────────────────────────── */}
      <InverseSection
        matrix={matrix}
        showInverse={showInverse}
        toggleInverse={toggleInverse}
      />

      {/* ── Cramer's Rule section ─────────────────────────────────────── */}
      <CramerSection
        matrix={matrix}
        showCramer={showCramer}
        toggleCramer={toggleCramer}
      />

      {/* ── Animation progress bar ───────────────────────────────────── */}
      <div className="anim-bar-wrap">
        <div
          className={`anim-bar-fill ${animating ? 'animating' : ''}`}
          style={{
            width: `${smoothStep(progress) * 100}%`,
            transition: animating ? 'none' : 'width 0.4s ease',
          }}
        />
        {progress > 0 && (
          <span className="anim-pct">{displayPct}%</span>
        )}
      </div>

      {/* ── Action buttons ───────────────────────────────────────────── */}
      <div className="matrix-actions">
        <button
          id="apply-matrix-btn"
          className="apply-btn"
          onClick={startAnimation}
          disabled={animating}
          title="Apply transform [Space]"
        >
          {animating ? '⏳ Animating…' : '▶ Apply'}
        </button>
        <button
          id="reset-matrix-btn"
          className="reset-btn"
          onClick={resetTransform}
          disabled={animating}
          title="Reset transform [R]"
        >
          ↺ Reset
        </button>
        <button
          id="export-matrix-btn"
          className="export-btn"
          onClick={() => exportPng('linalg-viz-matrix.png')}
          title="Export scene to PNG [E]"
        >
          📷
        </button>
      </div>

      <p className="panel-hint">
        Edit cells · pick preset · <kbd className="kbd-inline">Space</kbd> apply
      </p>
    </aside>
  )
}
