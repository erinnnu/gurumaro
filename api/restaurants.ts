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

// Cuisine name → Hot Pepper genre code
const CUISINE_TO_GENRE: Record<string, string> = {
  'イタリアン': 'G006',
  'フレンチ':   'G006',
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

  // Build keyword from areas + situation hints
  const keywords: string[] = [
    ...areas,
    ...situations.flatMap((s: string) => (SITUATION_KEYWORDS[s] ?? '').split(' ')).filter(Boolean),
  ]

  // Pick first matching genre code, or leave empty for broader search
  const genreCodes = [...new Set(
    (cuisines as string[]).map((c) => CUISINE_TO_GENRE[c]).filter(Boolean)
  )]
  const genreParam = genreCodes[0] ?? ''

  const budgetCode = (budgets as string[]).length ? (BUDGET_TO_CODE[(budgets as string[])[0]] ?? '') : ''
  const isLunch = mealtime === 'ランチ'

  const buildParams = (withBudget: boolean, withLunch: boolean) => new URLSearchParams({
    key: API_KEY,
    format: 'json',
    count: '15',
    large_area: largeArea,
    ...(genreParam ? { genre: genreParam } : {}),
    ...(keywords.length ? { keyword: keywords.join(' ') } : {}),
    ...(withBudget && budgetCode ? { budget: budgetCode } : {}),
    ...(withLunch && isLunch ? { lunch: '1' } : {}),
  })

  const tryFetch = async (params: URLSearchParams) => {
    const apiRes = await fetch(`${BASE_URL}?${params.toString()}`)
    if (!apiRes.ok) throw new Error(`Hot Pepper API error: ${apiRes.status}`)
    const data = await apiRes.json()
    return (data?.results?.shop ?? []) as Record<string, unknown>[]
  }

  try {
    // 段階的に条件を緩めながら検索
    let shops = await tryFetch(buildParams(true, true))
    if (shops.length === 0 && budgetCode) {
      shops = await tryFetch(buildParams(false, true))
    }
    if (shops.length === 0 && isLunch) {
      shops = await tryFetch(buildParams(false, false))
    }

    const restaurants = shops.map((shop: Record<string, unknown>) => {
      const photo = shop.photo as Record<string, Record<string, string>> | undefined
      const genre = shop.genre as { name?: string } | undefined
      const budget = shop.budget as { average?: string } | undefined
      const urls = shop.urls as { pc?: string } | undefined
      const smallArea = shop.small_area as { name?: string } | undefined
      const middleArea = shop.middle_area as { name?: string } | undefined

      return {
        id: shop.id as string,
        name: shop.name as string,
        genre: genre?.name ?? '',
        area: smallArea?.name ?? middleArea?.name ?? '',
        budget: budget?.average ? `¥${budget.average}` : '要確認',
        desc: (shop.catch as string) ?? (shop.access as string) ?? '',
        photo: photo?.mobile?.l ?? photo?.pc?.l ?? '',
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
