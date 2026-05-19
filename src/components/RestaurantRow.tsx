import { useState, useMemo } from 'react'
import { Restaurant } from '../types'
import { buildHotpepperUrl, buildTabelogUrl, buildIkyuUrl, VC_PIXELS } from '../lib/affiliate'
import { detectInAppBrowser, isIOS, tryOpenInSafari, openInExternalBrowser } from '../lib/browser'

interface RestaurantRowProps {
  restaurant: Restaurant
  match?: boolean
  defaultExpanded?: boolean
}

const BOOKING_SERVICES = [
  {
    label: '食べログで予約する',
    color: '#FF8C00',
    pixel: VC_PIXELS.tabelog,
    comingSoon: false,
  },
  {
    label: '一休で予約する',
    color: '#0F3D6E',
    pixel: VC_PIXELS.ikyu,
    comingSoon: false,
  },
  {
    label: 'ホットペッパーグルメで予約する',
    color: '#E60039',
    pixel: VC_PIXELS.hotpepper,
    comingSoon: true,
  },
] as const

export function RestaurantRow({ restaurant, match, defaultExpanded }: RestaurantRowProps) {
  const [expanded, setExpanded] = useState(defaultExpanded ?? false)
  const inAppBrowser = useMemo(() => detectInAppBrowser(), [])

  const bookingLinks = [
    { ...BOOKING_SERVICES[0], url: buildTabelogUrl(restaurant.name, restaurant.area) },
    { ...BOOKING_SERVICES[1], url: buildIkyuUrl(restaurant.name, restaurant.area) },
    { ...BOOKING_SERVICES[2], url: buildHotpepperUrl(restaurant.url) },
  ]

  return (
    <div
      className="card"
      style={{
        overflow: 'hidden',
        border: match ? '2px solid var(--orange)' : 'none',
        background: match ? '#FFF4EC' : '#fff',
        position: 'relative',
      }}
    >
      {match && (
        <div style={{
          position: 'absolute',
          top: 10,
          right: 10,
          padding: '4px 10px',
          background: 'var(--orange)',
          color: '#fff',
          borderRadius: 99,
          fontSize: 10,
          fontWeight: 900,
          fontFamily: 'M PLUS Rounded 1c, sans-serif',
          letterSpacing: '0.05em',
          boxShadow: '0 3px 0 var(--orange-deep)',
          zIndex: 2,
        }}>
          ★ マッチ！
        </div>
      )}

      {/* Photo + name header row */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: 12,
          width: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          textAlign: 'left',
        }}
      >
        <div style={{ width: 72, height: 72, flexShrink: 0, borderRadius: 12, overflow: 'hidden', background: '#F2EBDE' }}>
          {restaurant.photo ? (
            <img
              src={restaurant.photo}
              alt={restaurant.name}
              referrerPolicy="no-referrer"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              loading="lazy"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #FFD7B8, #FFB07A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🍽</div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'M PLUS Rounded 1c, sans-serif', fontWeight: 800, fontSize: 14, color: 'var(--brown)', lineHeight: 1.3, marginBottom: 5 }}>
            {restaurant.name}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--orange-deep)', background: '#FFE3D1', padding: '2px 6px', borderRadius: 99 }}>{restaurant.genre}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--brown-soft)', background: '#F2EBDE', padding: '2px 6px', borderRadius: 99 }}>{restaurant.area}</span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brown-soft)' }}>{restaurant.budget}</div>
        </div>
        <span style={{ fontSize: 14, color: 'var(--brown-mute)', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}>⌄</span>
      </button>

      {/* Access + desc — always visible, same as swipe card */}
      <div style={{ padding: '0 12px', marginBottom: 10 }}>
        {restaurant.access && (
          <div style={{ fontSize: 11, color: 'var(--brown-mute)', fontWeight: 600, marginBottom: 6 }}>
            🚶 {restaurant.access}
          </div>
        )}
        {restaurant.desc && (
          <div style={{ background: '#FFF4EC', borderRadius: 10, padding: '7px 10px', borderLeft: '3px solid var(--orange)' }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--orange)', marginBottom: 2, letterSpacing: '0.03em' }}>✨ おすすめポイント</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--brown)', lineHeight: 1.45 }}>{restaurant.desc}</div>
          </div>
        )}
      </div>

      {expanded && (
        <div style={{
          padding: '0 12px 12px',
          paddingTop: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          borderTop: '1px dashed #E8DECF',
        }}>
          {/* アプリ内ブラウザ向けバナー */}
          {inAppBrowser && (
            <div style={{
              background: '#FFFBE6',
              border: '1px solid #FFD93D',
              borderRadius: 10,
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
            }}>
              <div style={{ fontSize: 11, color: '#7A6200', fontWeight: 600, lineHeight: 1.4 }}>
                ⚠️ 予約ページをSafariで開く
              </div>
              {isIOS() && (
                <button
                  onClick={() => tryOpenInSafari(window.location.href)}
                  style={{
                    flexShrink: 0,
                    background: '#FF6B35', color: '#fff', border: 'none', borderRadius: 99,
                    fontSize: 10, fontWeight: 800, padding: '4px 12px', cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Safariで開く
                </button>
              )}
            </div>
          )}
          {bookingLinks.map((link) => (
            <div key={link.label}>
              {link.comingSoon ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 10,
                  background: '#F5F5F5',
                  borderLeft: `4px solid #CCC`,
                  fontWeight: 700,
                  fontSize: 13,
                  color: '#AAA',
                  cursor: 'default',
                }}>
                  <span>{link.label}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: '#BBB' }}>Coming Soon</span>
                </div>
              ) : (
                <a
                  href={link.url || undefined}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  onClick={inAppBrowser && link.url ? (e) => {
                    e.preventDefault()
                    openInExternalBrowser(link.url)
                  } : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 10,
                    background: '#fff',
                    borderLeft: `4px solid ${link.color}`,
                    fontFamily: 'inherit',
                    fontWeight: 700,
                    fontSize: 13,
                    color: 'var(--brown)',
                    textDecoration: 'none',
                    boxShadow: '0 2px 0 rgba(61,43,31,0.06)',
                    opacity: link.url ? 1 : 0.4,
                    pointerEvents: link.url ? 'auto' : 'none',
                  }}
                >
                  <span>{link.label}</span>
                  <span style={{ color: link.color, fontSize: 14 }}>→</span>
                </a>
              )}
              {/* ValueCommerce トラッキングピクセル */}
              <img src={link.pixel} height="1" width="0" style={{ border: 0, display: 'block' }} alt="" />
            </div>
          ))}
          <div style={{ fontSize: 9, color: 'var(--brown-mute)', marginTop: 2 }}>
            ※ 上記リンクはアフィリエイト広告を含みます
          </div>
        </div>
      )}
    </div>
  )
}
