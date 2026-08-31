import './ShortcutOverlay.css'

const SHORTCUTS = {
  'Navigation': [
    { keys: ['1'], desc: 'Vectors page' },
    { keys: ['2'], desc: 'Matrices page' },
    { keys: ['3'], desc: 'Scalars page' },
    { keys: ['Esc'], desc: 'Deselect / close' },
    { keys: ['?'], desc: 'Toggle this overlay' },
  ],
  'Vectors': [
    { keys: ['A'], desc: 'Add vector' },
    { keys: ['Del'], desc: 'Delete selected vector' },
    { keys: ['H'], desc: 'Hide / show selected' },
    { keys: ['Tab'], desc: 'Select next vector' },
    { keys: ['⇧', 'Tab'], desc: 'Select previous vector' },
    { keys: ['Space'], desc: 'Toggle span visualisation' },
  ],
  'Matrices': [
    { keys: ['Space'], desc: 'Apply transform (animate)' },
    { keys: ['R'], desc: 'Reset transform' },
  ],
  'Global': [
    { keys: ['E'], desc: 'Export scene to PNG' },
  ],
}

function Keys({ keys }) {
  return (
    <span className="shortcut-keys">
      {keys.map((k, i) => (
        <kbd key={i} className="kbd">{k}</kbd>
      ))}
    </span>
  )
}

export default function ShortcutOverlay({ onClose }) {
  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div
        className="overlay-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
      >
        {/* Header */}
        <div className="overlay-header">
          <span className="overlay-title">⌨ Keyboard Shortcuts</span>
          <button className="overlay-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Shortcut groups */}
        <div className="overlay-body">
          {Object.entries(SHORTCUTS).map(([group, items]) => (
            <div key={group} className="shortcut-group">
              <p className="shortcut-group-title">{group}</p>
              {items.map(({ keys, desc }) => (
                <div key={desc} className="shortcut-row">
                  <Keys keys={keys} />
                  <span className="shortcut-desc">{desc}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <p className="overlay-footer">Press <kbd className="kbd">?</kbd> or <kbd className="kbd">Esc</kbd> to dismiss</p>
      </div>
    </div>
  )
}
