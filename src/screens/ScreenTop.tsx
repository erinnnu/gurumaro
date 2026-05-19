import { useStore } from '../store'
import { Mascot } from '../components/Mascot'

export function ScreenTop() {
  const { setStep, isPartner, fetchRestaurants } = useStore()

  return (
    <div className="screen" style={{ background: 'var(--cream)', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '100%', padding: '32px 32px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, position: 'relative' }}>
        {/* Decorations */}
        <svg width="20" height="20" viewBox="0 0 24 24" style={{ position: 'absolute', top: 60, left: 20, transform: 'rotate(15deg)' }}>
          <path d="M12 2l2.6 6.4L21 11l-6.4 2.6L12 20l-2.6-6.4L3 11l6.4-2.6z" fill="#FFD93D" />
        </svg>
        <svg width="14" height="14" viewBox="0 0 24 24" style={{ position: 'absolute', top: 120, right: 24 }}>
          <path d="M12 2l2.6 6.4L21 11l-6.4 2.6L12 20l-2.6-6.4L3 11l6.4-2.6z" fill="#FF9A9E" />
        </svg>
        <svg width="18" height="18" viewBox="0 0 24 24" style={{ position: 'absolute', top: 220, left: 10, transform: 'rotate(-20deg)' }}>
          <path d="M12 21s-7-4.5-9.3-9.2C1.1 8.4 3 4.5 6.6 4.5c2 0 3.5 1.2 5.4 3.5 1.9-2.3 3.4-3.5 5.4-3.5 3.6 0 5.5 3.9 3.9 7.3C19 16.5 12 21 12 21z" fill="#FF9A9E" />
        </svg>

        {/* Logo */}
        <div style={{ textAlign: 'center', lineHeight: 1 }}>
          <div style={{ fontFamily: 'M PLUS Rounded 1c, sans-serif', fontWeight: 900, fontSize: 'clamp(40px, 16vw, 68px)', color: 'var(--orange)', textShadow: '0 5px 0 #FFD7B8', letterSpacing: '-0.02em', display: 'inline-block', whiteSpace: 'nowrap' }}>
            ぐるまろ<span style={{ color: 'var(--yellow)', textShadow: '0 5px 0 #E0B900' }}>！</span>
          </div>
        </div>

        {/* Sub copy */}
        <div style={{ fontSize: 14, color: 'var(--brown-soft)', fontWeight: 700, background: '#fff', padding: '5px 18px', borderRadius: 99, boxShadow: '0 2px 0 rgba(61,43,31,0.08)', marginTop: 8 }}>
          {isPartner ? '相手がお店を選んだよ！' : '次いくお店、決めようまろ！'}
        </div>

        {/* Mascot */}
        <div style={{ position: 'relative', marginTop: 16, marginBottom: 16, animation: 'mascot-sway 2.4s ease-in-out infinite' }}>
          <Mascot pose="base" size={Math.min(220, window.innerHeight * 0.28)} />
          <div style={{ position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)', width: 160, height: 16, background: 'radial-gradient(ellipse at center, rgba(61,43,31,0.16) 0%, transparent 70%)' }} />
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 400 }}>
          <button className="btn-primary" onClick={() => isPartner ? fetchRestaurants() : setStep('cuisine')}>
            {isPartner ? 'スワイプして答え合わせ！🎉' : '次いくお店を決める！🍽'}
          </button>
          <div style={{ fontSize: 12, color: 'var(--brown-mute)', textAlign: 'center', fontWeight: 500 }}>
            アカウント登録不要・完全無料で使えるまろ
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, fontSize: 11, color: 'var(--brown-mute)', fontWeight: 500 }}>
            <a href="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>利用規約</a>
            <span style={{ opacity: 0.4 }}>·</span>
            <a href="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>プライバシーポリシー</a>
            <span style={{ opacity: 0.4 }}>·</span>
            <a href="/credit" style={{ color: 'inherit', textDecoration: 'none' }}>クレジット</a>
          </div>
        </div>
      </div>
    </div>
  )
}
