import { useState, useEffect } from 'react'
import { useStore } from '../store'
import { Mascot } from '../components/Mascot'
import { RestaurantRow } from '../components/RestaurantRow'
import { playMatch } from '../lib/sounds'

export function ScreenMatchA() {
  const { matchResult, sessionId } = useStore()
  const [copied, setCopied] = useState(false)

  useEffect(() => { playMatch() }, [])

  if (!matchResult) return null

  const matchListUrl = sessionId
    ? `${window.location.origin}/?session=${sessionId}&view=match`
    : window.location.href

  const handleShare = async () => {
    let success = false
    try {
      await navigator.clipboard.writeText(matchListUrl)
      success = true
    } catch {
      // clipboard failed, try share sheet
      try {
        if (navigator.share) {
          await navigator.share({
            title: 'ぐるまろ！マッチ結果',
            text: `ぐるまろ！でマッチしたお店が${matchResult.matched.length}軒見つかったまろ！`,
            url: matchListUrl,
          })
          success = true
        }
      } catch { /* cancelled or unsupported */ }
    }
    if (!success) {
      prompt('このURLをコピーして送ってね', matchListUrl)
    } else {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const others = [...matchResult.onlyUser1, ...matchResult.onlyUser2].slice(0, 3)

  return (
    <div className="screen" style={{ background: 'var(--cream)', overflow: 'hidden' }}>
      {/* Hero */}
      <div style={{
        padding: '16px 24px 20px',
        background: 'linear-gradient(180deg, #FFE3D1 0%, #FFF8F0 100%)',
        position: 'relative',
        textAlign: 'center',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {/* Decorations */}
        <svg width="20" height="20" viewBox="0 0 24 24" style={{ position: 'absolute', top: 20, left: 24 }}>
          <path d="M12 2l2.6 6.4L21 11l-6.4 2.6L12 20l-2.6-6.4L3 11l6.4-2.6z" fill="#FFD93D" />
        </svg>
        <svg width="18" height="18" viewBox="0 0 24 24" style={{ position: 'absolute', top: 60, right: 30, transform: 'rotate(20deg)' }}>
          <path d="M12 21s-7-4.5-9.3-9.2C1.1 8.4 3 4.5 6.6 4.5c2 0 3.5 1.2 5.4 3.5 1.9-2.3 3.4-3.5 5.4-3.5 3.6 0 5.5 3.9 3.9 7.3C19 16.5 12 21 12 21z" fill="#FF6B9A" />
        </svg>
        <svg width="14" height="14" viewBox="0 0 24 24" style={{ position: 'absolute', top: 36, right: 60 }}>
          <path d="M12 2l2.6 6.4L21 11l-6.4 2.6L12 20l-2.6-6.4L3 11l6.4-2.6z" fill="#FF9A9E" />
        </svg>

        <Mascot pose="match" size={130} style={{ margin: '0 auto' }} />
        <div style={{ fontFamily: 'M PLUS Rounded 1c, sans-serif', fontWeight: 900, fontSize: 24, marginTop: 4, color: 'var(--brown)' }}>
          🎉 マッチしたまろ！
        </div>
        <div style={{ fontSize: 12, color: 'var(--brown-soft)', fontWeight: 600, marginTop: 4 }}>
          ふたりとも気になった お店は <b style={{ color: 'var(--orange)' }}>{matchResult.matched.length}軒</b>！
        </div>
      </div>

      {/* Lists */}
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 20px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {matchResult.matched.map((r, i) => (
            <RestaurantRow key={r.id} restaurant={r} match defaultExpanded={i === 0} />
          ))}

          {others.length > 0 && (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brown-mute)', marginTop: 6, marginBottom: -2, letterSpacing: '0.04em' }}>
                マッチしなかったけど お互いが気になったお店
              </div>
              {others.map((r) => (
                <RestaurantRow key={r.id} restaurant={r} />
              ))}
            </>
          )}
        </div>
      </div>

      <div className="bottom-fade">
        <button className="btn-primary" onClick={handleShare}>
          <span style={{ fontSize: 16 }}>🔗</span>
          <span>{copied ? 'リンクをコピーしたまろ！' : 'マッチリストを共有する'}</span>
        </button>
      </div>

      <div style={{ padding: '4px 20px 8px', textAlign: 'center', fontSize: 9, color: 'var(--brown-mute)', flexShrink: 0 }}>
        Powered by <a href="https://webservice.recruit.co.jp/" style={{ color: 'inherit' }}>ホットペッパーグルメ Webサービス</a>
      </div>

      {copied && <div className="toast">✓ リンクをコピーしたまろ！</div>}
    </div>
  )
}
