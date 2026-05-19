import { useStore } from '../store'
import { Mascot } from '../components/Mascot'
import { ProgressBar } from '../components/ProgressBar'
import { playTap } from '../lib/sounds'

const SITUATIONS = [
  { label: 'カジュ飲み', emoji: '🍷' },
  { label: '楽しく居酒屋', emoji: '🍻' },
  { label: 'ロマンチックなデート', emoji: '🌹' },
  { label: '女子会映え重視', emoji: '📷' },
  { label: '軽くラーメン', emoji: '🍜' },
  { label: '満腹になりたい！', emoji: '🍖' },
]

export function ScreenSituation() {
  const { filters, setFilters, setStep } = useStore()

  const toggle = (label: string) => {
    const has = filters.situations.includes(label)
    setFilters({ situations: has ? filters.situations.filter((s) => s !== label) : [...filters.situations, label] })
  }

  return (
    <div className="screen" style={{ padding: '16px 24px 8px' }}>
      <ProgressBar step={2} total={6} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 22 }}>
        <Mascot pose="thinking" size={64} />
        <div>
          <div style={{ fontFamily: 'M PLUS Rounded 1c, sans-serif', fontWeight: 900, fontSize: 24, lineHeight: 1.2, color: 'var(--brown)' }}>どんなシチュエーション？</div>
          <div style={{ fontSize: 12, color: 'var(--brown-mute)', fontWeight: 500, marginTop: 2 }}>今日の気分にぴったりなのを</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 22 }}>
        {SITUATIONS.map((item) => (
          <button key={item.label} className={`chip${filters.situations.includes(item.label) ? ' is-on' : ''}`} onClick={() => toggle(item.label)} style={{ justifyContent: 'flex-start', padding: '14px 18px', fontSize: 15 }}>
            <span style={{ fontSize: 20, marginRight: 4 }}>{item.emoji}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <div className="bottom-fade">
        <button className="btn-primary" onClick={() => { playTap(); setStep('area') }}>次へ →</button>
      </div>
    </div>
  )
}
