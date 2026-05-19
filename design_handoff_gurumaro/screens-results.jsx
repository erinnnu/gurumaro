// ============================================================
// screens-results.jsx — Screen 7 + Screen 8 (A/B/C)
// ============================================================

function ResultHeader({ variant, mascotPose, title, sub, mascotSize = 80 }) {
  const isPop = variant === 'pop';
  return (
    <div style={{
      padding: '16px 24px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      background: isPop ? '#FFEFDB' : 'transparent',
      borderBottom: isPop ? 'none' : '1px solid #EFE7DC'
    }}>
      <Mascot pose={mascotPose} size={mascotSize}/>
      <div style={{ flex: 1 }}>
        <div className="h1" style={{ fontSize: isPop ? 20 : 19, lineHeight: 1.25, marginBottom: 4 }}>
          {title}
        </div>
        {sub && <div style={{ fontSize: 12, color: 'var(--brown-mute)', fontWeight: 500 }}>{sub}</div>}
      </div>
    </div>
  );
}

function RestaurantRow({ variant, name, genre, area, budget, expanded, match, photoHue = 18 }) {
  const isPop = variant === 'pop';
  return (
    <div className="card" style={{
      overflow: 'hidden',
      position: 'relative',
      border: match ? `2px solid ${isPop ? 'var(--orange)' : 'var(--orange)'}` : (isPop ? 'none' : '1px solid #EFE7DC'),
      ...(match ? { background: '#FFF4EC' } : {})
    }}>
      {match && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          padding: '4px 10px',
          background: 'var(--orange)',
          color: '#fff',
          borderRadius: 99,
          fontSize: 10,
          fontWeight: 900,
          fontFamily: 'M PLUS Rounded 1c, sans-serif',
          letterSpacing: '0.05em',
          boxShadow: '0 3px 0 var(--orange-deep)',
          zIndex: 2
        }}>★ マッチ！</div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12 }}>
        <div style={{ width: 64, height: 64, flexShrink: 0, borderRadius: 12, overflow: 'hidden' }}>
          <PhotoSlot height={64} label="photo" hue={photoHue} variant={variant}/>
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
            whiteSpace: 'nowrap'
          }}>{name}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <span style={{ fontSize: 10, color: 'var(--orange-deep)', fontWeight: 700 }}>{genre}</span>
            <span style={{ fontSize: 10, color: 'var(--brown-mute)' }}>·</span>
            <span style={{ fontSize: 10, color: 'var(--brown-soft)', fontWeight: 600 }}>{area}</span>
            <span style={{ fontSize: 10, color: 'var(--brown-mute)' }}>·</span>
            <span style={{ fontSize: 10, color: 'var(--brown-soft)', fontWeight: 600 }}>{budget}</span>
          </div>
        </div>
        <span style={{
          fontSize: 14,
          color: 'var(--brown-mute)',
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s'
        }}>⌄</span>
      </div>
      {expanded && (
        <div style={{
          padding: '0 12px 12px',
          display: 'flex', flexDirection: 'column', gap: 6,
          borderTop: '1px dashed #E8DECF',
          paddingTop: 10,
          marginTop: 2
        }}>
          {[
            { label: 'ホットペッパーで予約', color: '#E60039' },
            { label: '食べログで予約',     color: '#FE9215' },
            { label: '一休で予約',         color: '#0F3D6E' },
          ].map((b, i) => (
            <button key={i} style={{
              width: '100%',
              padding: '10px 12px',
              border: 'none',
              borderRadius: 10,
              background: '#fff',
              borderLeft: `4px solid ${b.color}`,
              fontFamily: 'inherit',
              fontWeight: 700,
              fontSize: 13,
              color: 'var(--brown)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: isPop ? '0 2px 0 rgba(61,43,31,0.06)' : 'none',
              border_: isPop ? 'none' : '1px solid #EFE7DC',
            }}>
              <span>{b.label}</span>
              <span style={{ color: b.color }}>→</span>
            </button>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <PRTag variant={variant}/>
            <span style={{ fontSize: 9, color: 'var(--brown-mute)' }}>広告を含みます</span>
          </div>
        </div>
      )}
    </div>
  );
}

const PICKS = [
  { name: '炭火焼鳥 ぐるり',         genre: '居酒屋',     area: '恵比寿', budget: '¥3,500〜', hue: 28 },
  { name: 'トラットリア・ロッソ',     genre: 'イタリアン', area: '代官山', budget: '¥4,800〜', hue: 8 },
  { name: 'カウンター割烹 さくら',    genre: '和食',       area: '広尾',   budget: '¥6,000〜', hue: 80 },
  { name: '黒毛和牛 焼肉 ハナレ',     genre: '焼肉',       area: '六本木', budget: '¥5,500〜', hue: 20 },
  { name: '小皿酒場 トコ',           genre: '居酒屋',     area: '中目黒', budget: '¥2,800〜', hue: 50 },
];

// ---------- SCREEN 7 ----------
function ScreenResultSingle({ variant }) {
  const isPop = variant === 'pop';
  return (
    <Phone variant={variant} screenLabel="07 結果（1人目）">
      <div className="screen-body" style={{ overflow: 'hidden' }}>
        <ResultHeader
          variant={variant}
          mascotPose="base"
          mascotSize={72}
          title="あなたが気になったお店"
          sub="5つピックアップ！URLを相手に送ろう"
        />

        <div style={{
          flex: 1,
          overflow: 'hidden',
          padding: '14px 20px 0',
          display: 'flex', flexDirection: 'column', gap: 10
        }}>
          {PICKS.map((p, i) => (
            <RestaurantRow key={i} variant={variant} {...p} expanded={i === 0} photoHue={p.hue}/>
          ))}
        </div>

        {/* share button + toast */}
        <div style={{
          padding: '12px 20px 22px',
          background: isPop
            ? 'linear-gradient(180deg, rgba(255,248,240,0) 0%, #FFF8F0 40%)'
            : 'linear-gradient(180deg, rgba(250,246,240,0) 0%, #FAF6F0 40%)',
        }}>
          {/* toast */}
          <div style={{
            margin: '0 auto 10px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--brown)',
            color: '#fff',
            padding: '8px 14px',
            borderRadius: 99,
            fontSize: 12,
            fontWeight: 700,
            boxShadow: '0 6px 16px rgba(61,43,31,0.25)'
          }}>
            <span>✓</span>
            <span>コピーしたまろ！LINEやDMで送ってね</span>
          </div>
          <button className={`btn btn-primary${isPop ? '' : ' is-accent'}`} style={{ width: '100%' }}>
            <span style={{ fontSize: 18 }}>🔗</span>
            <span>リンクを相手に送る</span>
          </button>
        </div>
      </div>
    </Phone>
  );
}

// ---------- SCREEN 8A ----------
function ScreenMatchA({ variant }) {
  const isPop = variant === 'pop';
  return (
    <Phone variant={variant} screenLabel="08A マッチ">
      <div className="screen-body" style={{ overflow: 'hidden' }}>
        {/* Hero */}
        <div style={{
          padding: '12px 24px 20px',
          background: isPop
            ? 'linear-gradient(180deg, #FFE3D1 0%, #FFF8F0 100%)'
            : 'linear-gradient(180deg, #FFF0E2 0%, #FAF6F0 100%)',
          position: 'relative',
          textAlign: 'center',
          overflow: 'hidden'
        }}>
          {isPop && (
            <>
              <Sparkle size={20} color="#FFD93D" style={{ position: 'absolute', top: 20, left: 24 }}/>
              <Heart size={18} color="#FF6B9A" style={{ position: 'absolute', top: 60, right: 30, transform: 'rotate(20deg)' }}/>
              <Sparkle size={14} color="#FFD93D" style={{ position: 'absolute', top: 100, left: 36 }}/>
              <Sparkle size={16} color="#FF9A9E" style={{ position: 'absolute', top: 36, right: 60 }}/>
            </>
          )}
          <Mascot pose="match" size={130}/>
          <div className="h1" style={{
            fontSize: isPop ? 24 : 22,
            marginTop: 4,
            fontFamily: isPop ? 'M PLUS Rounded 1c, sans-serif' : 'Zen Maru Gothic, sans-serif'
          }}>
            🎉 マッチしたまろ！
          </div>
          <div style={{ fontSize: 12, color: 'var(--brown-soft)', fontWeight: 600, marginTop: 4 }}>
            ふたりとも気になった お店は <b style={{ color: 'var(--orange)' }}>2軒</b>！
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'hidden', padding: '12px 20px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <RestaurantRow variant={variant} {...PICKS[0]} match expanded photoHue={PICKS[0].hue}/>
          <RestaurantRow variant={variant} {...PICKS[2]} match photoHue={PICKS[2].hue}/>

          <div style={{
            fontSize: 11, fontWeight: 700, color: 'var(--brown-mute)',
            marginTop: 6, marginBottom: -2, letterSpacing: '0.04em'
          }}>マッチしなかったけど お互いが気になったお店</div>
          <RestaurantRow variant={variant} {...PICKS[1]} photoHue={PICKS[1].hue}/>
        </div>

        <div style={{
          padding: '12px 20px 22px',
          background: isPop
            ? 'linear-gradient(180deg, rgba(255,248,240,0) 0%, #FFF8F0 40%)'
            : 'linear-gradient(180deg, rgba(250,246,240,0) 0%, #FAF6F0 40%)',
        }}>
          <button className={`btn btn-primary${isPop ? '' : ' is-accent'}`} style={{ width: '100%' }}>
            <span style={{ fontSize: 16 }}>📤</span>
            <span>結果を共有</span>
          </button>
        </div>
      </div>
    </Phone>
  );
}

// ---------- SCREEN 8B ----------
function ScreenMatchB({ variant }) {
  const isPop = variant === 'pop';
  return (
    <Phone variant={variant} screenLabel="08B マッチなし">
      <div className="screen-body" style={{ overflow: 'hidden' }}>
        <div style={{
          padding: '12px 24px 18px',
          textAlign: 'center',
          background: isPop ? '#FFEFDB' : 'transparent',
          borderBottom: isPop ? 'none' : '1px solid #EFE7DC'
        }}>
          <Mascot pose="nope" size={100}/>
          <div className="h1" style={{ fontSize: isPop ? 19 : 18, marginTop: 4, lineHeight: 1.3 }}>
            マッチするお店が<br/>見つからなかったまろ…
          </div>
          <div style={{ fontSize: 12, color: 'var(--brown-soft)', fontWeight: 500, marginTop: 8, lineHeight: 1.5 }}>
            でも、お互いが気になったお店は<br/>こちらまろ！
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'hidden', padding: '14px 20px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <RestaurantRow variant={variant} {...PICKS[1]} photoHue={PICKS[1].hue}/>
          <RestaurantRow variant={variant} {...PICKS[3]} photoHue={PICKS[3].hue}/>
          <RestaurantRow variant={variant} {...PICKS[4]} photoHue={PICKS[4].hue}/>
        </div>

        <div style={{
          padding: '8px 20px 22px',
          background: isPop
            ? 'linear-gradient(180deg, rgba(255,248,240,0) 0%, #FFF8F0 40%)'
            : 'linear-gradient(180deg, rgba(250,246,240,0) 0%, #FAF6F0 40%)',
        }}>
          <div style={{
            margin: '0 0 10px',
            background: '#fff',
            border: '1.5px dashed #FFC59A',
            borderRadius: 12,
            padding: '10px 12px',
            fontSize: 12,
            color: 'var(--brown-soft)',
            fontWeight: 600,
            textAlign: 'center',
            lineHeight: 1.4
          }}>
            💬 LINEで話し合って決めようまろ！
          </div>
          <button className={`btn btn-primary${isPop ? '' : ' is-accent'}`} style={{ width: '100%' }}>
            <span style={{ fontSize: 16 }}>📤</span>
            <span>結果を共有</span>
          </button>
        </div>
      </div>
    </Phone>
  );
}

// ---------- SCREEN 8C ----------
function ScreenMatchC({ variant }) {
  const isPop = variant === 'pop';
  return (
    <Phone variant={variant} screenLabel="08C マッチ未発見">
      <div className="screen-body" style={{ overflow: 'hidden' }}>
        {/* faded swipe context behind */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.25, filter: 'blur(2px)',
          background: isPop ? 'var(--cream)' : '#FAF6F0'
        }}/>
        <div style={{ flex: 1 }}/>

        {/* modal card */}
        <div style={{
          margin: '0 24px',
          background: '#fff',
          borderRadius: isPop ? 28 : 20,
          boxShadow: '0 24px 48px rgba(61,43,31,0.2)',
          padding: '24px 22px 22px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{ marginTop: -70 }}>
            <Mascot pose="thinking" size={120}/>
          </div>
          <div className="h1" style={{ fontSize: isPop ? 20 : 19, marginTop: 4, lineHeight: 1.3 }}>
            まだマッチが見つからないまろ！
          </div>
          <div style={{ fontSize: 12, color: 'var(--brown-soft)', fontWeight: 500, marginTop: 8, lineHeight: 1.55 }}>
            15枚スワイプしたけど、ふたりの<br/>YESが重なるお店がまだ無いまろ。<br/>続けるか、結果を見るか選んでね。
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
            <button className={`btn btn-primary${isPop ? '' : ' is-accent'}`} style={{ width: '100%' }}>
              <span>もう少し続ける</span>
            </button>
            <button style={{
              width: '100%',
              padding: '13px 20px',
              border: isPop ? '2px solid var(--gray)' : '1.5px solid var(--gray)',
              background: '#fff',
              color: 'var(--brown)',
              borderRadius: isPop ? 999 : 16,
              fontFamily: 'inherit',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer'
            }}>
              気になったお店だけ見る
            </button>
          </div>
        </div>
        <div style={{ flex: 1 }}/>
      </div>
    </Phone>
  );
}

Object.assign(window, {
  PICKS, ResultHeader, RestaurantRow,
  ScreenResultSingle, ScreenMatchA, ScreenMatchB, ScreenMatchC
});
