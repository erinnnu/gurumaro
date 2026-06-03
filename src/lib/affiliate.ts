const SID = '3770692'
const HP_PID    = '892615042'
const TABELOG_PID = '892615043'
const IKYU_PID  = '892615044'

function vcLink(pid: string, targetUrl: string): string {
  return `//ck.jp.ap.valuecommerce.com/servlet/referral?sid=${SID}&pid=${pid}&vc_url=${encodeURIComponent(targetUrl)}`
}

function vcPixel(pid: string): string {
  return `//ad.jp.ap.valuecommerce.com/servlet/gifbanner?sid=${SID}&pid=${pid}`
}

/** ホットペッパー MyLink（restaurant.url をそのまま渡す） */
export function buildHotpepperUrl(restaurantUrl: string): string {
  if (!restaurantUrl) return ''
  return vcLink(HP_PID, restaurantUrl)
}

/**
 * 食べログ・一休向けに店名から余分な記号を除去する
 * 例: 「【全席喫煙可能】イタめし酒場Viva（ビバ）中野店」→「イタめし酒場Viva 中野店」
 */
function cleanName(name: string): string {
  return name
    .replace(/【[^】]*】/g, '')                    // 【...】を除去
    .replace(/（[^）]*）/g, '')                    // （...）を除去
    .replace(/\([^)]*\)/g, '')                    // (...)を除去
    .replace(/\s*[\u2500-\u257F\-ー]+.*/g, '')    // ダッシュ以降を除去
    .replace(/\s+[^\s]*[店舗號号](\s|$)/g, ' ')   // 「○○店」「○○號」を除去
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * 食べログ MyLink
 * 食べログの検索結果ページに直接遷移する。
 * 店名（クリーニング済み）＋エリアで検索。
 */
export function buildTabelogUrl(name: string, area?: string): string {
  const q = cleanName(name)
  const target = `https://tabelog.com/rstLst/?vs=1&sw=${encodeURIComponent(q)}`
  return vcLink(TABELOG_PID, target)
}

/** 一休 MyLink（店名で検索） */
export function buildIkyuUrl(name: string, area?: string): string {
  const q = cleanName(name)
  const target = `https://restaurant.ikyu.com/search/?keyword=${encodeURIComponent(q)}`
  return vcLink(IKYU_PID, target)
}

/** トラッキングピクセル URL（3サービス分） */
export const VC_PIXELS = {
  hotpepper: vcPixel(HP_PID),
  tabelog:   vcPixel(TABELOG_PID),
  ikyu:      vcPixel(IKYU_PID),
} as const
