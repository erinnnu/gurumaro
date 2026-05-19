import { useStore } from '../store'
import { Mascot } from '../components/Mascot'
import { ProgressBar } from '../components/ProgressBar'
import { playTap } from '../lib/sounds'

const AGES = ['10代', '20代', '30代', '40代', '50代〜']
const GENDERS = ['男性', '女性', 'その他', '答えない']

export function ScreenAboutYou() {
  const { profile, setProfile, fetchRestaurants, isPartner } = useStore()

  const handleStart = () => {
    playTap()
    fetchRestaurants()
  }

  return (
    <div className="screen" style={{ padding: '16px 24px 8px' }}>
      {!isPartner && <ProgressBar step={6} total={6} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 22 }}>
        <Mascot pose="base" size={64} />
        <div>
          <div style={{ fontFamily: 'M PLUS Rounded 1c, sans-serif', fontWeight: 900, fontSize: isPartner ? 20 : 24, lineHeight: 1.2, color: 'var(--brown)' }}>
            {isPartner ? <>招待されたまろ！<br />まずは教えてね</> : '教えてね（スキップOK！）'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--brown-mute)', fontWeight: 500, marginTop: 2 }}>
            {isPartner ? 'お店の条件は相手が決めてくれたまろ' : '統計のためだけに、ちょっとだけ教えてまろ'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 22 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--brown)', marginBottom: 10 }}>年代</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {AGES.map((a) => (
              <button
                key={a}
                className={`chip${profile.age === a ? ' is-on' : ''}`}
                onClick={() => setProfile({ age: profile.age === a ? undefined : a })}
                style={{ fontSize: 13, padding: '10px 14px' }}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--brown)', marginBottom: 10 }}>性別</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {GENDERS.map((g) => (
              <button
                key={g}
                className={`chip${profile.gender === g ? ' is-on' : ''}`}
                onClick={() => setProfile({ gender: profile.gender === g ? undefined : g })}
                style={{ fontSize: 13, padding: '10px 14px' }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div style={{
          fontSize: 10,
          color: 'var(--brown-mute)',
          lineHeight: 1.5,
          background: '#FFEFDB',
          padding: '10px 12px',
          borderRadius: 10,
        }}>
          ※ 統計データとしてのみ利用します。個人を特定する情報は取得しないまろ
        </div>
      </div>

      <div className="bottom-fade">
        <button className="btn-primary" onClick={handleStart}>
          スワイプ開始！
        </button>
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <button
            onClick={handleStart}
            style={{ fontSize: 12, color: 'var(--brown-mute)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}
          >
            スキップしてスワイプ開始
          </button>
        </div>
      </div>
    </div>
  )
}
