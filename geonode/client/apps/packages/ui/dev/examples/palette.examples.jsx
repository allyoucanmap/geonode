const tile = {
  minWidth: 150,
  flex: '1 1 150px',
  padding: 'var(--gn-space-3)',
  borderRadius: 'var(--gn-radius)',
  border: '1px solid var(--gn-border)',
}
const grid = { display: 'flex', flexWrap: 'wrap', gap: 'var(--gn-space-3)' }
const name = { font: '600 var(--gn-font-size-xs)/1.3 ui-monospace, monospace', opacity: 0.85 }
const sample = { marginTop: 'var(--gn-space-2)', fontSize: 'var(--gn-font-size-sm)' }

function Surface({ bg, label }) {
  return (
    <div style={{ ...tile, background: `var(${bg})` }}>
      <div style={{ ...name, color: 'var(--gn-text)' }}>{label}</div>
      <div style={{ ...sample, color: 'var(--gn-text)' }}>Body text (--gn-text)</div>
      <div style={{ ...sample, marginTop: 'var(--gn-space-1)', color: 'var(--gn-text-muted)' }}>
        Muted text (--gn-text-muted)
      </div>
    </div>
  )
}

function Solid({ bg, label, fg = '--gn-text-on-primary' }) {
  return (
    <div style={{ ...tile, background: `var(${bg})`, borderColor: 'transparent', color: `var(${fg})` }}>
      <div style={{ ...name, color: 'inherit' }}>{label}</div>
      <div style={{ ...sample, color: 'inherit' }}>Label on fill</div>
    </div>
  )
}

function Soft({ bg, label, fg = '--gn-text', accent }) {
  return (
    <div style={{ ...tile, background: `var(${bg})` }}>
      <div style={{ ...name, color: `var(${accent || fg})` }}>{label}</div>
      <div style={{ ...sample, color: `var(${fg})` }}>Message text on soft tint</div>
    </div>
  )
}

export default {
  title: 'Palette',
  order: -1,
  scenarios: [
    {
      name: 'surfaces & text',
      render: () => (
        <div style={grid}>
          <Surface bg="--gn-bg" label="--gn-bg" />
          <Surface bg="--gn-surface" label="--gn-surface" />
          <Surface bg="--gn-surface-subtle" label="--gn-surface-subtle" />
          <Surface bg="--gn-surface-muted" label="--gn-surface-muted" />
        </div>
      ),
    },
    {
      name: 'solid fills (white text)',
      render: () => (
        <div style={grid}>
          <Solid bg="--gn-primary" label="--gn-primary" />
          <Solid bg="--gn-primary-hover" label="--gn-primary-hover" />
          <Solid bg="--gn-danger" label="--gn-danger" fg="--gn-text-on-danger" />
        </div>
      ),
    },
    {
      name: 'semantic soft + text',
      render: () => (
        <div style={grid}>
          <Soft bg="--gn-success-soft" label="--gn-success-soft" accent="--gn-success" />
          <Soft bg="--gn-warning-soft" label="--gn-warning-soft" accent="--gn-warning-text" />
          <Soft bg="--gn-info-soft" label="--gn-info-soft" accent="--gn-info-text" />
          <Soft bg="--gn-danger-soft" label="--gn-danger-soft" accent="--gn-danger" />
        </div>
      ),
    },
  ],
}
