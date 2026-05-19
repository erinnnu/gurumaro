import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { Mascot } from '../components/Mascot'

export function ScreenWaiting() {
  const { sessionId, pollForPartner, setStep } = useStore()
  const [copyDone, setCopyDone] = useState(false)
  const [time] = useState(() => {
    const now = new Date()
    return `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
  })

  const shareUrl = sessionId
    ? `${window.location.origin}/?session=${sessionId}`
    : window.location.href

  useEffect(() => {
    // Push session token to URL
    if (sessionId && !window.location.search.includes(sessionId)) {
      window.history.replaceState(null, '', `/?session=${sessionId}`)
    }
    // Poll every 5 seconds
    const timer = setInterval(() => pollForPartner(), 5000)
    return () => clearInterval(timer)
  }, [sessionId, pollForPartner])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopyDone(true)
      setTimeout(() => setCopyDone(false), 2000)
    } catch {
      prompt('このURLをコピーしてね', shareUrl)
    }
  }

  return (
    <div className="screen" style={{ background: 'var(--cream)', padding: '0 24px' }}>
      {/* Status chip */}
      <div style={{
        marginTop: 16,
        background: '#FFE3D1',
        borderRadius: 14,
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexShrink: 0,
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: '#19B26B',
          boxShadow: '0 0 0 4px rgba(25,178,107,0.18)',
          flexShrink: 0,
          display: 'block',
        }} />
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--brown)' }}>リンクを送信しました</div>
          <div style={{ fontSize: 10, color: 'var(--brown-mute)', fontWeight: 500 }}>{time}・クリップボードにコピー済み</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <Mascot pose="thinking" size={170} />
        <div style={{ fontFamily: 'M PLUS Rounded 1c, sans-serif', fontWeight: 900, fontSize: 20, marginTop: 12, lineHeight: 1.3, color: 'var(--brown)' }}>
          相手の選択を待ってるまろ
        </div>
        <div style={{ fontSize: 12, color: 'var(--brown-soft)', fontWeight: 500, marginTop: 8, lineHeight: 1.55 }}>
          相手がスワイプを終えると、<br />マッチ結果がこの画面に届くまろ！
        </div>

        {/* Status cards */}
        <div style={{ display: 'flex', gap: 10, marginTop: 22, width: '100%' }}>
          <div style={{
            flex: 1,
            background: '#fff',
            border: '2px solid var(--orange)',
            borderRadius: 14,
            padding: '12px 10px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brown-mute)' }}>あなた</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--orange)', marginTop: 4 }}>✓ 完了</div>
          </div>
          <div style={{
            flex: 1,
            background: '#fff',
            border: '2px dashed var(--gray-deep)',
            borderRadius: 14,
            padding: '12px 10px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brown-mute)' }}>相手</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--brown-mute)', marginTop: 4 }}>… 待機中</div>
          </div>
        </div>
      </div>

      <div style={{ paddingBottom: 32, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="btn-secondary" onClick={handleCopy}>
          <span style={{ fontSize: 16 }}>🔗</span>
          <span>{copyDone ? 'コピー済み！' : 'もう一度リンクをコピー'}</span>
        </button>
        <button
          onClick={() => setStep('result')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            color: 'var(--brown-soft)',
            fontWeight: 600,
            padding: '4px 0',
            textDecoration: 'underline',
            textDecorationColor: '#D4C4B4',
          }}
        >
          ← 自分が選んだリストに戻る
        </button>
        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--brown-mute)', fontWeight: 500 }}>
          このページは自動更新されるまろ
        </div>
      </div>
    </div>
  )
}
