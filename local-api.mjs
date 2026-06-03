// ローカル開発用APIサーバー（npm run dev と一緒に使う）
import http from 'http'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))

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

const AREA_TO_LATLNG = {
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
  '横浜':   { lat: 35.4437, lng: 139.6380 },
  '川崎':   { lat: 35.5308, lng: 139.7030 },
  '梅田':   { lat: 34.7024, lng: 135.4959 },
  '難波':   { lat: 34.6628, lng: 135.5013 },
  '心斎橋': { lat: 34.6738, lng: 135.5022 },
  '天王寺': { lat: 34.6468, lng: 135.5140 },
  '名古屋': { lat: 35.1709, lng: 136.8816 },
  '栄':     { lat: 35.1686, lng: 136.9086 },
  '博多':   { lat: 33.5902, lng: 130.4207 },
  '天神':   { lat: 33.5917, lng: 130.3987 },
  '中洲':   { lat: 33.5920, lng: 130.4067 },
}

const CUISINE_TO_GENRE = {
  'イタリアン・フレンチ': 'G006', '和食': 'G004',
  '中華': 'G007', '韓国料理': 'G017', 'カフェ': 'G014',
  '焼肉': 'G008', 'その他': 'G015',
}

const SITUATION_KEYWORDS = {
  'カジュ飲み': 'バル', '楽しく居酒屋': '居酒屋',
  'ロマンチックなデート': '個室 デート', '女子会映え重視': '女子会',
  '軽くラーメン': 'ラーメン', '満腹になりたい！': '食べ放題',
}

const BUDGET_TO_CODE = {
  'お手軽 (〜¥1,000)': 'B010', 'ふつう (¥1,000〜¥1,500)': 'B011',
  'ちょっとこだわり (¥1,500〜¥2,500)': 'B001', 'プチ贅沢 (¥2,500〜)': 'B002',
  'カジュアル (〜¥3,000)': 'B001', 'ふつう (¥3,000〜¥5,000)': 'B003',
  'ちょっと贅沢 (¥5,000〜¥8,000)': 'B008', '特別な日 (¥8,000〜)': 'B004',
}

const server = http.createServer(async (req, res) => {
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
      const latlng = areas.map(a => AREA_TO_LATLNG[a]).find(Boolean)
      const situationKeywords = situations.flatMap(s => (SITUATION_KEYWORDS[s] ?? '').split(' ')).filter(Boolean)

      const genreCodes = [...new Set(cuisines.map(c => CUISINE_TO_GENRE[c]).filter(Boolean))]
      const genreParam = genreCodes[0] ?? ''
      const budgetCode = budgets.length ? (BUDGET_TO_CODE[budgets[0]] ?? '') : ''
      const isLunch = mealtime === 'ランチ'

      const buildParams = ({ withBudget, withLunch, withKeyword = true, withGenre = true }) => {
        return new URLSearchParams({
          key: API_KEY,
          format: 'json',
          count: '20',
          ...(latlng ? { lat: String(latlng.lat), lng: String(latlng.lng), range: '3' } : { large_area: largeArea }),
          ...(withGenre && genreParam ? { genre: genreParam } : {}),
          ...(withKeyword && situationKeywords.length ? { keyword: situationKeywords.join(' ') } : {}),
          ...(withBudget && budgetCode ? { budget: budgetCode } : {}),
          ...(withLunch && isLunch ? { lunch: '1' } : {}),
          order: '4',
        })
      }

      const tryFetch = async (params) => {
        const url = `${BASE_URL}?${params}`
        console.log(`[API] Fetching: ${url}`)
        const r = await fetch(url)
        const d = await r.json()
        return d?.results?.shop ?? []
      }

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
      if (shops.length < 8 && situationKeywords.length) {
        shops = await tryFetch(buildParams({ withBudget: false, withLunch: false, withKeyword: false }))
        console.log(`[API] Without keyword: ${shops.length} shops`)
      }
      // ジャンルは絶対に外さない

      const extractPrice = (avg) => {
        if (!avg) return ''
        const m = avg.match(/(\d[\d,]*)/)
        return m ? `¥${Number(m[1].replace(/,/g, '')).toLocaleString('ja-JP')}` : ''
      }

      const restaurants = shops.map(shop => {
        const dinner = extractPrice(shop.budget?.average)
        const lunch = extractPrice(shop.budget_lunch?.average)
        let budget = '要確認'
        if (lunch && dinner && lunch !== dinner) budget = `ランチ ${lunch} / ディナー ${dinner}`
        else if (dinner) budget = `ディナー ${dinner}`
        else if (lunch) budget = `ランチ ${lunch}`
        return {
          id: shop.id,
          name: shop.name,
          genre: shop.genre?.name ?? '',
          area: shop.small_area?.name ?? shop.middle_area?.name ?? '',
          budget,
          desc: shop.catch ?? '',
          access: shop.access ?? '',
          photo: shop.photo?.pc?.l ?? shop.photo?.mobile?.l ?? '',
          url: shop.urls?.pc ?? '',
        }
      })

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
