import { useState, useRef, useEffect } from 'react'
import { useStore } from '../store'
import { Mascot } from '../components/Mascot'
import { Restaurant } from '../types'
import { playYes, playNo } from '../lib/sounds'

const SWIPE_THRESHOLD = 80
const SNAP_BACK_SPEED = 0.35

function SwipeCard({
  restaurant,
  onSwipe,
  isTop,
}: {
  restaurant: Restaurant
  onSwipe: (choice: 'yes' | 'no') => void
  isTop: boolean
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [snapping, setSnapping] = useState(false)
  const startRef = useRef({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const rotation = pos.x * 0.12
  const stampOpacity = Math.min(Math.abs(pos.x) / 60, 1)
  const isYes = pos.x > 20
  const isNo = pos.x < -20

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isTop) return
    setDragging(true)
    setSnapping(false)
    startRef.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
    cardRef.current?.setPointerCapture(e.pointerId)
  }
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return
    setPos({ x: e.clientX - startRef.current.x, y: e.clientY - startRef.current.y })
  }
  const handlePointerUp = () => {
    if (!dragging) return
    setDragging(false)
    if (pos.x > SWIPE_THRESHOLD) onSwipe('yes')
    else if (pos.x < -SWIPE_THRESHOLD) onSwipe('no')
    else { setSnapping(true); setPos({ x: 0, y: 0 }) }
  }

  return (
    <div
      ref={cardRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px) rotate(${rotation}deg)`,
        transition: snapping ? `transform ${SNAP_BACK_SPEED}s cubic-bezier(0.25,0.46,0.45,0.94)` : 'none',
        touchAction: 'none',
        cursor: dragging ? 'grabbing' : 'grab',
        willChange: 'transform',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div className="card" style={{ overflow: 'hidden' }}>
        {/* Photo */}
        <div style={{ height: 'clamp(160px, 32vh, 220px)', position: 'relative', overflow: 'hidden', background: '#F2EBDE', flexShrink: 0 }}>
          {restaurant.photo ? (
            <img
              src={restaurant.photo}
              alt={restaurant.name}
              referrerPolicy="no-referrer"
              style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none', display: 'block' }}
              draggable={false}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>🍽</div>
          )}
          {isYes && (
            <div style={{ position: 'absolute', top: 12, left: 12, border: '3px solid #FF6B9A', color: '#FF6B9A', background: 'rgba(255,255,255,0.95)', fontFamily: 'M PLUS Rounded 1c, sans-serif', fontWeight: 900, fontSize: 20, padding: '3px 10px', borderRadius: 8, transform: 'rotate(-12deg)', opacity: stampOpacity }}>YES ❤</div>
          )}
          {isNo && (
            <div style={{ position: 'absolute', top: 12, right: 12, border: '3px solid #7B8AA0', color: '#7B8AA0', background: 'rgba(255,255,255,0.95)', fontFamily: 'M PLUS Rounded 1c, sans-serif', fontWeight: 900, fontSize: 20, padding: '3px 10px', borderRadius: 8, transform: 'rotate(14deg)', opacity: stampOpacity }}>NOPE</div>
          )}
        </div>
        {/* Body */}
        <div style={{ padding: '10px 14px 0' }}>
          <div style={{ fontFamily: 'M PLUS Rounded 1c, sans-serif', fontWeight: 800, fontSize: 15, color: 'var(--brown)', lineHeight: 1.2, marginBottom: 6 }}>
            {restaurant.name}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 5 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--orange-deep)', background: '#FFE3D1', padding: '2px 7px', borderRadius: 99 }}>{restaurant.genre}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--brown-soft)', background: '#F2EBDE', padding: '2px 7px', borderRadius: 99 }}>{restaurant.area}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--brown-soft)', background: '#F2EBDE', padding: '2px 7px', borderRadius: 99 }}>{restaurant.budget}</span>
          </div>
          {restaurant.access && (
            <div style={{ fontSize: 11, color: 'var(--brown-mute)', fontWeight: 600, marginBottom: 6 }}>
              🚶 {restaurant.access}
            </div>
          )}
        </div>
        {/* おすすめポイント */}
        {restaurant.desc && (
          <div style={{ margin: '0 14px 12px', background: '#FFF4EC', borderRadius: 10, padding: '7px 10px', borderLeft: '3px solid var(--orange)' }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--orange)', marginBottom: 2, letterSpacing: '0.03em' }}>✨ おすすめポイント</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--brown)', lineHeight: 1.45 }}>{restaurant.desc}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export function ScreenSwipe() {
  const { restaurants, addSwipe, clearSwipes, setStep, swipes, saveSessionAndShare } = useStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mascotReaction, setMascotReaction] = useState<'like' | 'nope' | null>(null)
  const [showMatchC, setShowMatchC] = useState(false)

  const remaining = restaurants.length - currentIndex
  const currentRestaurant: Restaurant | undefined = restaurants[currentIndex]

  const handleSwipe = (choice: 'yes' | 'no') => {
    if (!currentRestaurant) return
    addSwipe({ restaurantId: currentRestaurant.id, choice })
    setMascotReaction(choice === 'yes' ? 'like' : 'nope')
    setTimeout(() => setMascotReaction(null), 600)
    if (choice === 'yes') playYes()
    else playNo()
    setCurrentIndex(i => i + 1)
  }

  useEffect(() => {
    if (currentIndex >= restaurants.length && restaurants.length > 0) {
      const yesCount = swipes.filter(s => s.choice === 'yes').length
      if (yesCount <= 2) setShowMatchC(true)
      else handleFinish()
    }
  }, [currentIndex, restaurants.length])

  const handleFinish = async () => {
    await saveSessionAndShare()
    setStep('result')
  }

  if (showMatchC) {
    return (
      <div className="screen" style={{ background: 'var(--cream)', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ flex: 1 }} />
        <div style={{ background: '#fff', borderRadius: 28, boxShadow: '0 24px 48px rgba(61,43,31,0.2)', padding: '24px 22px 22px', textAlign: 'center', position: 'relative', width: '100%', maxWidth: 440 }}>
          <div style={{ marginTop: -70 }}><Mascot pose="thinking" size={120} /></div>
          <div style={{ fontFamily: 'M PLUS Rounded 1c, sans-serif', fontWeight: 900, fontSize: 20, marginTop: 4, lineHeight: 1.3, color: 'var(--brown)' }}>まだマッチが見つからないまろ！</div>
          <div style={{ fontSize: 13, color: 'var(--brown-soft)', fontWeight: 500, marginTop: 8, lineHeight: 1.55 }}>
            {currentIndex}枚スワイプしたけど、YESが少なめまろ。<br />続けるか、結果を見るか選んでね。
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
            <button className="btn-primary" onClick={() => { clearSwipes(); setShowMatchC(false); setCurrentIndex(0) }}>もう少し続ける</button>
            <button className="btn-secondary" onClick={handleFinish}>気になったお店だけ見る</button>
          </div>
        </div>
        <div style={{ flex: 1 }} />
      </div>
    )
  }

  if (!currentRestaurant) return null

  return (
    <div className="screen" style={{ background: 'var(--cream)', overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{ padding: '12px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ fontFamily: 'M PLUS Rounded 1c, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--orange)' }}>
          ぐるまろ<span style={{ color: 'var(--yellow)' }}>！</span>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 99, background: '#FFE3D1', fontSize: 13, fontWeight: 800, color: 'var(--orange-deep)' }}>
          <span>📍</span><span>あと{remaining}枚</span>
        </div>
      </div>

      {/* Card */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 8px', minHeight: 0 }}>
        <SwipeCard key={currentRestaurant.id} restaurant={currentRestaurant} onSwipe={handleSwipe} isTop />
      </div>

      {/* Buttons */}
      <div style={{ padding: '12px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, flexShrink: 0 }}>
        <ActionButtons onSwipe={handleSwipe} />
      </div>
      <div style={{ padding: '4px 0 16px', textAlign: 'center', flexShrink: 0 }}>
        <SkipLink onFinish={handleFinish} />
      </div>
    </div>
  )
}

function ActionButtons({ onSwipe, large }: { onSwipe: (c: 'yes' | 'no') => void; large?: boolean }) {
  const noSize = large ? 80 : 64
  const yesSize = large ? 90 : 76
  const [bouncing, setBouncing] = useState(false)
  const [hearts, setHearts] = useState<{ id: number; x: number; rot: number }[]>([])

  const handleYes = () => {
    onSwipe('yes')
    setBouncing(true)
    setTimeout(() => setBouncing(false), 400)
    const newHearts = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 80,
      rot: (Math.random() - 0.5) * 40,
    }))
    setHearts(h => [...h, ...newHearts])
    setTimeout(() => setHearts(h => h.filter(x => !newHearts.find(n => n.id === x.id))), 800)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: large ? 48 : 36 }}>
      {/* NO */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <button onClick={() => onSwipe('no')} style={{ width: noSize, height: noSize, borderRadius: '50%', border: 'none', background: '#fff', boxShadow: '0 4px 0 #E8DECF, 0 8px 18px rgba(61,43,31,0.12)', fontSize: large ? 32 : 26, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brown-mute)' }}>✕</button>
        <div style={{ fontSize: large ? 13 : 11, color: 'var(--brown-mute)', fontWeight: 700 }}>違うかな</div>
      </div>

      {/* YES with hearts */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative' }}>
        {/* Floating hearts */}
        {hearts.map(h => (
          <span
            key={h.id}
            style={{
              position: 'absolute',
              top: yesSize / 2,
              left: '50%',
              marginLeft: h.x,
              fontSize: 14 + Math.random() * 8,
              pointerEvents: 'none',
              animation: 'float-heart 0.75s ease-out forwards',
              // @ts-ignore
              '--rot': `${h.rot}deg`,
              zIndex: 10,
            }}
          >
            💗
          </span>
        ))}

        <button
          onClick={handleYes}
          className={bouncing ? 'yes-bounce' : ''}
          style={{
            width: yesSize,
            height: yesSize,
            borderRadius: '50%',
            border: '3px solid rgba(255,255,255,0.5)',
            background: 'radial-gradient(circle at 38% 35%, #FF8FB8, #FF4D8D)',
            boxShadow: '0 6px 0 #C73B6A, 0 10px 28px rgba(255,77,141,0.5), inset 0 2px 6px rgba(255,255,255,0.35)',
            fontSize: large ? 36 : 32,
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
          }}
        >
          🤍
        </button>
        <div style={{ fontSize: large ? 13 : 12, color: '#E84B7E', fontWeight: 800 }}>行きたい！</div>
      </div>
    </div>
  )
}

function SkipLink({ onFinish }: { onFinish: () => void }) {
  return (
    <button onClick={onFinish} style={{ fontSize: 12, color: 'var(--brown-mute)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}>
      スキップして結果を見る
    </button>
  )
}
