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

export function ScreenTerms() {
  const today = '2025年1月1日'

  return (
    <div className="screen" style={{ background: 'var(--cream)' }}>
      <StaticHeader title="利用規約" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 40px' }}>
        <p style={{ fontSize: 11, color: 'var(--brown-mute)', marginBottom: 24, lineHeight: 1.6 }}>
          本利用規約（以下「本規約」）は、ぐるまろ！（以下「本サービス」）の利用条件を定めるものです。本サービスをご利用になる前に、必ずお読みください。
        </p>

        <Section title="第1条（サービスの概要）">
          本サービスは、ホットペッパーグルメWebサービスのAPIを利用したレストラン検索・マッチングサービスです。個人が運営しており、アカウント登録なし・完全無料でご利用いただけます。
        </Section>

        <Section title="第2条（利用料金）">
          本サービスは無料でご利用いただけます。将来的に有料機能を追加する場合は、事前にお知らせします。
        </Section>

        <Section title="第3条（禁止事項）">
          利用者は以下の行為を行ってはなりません。<br />
          • 法令または公序良俗に違反する行為<br />
          • 本サービスのシステムへの不正アクセス・クラッキング<br />
          • 本サービスの運営を妨害するおそれのある行為<br />
          • 他の利用者または第三者に迷惑、不利益を与える行為<br />
          • その他、運営者が不適切と判断する行為
        </Section>

        <Section title="第4条（免責事項）">
          本サービスに掲載されるレストラン情報は、ホットペッパーグルメWebサービスのAPIから取得しており、情報の正確性・完全性・最新性を保証するものではありません。掲載情報を利用したことにより生じた損害について、運営者は一切の責任を負いません。<br /><br />
          また、システムの不具合・停止・中断等によって生じた損害についても、運営者は責任を負いかねます。
        </Section>

        <Section title="第5条（アフィリエイト広告）">
          本サービスには、バリューコマース株式会社が提供するアフィリエイトプログラムを通じた広告リンク（ホットペッパーグルメ・食べログ・一休）が含まれます。これらのリンクを経由して予約・購入が行われた場合、運営者に一定の報酬が発生します。
        </Section>

        <Section title="第6条（サービスの変更・終了）">
          運営者は、利用者への事前通知なく本サービスの内容変更・停止・終了を行う場合があります。
        </Section>

        <Section title="第7条（規約の変更）">
          運営者は必要に応じて本規約を変更することがあります。変更後の規約はサービス内に掲示した時点から効力を生じます。
        </Section>

        <p style={{ fontSize: 11, color: 'var(--brown-mute)', marginTop: 32, textAlign: 'right' }}>
          制定日：{today}
        </p>
      </div>
    </div>
  )
}
