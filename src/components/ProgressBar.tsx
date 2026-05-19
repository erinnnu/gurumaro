interface ProgressBarProps {
  step: number
  total: number
}

export function ProgressBar({ step, total }: ProgressBarProps) {
  const pct = (step / total) * 100
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div className="progress-track" style={{ flex: 1 }}>
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span style={{
        fontSize: 12,
        fontWeight: 800,
        color: 'var(--orange-deep)',
        background: '#FFE3D1',
        padding: '4px 10px',
        borderRadius: 99,
        flexShrink: 0,
      }}>
        {step}/{total}
      </span>
    </div>
  )
}
