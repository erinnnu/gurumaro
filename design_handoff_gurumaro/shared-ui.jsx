// ============================================================
// shared-ui.jsx — Phone frame, status bar, mascot helper, etc.
// ============================================================

const MASCOT = {
  base:     'img/mascot_base.png',
  like:     'img/mascot_like.png',
  nope:     'img/mascot_nope.png',
  match:    'img/mascot_match.png',
  thinking: 'img/mascot_thinking.png',
};

function Mascot({ pose = 'base', size = 120, style }) {
  return (
    <img
      src={MASCOT[pose]}
      alt={`ぐるまろくん（${pose}）`}
      className="mascot"
      style={{ width: size, height: size * (512/465), objectFit: 'contain', ...(style||{}) }}
    />
  );
}

function StatusBar({ time = '21:24', dark = false }) {
  const color = dark ? '#fff' : 'var(--brown)';
  return (
    <div className="statusbar" style={{ color }}>
      <span>{time}</span>
      <div className="icons">
        {/* signal */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill={color}>
          <rect x="0" y="7" width="3" height="4" rx="1"/>
          <rect x="4.5" y="5" width="3" height="6" rx="1"/>
          <rect x="9" y="2.5" width="3" height="8.5" rx="1"/>
          <rect x="13.5" y="0" width="3" height="11" rx="1"/>
        </svg>
        {/* wifi */}
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <path d="M7.5 8.5l1.7 1.7-1.7 1.7-1.7-1.7z" fill={color}/>
          <path d="M3 5.5a6 6 0 019 0" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <path d="M0.5 3a9.5 9.5 0 0114 0" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </svg>
        {/* battery */}
        <svg width="24" height="11" viewBox="0 0 24 11" fill="none">
          <rect x="0.5" y="0.5" width="20" height="10" rx="2.5" stroke={color} strokeOpacity="0.5"/>
          <rect x="2" y="2" width="14" height="7" rx="1.5" fill={color}/>
          <rect x="21" y="3.5" width="1.5" height="4" rx="0.75" fill={color} fillOpacity="0.5"/>
        </svg>
      </div>
    </div>
  );
}

function Phone({ variant, children, dark = false, label, screenLabel }) {
  return (
    <div
      className={`phone v-${variant}`}
      data-screen-label={screenLabel}
    >
      <StatusBar dark={dark} />
      {children}
      <div className="home-bar" />
    </div>
  );
}

function ProgressBar({ step, total, variant }) {
  const pct = (step / total) * 100;
  if (variant === 'refined') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1, height: 3, background: '#E8DECF', borderRadius: 99 }}>
          <div style={{ width: `${pct}%`, height: '100%', background: 'var(--brown)', borderRadius: 99 }}/>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--brown-soft)', letterSpacing: '0.06em' }}>
          STEP {step}/{total}
        </span>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div className="progress-track" style={{ flex: 1 }}>
        <i style={{ width: `${pct}%` }}/>
      </div>
      <span style={{
        fontSize: 12, fontWeight: 800, color: 'var(--orange-deep)',
        background: '#FFE3D1', padding: '4px 10px', borderRadius: 99
      }}>
        {step}/{total}
      </span>
    </div>
  );
}

// little decorative sparkle for pop variant
function Sparkle({ size = 16, color = '#FFD93D', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <path d="M12 2l2.6 6.4L21 11l-6.4 2.6L12 20l-2.6-6.4L3 11l6.4-2.6z" fill={color}/>
    </svg>
  );
}

function Heart({ size = 16, color = '#FF6B9A', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <path d="M12 21s-7-4.5-9.3-9.2C1.1 8.4 3 4.5 6.6 4.5c2 0 3.5 1.2 5.4 3.5 1.9-2.3 3.4-3.5 5.4-3.5 3.6 0 5.5 3.9 3.9 7.3C19 16.5 12 21 12 21z" fill={color}/>
    </svg>
  );
}

function PRTag({ variant }) {
  return (
    <span style={{
      fontSize: 9,
      fontWeight: 700,
      padding: '2px 6px',
      borderRadius: 4,
      background: variant === 'refined' ? '#F0E8DA' : '#FFE3D1',
      color: variant === 'refined' ? 'var(--brown-mute)' : 'var(--orange-deep)',
      letterSpacing: '0.08em'
    }}>PR</span>
  );
}

// stripe placeholder for restaurant photos
function PhotoSlot({ height = 220, label = 'photo', hue = 18, variant }) {
  const bg = variant === 'refined'
    ? `linear-gradient(135deg, oklch(0.88 0.04 ${hue}), oklch(0.78 0.06 ${hue}))`
    : `linear-gradient(135deg, oklch(0.85 0.10 ${hue}), oklch(0.70 0.13 ${hue}))`;
  return (
    <div style={{
      width: '100%', height, background: bg,
      position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'flex-end', padding: 12
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.0) 0px, rgba(255,255,255,0.0) 10px, rgba(255,255,255,0.10) 10px, rgba(255,255,255,0.10) 11px)'
      }}/>
      <span style={{
        fontFamily: 'ui-monospace, Menlo, monospace',
        fontSize: 10, color: 'rgba(255,255,255,0.85)',
        background: 'rgba(0,0,0,0.18)', padding: '3px 8px', borderRadius: 4,
        position: 'relative'
      }}>{label}</span>
    </div>
  );
}

Object.assign(window, {
  MASCOT, Mascot, StatusBar, Phone, ProgressBar, Sparkle, Heart, PRTag, PhotoSlot
});
