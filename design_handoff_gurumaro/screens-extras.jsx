// ============================================================
// screens-extras.jsx — Loading / Waiting / Error
// ============================================================

// ---------- LOADING ----------
function ScreenLoading({ variant }) {
  const isPop = variant === 'pop';
  return (
    <Phone variant={variant} screenLabel="L1 ローディング">
      <div className="screen-body" style={{ alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        {isPop && (
          <>
            <Sparkle size={20} color="#FFD93D" style={{ position: 'absolute', top: 160, left: 60 }}/>
            <Sparkle size={16} color="#FF9A9E" style={{ position: 'absolute', top: 240, right: 60 }}/>
            <Heart size={14} color="#FF9A9E" style={{ position: 'absolute', top: 340, left: 48, transform: 'rotate(-20deg)' }}/>
          </>
        )}
        <div style={{ flex: 1 }}/>
        <div style={{ position: 'relative' }}>
          <Mascot pose="base" size={180}/>
          {/* spinning ring */}
          <div style={{
            position: 'absolute',
            inset: -16,
            border: '4px dashed var(--orange-soft)',
            borderRadius: '50%',
            borderTopColor: 'var(--orange)',
            animation: 'gurumaroSpin 2.4s linear infinite'
          }}/>
        </div>
        <div className="h1" style={{ fontSize: 20, marginTop: 36, textAlign: 'center', lineHeight: 1.3 }}>
          お店を探しているまろ…
        </div>
        <div style={{ fontSize: 12, color: 'var(--brown-mute)', fontWeight: 500, marginTop: 8, textAlign: 'center' }}>
          ぴったりのお店を集めてくるね
        </div>

        {/* mini progress dots */}
        <div style={{ display: 'flex', gap: 6, marginTop: 18 }}>
          {[0,1,2].map(i => (
            <span key={i} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: i < 2 ? 'var(--orange)' : '#FFD7B8'
            }}/>
          ))}
        </div>
        <div style={{ flex: 1 }}/>
        <style>{`@keyframes gurumaroSpin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </Phone>
  );
}

// ---------- WAITING (after URL shared, partner not done) ----------
function ScreenWaiting({ variant }) {
  const isPop = variant === 'pop';
  return (
    <Phone variant={variant} screenLabel="L2 相手待機">
      <div className="screen-body" style={{ padding: '0 24px' }}>
        {/* top status */}
        <div style={{
          marginTop: 16,
          background: isPop ? '#FFE3D1' : '#F2EBDE',
          borderRadius: 14,
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#19B26B',
            boxShadow: '0 0 0 4px rgba(25,178,107,0.18)'
          }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--brown)' }}>リンクを送信しました</div>
            <div style={{ fontSize: 10, color: 'var(--brown-mute)', fontWeight: 500 }}>21:24・クリップボードにコピー済み</div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', textAlign: 'center' }}>
          <Mascot pose="thinking" size={170}/>
          <div className="h1" style={{ fontSize: 20, marginTop: 12, lineHeight: 1.3 }}>
            相手の選択を待ってるまろ
          </div>
          <div style={{
            fontSize: 12, color: 'var(--brown-soft)', fontWeight: 500,
            marginTop: 8, lineHeight: 1.55
          }}>
            相手がスワイプを終えると、<br/>マッチ結果がこの画面に届くまろ！
          </div>

          {/* you / partner status */}
          <div style={{
            display: 'flex',
            gap: 10,
            marginTop: 22,
            width: '100%'
          }}>
            <div style={{
              flex: 1,
              background: '#fff',
              border: '2px solid var(--orange)',
              borderRadius: 14,
              padding: '12px 10px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brown-mute)' }}>あなた</div>
              <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--orange)', marginTop: 4 }}>✓ 完了</div>
              <div style={{ fontSize: 10, color: 'var(--brown-mute)', marginTop: 2 }}>5軒ピックアップ</div>
            </div>
            <div style={{
              flex: 1,
              background: '#fff',
              border: `2px dashed ${isPop ? 'var(--gray-deep)' : 'var(--gray-deep)'}`,
              borderRadius: 14,
              padding: '12px 10px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brown-mute)' }}>相手</div>
              <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--brown-mute)', marginTop: 4 }}>… スワイプ中</div>
              <div style={{ fontSize: 10, color: 'var(--brown-mute)', marginTop: 2 }}>3 / 約15軒</div>
            </div>
          </div>
        </div>

        <div style={{ paddingBottom: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
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
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}>
            <span style={{ fontSize: 16 }}>🔗</span>
            <span>もう一度リンクをコピー</span>
          </button>
          <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--brown-mute)', fontWeight: 500 }}>
            このページは自動更新されるまろ
          </div>
        </div>
      </div>
    </Phone>
  );
}

// ---------- ERROR ----------
function ScreenError({ variant }) {
  const isPop = variant === 'pop';
  return (
    <Phone variant={variant} screenLabel="L3 エラー">
      <div className="screen-body" style={{ padding: '0 24px', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ flex: 1 }}/>
        <Mascot pose="nope" size={150}/>
        <div className="h1" style={{ fontSize: 20, marginTop: 12, textAlign: 'center', lineHeight: 1.3 }}>
          通信できなかったまろ…
        </div>
        <div style={{
          fontSize: 12, color: 'var(--brown-soft)', fontWeight: 500,
          marginTop: 8, lineHeight: 1.55, textAlign: 'center'
        }}>
          ネットワーク接続を確認して、<br/>もう一度試してみてね。
        </div>

        <div style={{
          width: '100%',
          background: '#fff',
          border: '1px solid #F4D7C5',
          borderLeft: '4px solid var(--orange)',
          borderRadius: 12,
          padding: '12px 14px',
          marginTop: 22,
          fontSize: 11,
          color: 'var(--brown-soft)',
          fontWeight: 500,
          lineHeight: 1.5
        }}>
          <div style={{ fontWeight: 800, color: 'var(--brown)', marginBottom: 4 }}>エラーコード: NET_408</div>
          お店データの取得中にタイムアウトしました。電波の良い場所で再読み込みしてね。
        </div>

        <div style={{ flex: 1 }}/>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 24 }}>
          <button className={`btn btn-primary${isPop ? '' : ' is-accent'}`} style={{ width: '100%' }}>
            <span style={{ fontSize: 16 }}>↻</span>
            <span>もう一度試す</span>
          </button>
          <button style={{
            width: '100%',
            padding: '12px 20px',
            border: 'none',
            background: 'transparent',
            color: 'var(--brown-mute)',
            fontFamily: 'inherit',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
            textDecoration: 'underline',
            textUnderlineOffset: 3
          }}>
            トップへ戻る
          </button>
        </div>
      </div>
    </Phone>
  );
}

Object.assign(window, { ScreenLoading, ScreenWaiting, ScreenError });
