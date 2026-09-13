import { useEffect } from 'react'
import { useStore } from '../state/useStore'
import { useMatrixStore } from '../state/useMatrixStore'
import { useScalarStore } from '../state/useScalarStore'
import { useProjectionStore } from '../state/useProjectionStore'
import { useExportPng } from './useExportPng'

/**
 * Global keyboard shortcut handler — mount once at App level.
 *
 * @param {string}   activePage     - 'Vectors' | 'Matrices' | 'Scalars' | 'Project'
 * @param {Function} setActivePage  - page setter
 * @param {Function} setShowShortcuts - toggle the shortcut overlay
 */
export function useKeyboardShortcuts(activePage, setActivePage, setShowShortcuts) {
  const exportPng = useExportPng()

  useEffect(() => {
    function onKeyDown(e) {
      // Don't fire shortcuts when the user is typing in an input/textarea
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      const key = e.key

      // ── Page navigation ────────────────────────────────────────────
      if (key === '1') { setActivePage('Vectors');  return }
      if (key === '2') { setActivePage('Matrices'); return }
      if (key === '3') { setActivePage('Scalars');  return }
      if (key === '4') { setActivePage('Project');  return }
      if (key === '5') { setActivePage('Cross');    return }

      // ── Overlay ────────────────────────────────────────────────────
      if (key === '?') { setShowShortcuts(prev => !prev); return }
      if (key === 'Escape') {
        setShowShortcuts(false)
        useStore.getState().setSelectedId(null)
        return
      }

      // ── Export ────────────────────────────────────────────────────
      if (key === 'e' || key === 'E') {
        const page = activePage.toLowerCase()
        exportPng(`linalg-viz-${page}.png`)
        return
      }

      // ── Vectors page shortcuts ─────────────────────────────────────
      if (activePage === 'Vectors') {
        const { vectors, selectedId, setSelectedId, addVector, removeVector, toggleVector, setShowSpan } = useStore.getState()

        if (key === 'a' || key === 'A') {
          addVector()
          return
        }

        if ((key === 'Delete' || key === 'Backspace') && selectedId) {
          removeVector(selectedId)
          return
        }

        if ((key === 'h' || key === 'H') && selectedId) {
          toggleVector(selectedId)
          return
        }

        if (key === ' ') {
          e.preventDefault()
          setShowSpan(!useStore.getState().showSpan)
          return
        }

        // Tab / Shift+Tab — cycle selection
        if (key === 'Tab') {
          e.preventDefault()
          const vis = vectors.filter(v => v.visible)
          if (vis.length === 0) return
          const idx = vis.findIndex(v => v.id === selectedId)
          const next = e.shiftKey
            ? (idx - 1 + vis.length) % vis.length
            : (idx + 1) % vis.length
          setSelectedId(vis[next].id)
          return
        }
      }

      // ── Matrices page shortcuts ────────────────────────────────────
      if (activePage === 'Matrices') {
        const { animating, startAnimation, resetTransform,
                showParallelepiped, setShowParallelepiped,
                showInverse, toggleInverse,
                showCramer, toggleCramer } = useMatrixStore.getState()

        if (key === ' ') {
          e.preventDefault()
          if (!animating) startAnimation()
          return
        }

        if (key === 'r' || key === 'R') {
          resetTransform()
          return
        }

        if (key === 'v' || key === 'V') {
          setShowParallelepiped(!showParallelepiped)
          return
        }

        if (key === 'i' || key === 'I') {
          toggleInverse()
          return
        }

        if (key === 'c' || key === 'C') {
          toggleCramer()
          return
        }
      }

      // ── Scalars page shortcuts ─────────────────────────────────────
      if (activePage === 'Scalars') {
        const { addVector, removeVector, toggleSweep } = useScalarStore.getState()

        if (key === 'a' || key === 'A') {
          addVector()
          return
        }

        if (key === 'Delete' || key === 'Backspace') {
          removeVector()
          return
        }

        if (key === 's' || key === 'S') {
          toggleSweep(0)  // sweep α by default
          return
        }
      }

      // ── Project page shortcuts ──────────────────────────────────────
      if (activePage === 'Project') {
        const store = useProjectionStore.getState()

        if (key === 'a' || key === 'A') {
          if (store.mode === 'project') store.addBase()
          else store.addGsVector()
          return
        }

        if (key === 'Delete' || key === 'Backspace') {
          if (store.mode === 'project') store.removeBase()
          else store.removeGsVector()
          return
        }

        if (key === 't' || key === 'T') {
          store.toggleMode()
          return
        }

        if (key === 'n' || key === 'N') {
          store.nextGsStep()
          return
        }

        if (key === 'p' || key === 'P') {
          store.toggleGsPlay()
          return
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activePage, setActivePage, setShowShortcuts, exportPng])
}

