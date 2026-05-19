import { useStore } from '../store'
import { Mascot } from '../components/Mascot'
import { ProgressBar } from '../components/ProgressBar'
import { playTap } from '../lib/sounds'

const OPTIONS = [
  { label: 'ランチ', emoji: '☀️', desc: 'お昼ごはんを探す' },
  { label: 'ディナー', emoji: '🌙', desc: '夜ごはんを探す' },
]

export function ScreenMealtime() {
  const { filters, setFilters, setStep } = useStore()

  const select = (label: string) => {
    // 食事タイム変更時は予算をリセット
    setFilters({ mealtime: label, budgets: [] })
  }

  return (
    <div className="screen" style={{ padding: '16px 24px 8px' }}>
      <ProgressBar step={4} total={6} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 22 }}>
        <Mascot pose="thinking" size={64} />
        <div>
          <div style={{ fontFamily: 'M PLUS Rounded 1c, sans-serif', fontWeight: 900, fontSize: 24, lineHeight: 1.2, color: 'var(--brown)' }}>ランチ？ディナー？</div>
          <div style={{ fontSize: 12, color: 'var(--brown-mute)', fontWeight: 500, marginTop: 2 }}>どちらか選んでね</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 28 }}>
        {OPTIONS.map((opt) => {
          const isOn = filters.mealtime === opt.label
          return (
            <button
              key={opt.label}
              onClick={() => select(opt.label)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '20px 20px',
                borderRadius: 20,
                border: `2px solid ${isOn ? 'var(--orange)' : 'var(--gray)'}`,
                background: isOn ? '#FFE9DD' : '#fff',
                boxShadow: isOn ? '0 4px 0 var(--orange)' : '0 4px 0 rgba(61,43,31,0.08)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 40, lineHeight: 1 }}>{opt.emoji}</span>
              <div>
                <div style={{ fontFamily: 'M PLUS Rounded 1c, sans-serif', fontWeight: 900, fontSize: 20, color: isOn ? 'var(--orange-deep)' : 'var(--brown)' }}>{opt.label}</div>
                <div style={{ fontSize: 12, color: 'var(--brown-mute)', fontWeight: 500, marginTop: 2 }}>{opt.desc}</div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="bottom-fade">
        <button
          className="btn-primary"
          onClick={() => { playTap(); setStep('budget') }}
          style={{ opacity: filters.mealtime ? 1 : 0.5 }}
          disabled={!filters.mealtime}
        >
          次へ →
        </button>
      </div>
    </div>
  )
}
