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
 * LINEブラウザからSafariで開く試み（iOS限定）。
 * x-safari-https:// スキームで外部ブラウザが起動する場合がある。
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
