import { Mascot } from '../components/Mascot'

export function ScreenLoading() {
  return (
    <div
      className="screen"
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: 'var(--cream)',
        gap: 0,
      }}
    >
      <div style={{ flex: 1 }} />

      <div style={{ position: 'relative' }}>
        <Mascot pose="base" size={180} />
        <div style={{
          position: 'absolute',
          inset: -16,
          border: '4px dashed var(--orange-soft)',
          borderRadius: '50%',
          borderTopColor: 'var(--orange)',
          animation: 'gurumaro-spin 2.4s linear infinite',
        }} />
      </div>

      <div style={{
        fontFamily: 'M PLUS Rounded 1c, sans-serif',
        fontWeight: 900,
        fontSize: 20,
        marginTop: 36,
        textAlign: 'center',
        lineHeight: 1.3,
        color: 'var(--brown)',
      }}>
        お店を探しているまろ…
      </div>
      <div style={{ fontSize: 12, color: 'var(--brown-mute)', fontWeight: 500, marginTop: 8, textAlign: 'center' }}>
        ぴったりのお店を集めてくるね
      </div>

      <div style={{ display: 'flex', gap: 6, marginTop: 18 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: i < 2 ? 'var(--orange)' : '#FFD7B8',
              display: 'block',
            }}
          />
        ))}
      </div>

      <div style={{ flex: 1 }} />
    </div>
  )
}
