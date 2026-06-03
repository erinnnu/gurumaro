import type { VercelRequest, VercelResponse } from '@vercel/node'

const API_KEY = process.env.HOTPEPPER_API_KEY ?? ''
const BASE_URL = 'https://webservice.recruit.co.jp/hotpepper/gourmet/v1/'

// Prefecture name → Hot Pepper large area code
const PREF_TO_LARGE_AREA: Record<string, string> = {
  '東京都': 'Z011',
  '神奈川県': 'Z012',
  '埼玉県': 'Z013',
  '千葉県': 'Z014',
  '大阪府': 'Z021',
  '兵庫県': 'Z022',
  '京都府': 'Z023',
  '愛知県': 'Z051',
  '福岡県': 'Z061',
}

// Area name → 緯度経度（Hot Pepper lat/lng/range パラメータ用）
const AREA_TO_LATLNG: Record<string, { lat: number; lng: number }> = {
  // 東京
  '渋谷':   { lat: 35.6580, lng: 139.7016 },
  '恵比寿': { lat: 35.6467, lng: 139.7100 },
  '代官山': { lat: 35.6486, lng: 139.7030 },
  '中目黒': { lat: 35.6441, lng: 139.6987 },
  '六本木': { lat: 35.6627, lng: 139.7311 },
  '麻布':   { lat: 35.6543, lng: 139.7375 },
  '広尾':   { lat: 35.6509, lng: 139.7225 },
  '赤坂':   { lat: 35.6726, lng: 139.7371 },
  '青山':   { lat: 35.6654, lng: 139.7195 },
  '原宿':   { lat: 35.6702, lng: 139.7027 },
  '表参道': { lat: 35.6654, lng: 139.7121 },
  '新宿':   { lat: 35.6896, lng: 139.7006 },
  '池袋':   { lat: 35.7295, lng: 139.7109 },
  '銀座':   { lat: 35.6717, lng: 139.7649 },
  '秋葉原': { lat: 35.6984, lng: 139.7731 },
  '上野':   { lat: 35.7141, lng: 139.7774 },
  '品川':   { lat: 35.6284, lng: 139.7387 },
  // 神奈川
  '横浜':   { lat: 35.4437, lng: 139.6380 },
  '川崎':   { lat: 35.5308, lng: 139.7030 },
  // 大阪
  '梅田':   { lat: 34.7024, lng: 135.4959 },
  '難波':   { lat: 34.6628, lng: 135.5013 },
  '心斎橋': { lat: 34.6738, lng: 135.5022 },
  '天王寺': { lat: 34.6468, lng: 135.5140 },
  // 愛知
  '名古屋': { lat: 35.1709, lng: 136.8816 },
  '栄':     { lat: 35.1686, lng: 136.9086 },
  // 福岡
  '博多':   { lat: 33.5902, lng: 130.4207 },
  '天神':   { lat: 33.5917, lng: 130.3987 },
  '中洲':   { lat: 33.5920, lng: 130.4067 },
}

// Cuisine name → Hot Pepper genre code
const CUISINE_TO_GENRE: Record<string, string> = {
  'イタリアン・フレンチ': 'G006',
  '和食':       'G004',
  '中華':       'G007',
  '韓国料理':   'G017',
  'カフェ':     'G014',
  '焼肉':       'G008',
  'その他':     'G015',
}

// Budget label → Hot Pepper budget code
const BUDGET_TO_CODE: Record<string, string> = {
  // ランチ
  'お手軽 (〜¥1,000)':                   'B010',
  'ふつう (¥1,000〜¥1,500)':             'B011',
  'ちょっとこだわり (¥1,500〜¥2,500)':   'B001',
  'プチ贅沢 (¥2,500〜)':                 'B002',
  // ディナー
  'カジュアル (〜¥3,000)':               'B001',
  'ふつう (¥3,000〜¥5,000)':             'B003',
  'ちょっと贅沢 (¥5,000〜¥8,000)':       'B008',
  '特別な日 (¥8,000〜)':                 'B004',
}

// Situation → keyword hints
const SITUATION_KEYWORDS: Record<string, string> = {
  'カジュ飲み':          'バル',
  '楽しく居酒屋':         '居酒屋',
  'ロマンチックなデート': '個室 デート',
  '女子会映え重視':       '女子会',
  '軽くラーメン':         'ラーメン',
  '満腹になりたい！':     '食べ放題',
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  const { cuisines = [], situations = [], prefecture = '東京都', areas = [], mealtime = '', budgets = [] } = req.body ?? {}

  const largeArea = PREF_TO_LARGE_AREA[prefecture] ?? 'Z011'

  // 選ばれたエリアの最初の緯度経度
  const latlng = (areas as string[]).map((a) => AREA_TO_LATLNG[a]).find(Boolean)

  // Pick first matching genre code, or leave empty for broader search
  const genreCodes = [...new Set(
    (cuisines as string[]).map((c) => CUISINE_TO_GENRE[c]).filter(Boolean)
  )]
  const genreParam = genreCodes[0] ?? ''

  const budgetCode = (budgets as string[]).length ? (BUDGET_TO_CODE[(budgets as string[])[0]] ?? '') : ''
  const isLunch = mealtime === 'ランチ'

  const situationKeywords = situations.flatMap(
    (s: string) => (SITUATION_KEYWORDS[s] ?? '').split(' ')
  ).filter(Boolean)

  const buildParams = (
    withBudget: boolean, withLunch: boolean, withKeyword: boolean, withGenre: boolean,
  ) => {
    return new URLSearchParams({
      key: API_KEY,
      format: 'json',
      count: '20',
      ...(latlng
        ? { lat: String(latlng.lat), lng: String(latlng.lng), range: '3' }
        : { large_area: largeArea }),
      ...(withGenre && genreParam ? { genre: genreParam } : {}),
      ...(withKeyword && situationKeywords.length ? { keyword: situationKeywords.join(' ') } : {}),
      ...(withBudget && budgetCode ? { budget: budgetCode } : {}),
      ...(withLunch && isLunch ? { lunch: '1' } : {}),
      order: '4',
    })
  }

  const tryFetch = async (params: URLSearchParams) => {
    const apiRes = await fetch(`${BASE_URL}?${params.toString()}`)
    if (!apiRes.ok) throw new Error(`Hot Pepper API error: ${apiRes.status}`)
    const data = await apiRes.json()
    return (data?.results?.shop ?? []) as Record<string, unknown>[]
  }

  try {
    // 段階的に条件を緩めながら最低8件を目指す
    let shops = await tryFetch(buildParams(true, true, true, true))
    if (shops.length < 8 && budgetCode) {
      shops = await tryFetch(buildParams(false, true, true, true))
    }
    if (shops.length < 8 && isLunch) {
      shops = await tryFetch(buildParams(false, false, true, true))
    }
    if (shops.length < 8 && situationKeywords.length) {
      shops = await tryFetch(buildParams(false, false, false, true))
    }
    // ジャンルは絶対に外さない

    const extractPrice = (avg: string | undefined): string => {
      if (!avg) return ''
      const m = avg.match(/(\d[\d,]*)/)
      return m ? `¥${Number(m[1].replace(/,/g, '')).toLocaleString('ja-JP')}` : ''
    }

    const restaurants = shops.map((shop: Record<string, unknown>) => {
      const photo = shop.photo as Record<string, Record<string, string>> | undefined
      const genre = shop.genre as { name?: string } | undefined
      const budget = shop.budget as { average?: string } | undefined
      const budgetLunch = shop.budget_lunch as { average?: string } | undefined
      const urls = shop.urls as { pc?: string } | undefined
      const smallArea = shop.small_area as { name?: string } | undefined
      const middleArea = shop.middle_area as { name?: string } | undefined

      const dinner = extractPrice(budget?.average)
      const lunch = extractPrice(budgetLunch?.average)
      let budgetStr = '要確認'
      if (lunch && dinner && lunch !== dinner) budgetStr = `ランチ ${lunch} / ディナー ${dinner}`
      else if (dinner) budgetStr = `ディナー ${dinner}`
      else if (lunch) budgetStr = `ランチ ${lunch}`

      return {
        id: shop.id as string,
        name: shop.name as string,
        genre: genre?.name ?? '',
        area: smallArea?.name ?? middleArea?.name ?? '',
        budget: budgetStr,
        desc: (shop.catch as string) ?? '',
        access: (shop.access as string) ?? '',
        photo: photo?.pc?.l ?? photo?.mobile?.l ?? '',
        url: urls?.pc ?? `https://restaurant.hotpepper.jp/strJ${(shop.id as string).replace(/^J/, '')}/`,
      }
    })

    res.setHeader('Cache-Control', 'no-store')
    return res.status(200).json({ restaurants })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return res.status(500).json({ error: msg })
  }
}
