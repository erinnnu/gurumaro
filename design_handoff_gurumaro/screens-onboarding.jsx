// ============================================================
// screens-onboarding.jsx — Screen 1 (top)
// ============================================================

function Logo({ variant, size = 56 }) {
  if (variant === 'refined') {
    return (
      <div style={{ textAlign: 'center', lineHeight: 1 }}>
        <div style={{
          fontFamily: 'Zen Maru Gothic, sans-serif',
          fontWeight: 900,
          fontSize: size,
          color: 'var(--brown)',
          letterSpacing: '-0.01em',
          display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 2
        }}>
          <span>ぐるまろ</span>
          <span style={{ color: 'var(--orange)', fontSize: size * 0.85 }}>！</span>
        </div>
        <div style={{
          marginTop: 8,
          fontSize: 10,
          letterSpacing: '0.35em',
          color: 'var(--brown-mute)',
          fontWeight: 700,
          paddingLeft: '0.35em'
        }}>GURUMARO</div>
      </div>
    );
  }
  return (
    <div style={{ textAlign: 'center', lineHeight: 1, position: 'relative' }}>
      <div style={{
        fontFamily: 'M PLUS Rounded 1c, sans-serif',
        fontWeight: 900,
        fontSize: size,
        color: 'var(--orange)',
        textShadow: '0 4px 0 #FFD7B8',
        letterSpacing: '-0.02em',
        display: 'inline-block',
        transform: 'rotate(-2deg)'
      }}>
        ぐるまろ<span style={{ color: 'var(--yellow)', textShadow: '0 4px 0 #E0B900' }}>！</span>
      </div>
    </div>
  );
}

function ScreenTop({ variant }) {
  const isPop = variant === 'pop';
  return (
    <Phone variant={variant} screenLabel="01 トップ">
      <div className="screen-body" style={{ padding: '0 24px 80px' }}>
        {/* spacer to clear status bar */}
        <div style={{ height: 8 }}/>

        {/* decorative top dots for pop */}
        {isPop && (
          <>
            <Sparkle size={20} color="#FFD93D" style={{ position: 'absolute', top: 80, left: 36, transform: 'rotate(15deg)' }}/>
            <Sparkle size={14} color="#FF9A9E" style={{ position: 'absolute', top: 140, right: 48 }}/>
            <Heart size={18} color="#FF9A9E" style={{ position: 'absolute', top: 220, left: 28, transform: 'rotate(-20deg)' }}/>
            <Sparkle size={12} color="#FFD93D" style={{ position: 'absolute', top: 300, right: 32 }}/>
          </>
        )}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: isPop ? 18 : 28 }}>
          <Logo variant={variant} size={isPop ? 64 : 52} />
          <div style={{
            fontSize: 13,
            color: isPop ? 'var(--brown-soft)' : 'var(--brown-mute)',
            fontWeight: isPop ? 700 : 500,
            marginTop: isPop ? -10 : -16,
            background: isPop ? '#fff' : 'transparent',
            padding: isPop ? '4px 12px' : 0,
            borderRadius: 99,
            ...(isPop ? { boxShadow: '0 2px 0 rgba(61,43,31,0.08)' } : {}),
          }}>
            {isPop ? '次いくお店、決めようまろ！' : '次に行くお店を、ふたりで決める。'}
          </div>

          {/* mascot */}
          <div style={{ position: 'relative', marginTop: isPop ? 4 : 12 }}>
            <Mascot pose="base" size={isPop ? 220 : 180} />
            <div className="mascot-shadow" style={{
              position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)',
              width: isPop ? 160 : 130, height: 16
            }}/>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 8 }}>
          <button className={`btn btn-primary${isPop ? '' : ' is-accent'}`}>
            <span>次いくお店を決める！</span>
            <span style={{ fontSize: 20 }}>🍽</span>
          </button>
          <div style={{
            fontSize: 11,
            color: 'var(--brown-mute)',
            textAlign: 'center',
            fontWeight: 500
          }}>
            アカウント登録不要・完全無料で使えるまろ
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 12,
            marginTop: 6,
            fontSize: 10,
            color: 'var(--brown-mute)',
            fontWeight: 500
          }}>
            <span>利用規約</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>プライバシーポリシー</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>クレジット</span>
          </div>
        </div>
      </div>
    </Phone>
  );
}

Object.assign(window, { Logo, ScreenTop });
