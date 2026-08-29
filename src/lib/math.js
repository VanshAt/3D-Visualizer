// ─── Pure vector math helpers ────────────────────────────────────────────────
// All functions accept / return plain [x, y, z] arrays.

export const vec3 = (x = 0, y = 0, z = 0) => [x, y, z]

export const add = ([ax, ay, az], [bx, by, bz]) => [ax + bx, ay + by, az + bz]

export const sub = ([ax, ay, az], [bx, by, bz]) => [ax - bx, ay - by, az - bz]

export const scale = ([x, y, z], s) => [x * s, y * s, z * s]

export const dot = ([ax, ay, az], [bx, by, bz]) => ax * bx + ay * by + az * bz

export const cross = ([ax, ay, az], [bx, by, bz]) => [
  ay * bz - az * by,
  az * bx - ax * bz,
  ax * by - ay * bx,
]

export const magnitude = ([x, y, z]) => Math.sqrt(x * x + y * y + z * z)

export const normalize = (v) => {
  const m = magnitude(v)
  return m === 0 ? [0, 0, 0] : scale(v, 1 / m)
}

export const angle = (a, b) => {
  const denom = magnitude(a) * magnitude(b)
  if (denom === 0) return 0
  return Math.acos(Math.min(1, Math.max(-1, dot(a, b) / denom)))
}

/** Format a component value for display */
export const fmt = (n) => (Number.isInteger(n) ? n.toString() : n.toFixed(2))

// ─── Matrix math (3×3, row-major flat array of 9) ────────────────────────────

/** Multiply a 3×3 matrix M by vec3 v → new vec3 */
export const matMul = (M, [x, y, z]) => [
  M[0] * x + M[1] * y + M[2] * z,
  M[3] * x + M[4] * y + M[5] * z,
  M[6] * x + M[7] * y + M[8] * z,
]

/** Determinant of a 3×3 row-major matrix */
export const det3 = ([a, b, c, d, e, f, g, h, i]) =>
  a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g)

// ─── Preset matrix factories ──────────────────────────────────────────────────

export const mat3Identity = () => [1, 0, 0,  0, 1, 0,  0, 0, 1]

export const mat3RotY = (deg) => {
  const r = (deg * Math.PI) / 180
  const c = Math.cos(r), s = Math.sin(r)
  return [c, 0, s,  0, 1, 0,  -s, 0, c]
}

export const mat3RotZ = (deg) => {
  const r = (deg * Math.PI) / 180
  const c = Math.cos(r), s = Math.sin(r)
  return [c, -s, 0,  s, c, 0,  0, 0, 1]
}

export const mat3Scale  = (sx, sy, sz) => [sx, 0, 0,  0, sy, 0,  0, 0, sz]
export const mat3ShearX = ()           => [1, 0.7, 0,  0, 1, 0,  0, 0, 1]
export const mat3MirrorX = ()          => [-1, 0, 0,  0, 1, 0,  0, 0, 1]

// ─── Easing ──────────────────────────────────────────────────────────────────

/** Classic smoothstep — maps t ∈ [0,1] to a smooth S-curve */
export const smoothStep = (t) => t * t * (3 - 2 * t)

