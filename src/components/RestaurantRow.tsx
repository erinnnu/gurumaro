import { useState } from 'react'
import { Restaurant } from '../types'
import { buildHotpepperUrl, buildTabelogUrl, buildIkyuUrl, VC_PIXELS } from '../lib/affiliate'

interface RestaurantRowProps {
  restaurant: Restaurant
  match?: boolean
  defaultExpanded?: boolean
}

const BOOKING_SERVICES = [
  {
    label: 'ホットペッパーで予約する',
    color: '#E60039',
    pixel: VC_PIXELS.hotpepper,
  },
  {
    label: '食べログで予約する',
    color: '#FF8C00',
    pixel: VC_PIXELS.tabelog,
  },
  {
    label: '一休で予約する',
    color: '#0F3D6E',
    pixel: VC_PIXELS.ikyu,
  },
] as const

export function RestaurantRow({ restaurant, match, defaultExpanded }: RestaurantRowProps) {
  const [expanded, setExpanded] = useState(defaultExpanded ?? false)

  const bookingLinks = [
    { ...BOOKING_SERVICES[0], url: buildHotpepperUrl(restaurant.url) },
    { ...BOOKING_SERVICES[1], url: buildTabelogUrl(restaurant.name) },
    { ...BOOKING_SERVICES[2], url: buildIkyuUrl(restaurant.name) },
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
        <div style={{ width: 64, height: 64, flexShrink: 0, borderRadius: 12, overflow: 'hidden', background: '#F2EBDE' }}>
          {restaurant.photo ? (
            <img
              src={restaurant.photo}
              alt={restaurant.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              loading="lazy"
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #FFD7B8, #FFB07A)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}>
              🍽
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: 700,
            fontSize: 14,
            color: 'var(--brown)',
            lineHeight: 1.3,
            marginBottom: 4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {restaurant.name}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: 'var(--orange-deep)', fontWeight: 700 }}>{restaurant.genre}</span>
            <span style={{ fontSize: 10, color: 'var(--brown-mute)' }}>·</span>
            <span style={{ fontSize: 10, color: 'var(--brown-soft)', fontWeight: 600 }}>{restaurant.area}</span>
            <span style={{ fontSize: 10, color: 'var(--brown-mute)' }}>·</span>
            <span style={{ fontSize: 10, color: 'var(--brown-soft)', fontWeight: 600 }}>{restaurant.budget}</span>
          </div>
        </div>
        <span style={{
          fontSize: 14,
          color: 'var(--brown-mute)',
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s',
          flexShrink: 0,
        }}>
          ⌄
        </span>
      </button>

      {expanded && (
        <div style={{
          padding: '0 12px 12px',
          paddingTop: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          borderTop: '1px dashed #E8DECF',
        }}>
          {bookingLinks.map((link) => (
            <div key={link.label}>
              <a
                href={link.url || undefined}
                target="_blank"
                rel="noopener noreferrer sponsored"
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
