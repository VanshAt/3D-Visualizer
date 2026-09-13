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

// ─── Matrix × Matrix (3×3, row-major) ────────────────────────────────────────

export const mat3Mul = (A, B) => [
  A[0]*B[0] + A[1]*B[3] + A[2]*B[6],
  A[0]*B[1] + A[1]*B[4] + A[2]*B[7],
  A[0]*B[2] + A[1]*B[5] + A[2]*B[8],
  A[3]*B[0] + A[4]*B[3] + A[5]*B[6],
  A[3]*B[1] + A[4]*B[4] + A[5]*B[7],
  A[3]*B[2] + A[4]*B[5] + A[5]*B[8],
  A[6]*B[0] + A[7]*B[3] + A[8]*B[6],
  A[6]*B[1] + A[7]*B[4] + A[8]*B[7],
  A[6]*B[2] + A[7]*B[5] + A[8]*B[8],
]

// ─── Gram-Schmidt orthonormalisation ─────────────────────────────────────────

/**
 * Returns an orthonormal basis (up to 3 vectors) for the span of `vecs`.
 * Zero vectors and linearly-dependent vectors are silently dropped.
 */
export const gramSchmidtBasis = (vecs) => {
  const eps = 1e-6
  const basis = []
  for (const v of vecs) {
    if (magnitude(v) < eps) continue
    let w = [...v]
    for (const b of basis) w = sub(w, scale(b, dot(w, b)))
    if (magnitude(w) > eps) basis.push(normalize(w))
    if (basis.length === 3) break
  }
  return basis
}

/** Rank (0–3) of the vector set — number of linearly independent vectors. */
export const gramSchmidtRank = (vecs) => gramSchmidtBasis(vecs).length

// ─── Projection helpers ──────────────────────────────────────────────────────

/** Project vector b onto vector a:  (b·a / a·a) * a */
export const project1D = (b, a) => {
  const d = dot(a, a)
  if (d < 1e-12) return [0, 0, 0]
  return scale(a, dot(b, a) / d)
}

/** Project b onto the subspace spanned by bases (up to 2 vectors) */
export const projectSubspace = (b, bases) => {
  if (bases.length === 0) return [0, 0, 0]
  if (bases.length === 1) return project1D(b, bases[0])
  // Orthogonalise a2 against a1, then sum projections
  const a1 = bases[0]
  const a2orth = sub(bases[1], project1D(bases[1], a1))
  return add(project1D(b, a1), project1D(b, a2orth))
}

// ─── Matrix transpose (3×3, row-major) ───────────────────────────────────────

export const mat3Transpose = ([a,b,c, d,e,f, g,h,i]) => [a,d,g, b,e,h, c,f,i]

// ─── Cofactor matrix (3×3, row-major) ────────────────────────────────────────

export const mat3Cofactor = ([a,b,c, d,e,f, g,h,i]) => [
   (e*i - f*h), -(d*i - f*g),  (d*h - e*g),
  -(b*i - c*h),  (a*i - c*g), -(a*h - b*g),
   (b*f - c*e), -(a*f - c*d),  (a*e - b*d),
]

// ─── Matrix inverse (3×3) — returns null when singular ───────────────────────

export const mat3Inverse = (M) => {
  const d = det3(M)
  if (Math.abs(d) < 1e-10) return null
  const C = mat3Cofactor(M)
  const adj = mat3Transpose(C)
  return adj.map(v => v / d)
}

// ─── Cramer's Rule solver  Ax = b ────────────────────────────────────────────

/**
 * Solves the 3×3 system  M·x = b  via Cramer's Rule.
 * Returns { x: [x1,x2,x3], dets: [detA1,detA2,detA3], detA } or null if singular.
 */
export const cramerSolve = (M, b) => {
  const detA = det3(M)
  if (Math.abs(detA) < 1e-10) return null

  // Replace column j with b → compute det
  const replaceCol = (col) => {
    const A = [...M]
    A[0 + col] = b[0]  // row 0
    A[3 + col] = b[1]  // row 1
    A[6 + col] = b[2]  // row 2
    return det3(A)
  }

  const dets = [replaceCol(0), replaceCol(1), replaceCol(2)]
  return {
    x: [dets[0] / detA, dets[1] / detA, dets[2] / detA],
    dets,
    detA,
  }
}

// ─── Cubic polynomial root finder ────────────────────────────────────────────

/**
 * Solves the monic cubic  x³ + b·x² + c·x + d = 0.
 * Returns { real: number[], complex: { re, im }[] }
 * Complex roots always appear as a conjugate pair → complex.length ≤ 1.
 */
export const solveCubic = (b, c, d) => {
  const eps = 1e-9
  // Depress via x = t − b/3
  const p     = c - (b * b) / 3
  const q     = (2 * b * b * b) / 27 - (b * c) / 3 + d
  const shift = -b / 3
  const D     = (q / 2) ** 2 + (p / 3) ** 3  // = −Δ/108

  // Numerical zero in p and q → triple root
  if (Math.abs(p) < eps && Math.abs(q) < eps)
    return { real: [shift, shift, shift], complex: [] }

  if (D < -eps) {
    // Three distinct real roots — trigonometric method (casus irreducibilis)
    const r   = Math.sqrt(Math.max(0, (-(p ** 3)) / 27))
    const cos = Math.min(1, Math.max(-1, -q / (2 * r)))
    const phi = Math.acos(cos)
    const m   = 2 * Math.cbrt(r)
    return {
      real: [
        m * Math.cos(phi / 3)                    + shift,
        m * Math.cos((phi + 2 * Math.PI) / 3)   + shift,
        m * Math.cos((phi + 4 * Math.PI) / 3)   + shift,
      ],
      complex: [],
    }
  }

  if (Math.abs(D) <= eps) {
    // Repeated roots (all real)
    if (Math.abs(q) < eps) return { real: [shift, shift, shift], complex: [] }
    const t1 = 3 * q / p
    const t2 = -3 * q / (2 * p)
    return { real: [t1 + shift, t2 + shift, t2 + shift], complex: [] }
  }

  // D > 0 → one real root + complex conjugate pair (Cardano)
  const sqrtD = Math.sqrt(D)
  const u     = Math.cbrt(-q / 2 + sqrtD)
  const v_c   = Math.cbrt(-q / 2 - sqrtD)
  const t0    = u + v_c
  const re    = -(u + v_c) / 2 + shift
  const im    = Math.abs((u - v_c) * (Math.sqrt(3) / 2))
  return {
    real:    [t0 + shift],
    complex: [{ re, im }],
  }
}

// ─── Null-space vector of a (near-singular) 3×3 matrix ───────────────────────

const _nullVec3 = (M) => {
  const r0 = [M[0], M[1], M[2]]
  const r1 = [M[3], M[4], M[5]]
  const r2 = [M[6], M[7], M[8]]
  const candidates = [cross(r0, r1), cross(r0, r2), cross(r1, r2)]
  let best = null, bestMag = 0
  for (const c of candidates) {
    const m = magnitude(c)
    if (m > bestMag) { bestMag = m; best = c }
  }
  return bestMag > 1e-8 ? normalize(best) : [1, 0, 0]
}

// ─── Display colour helpers ───────────────────────────────────────────────────

/** Colour for a real eigenvalue based on its magnitude and sign. */
export const eigenColor = (lambda) => {
  if (Math.abs(lambda) < 0.001) return '#64748b'  // collapse (zero)
  if (lambda > 1.01)            return '#4dff88'  // expansion
  if (lambda >= 0.99)           return '#ffcc4d'  // identity-like (≈1)
  if (lambda > 0)               return '#fb923c'  // contraction (0 < λ < 1)
  return '#ff4d6d'                                 // flip (negative)
}

/** Colour for a complex conjugate pair based on |λ|. */
export const complexEigenColor = (modulus) => {
  if (modulus > 1.02) return '#22d3ee'  // expanding spiral (cyan)
  if (modulus > 0.98) return '#c084fc'  // pure rotation  (purple)
  return '#60a5fa'                       // contracting spiral (blue)
}

// ─── Full 3×3 eigen-solver ────────────────────────────────────────────────────

/**
 * Computes eigenvalues and eigenvectors / eigenplane data for a 3×3 real matrix.
 *
 * Returns:
 *   real:    { lambda, vec }[]    — real eigenvalues with eigenvectors
 *   complex: { re, im, magnitude, angleDeg, v1, v2 }[]
 *            v1 / v2 are orthonormal basis vectors of the invariant 2-D plane.
 *            Under M:  v1 → re·v1 + im·v2  (scale |λ| + rotation by angleDeg).
 */
export const eigenSolve3 = (M) => {
  if (M.some((v) => !isFinite(v))) return { real: [], complex: [] }

  const tr     = M[0] + M[4] + M[8]
  const m01    = M[0] * M[4] - M[1] * M[3]
  const m02    = M[0] * M[8] - M[2] * M[6]
  const m12    = M[4] * M[8] - M[5] * M[7]
  const minors = m01 + m02 + m12
  const det    = det3(M)

  // Characteristic polynomial: λ³ − tr·λ² + minors·λ − det = 0
  const { real: rawLambdas, complex } = solveCubic(-tr, minors, -det)

  // Deduplicate real eigenvalues within tolerance
  const unique = []
  for (const λ of rawLambdas)
    if (!unique.some((u) => Math.abs(u - λ) < 1e-5)) unique.push(λ)

  const realEigen = unique.map((lambda) => {
    const A = [...M]
    A[0] -= lambda; A[4] -= lambda; A[8] -= lambda
    return { lambda, vec: _nullVec3(A) }
  })

  const complexEigen = complex.map(({ re, im }) => {
    const modulus  = Math.sqrt(re * re + im * im)
    const angleDeg = Math.atan2(im, re) * (180 / Math.PI)

    // Invariant 2-D plane: null space of  B = (M − re·I)² + im²·I
    const A = [...M]
    A[0] -= re; A[4] -= re; A[8] -= re
    const B = mat3Mul(A, A)
    B[0] += im * im; B[4] += im * im; B[8] += im * im

    const v1 = _nullVec3(B)

    // v2: rotate v1 by A  (A·v1 ≈ im·v2 in the eigenplane)
    const Av1 = matMul(A, v1)
    let v2
    if (magnitude(Av1) > 1e-8) {
      v2 = normalize(Av1)
    } else {
      const perp = Math.abs(v1[0]) < 0.8 ? [1, 0, 0] : [0, 1, 0]
      v2 = normalize(sub(perp, scale(v1, dot(perp, v1))))
    }

    return { re, im, magnitude: modulus, angleDeg, v1, v2 }
  })

  return { real: realEigen, complex: complexEigen }
}
