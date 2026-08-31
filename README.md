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

### Day 5 — ⌨ Shortcuts button in the header

![App at initial load showing the new Shortcuts button in the top-right of the header](public/screenshots/07-day5-initial-state.png)

### Day 5 — Keyboard shortcut overlay (press `?`)

![Shortcut cheat-sheet modal with groups: Navigation, Vectors, Matrices, Global](public/screenshots/08-day5-shortcut-overlay.png)

### Day 5 — 📷 Export button in the Vectors panel

![Vectors panel header showing Span, + Add, and camera export buttons](public/screenshots/09-day5-export-button.png)

### Day 5 — Two vectors with selection active

![Two vectors in the 3D scene with v2 selected and sliders expanded](public/screenshots/10-day5-two-vectors.png)

### Day 5 — 📷 Export button in the Matrices panel

![Matrices page with export button alongside Apply and Reset action buttons](public/screenshots/11-day5-matrices-export.png)

---

## Features (Day 5 ✅)

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
| Page routing — Vectors / Matrices / Scalars nav | ✅ |
| **Matrices module** — 3×3 editable matrix panel + presets | ✅ |
| **Matrix transform animation** — basis vectors lerp with smoothstep | ✅ |
| **Click-to-select in 3D** — raycasting via R3F onClick | ✅ |
| **Span visualisation** — plane/line mesh, live rank badge | ✅ |
| **Eigenvalue explorer** — real + complex eigen display, 3D arrows | ✅ |
| **Keyboard shortcuts** — A / Del / Tab / Space / R / 1–2–3 / E / ? | ✅ |
| **Export-to-PNG** — canvas screenshot download | ✅ |
| **Shortcut overlay** — ? key opens cheat-sheet modal | ✅ |


---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `1` / `2` / `3` | Switch page (Vectors / Matrices / Scalars) |
| `A` | Add vector (Vectors page) |
| `Delete` | Delete selected vector |
| `H` | Hide / show selected vector |
| `Tab` / `Shift+Tab` | Cycle selection forward / backward |
| `Space` | Toggle span (Vectors) · Apply transform (Matrices) |
| `R` | Reset matrix transform |
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
│   └── math.js              # Pure vector math (add, dot, cross, angle …)
├── state/
│   └── useStore.js          # Zustand store — vectors[], selectedId, actions
├── components/
│   ├── Scene/
│   │   ├── SceneSetup.jsx   # Lights, grid, fog, OrbitControls
│   │   ├── Axes.jsx         # XYZ axis lines + labels
│   │   └── VectorArrow.jsx  # 3D arrow (shaft + cone) with labels
│   └── UI/
│       ├── VectorPanel.jsx  # Side panel — cards, sliders, ops
│       └── VectorPanel.css
└── pages/
    └── VectorsPage.jsx      # Canvas + panel layout
```

---

## Roadmap

- **Day 3** — Matrix transforms, 3D click-to-select, animated lerp between states
- **Day 4** — Span visualisation, eigenvalue/eigenvector explorer
- **Day 5** — Keyboard shortcuts, export-to-PNG, shortcut overlay ✅

---

*Built day by day 🛠 — follow along as the modules grow.*
