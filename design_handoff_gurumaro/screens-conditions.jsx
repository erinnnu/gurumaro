// ============================================================
// screens-conditions.jsx — Screens 2-5 (料理 / シチュエーション / エリア / あなた)
// ============================================================

function ConditionHeader({ variant, step, total, title, sub, mascotPose = 'thinking' }) {
  const isPop = variant === 'pop';
  return (
    <div style={{ padding: '4px 24px 0' }}>
      <ProgressBar step={step} total={total} variant={variant}/>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 22 }}>
        <Mascot pose={mascotPose} size={64}/>
        <div>
          <div className="h1" style={{
            fontSize: isPop ? 24 : 22,
            lineHeight: 1.2,
            marginBottom: 4
          }}>{title}</div>
          {sub && <div style={{
            fontSize: 12,
            color: 'var(--brown-mute)',
            fontWeight: 500
          }}>{sub}</div>}
        </div>
      </div>
    </div>
  );
}

function NextBar({ variant, label = '次へ', enabled = true, sub }) {
  const isPop = variant === 'pop';
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      padding: '16px 24px 32px',
      background: isPop
        ? 'linear-gradient(180deg, rgba(255,248,240,0) 0%, rgba(255,248,240,0.95) 30%, #FFF8F0 100%)'
        : 'linear-gradient(180deg, rgba(250,246,240,0) 0%, rgba(250,246,240,0.95) 30%, #FAF6F0 100%)',
    }}>
      <button
        className={`btn btn-primary${isPop ? '' : ' is-accent'}`}
        style={{ width: '100%', opacity: enabled ? 1 : 0.4 }}
      >
        <span>{label}</span>
        {isPop && <span style={{ fontSize: 16 }}>→</span>}
      </button>
      {sub && <div style={{ textAlign: 'center', marginTop: 10 }}>
        <span style={{ fontSize: 12, color: 'var(--brown-mute)', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 3 }}>{sub}</span>
      </div>}
    </div>
  );
}

// ---------- SCREEN 2 ----------
function ScreenCuisine({ variant }) {
  const items = [
    { label: 'イタリアン', emoji: '🍝', on: true },
    { label: 'フレンチ',   emoji: '🥐' },
    { label: '和食',       emoji: '🍣', on: true },
    { label: '中華',       emoji: '🥟' },
    { label: '韓国料理',   emoji: '🌶' },
    { label: 'カフェ',     emoji: '☕' },
    { label: '焼肉',       emoji: '🥩', on: true },
    { label: 'その他',     emoji: '✨' },
  ];
  return (
    <Phone variant={variant} screenLabel="02 料理">
      <div className="screen-body">
        <ConditionHeader
          variant={variant}
          step={1} total={4}
          title="何系の気分？"
          sub="気になるジャンルを選んでね（複数OK）"
        />
        <div style={{
          marginTop: 22, padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10
        }}>
          {items.map((it,i) => (
            <button key={i} className={`chip${it.on ? ' is-on' : ''}`} style={{ justifyContent: 'flex-start', width: '100%' }}>
              <span style={{ fontSize: 18 }}>{it.emoji}</span>
              <span>{it.label}</span>
            </button>
          ))}
        </div>
        <NextBar variant={variant}/>
      </div>
    </Phone>
  );
}

// ---------- SCREEN 3 ----------
function ScreenSituation({ variant }) {
  const items = [
    { label: 'カジュ飲み',          emoji: '🍷' },
    { label: '楽しく居酒屋',         emoji: '🍻', on: true },
    { label: 'ロマンチックなデート', emoji: '🌹' },
    { label: '女子会映え重視',       emoji: '📷' },
    { label: '軽くラーメン',         emoji: '🍜' },
    { label: '満腹になりたい！',     emoji: '🍖', on: true },
  ];
  return (
    <Phone variant={variant} screenLabel="03 シチュ">
      <div className="screen-body">
        <ConditionHeader
          variant={variant}
          step={2} total={4}
          title="どんなシチュエーション？"
          sub="今日の気分にぴったりなのを"
        />
        <div style={{ marginTop: 22, padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((it,i) => (
            <button key={i} className={`chip${it.on ? ' is-on' : ''}`} style={{ justifyContent: 'flex-start', width: '100%', padding: variant === 'pop' ? '14px 18px' : '13px 16px', fontSize: 15 }}>
              <span style={{ fontSize: 20, marginRight: 4 }}>{it.emoji}</span>
              <span>{it.label}</span>
            </button>
          ))}
        </div>
        <NextBar variant={variant}/>
      </div>
    </Phone>
  );
}

// ---------- SCREEN 4 ----------
function ScreenArea({ variant }) {
  const isPop = variant === 'pop';
  const areas = [
    { label: '渋谷',    on: true },
    { label: '恵比寿',  on: true },
    { label: '代官山' },
    { label: '中目黒' },
    { label: '六本木' },
    { label: '麻布' },
    { label: '広尾' },
    { label: '原宿' },
    { label: '青山' },
  ];
  return (
    <Phone variant={variant} screenLabel="04 エリア">
      <div className="screen-body">
        <ConditionHeader
          variant={variant}
          step={3} total={4}
          title="どこで食べる？"
          sub="都道府県とエリアを選んでね"
        />
        <div style={{ padding: '22px 24px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* prefecture dropdown */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brown-mute)', marginBottom: 6, letterSpacing: '0.04em' }}>
              都道府県
            </div>
            <button style={{
              width: '100%',
              border: isPop ? '2px solid var(--gray)' : '1.5px solid var(--gray)',
              background: '#fff',
              borderRadius: isPop ? 16 : 12,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: 'inherit',
              fontWeight: 700,
              fontSize: 15,
              color: 'var(--brown)',
            }}>
              <span>東京都</span>
              <span style={{ color: 'var(--brown-mute)', fontSize: 12 }}>▼</span>
            </button>
          </div>

          {/* areas */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brown-mute)', marginBottom: 8, letterSpacing: '0.04em' }}>
              エリア（複数OK）
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {areas.map((a,i) => (
                <button key={i} className={`chip${a.on ? ' is-on' : ''}`} style={{ fontSize: 13, padding: isPop ? '9px 14px' : '8px 12px' }}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <NextBar variant={variant}/>
      </div>
    </Phone>
  );
}

// ---------- SCREEN 5 ----------
function ScreenAboutYou({ variant }) {
  const isPop = variant === 'pop';
  const ages = ['10代', '20代', '30代', '40代', '50代〜'];
  const genders = ['男性', '女性', 'その他', '答えない'];
  return (
    <Phone variant={variant} screenLabel="05 あなた">
      <div className="screen-body">
        <ConditionHeader
          variant={variant}
          step={4} total={4}
          title="教えてね（スキップOK！）"
          sub="統計のためだけに、ちょっとだけ教えてまろ"
          mascotPose="base"
        />
        <div style={{ padding: '22px 24px 0', display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--brown)', marginBottom: 10 }}>年代</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ages.map((a, i) => (
                <button key={i} className={`chip${i === 1 ? ' is-on' : ''}`} style={{ fontSize: 13, padding: isPop ? '10px 14px' : '9px 12px' }}>
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--brown)', marginBottom: 10 }}>性別</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {genders.map((g, i) => (
                <button key={i} className={`chip${i === 1 ? ' is-on' : ''}`} style={{ fontSize: 13, padding: isPop ? '10px 14px' : '9px 12px' }}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div style={{
            fontSize: 10,
            color: 'var(--brown-mute)',
            lineHeight: 1.5,
            background: isPop ? '#FFEFDB' : '#F2EBDE',
            padding: '10px 12px',
            borderRadius: 10,
          }}>
            ※ 統計データとしてのみ利用します。個人を特定する情報は取得しないまろ
          </div>
        </div>
        <NextBar variant={variant} label="スワイプ開始！" sub="スキップしてスワイプ開始"/>
      </div>
    </Phone>
  );
}

Object.assign(window, {
  ConditionHeader, NextBar,
  ScreenCuisine, ScreenSituation, ScreenArea, ScreenAboutYou
});
