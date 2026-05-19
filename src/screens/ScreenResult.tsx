import { useState, useEffect } from 'react'
import { useStore } from '../store'
import { Mascot } from '../components/Mascot'
import { RestaurantRow } from '../components/RestaurantRow'

export function ScreenResult() {
  const { restaurants, swipes, setStep, sessionId, partnerDone, checkBothDone, computeMatch } = useStore()
  const [copied, setCopied] = useState(false)
  const [matchLoading, setMatchLoading] = useState(false)

  const yesRestaurants = swipes
    .filter((s) => s.choice === 'yes')
    .map((s) => restaurants.find((r) => r.id === s.restaurantId))
    .filter(Boolean) as typeof restaurants

  const shareUrl = sessionId
    ? `${window.location.origin}/?session=${sessionId}`
    : window.location.href

  // 画面を開いた時に相手の完了状態をチェック
  useEffect(() => {
    checkBothDone()
  }, [])

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      prompt('このURLをコピーして相手に送ってね', shareUrl)
    }
    setStep('waiting')
  }

  const handleCheckMatch = async () => {
    setMatchLoading(true)
    await computeMatch()
    setMatchLoading(false)
  }

  return (
    <div className="screen" style={{ background: 'var(--cream)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: '#FFEFDB',
        flexShrink: 0,
      }}>
        <Mascot pose="base" size={72} />
        <div>
          <div style={{ fontFamily: 'M PLUS Rounded 1c, sans-serif', fontWeight: 900, fontSize: 20, lineHeight: 1.25, color: 'var(--brown)' }}>
            あなたが気になったお店
          </div>
          <div style={{ fontSize: 12, color: 'var(--brown-mute)', fontWeight: 500, marginTop: 2 }}>
            {partnerDone
              ? `${yesRestaurants.length}つピックアップ！マッチ結果を確認しよう`
              : `${yesRestaurants.length}つピックアップ！URLを相手に送ろう`}
          </div>
        </div>
      </div>

      {/* Restaurant list */}
      <div style={{ flex: 1, overflow: 'auto', padding: '14px 20px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {yesRestaurants.length > 0 ? (
            yesRestaurants.map((r, i) => (
              <RestaurantRow key={r.id} restaurant={r} defaultExpanded={i === 0} />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--brown-mute)', fontSize: 14 }}>
              YESしたお店がないまろ…<br />
              <button
                onClick={() => setStep('swipe')}
                style={{ marginTop: 12, fontSize: 13, color: 'var(--orange)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                もう一度スワイプする
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Action button */}
      <div className="bottom-fade">
        {partnerDone ? (
          <button className="btn-primary" onClick={handleCheckMatch} disabled={matchLoading}>
            <span style={{ fontSize: 18 }}>✨</span>
            <span>{matchLoading ? '確認中…' : 'マッチ結果を確認する！'}</span>
          </button>
        ) : (
          <button className="btn-primary" onClick={handleShare}>
            <span style={{ fontSize: 18 }}>🔗</span>
            <span>相手にリンクをシェアする</span>
          </button>
        )}
      </div>

      {/* Toast */}
      {copied && (
        <div className="toast">
          ✓ コピーしたまろ！LINEやDMで送ってね
        </div>
      )}

      {/* Hot Pepper credit */}
      <div style={{ padding: '4px 20px 8px', textAlign: 'center', fontSize: 9, color: 'var(--brown-mute)', flexShrink: 0 }}>
        Powered by <a href="https://webservice.recruit.co.jp/" style={{ color: 'inherit' }}>ホットペッパーグルメ Webサービス</a>
      </div>
    </div>
  )
}
