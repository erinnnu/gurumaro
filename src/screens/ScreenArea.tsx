import { useStore } from '../store'
import { Mascot } from '../components/Mascot'
import { ProgressBar } from '../components/ProgressBar'
import { playTap } from '../lib/sounds'

const PREFECTURES = [
  '東京都', '神奈川県', '埼玉県', '千葉県',
  '大阪府', '兵庫県', '京都府', '愛知県', '福岡県',
]

const AREAS_BY_PREF: Record<string, string[]> = {
  '東京都': ['渋谷', '恵比寿', '代官山', '中目黒', '六本木', '麻布', '広尾', '原宿', '青山', '新宿', '池袋', '銀座', '秋葉原', '上野', '品川'],
  '神奈川県': ['横浜', '川崎', '藤沢', '鎌倉', '湘南'],
  '埼玉県': ['大宮', '浦和', '川口'],
  '千葉県': ['千葉', '船橋', '柏', '成田'],
  '大阪府': ['梅田', '難波', '心斎橋', '天王寺', '北浜'],
  '兵庫県': ['神戸', '三宮', '元町'],
  '京都府': ['京都駅', '烏丸', '祇園'],
  '愛知県': ['名古屋', '栄', '金山'],
  '福岡県': ['博多', '天神', '中洲'],
}

export function ScreenArea() {
  const { filters, setFilters, setStep } = useStore()
  const areas = AREAS_BY_PREF[filters.prefecture] ?? []

  const toggleArea = (label: string) => {
    const has = filters.areas.includes(label)
    setFilters({ areas: has ? filters.areas.filter((a) => a !== label) : [...filters.areas, label] })
  }

  const changePref = (pref: string) => {
    setFilters({ prefecture: pref, areas: [] })
  }

  return (
    <div className="screen" style={{ padding: '16px 24px 8px' }}>
      <ProgressBar step={3} total={6} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 22 }}>
        <Mascot pose="thinking" size={64} />
        <div>
          <div style={{ fontFamily: 'M PLUS Rounded 1c, sans-serif', fontWeight: 900, fontSize: 24, lineHeight: 1.2, color: 'var(--brown)' }}>
            どこで食べる？
          </div>
          <div style={{ fontSize: 12, color: 'var(--brown-mute)', fontWeight: 500, marginTop: 2 }}>
            都道府県とエリアを選んでね
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 22 }}>
        {/* Prefecture */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brown-mute)', marginBottom: 6, letterSpacing: '0.04em' }}>
            都道府県
          </div>
          <select
            value={filters.prefecture}
            onChange={(e) => changePref(e.target.value)}
            style={{
              width: '100%',
              border: '2px solid var(--gray)',
              background: '#fff',
              borderRadius: 16,
              padding: '14px 16px',
              fontFamily: 'inherit',
              fontWeight: 700,
              fontSize: 15,
              color: 'var(--brown)',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23A08877' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 16px center',
            }}
          >
            {PREFECTURES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Areas */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brown-mute)', marginBottom: 8, letterSpacing: '0.04em' }}>
            エリア（複数OK）
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {areas.map((a) => (
              <button
                key={a}
                className={`chip${filters.areas.includes(a) ? ' is-on' : ''}`}
                onClick={() => toggleArea(a)}
                style={{ fontSize: 13, padding: '9px 14px' }}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bottom-fade">
        <button
          className="btn-primary"
          onClick={() => { playTap(); setStep('mealtime') }}
          style={{ opacity: filters.areas.length === 0 ? 0.5 : 1 }}
        >
          次へ →
        </button>
      </div>
    </div>
  )
}
