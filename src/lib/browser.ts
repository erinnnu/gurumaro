/** LINEや各種SNSのアプリ内ブラウザを検出するユーティリティ */

export type InAppBrowserType = 'line' | 'facebook' | 'instagram' | 'other' | null

export function detectInAppBrowser(): InAppBrowserType {
  if (typeof navigator === 'undefined') return null
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('line/')) return 'line'
  if (ua.includes('fban') || ua.includes('fbav')) return 'facebook'
  if (ua.includes('instagram')) return 'instagram'
  // その他の一般的なWebView
  if (/wv|webview/.test(ua) && ua.includes('android')) return 'other'
  return null
}

export function isIOS(): boolean {
  return /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
}

/**
 * アプリ内ブラウザから外部ブラウザで指定URLを開く。
 * - iOS: x-safari-https:// スキームでSafariが起動（LINE画面はそのまま残る）
 * - Android: window.open(_blank) でデフォルトブラウザが開く
 * 失敗時は通常のリンク遷移にフォールバック。
 */
export function openInExternalBrowser(url: string): void {
  if (isIOS()) {
    // x-safari-https:// はiOSがSafariを起動するURL scheme
    // LINEの画面はそのまま残るので、アプリ側の状態は失われない
    window.location.href = url.replace(/^https?:\/\//, 'x-safari-https://')
  } else {
    // Android: _blank で外部ブラウザが開くことが多い
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

/**
 * 現在のページ全体をSafariで開く試み（iOS限定）。
 */
export function tryOpenInSafari(url: string): boolean {
  if (!isIOS()) return false
  try {
    window.location.href = url.replace(/^https?:\/\//, 'x-safari-https://')
    return true
  } catch {
    return false
  }
}
