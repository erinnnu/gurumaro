// ============================================================
// screens-swipe.jsx — Screen 6 (main swipe) — YES / NO reaction states
// ============================================================

function RestaurantCard({ variant, photo, name, genre, area, budget, desc, tilt = 0, badge, photoHue = 18 }) {
  const isPop = variant === 'pop';
  return (
    <div
      className="card"
      style={{
        width: '100%',
        overflow: 'hidden',
        transform: `rotate(${tilt}deg)`,
        position: 'relative'
      }}
    >
      <PhotoSlot height={300} label={photo} hue={photoHue} variant={variant}/>
      {badge}
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{
          fontFamily: isPop ? 'M PLUS Rounded 1c, sans-serif' : 'Zen Maru Gothic, sans-serif',
          fontWeight: isPop ? 800 : 700,
          fontSize: 18,
          color: 'var(--brown)',
          lineHeight: 1.2,
          marginBottom: 6
        }}>{name}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--orange-deep)', background: '#FFE3D1', padding: '3px 8px', borderRadius: 99 }}>{genre}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--brown-soft)', background: '#F2EBDE', padding: '3px 8px', borderRadius: 99 }}>{area}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--brown-soft)', background: '#F2EBDE', padding: '3px 8px', borderRadius: 99 }}>{budget}</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--brown-soft)', lineHeight: 1.55, fontWeight: 500 }}>{desc}</div>
      </div>
    </div>
  );
}

// ---------- SCREEN 6 (parametrized by reaction = 'yes' | 'no') ----------
function ScreenSwipe({ variant, reaction = 'yes' }) {
  const isPop = variant === 'pop';
  const isYes = reaction === 'yes';

  // Per-reaction visuals
  const tilt = isYes ? 6 : -7;
  const stampColor = isYes ? '#FF6B9A' : '#7B8AA0';
  const stampBg = isYes ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.95)';
  const stampLabel = isYes ? 'YES ❤' : 'NOPE';
  const stampRotate = isYes ? '-12deg' : '14deg';
  const stampSide = isYes ? { top: 18, left: 16 } : { top: 18, right: 16 };
  const bubbleColor = isYes ? '#FF6B9A' : '#7B8AA0';
  const bubbleText = isYes ? '行きたいまろ〜！' : 'うーん、ちがうまろ…';
  const mascotPose = isYes ? 'like' : 'nope';
  const mascotSide = isYes ? { right: 8 } : { left: 8 };

  return (
    <Phone variant={variant} screenLabel={`06 スワイプ（${isYes ? 'YES' : 'NO'}）`}>
      <div className="screen-body" style={{ overflow: 'hidden' }}>
        {/* top bar: brand + counter */}
        <div style={{
          padding: '4px 24px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            fontFamily: isPop ? 'M PLUS Rounded 1c, sans-serif' : 'Zen Maru Gothic, sans-serif',
            fontWeight: 800,
            fontSize: 18,
            color: isPop ? 'var(--orange)' : 'var(--brown)'
          }}>
            ぐるまろ<span style={{ color: isPop ? 'var(--yellow)' : 'var(--orange)' }}>！</span>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 12px',
            borderRadius: 99,
            background: isPop ? '#FFE3D1' : '#F2EBDE',
            fontSize: 12, fontWeight: 800,
            color: isPop ? 'var(--orange-deep)' : 'var(--brown)'
          }}>
            <span style={{ fontSize: 11 }}>📍</span>
            <span>あと10枚</span>
          </div>
        </div>

        {/* card stack */}
        <div style={{ flex: 1, position: 'relative', padding: '0 24px' }}>
          {/* peek behind */}
          <div style={{
            position: 'absolute',
            left: 36, right: 36, top: 14,
            height: '88%',
            background: '#fff',
            borderRadius: isPop ? 24 : 18,
            border: isPop ? 'none' : '1px solid #EFE7DC',
            boxShadow: isPop ? '0 4px 0 rgba(61,43,31,0.08)' : 'none',
            opacity: 0.7,
            transform: 'translateY(0) scale(0.97)'
          }}/>
          {/* peek behind 2 */}
          <div style={{
            position: 'absolute',
            left: 48, right: 48, top: 28,
            height: '85%',
            background: '#fff',
            borderRadius: isPop ? 24 : 18,
            border: isPop ? 'none' : '1px solid #EFE7DC',
            opacity: 0.4,
            transform: 'scale(0.94)'
          }}/>
          {/* foreground card */}
          <div style={{ position: 'relative', paddingTop: 4 }}>
            <RestaurantCard
              variant={variant}
              photo="restaurant hero photo"
              name="炭火焼鳥 ぐるり"
              genre="居酒屋・焼鳥"
              area="恵比寿"
              budget="¥3,500〜"
              desc="路地裏にある隠れ家。備長炭で焼く比内地鶏と、季節の日本酒が自慢のカウンター9席のお店。"
              tilt={tilt}
              photoHue={28}
              badge={(
                <div style={{
                  position: 'absolute',
                  ...stampSide,
                  border: `3px solid ${stampColor}`,
                  color: stampColor,
                  background: stampBg,
                  fontFamily: 'M PLUS Rounded 1c, sans-serif',
                  fontWeight: 900,
                  fontSize: 22,
                  padding: '4px 12px',
                  borderRadius: 8,
                  transform: `rotate(${stampRotate})`,
                  letterSpacing: '0.05em'
                }}>
                  {stampLabel}
                </div>
              )}
            />
          </div>

          {/* mascot reaction floating */}
          <div style={{
            position: 'absolute',
            ...mascotSide,
            bottom: 14,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 4
          }}>
            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: '6px 10px 4px',
              boxShadow: '0 6px 14px rgba(61,43,31,0.15)',
              fontSize: 11, fontWeight: 800,
              color: bubbleColor,
              fontFamily: 'M PLUS Rounded 1c, sans-serif',
              whiteSpace: 'nowrap'
            }}>{bubbleText}</div>
            <Mascot pose={mascotPose} size={64}/>
          </div>
        </div>

        {/* action buttons */}
        <div style={{
          padding: '8px 24px 10px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: 36
        }}>
          {/* NO */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <button style={{
              width: 64, height: 64,
              borderRadius: '50%',
              border: 'none',
              background: '#fff',
              boxShadow: '0 4px 0 #E8DECF, 0 8px 18px rgba(61,43,31,0.12)',
              fontSize: 26,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--brown-mute)',
              fontWeight: 700
            }}>
              ✕
            </button>
            <div style={{
              fontSize: 11, color: 'var(--brown-mute)', fontWeight: 700,
              textAlign: 'center', lineHeight: 1.2
            }}>
              違うかな
            </div>
          </div>

          {/* YES */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <button style={{
              width: 72, height: 72,
              borderRadius: '50%',
              border: 'none',
              background: 'linear-gradient(180deg, #FF6B9A, #E84B7E)',
              boxShadow: '0 6px 0 #C73B6A, 0 10px 24px rgba(255,107,154,0.4)',
              fontSize: 30,
              color: '#fff',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              ♥
            </button>
            <div style={{
              fontSize: 12, color: '#E84B7E', fontWeight: 800,
              textAlign: 'center', lineHeight: 1.2
            }}>
              行きたい！
            </div>
          </div>
        </div>

        {/* skip link — now under the action buttons */}
        <div style={{ padding: '4px 0 20px', textAlign: 'center' }}>
          <span style={{
            fontSize: 11, color: 'var(--brown-mute)', fontWeight: 500,
            textDecoration: 'underline', textUnderlineOffset: 3
          }}>スキップして結果を見る</span>
        </div>
      </div>
    </Phone>
  );
}

// Convenience wrappers so DCArtboard can render each state directly
function ScreenSwipeYes(props) { return <ScreenSwipe {...props} reaction="yes"/>; }
function ScreenSwipeNo(props)  { return <ScreenSwipe {...props} reaction="no"/>; }

Object.assign(window, { RestaurantCard, ScreenSwipe, ScreenSwipeYes, ScreenSwipeNo });
