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

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 24 }}>
    <div style={{
      fontFamily: 'M PLUS Rounded 1c, sans-serif',
      fontWeight: 900, fontSize: 14, color: 'var(--brown)',
      marginBottom: 8, paddingLeft: 10,
      borderLeft: '3px solid var(--orange)',
    }}>
      {title}
    </div>
    <div style={{ fontSize: 12, color: 'var(--brown-soft)', lineHeight: 1.8, fontWeight: 500 }}>
      {children}
    </div>
  </div>
)

const DataRow = ({ label, value }: { label: string; value: string }) => (
  <div style={{
    display: 'flex', gap: 8, padding: '7px 0',
    borderBottom: '1px solid #EFE7DC', fontSize: 12,
  }}>
    <span style={{ color: 'var(--brown-mute)', fontWeight: 700, flexShrink: 0, minWidth: 120 }}>{label}</span>
    <span style={{ color: 'var(--brown-soft)', fontWeight: 500, lineHeight: 1.6 }}>{value}</span>
  </div>
)

export function ScreenPrivacy() {
  const today = '2025年1月1日'

  return (
    <div className="screen" style={{ background: 'var(--cream)' }}>
      <StaticHeader title="プライバシーポリシー" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 40px' }}>
        <p style={{ fontSize: 11, color: 'var(--brown-mute)', marginBottom: 24, lineHeight: 1.6 }}>
          ぐるまろ！（以下「本サービス」）は、利用者のプライバシーを尊重します。本ポリシーでは、本サービスにおける情報の取り扱いについて説明します。
        </p>

        <Section title="取得する情報">
          本サービスでは、個人を特定できる情報（氏名・メールアドレス・住所等）は一切取得しません。<br /><br />
          取得するデータは以下のとおりです：
          <div style={{ marginTop: 10, background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #EFE7DC' }}>
            <DataRow label="年代" value="任意入力。統計目的のみ。省略可能" />
            <DataRow label="性別" value="任意入力。統計目的のみ。省略可能" />
            <DataRow label="スワイプ結果" value="YES/NOの選択結果（マッチング計算に使用）" />
            <DataRow label="予約リンクのクリック" value="アフィリエイト計測のため、バリューコマース社のシステムで集計" />
          </div>
        </Section>

        <Section title="利用目的">
          取得した情報は以下の目的に使用します。<br />
          • サービスの機能提供（マッチング計算）<br />
          • サービス改善・統計分析<br />
          • アフィリエイト広告の効果測定
        </Section>

        <Section title="Cookieおよびトラッキング">
          本サービスでは以下のCookieを使用します。<br /><br />
          <strong style={{ color: 'var(--brown)' }}>バリューコマース</strong><br />
          予約リンクのクリック計測のため、バリューコマース株式会社のアフィリエイトCookieを使用します。詳細は<a href="https://www.valuecommerce.ne.jp/privacy.html" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--orange)' }}>バリューコマース プライバシーポリシー</a>をご確認ください。<br /><br />
          <strong style={{ color: 'var(--brown)' }}>Google Analytics（将来的に導入予定）</strong><br />
          サービス利用状況を把握するためGoogle Analyticsを導入する場合があります。Google Analyticsが収集するデータは、<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--orange)' }}>Googleプライバシーポリシー</a>に基づき管理されます。
        </Section>

        <Section title="第三者提供">
          取得した情報を、法令に基づく場合を除き、第三者に提供・販売・賃貸することはありません。
        </Section>

        <Section title="情報の保存">
          スワイプ結果はマッチング計算のためSupabase（米国）のサーバーに一時保存されます。個人を特定できる情報は含まれません。
        </Section>

        <Section title="お問い合わせ">
          プライバシーに関するご質問は、本サービスのSNS等よりお問い合わせください。
        </Section>

        <p style={{ fontSize: 11, color: 'var(--brown-mute)', marginTop: 32, textAlign: 'right' }}>
          制定日：{today}
        </p>
      </div>
    </div>
  )
}
