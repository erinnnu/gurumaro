import { useStore } from '../store'
import { Mascot } from '../components/Mascot'
import { ProgressBar } from '../components/ProgressBar'
import { playTap } from '../lib/sounds'

const CUISINES = [
  { label: 'イタリアン・フレンチ', emoji: '🍝' },
  { label: '和食', emoji: '🍣' },
  { label: '中華', emoji: '🥟' },
  { label: '韓国料理', emoji: '🌶' },
  { label: 'カフェ', emoji: '☕' },
  { label: '焼肉', emoji: '🥩' },
  { label: 'その他', emoji: '✨' },
]

export function ScreenCuisine() {
  const { filters, setFilters, setStep } = useStore()

  const toggle = (label: string) => {
    const has = filters.cuisines.includes(label)
    setFilters({ cuisines: has ? filters.cuisines.filter((c) => c !== label) : [...filters.cuisines, label] })
  }

  return (
    <div className="screen" style={{ padding: '16px 24px 8px' }}>
      <ProgressBar step={1} total={6} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 22 }}>
        <Mascot pose="thinking" size={64} />
        <div>
          <div style={{ fontFamily: 'M PLUS Rounded 1c, sans-serif', fontWeight: 900, fontSize: 24, lineHeight: 1.2, color: 'var(--brown)' }}>何系の気分？</div>
          <div style={{ fontSize: 12, color: 'var(--brown-mute)', fontWeight: 500, marginTop: 2 }}>気になるジャンルを選んでね（複数OK）</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 22 }}>
        {CUISINES.map((item) => (
          <button key={item.label} className={`chip${filters.cuisines.includes(item.label) ? ' is-on' : ''}`} onClick={() => toggle(item.label)} style={{ justifyContent: 'flex-start' }}>
            <span style={{ fontSize: 18 }}>{item.emoji}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <div className="bottom-fade">
        <button className="btn-primary" onClick={() => { playTap(); setStep('situation') }} style={{ opacity: filters.cuisines.length === 0 ? 0.5 : 1 }}>次へ →</button>
      </div>
    </div>
  )
}
