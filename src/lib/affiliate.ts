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

/** 食べログ MyLink（店名で検索ページへ） */
export function buildTabelogUrl(name: string): string {
  const target = `https://tabelog.com/rstLst/?vs=1&sw=${encodeURIComponent(name)}`
  return vcLink(TABELOG_PID, target)
}

/** 一休 MyLink（店名で検索ページへ） */
export function buildIkyuUrl(name: string): string {
  const target = `https://restaurant.ikyu.com/search/?keyword=${encodeURIComponent(name)}`
  return vcLink(IKYU_PID, target)
}

/** トラッキングピクセル URL（3サービス分） */
export const VC_PIXELS = {
  hotpepper: vcPixel(HP_PID),
  tabelog:   vcPixel(TABELOG_PID),
  ikyu:      vcPixel(IKYU_PID),
} as const
