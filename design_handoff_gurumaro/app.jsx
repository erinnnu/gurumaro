// ============================================================
// app.jsx — assemble all 13 screens × 2 variants into design canvas
// ============================================================

const SCREEN_LIST = [
  { id: 'top',       label: '01 · トップ',           Comp: ScreenTop },
  { id: 'cuisine',   label: '02 · 料理',             Comp: ScreenCuisine },
  { id: 'situation', label: '03 · シチュエーション', Comp: ScreenSituation },
  { id: 'area',      label: '04 · エリア',           Comp: ScreenArea },
  { id: 'about',     label: '05 · あなたについて',   Comp: ScreenAboutYou },
  { id: 'swipe',     label: '06 · スワイプ（YES）', Comp: ScreenSwipeYes },
  { id: 'swipe-no',  label: '06 · スワイプ（NO）',  Comp: ScreenSwipeNo },
  { id: 'result',    label: '07 · 結果（1人目）',    Comp: ScreenResultSingle },
  { id: 'match-a',   label: '08A · マッチあり',      Comp: ScreenMatchA },
  { id: 'match-b',   label: '08B · マッチなし',      Comp: ScreenMatchB },
  { id: 'match-c',   label: '08C · 続行確認',        Comp: ScreenMatchC },
  { id: 'loading',   label: 'L1 · ローディング',     Comp: ScreenLoading },
  { id: 'waiting',   label: 'L2 · 相手の待機',       Comp: ScreenWaiting },
  { id: 'error',     label: 'L3 · エラー',           Comp: ScreenError },
];

function VariantSection({ id, title, subtitle, variant }) {
  return (
    <DCSection id={id} title={title} subtitle={subtitle}>
      {SCREEN_LIST.map(s => {
        const Comp = s.Comp;
        return (
          <DCArtboard
            key={s.id}
            id={`${variant}-${s.id}`}
            label={s.label}
            width={375}
            height={812}
          >
            <Comp variant={variant} />
          </DCArtboard>
        );
      })}
    </DCSection>
  );
}

function App() {
  return (
    <DesignCanvas
      title="ぐるまろ！ 画面モックアップ"
      subtitle="13画面 × 2案（ポップ / やや上品）— iPhone 375×812"
    >
      <VariantSection
        id="variant-pop"
        title="A案 — ポップ振り"
        subtitle="彩度高め・キャラ大きめ・賑やか。ターゲットど真ん中の楽しさ重視"
        variant="pop"
      />
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
