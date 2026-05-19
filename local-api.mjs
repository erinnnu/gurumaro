// ローカル開発用APIサーバー（npm run dev と一緒に使う）
// Hot Pepper APIキーをサーバーサイドで使うためのプロキシ
import http from 'http'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))

// .envを手動で読む（dotenvなしで動くように）
function loadEnv() {
  try {
    const env = readFileSync(join(__dir, '.env'), 'utf-8')
    env.split('\n').forEach(line => {
      const [k, ...v] = line.split('=')
      if (k && v.length && !k.startsWith('#')) {
        process.env[k.trim()] = v.join('=').trim()
      }
    })
  } catch { /* .envなし */ }
}
loadEnv()

const API_KEY = process.env.HOTPEPPER_API_KEY ?? ''
const BASE_URL = 'https://webservice.recruit.co.jp/hotpepper/gourmet/v1/'
const PORT = 3001

const PREF_TO_LARGE_AREA = {
  '東京都': 'Z011', '神奈川県': 'Z012', '埼玉県': 'Z013', '千葉県': 'Z014',
  '大阪府': 'Z021', '兵庫県': 'Z022', '京都府': 'Z023',
  '愛知県': 'Z051', '福岡県': 'Z061',
}

const CUISINE_TO_GENRE = {
  'イタリアン': 'G006', 'フレンチ': 'G006', '和食': 'G004',
  '中華': 'G007', '韓国料理': 'G017', 'カフェ': 'G014',
  '焼肉': 'G008', 'その他': 'G015',
}

const SITUATION_KEYWORDS = {
  'カジュ飲み': 'バル', '楽しく居酒屋': '居酒屋',
  'ロマンチックなデート': '個室 デート', '女子会映え重視': '女子会',
  '軽くラーメン': 'ラーメン', '満腹になりたい！': '食べ放題',
}

const BUDGET_TO_CODE = {
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

const server = http.createServer(async (req, res) => {
  // CORS headers for Vite dev server
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }
  if (req.method !== 'POST' || req.url !== '/api/restaurants') {
    res.writeHead(404); res.end('Not found'); return
  }

  let body = ''
  req.on('data', chunk => body += chunk)
  req.on('end', async () => {
    try {
      const { cuisines = [], situations = [], prefecture = '東京都', areas = [], mealtime = '', budgets = [] } = JSON.parse(body || '{}')
      const largeArea = PREF_TO_LARGE_AREA[prefecture] ?? 'Z011'
      const keywords = [
        ...areas,
        ...situations.flatMap(s => (SITUATION_KEYWORDS[s] ?? '').split(' ')).filter(Boolean),
      ]
      const genreCodes = [...new Set(cuisines.map(c => CUISINE_TO_GENRE[c]).filter(Boolean))]
      const genreParam = genreCodes[0] ?? ''

      const budgetCode = budgets.length ? (BUDGET_TO_CODE[budgets[0]] ?? '') : ''
      const isLunch = mealtime === 'ランチ'

      // 段階的に条件を緩めながら検索（厳しすぎるフィルタで0件にならないよう）
      const buildParams = ({ withBudget, withLunch, withKeyword = true, withGenre = true }) => new URLSearchParams({
        key: API_KEY,
        format: 'json',
        count: '8',
        large_area: largeArea,
        ...(withGenre && genreParam ? { genre: genreParam } : {}),
        ...(withKeyword && keywords.length ? { keyword: keywords.join(' ') } : {}),
        ...(withBudget && budgetCode ? { budget: budgetCode } : {}),
        ...(withLunch && isLunch ? { lunch: '1' } : {}),
      })

      const tryFetch = async (params) => {
        const url = `${BASE_URL}?${params}`
        console.log(`[API] Fetching: ${url}`)
        const r = await fetch(url)
        const d = await r.json()
        return d?.results?.shop ?? []
      }

      // 段階的に条件を緩めながら最低8件を目指す
      let shops = await tryFetch(buildParams({ withBudget: true, withLunch: true }))
      console.log(`[API] Full filter: ${shops.length} shops`)

      if (shops.length < 8 && budgetCode) {
        shops = await tryFetch(buildParams({ withBudget: false, withLunch: true }))
        console.log(`[API] Without budget: ${shops.length} shops`)
      }

      if (shops.length < 8 && isLunch) {
        shops = await tryFetch(buildParams({ withBudget: false, withLunch: false }))
        console.log(`[API] Without lunch filter: ${shops.length} shops`)
      }

      if (shops.length < 8 && keywords.length) {
        shops = await tryFetch(buildParams({ withBudget: false, withLunch: false, withKeyword: false }))
        console.log(`[API] Without keyword: ${shops.length} shops`)
      }

      if (shops.length < 8 && genreParam) {
        shops = await tryFetch(buildParams({ withBudget: false, withLunch: false, withKeyword: false, withGenre: false }))
        console.log(`[API] Without genre: ${shops.length} shops`)
      }

      const restaurants = shops.map(shop => ({
        id: shop.id,
        name: shop.name,
        genre: shop.genre?.name ?? '',
        area: shop.small_area?.name ?? shop.middle_area?.name ?? '',
        budget: shop.budget?.average ? `¥${shop.budget.average}` : '要確認',
        desc: shop.catch ?? '',
        access: shop.access ?? '',
        photo: shop.photo?.pc?.l ?? shop.photo?.mobile?.l ?? '',
        url: shop.urls?.pc ?? '',
      }))

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ restaurants }))
    } catch (e) {
      console.error('[API] Error:', e.message)
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: e.message }))
    }
  })
})

server.listen(PORT, () => {
  console.log(`\n[ぐるまろ！ローカルAPIサーバー] http://localhost:${PORT}`)
  console.log(`HOTPEPPER_API_KEY: ${API_KEY ? API_KEY.slice(0,4) + '...' : '未設定'}`)
})
