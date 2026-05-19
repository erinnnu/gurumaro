import React from 'react'

function StaticHeader({ title }: { title: string }) {
  return (
    <div style={{
      padding: '14px 20px 12px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      borderBottom: '1px solid #EFE7DC',
      flexShrink: 0,
      background: 'var(--cream)',
    }}>
      <button
        onClick={() => window.location.href = '/'}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 20, color: 'var(--brown-mute)', padding: '0 4px',
          lineHeight: 1, flexShrink: 0,
        }}
        aria-label="戻る"
      >
        ←
      </button>
      <div style={{ fontFamily: 'M PLUS Rounded 1c, sans-serif', fontWeight: 900, fontSize: 17, color: 'var(--brown)' }}>
        {title}
      </div>
    </div>
  )
}

function CreditCard({
  logo,
  name,
  description,
  link,
  linkLabel,
}: {
  logo: string
  name: string
  description: string
  link?: string
  linkLabel?: string
}) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: '16px 16px',
      boxShadow: '0 2px 0 rgba(61,43,31,0.06)',
      display: 'flex',
      gap: 14,
      alignItems: 'flex-start',
    }}>
      <div style={{
        fontSize: 32,
        lineHeight: 1,
        width: 48,
        height: 48,
        borderRadius: 12,
        background: 'var(--cream-deep)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {logo}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'M PLUS Rounded 1c, sans-serif', fontWeight: 900, fontSize: 14, color: 'var(--brown)', marginBottom: 4 }}>
          {name}
        </div>
        <div style={{ fontSize: 11, color: 'var(--brown-soft)', lineHeight: 1.7, fontWeight: 500 }}>
          {description}
        </div>
        {link && linkLabel && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 11, color: 'var(--orange)', fontWeight: 700, marginTop: 6, display: 'inline-block' }}
          >
            {linkLabel} →
          </a>
        )}
      </div>
    </div>
  )
}

export function ScreenCredit() {
  return (
    <div className="screen" style={{ background: 'var(--cream)' }}>
      <StaticHeader title="クレジット" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 40px' }}>

        <div style={{ fontFamily: 'M PLUS Rounded 1c, sans-serif', fontWeight: 900, fontSize: 13, color: 'var(--brown-mute)', marginBottom: 10, letterSpacing: '0.04em' }}>
          データ提供
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          <CreditCard
            logo="🍽"
            name="ホットペッパーグルメ Webサービス"
            description={'レストラン情報はホットペッパーグルメWebサービスのAPIを利用しています。\nPowered by ホットペッパーグルメ Webサービス'}
            link="https://webservice.recruit.co.jp/"
            linkLabel="ホットペッパーグルメ Webサービス"
          />
        </div>

        <div style={{ fontFamily: 'M PLUS Rounded 1c, sans-serif', fontWeight: 900, fontSize: 13, color: 'var(--brown-mute)', marginBottom: 10, letterSpacing: '0.04em' }}>
          アフィリエイト
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          <CreditCard
            logo="💹"
            name="バリューコマース"
            description="予約リンク（ホットペッパーグルメ・食べログ・一休）はバリューコマース株式会社のアフィリエイトプログラムを利用しています。"
            link="https://www.valuecommerce.ne.jp/"
            linkLabel="バリューコマース"
          />
        </div>

        <div style={{ fontFamily: 'M PLUS Rounded 1c, sans-serif', fontWeight: 900, fontSize: 13, color: 'var(--brown-mute)', marginBottom: 10, letterSpacing: '0.04em' }}>
          キャラクター
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          <CreditCard
            logo="🟠"
            name="ぐるまろくん"
            description={'キャラクターデザイン：ぐるまろくん\n© ぐるまろ！ All rights reserved.'}
          />
        </div>

        <div style={{ fontFamily: 'M PLUS Rounded 1c, sans-serif', fontWeight: 900, fontSize: 13, color: 'var(--brown-mute)', marginBottom: 10, letterSpacing: '0.04em' }}>
          フォント
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          <CreditCard
            logo="Aa"
            name="M PLUS Rounded 1c / Zen Maru Gothic"
            description="Google Fontsより使用。SIL Open Font License 1.1に基づきます。"
            link="https://fonts.google.com/"
            linkLabel="Google Fonts"
          />
        </div>

        <div style={{ fontSize: 11, color: 'var(--brown-mute)', textAlign: 'center', marginTop: 12, lineHeight: 1.8 }}>
          ぐるまろ！ — 個人運営サービス<br />
          © 2025 ぐるまろ！
        </div>
      </div>
    </div>
  )
}
