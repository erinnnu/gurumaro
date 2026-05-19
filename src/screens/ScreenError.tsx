import { useStore } from '../store'
import { Mascot } from '../components/Mascot'

export function ScreenError() {
  const { errorMessage, setStep, fetchRestaurants } = useStore()

  return (
    <div className="screen" style={{ background: 'var(--cream)', padding: '0 24px', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ flex: 1 }} />

      <Mascot pose="nope" size={150} style={{ margin: '0 auto' }} />

      <div style={{ fontFamily: 'M PLUS Rounded 1c, sans-serif', fontWeight: 900, fontSize: 20, marginTop: 12, textAlign: 'center', lineHeight: 1.3, color: 'var(--brown)' }}>
        通信できなかったまろ…
      </div>
      <div style={{ fontSize: 12, color: 'var(--brown-soft)', fontWeight: 500, marginTop: 8, lineHeight: 1.55, textAlign: 'center' }}>
        ネットワーク接続を確認して、<br />もう一度試してみてね。
      </div>

      {errorMessage && (
        <div style={{
          width: '100%',
          background: '#fff',
          borderLeft: '4px solid var(--orange)',
          borderRadius: 12,
          padding: '12px 14px',
          marginTop: 22,
          fontSize: 11,
          color: 'var(--brown-soft)',
          fontWeight: 500,
          lineHeight: 1.5,
        }}>
          {errorMessage}
        </div>
      )}

      <div style={{ flex: 1 }} />

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 32 }}>
        <button className="btn-primary" onClick={() => fetchRestaurants()}>
          <span style={{ fontSize: 16 }}>↻</span>
          <span>もう一度試す</span>
        </button>
        <button
          onClick={() => setStep('top')}
          style={{
            width: '100%', padding: '12px 20px', border: 'none',
            background: 'transparent', color: 'var(--brown-mute)',
            fontFamily: 'inherit', fontWeight: 700, fontSize: 13,
            cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3,
          }}
        >
          トップへ戻る
        </button>
      </div>
    </div>
  )
}
