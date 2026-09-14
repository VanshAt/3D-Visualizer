import React from 'react'
import { useTransformStore } from '../../state/useTransformStore'
import './TransformPanel.css'

function SliderRow({ label, value, onChange, min, max, step = 0.1, colorClass = '' }) {
  return (
    <div className="slider-row">
      <span className="slider-label">{label}</span>
      <input
        type="range"
        className={`slider-input ${colorClass}`}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <input
        type="number"
        className="slider-val"
        value={Number(value.toFixed(2))}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        step={step}
      />
    </div>
  )
}

export default function TransformPanel() {
  const { scale, rotate, shear, matrix, setScale, setRotate, setShear, reset } = useTransformStore()

  const fmtV = (n) => (Math.abs(n) < 1e-10 ? '0' : n.toFixed(2))

  return (
    <aside className="transform-panel">
      <div className="panel-header">
        <span className="panel-title">Transformations</span>
      </div>

      <div className="transform-section">
        <div className="section-title">Scale</div>
        <SliderRow label="Sx" value={scale[0]} onChange={(v) => setScale(0, v)} min={-3} max={3} colorClass="slider-x" />
        <SliderRow label="Sy" value={scale[1]} onChange={(v) => setScale(1, v)} min={-3} max={3} colorClass="slider-y" />
        <SliderRow label="Sz" value={scale[2]} onChange={(v) => setScale(2, v)} min={-3} max={3} colorClass="slider-z" />
      </div>

      <div className="transform-section">
        <div className="section-title">Rotate (degrees)</div>
        <SliderRow label="Rx" value={rotate[0]} onChange={(v) => setRotate(0, v)} min={-180} max={180} step={1} colorClass="slider-x" />
        <SliderRow label="Ry" value={rotate[1]} onChange={(v) => setRotate(1, v)} min={-180} max={180} step={1} colorClass="slider-y" />
        <SliderRow label="Rz" value={rotate[2]} onChange={(v) => setRotate(2, v)} min={-180} max={180} step={1} colorClass="slider-z" />
      </div>

      <div className="transform-section">
        <div className="section-title">Shear</div>
        <SliderRow label="Sh(xy)" value={shear.xy} onChange={(v) => setShear('xy', v)} min={-2} max={2} />
        <SliderRow label="Sh(xz)" value={shear.xz} onChange={(v) => setShear('xz', v)} min={-2} max={2} />
        <SliderRow label="Sh(yx)" value={shear.yx} onChange={(v) => setShear('yx', v)} min={-2} max={2} />
      </div>

      <div className="matrix-result">
        <div className="matrix-result-title">Composed Matrix (Sh × R × S)</div>
        <div className="matrix-display">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <span key={i} className="mat-val">{fmtV(matrix[i])}</span>
          ))}
        </div>
      </div>

      <button className="reset-btn" onClick={reset}>↺ Reset</button>
    </aside>
  )
}
