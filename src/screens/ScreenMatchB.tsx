import { useState } from 'react'
import { useStore } from '../store'
import { Mascot } from '../components/Mascot'
import { RestaurantRow } from '../components/RestaurantRow'

export function ScreenMatchB() {
  const { matchResult, sessionId } = useStore()
  const [copied, setCopied] = useState(false)

  if (!matchResult) return null

  const candidateRestaurants = [...matchResult.onlyUser1, ...matchResult.onlyUser2].slice(0, 5)

  const matchListUrl = sessionId
    ? `${window.location.origin}/?session=${sessionId}&view=match`
    : window.location.href

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'ぐるまろ！結果',
          text: 'ぐるまろ！の結果を見てね！',
          url: matchListUrl,
        })
      } else {
        await navigator.clipboard.writeText(matchListUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      // ignore
    }
  }

  return (
    <div className="screen" style={{ background: 'var(--cream)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '12px 24px 18px',
        textAlign: 'center',
        background: '#FFEFDB',
        flexShrink: 0,
      }}>
        <Mascot pose="nope" size={100} style={{ margin: '0 auto' }} />
        <div style={{ fontFamily: 'M PLUS Rounded 1c, sans-serif', fontWeight: 900, fontSize: 19, marginTop: 4, lineHeight: 1.3, color: 'var(--brown)' }}>
          マッチするお店が<br />見つからなかったまろ…
        </div>
        <div style={{ fontSize: 12, color: 'var(--brown-soft)', fontWeight: 500, marginTop: 8, lineHeight: 1.5 }}>
          でも、お互いが気になったお店は<br />こちらまろ！
        </div>
      </div>

      {/* Lists */}
      <div style={{ flex: 1, overflow: 'auto', padding: '14px 20px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {candidateRestaurants.map((r) => (
            <RestaurantRow key={r.id} restaurant={r} />
          ))}
          {candidateRestaurants.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--brown-mute)', fontSize: 14 }}>
              気になったお店がなかったまろ…<br />
              条件を変えてもう一度試してみてね！
            </div>
          )}
        </div>
      </div>

      <div className="bottom-fade">
        <div style={{
          marginBottom: 10,
          background: '#fff',
          border: '1.5px dashed #FFC59A',
          borderRadius: 12,
          padding: '10px 12px',
          fontSize: 12,
          color: 'var(--brown-soft)',
          fontWeight: 600,
          textAlign: 'center',
          lineHeight: 1.4,
        }}>
          💬 LINEで話し合って決めようまろ！
        </div>
        <button className="btn-primary" onClick={handleShare}>
          <span style={{ fontSize: 16 }}>🔗</span>
          <span>{copied ? 'リンクをコピーしたまろ！' : 'マッチリストを共有する'}</span>
        </button>
      </div>

      <div style={{ padding: '4px 20px 8px', textAlign: 'center', fontSize: 9, color: 'var(--brown-mute)', flexShrink: 0 }}>
        Powered by <a href="https://webservice.recruit.co.jp/" style={{ color: 'inherit' }}>ホットペッパーグルメ Webサービス</a>
      </div>
    </div>
  )
}
