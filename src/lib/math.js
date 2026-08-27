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
