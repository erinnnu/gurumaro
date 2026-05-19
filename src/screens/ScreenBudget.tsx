import { useStore } from '../store'
import { Mascot } from '../components/Mascot'
import { ProgressBar } from '../components/ProgressBar'
import { playTap } from '../lib/sounds'

const LUNCH_BUDGETS = [
  { label: 'お手軽 (〜¥1,000)', emoji: '🪙' },
  { label: 'ふつう (¥1,000〜¥1,500)', emoji: '🍽' },
  { label: 'ちょっとこだわり (¥1,500〜¥2,500)', emoji: '✨' },
  { label: 'プチ贅沢 (¥2,500〜)', emoji: '🌟' },
]

const DINNER_BUDGETS = [
  { label: 'カジュアル (〜¥3,000)', emoji: '🪙' },
  { label: 'ふつう (¥3,000〜¥5,000)', emoji: '🍽' },
  { label: 'ちょっと贅沢 (¥5,000〜¥8,000)', emoji: '✨' },
  { label: '特別な日 (¥8,000〜)', emoji: '🌟' },
]

export function ScreenBudget() {
  const { filters, setFilters, setStep } = useStore()
  const budgets = filters.mealtime === 'ランチ' ? LUNCH_BUDGETS : DINNER_BUDGETS

  const select = (label: string) => {
    const isSelected = filters.budgets.includes(label)
    setFilters({ budgets: isSelected ? [] : [label] })
  }

  return (
    <div className="screen" style={{ padding: '16px 24px 8px' }}>
      <ProgressBar step={5} total={6} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 22 }}>
        <Mascot pose="thinking" size={64} />
        <div>
          <div style={{ fontFamily: 'M PLUS Rounded 1c, sans-serif', fontWeight: 900, fontSize: 24, lineHeight: 1.2, color: 'var(--brown)' }}>予算はどのくらい？</div>
          <div style={{ fontSize: 12, color: 'var(--brown-mute)', fontWeight: 500, marginTop: 2 }}>
            {filters.mealtime === 'ランチ' ? 'ランチのひとり当たり目安' : 'ディナーのひとり当たり目安'}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 22 }}>
        {budgets.map((item) => (
          <button
            key={item.label}
            className={`chip${filters.budgets.includes(item.label) ? ' is-on' : ''}`}
            onClick={() => select(item.label)}
            style={{ justifyContent: 'flex-start', width: '100%', padding: '14px 18px', fontSize: 15 }}
          >
            <span style={{ fontSize: 20, marginRight: 4 }}>{item.emoji}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <div className="bottom-fade">
        <button className="btn-primary" onClick={() => { playTap(); setStep('aboutyou') }}>
          次へ →
        </button>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <button
            onClick={() => { playTap(); setStep('aboutyou') }}
            style={{ fontSize: 12, color: 'var(--brown-mute)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}
          >
            こだわらない
          </button>
        </div>
      </div>
    </div>
  )
}
