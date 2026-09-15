# LinAlgViz 🔷

**An interactive 3D linear algebra explorer built with React, Three.js & React Three Fiber.**

Visualise vectors, operations, and transformations right in your browser — no setup, no equations hidden behind a wall of text. Just drag, spin, and play.

---

## Screenshots

### Vectors Module — 3D scene with multiple vectors

![Vectors scene with two vectors, axes, and grid](public/screenshots/01-initial-load.png)

### Vector selected — x/y/z sliders + colour picker

![v1 card expanded showing x, y, z sliders and coordinates](public/screenshots/02-vector-selected.png)

### Live operations panel — dot product, cross product, angle

![Two vectors with Vector Operations panel showing dot · cross × angle](public/screenshots/03-vector-operations.png)

### Click-to-select in 3D — raycasting on vector arrows

![Clicking a vector arrow in 3D selects it and expands the side-panel card](public/screenshots/06-vectors-click-select.png)

### Matrices module — identity state

![Matrices page with identity matrix and three orthogonal basis arrows](public/screenshots/04-matrices-identity.png)

### Matrices — Rotate Y 45° applied (animated transform)

![Basis arrows rotated after applying Rotate Y 45° — det=1.000, basis images updated](public/screenshots/05-matrices-rotate-applied.png)

### Day 5 — Shortcuts button in the header

![App at initial load showing the new Shortcuts button in the top-right of the header](public/screenshots/07-day5-initial-state.png)

### Day 5 — Keyboard shortcut overlay (press ?)

![Shortcut cheat-sheet modal with groups: Navigation, Vectors, Matrices, Global](public/screenshots/08-day5-shortcut-overlay.png)

### Day 5 — Export button in the Vectors panel

![Vectors panel header showing Span, + Add, and camera export buttons](public/screenshots/09-day5-export-button.png)

### Day 5 — Two vectors with selection active

![Two vectors in the 3D scene with v2 selected and sliders expanded](public/screenshots/10-day5-two-vectors.png)

### Day 5 — Export button in the Matrices panel

![Matrices page with export button alongside Apply and Reset action buttons](public/screenshots/11-day5-matrices-export.png)

### Day 6 — Scalars module: linear combinations explorer

![Scalars page showing base vector v₁, ghost scaled arrow, and glowing gold result arrow r](public/screenshots/12-day6-scalars-initial.png)

### Day 6 — Two base vectors (v₁, v₂) with α and β sliders

![Scalars page with two base vectors and result r = αv₁ + βv₂ = (2, 2, 0)](public/screenshots/13-day6-scalars-two-vectors.png)

### Day 6 — Sweep active: α oscillating live

![α sweep active — slider glowing, result arrow sweeping, β also visible](public/screenshots/14-day6-scalars-sweep.png)

### Day 6 — Shortcut overlay with new Scalars group

![Shortcut overlay updated with Scalars section: A add vector, Del remove, S sweep](public/screenshots/15-day6-shortcut-overlay-scalars.png)

### Day 7 — Projection mode: project b onto a

![Projection page showing base vector a, target b, cyan projection arrow, and red residual with right-angle marker](public/screenshots/18-day7-projection-initial.png)

### Day 7 — Two base vectors (subspace projection)

![Projection onto a 2D subspace spanned by a1 and a2, residual nearly zero](public/screenshots/19-day7-projection-subspace.png)

### Day 7 — Gram-Schmidt mode: step-by-step orthonormalisation

![Gram-Schmidt page with 3 input vectors and 2 orthonormal basis vectors lit up](public/screenshots/20-day7-gram-schmidt-steps.png)

### Day 7 — Shortcut overlay with new Project group

![Shortcut overlay updated with Project section: A, T, N, P shortcuts](public/screenshots/21-day7-shortcut-overlay-project.png)

### Day 8 — Cross Product Explorer

![Cross Product Explorer showing u, v, u x v, and parallelogram area](public/screenshots/21-day8-cross-initial.png)

### Day 9 — Transformations Explorer

![Transformations Explorer showing scale, rotate, and shear sliders with a multicoloured cube](public/screenshots/22-day9-transform-explorer.png)

### Day 10 — Systems of Linear Equations (Intersecting Planes)

![Equations Explorer showing three distinct intersecting planes and a unique solution point](public/screenshots/23-day10-equations-initial.png)

### Day 10 — Singular Matrix Warning (No unique solution)

![Equations Explorer showing dependent planes with no unique solution and a det(A) of 0](public/screenshots/24-day10-equations-singular.png)

---

## Features (Day 9 ✅)

| Feature | Status |
|---|---|
| 3D scene — XYZ axes, infinite grid, fog, orbit controls | ✅ |
| Vector arrows — cylinder shaft + cone tip, auto-colour palette | ✅ |
| Magnitude label per vector (`\|v\| = 3.26`) | ✅ |
| Add / delete / hide vectors | ✅ |
| Rename vectors inline | ✅ |
| x / y / z sliders + number inputs (live update) | ✅ |
| Colour picker per vector | ✅ |
| Selection pulse animation | ✅ |
| Vector operations panel — dot · cross × angle | ✅ |
| Page routing — Vectors / Matrices / Scalars / Project / Cross / Transform nav | ✅ |
| **Matrices module** — 3×3 editable matrix panel + presets | ✅ |
| **Matrix transform animation** — basis vectors lerp with smoothstep | ✅ |
| **Click-to-select in 3D** — raycasting via R3F onClick | ✅ |
| **Span visualisation** — plane/line mesh, live rank badge | ✅ |
| **Eigenvalue explorer** — real + complex eigen display, 3D arrows | ✅ |
| **Keyboard shortcuts** — A / Del / Tab / Space / R / 1–2–3–4–5–6 / E / ? | ✅ |
| **Export-to-PNG** — canvas screenshot download | ✅ |
| **Shortcut overlay** — ? key opens cheat-sheet modal | ✅ |
| **Scalars module** — linear combinations αv₁ + βv₂ + γv₃ | ✅ |
| **Scalar sliders** — per-vector α/β/γ with colour-accented oversized thumb | ✅ |
| **Result arrow** — glowing gold Σ αᵢvᵢ with animated emissive pulse | ✅ |
| **Ghost scaled arrows** — semi-transparent αᵢvᵢ pieces | ✅ |
| **Sweep animation** — oscillate any scalar to trace spanning set live | ✅ |
| **Projection module** — project b onto a (or subspace), cyan proj + red residual | ✅ |
| **Right-angle marker** — small white square at foot of perpendicular | ✅ |
| **Subspace projection** — project onto 2-base subspace via Gram-Schmidt | ✅ |
| **Gram-Schmidt visualiser** — step-by-step orthonormalisation with auto-play | ✅ |
| **GS intermediate arrows** — grey semi-transparent orthogonalised vectors | ✅ |
| **GS output arrows** — gold e₁, teal e₂, magenta e₃ with pulsing glow | ✅ |
| **Cross Product module** — visualise $u \times v$, parallelogram area, right-hand rule | ✅ |
| **Transformations Explorer module** — interactively compose Scale, Rotate, and Shear | ✅ |
| **Live composed matrix** — watch the 3x3 matrix update instantly during slider drag | ✅ |
| **Multicoloured cube** — clear visualisation of 3D deformations | ✅ |
| **Systems of Linear Equations** — visualises $Ax = b$ as 3 intersecting planes | ✅ |
| **Singular system detection** — distinct UI warning when $det(A) = 0$ | ✅ |


---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `1` / `2` / `3` / `4` / `5` / `6` / `7` | Switch page (Vectors / Matrices / Scalars / Project / Cross / Transform / Equations) |
| `A` | Add vector (Vectors) · Add base vector (Scalars / Project) |
| `Delete` | Delete selected vector (Vectors) · Remove last base vector (Scalars / Project) |
| `H` | Hide / show selected vector |
| `Tab` / `Shift+Tab` | Cycle selection forward / backward |
| `Space` | Toggle span (Vectors) · Apply transform (Matrices) |
| `R` | Reset matrix transform (Matrices, Transform) |
| `S` | Toggle α sweep animation (Scalars) |
| `T` | Toggle Projection / Gram-Schmidt mode (Project) |
| `N` | Next Gram-Schmidt step (Project) |
| `P` | Toggle auto-play Gram-Schmidt (Project) |
| `E` | Export scene to PNG |
| `?` | Open / close shortcut overlay |
| `Escape` | Deselect / close overlay |

## Tech Stack

- **[React 19](https://react.dev/)** + **[Vite 8](https://vitejs.dev/)**
- **[Three.js](https://threejs.org/)** + **[React Three Fiber](https://r3f.docs.pmnd.rs/)**
- **[Drei](https://github.com/pmndrs/drei)** — OrbitControls, Grid, Text helpers
- **[Zustand](https://zustand-demo.pmnd.rs/)** — global state
- Vanilla CSS — design tokens, glassmorphism, custom slider thumbs

---

## Getting started

```bash
git clone https://github.com/VanshAt/3D-Visualizer.git
cd 3D-Visualizer/linalg-viz
npm install
npm run dev
```

Then open **http://localhost:5173/**

---

## Project structure

```
src/
├── lib/
│   └── math.js              # Pure vector math (add, dot, cross, angle, project …)
├── state/
│   ├── useStore.js          # Zustand store — vectors[], selectedId, actions
│   ├── useMatrixStore.js    # Matrices module state
│   ├── useScalarStore.js    # Scalars module state
│   └── useProjectionStore.js# Projection & Gram-Schmidt state
├── components/
│   ├── Scene/
│   │   ├── SceneSetup.jsx   # Lights, grid, fog, OrbitControls
│   │   ├── Axes.jsx         # XYZ axis lines + labels
│   │   ├── VectorArrow.jsx  # 3D arrow (shaft + cone) with labels
│   │   ├── ProjectionScene.jsx  # Projection mode 3D scene
│   │   └── GramSchmidtScene.jsx # Gram-Schmidt mode 3D scene
│   └── UI/
│       ├── VectorPanel.jsx  # Side panel — cards, sliders, ops
│       ├── VectorPanel.css
│       ├── ProjectionPanel.jsx  # Projection / GS side panel
│       └── ProjectionPanel.css
└── pages/
    ├── VectorsPage.jsx      # Canvas + panel layout
    ├── MatricesPage.jsx
    ├── ScalarsPage.jsx
    └── ProjectionPage.jsx   # Projection / Gram-Schmidt page
```

---

## Roadmap

- **Day 3** — Matrix transforms, 3D click-to-select, animated lerp between states
- **Day 4** — Span visualisation, eigenvalue/eigenvector explorer
- **Day 5** — Keyboard shortcuts, export-to-PNG, shortcut overlay ✅
- **Day 6** — Scalars module: linear combinations, sweep animation, ghost arrows ✅
- **Day 7** — Projection & Gram-Schmidt: project onto vectors/subspaces, step-by-step orthonormalisation ✅
- **Day 8** — Cross Product Explorer: orthogonal vector, parallelogram area, right-hand rule ✅
- **Day 9** — Transformations Explorer ✅
- **Day 10** — Systems of Linear Equations Explorer: 3D intersecting planes, singular detection ✅

---

*Built day by day 🛠 — follow along as the modules grow.*

