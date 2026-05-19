import { create } from 'zustand'
import { Step, Restaurant, SwipeChoice, Filters, Profile, MatchResult } from '../types'
import { supabase, getUserToken, generateToken } from '../lib/supabase'

interface AppState {
  step: Step
  filters: Filters
  profile: Profile
  restaurants: Restaurant[]
  swipes: SwipeChoice[]
  sessionId: string | null
  isPartner: boolean          // true when opened via shared URL (new user)
  partnerDone: boolean        // true when both users have completed
  matchResult: MatchResult | null
  errorMessage: string | null
  toast: string | null

  setStep: (s: Step) => void
  setFilters: (f: Partial<Filters>) => void
  setProfile: (p: Partial<Profile>) => void
  setRestaurants: (r: Restaurant[]) => void
  addSwipe: (s: SwipeChoice) => void
  setToast: (msg: string | null) => void

  // Actions
  initFromUrl: () => void
  fetchRestaurants: () => Promise<void>
  saveSessionAndShare: () => Promise<string | null>
  pollForPartner: () => Promise<void>
  computeMatch: () => Promise<void>
  loadSharedMatch: () => Promise<void>
  loadOwnSessionResult: () => Promise<void>
  checkBothDone: () => Promise<void>
}

const defaultFilters: Filters = {
  cuisines: [],
  situations: [],
  prefecture: '東京都',
  areas: [],
  mealtime: '',
  budgets: [],
}

export const useStore = create<AppState>((set, get) => ({
  step: 'top',
  filters: defaultFilters,
  profile: {},
  restaurants: [],
  swipes: [],
  sessionId: null,
  isPartner: false,
  partnerDone: false,
  matchResult: null,
  errorMessage: null,
  toast: null,

  setStep: (step) => set({ step }),
  setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
  setProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
  setRestaurants: (r) => set({ restaurants: r }),
  addSwipe: (s) => set((state) => ({ swipes: [...state.swipes, s] })),
  setToast: (toast) => set({ toast }),

  // URL初期化：セッションIDを検出し、同一ユーザーか新規ユーザーかを判定
  initFromUrl: () => {
    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get('session')
    const viewMatch = params.get('view') === 'match'

    if (!sessionId) return

    set({ sessionId, step: 'loading' })

    if (viewMatch) {
      // マッチリスト共有URL → 直接マッチ画面へ
      get().loadSharedMatch()
      return
    }

    // 同じcookieかどうかチェック（非同期で実行）
    const userToken = getUserToken()
    ;(async () => {
      try {
        const { data } = await supabase
          .from('session_completion')
          .select('user_token')
          .eq('session_id', sessionId)
        const alreadyDone = data?.some(d => d.user_token === userToken) ?? false
        if (alreadyDone) {
          // 1人目が同じブラウザで再度開いた → 自分のyes一覧を表示
          get().loadOwnSessionResult()
        } else {
          // 2人目（新規ユーザー） → aboutyouから開始
          set({ isPartner: true, step: 'aboutyou' })
        }
      } catch {
        set({ step: 'error', errorMessage: 'セッションの確認に失敗しました' })
      }
    })()
  },

  fetchRestaurants: async () => {
    const state = get()
    set({ step: 'loading', errorMessage: null })

    try {
      if (state.isPartner && state.sessionId) {
        // パートナー：セッションからレストランを読み込む
        const { data, error } = await supabase
          .from('sessions')
          .select('restaurants')
          .eq('id', state.sessionId)
          .single()

        if (error || !data) throw new Error('セッションが見つかりませんでした')

        const restaurants = data.restaurants as Restaurant[]
        set({ restaurants, step: 'swipe' })
      } else {
        // 1人目：Hot Pepper APIからお店を取得
        const res = await fetch('/api/restaurants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state.filters),
        })
        if (!res.ok) throw new Error('お店の取得に失敗しました')
        const { restaurants } = await res.json()
        if (!restaurants || restaurants.length === 0) {
          throw new Error('条件に合うお店が見つかりませんでした。条件を変えてお試しください。')
        }
        set({ restaurants, step: 'swipe' })
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'エラーが発生しました'
      set({ step: 'error', errorMessage: msg })
    }
  },

  saveSessionAndShare: async () => {
    const state = get()
    const userToken = getUserToken()
    const sessionId = state.sessionId ?? generateToken(8)

    try {
      // 1人目のみセッションをupsert
      if (!state.isPartner) {
        await supabase.from('sessions').upsert({
          id: sessionId,
          restaurants: state.restaurants,
          filters: state.filters,
        })
      }

      // スワイプ結果を保存
      const rows = state.swipes.map((s) => ({
        session_id: sessionId,
        user_token: userToken,
        restaurant_id: s.restaurantId,
        choice: s.choice,
        age: state.profile.age ?? null,
        gender: state.profile.gender ?? null,
      }))
      await supabase.from('swipes').upsert(rows)

      // 完了マーク
      await supabase.from('session_completion').upsert({
        session_id: sessionId,
        user_token: userToken,
      })

      set({ sessionId })
      return sessionId
    } catch {
      return null
    }
  },

  pollForPartner: async () => {
    const state = get()
    if (!state.sessionId) return

    const { data } = await supabase
      .from('session_completion')
      .select('user_token')
      .eq('session_id', state.sessionId)

    if (data && data.length >= 2) {
      set({ partnerDone: true })
      await get().computeMatch()
    }
  },

  // 両者の完了状態をチェックしてpartnerDoneを更新
  checkBothDone: async () => {
    const state = get()
    if (!state.sessionId) return
    const { data } = await supabase
      .from('session_completion')
      .select('user_token')
      .eq('session_id', state.sessionId)
    if (data && data.length >= 2) {
      set({ partnerDone: true })
    }
  },

  computeMatch: async () => {
    const state = get()
    if (!state.sessionId) return

    const userToken = getUserToken()

    const { data: allSwipes } = await supabase
      .from('swipes')
      .select('user_token, restaurant_id, choice')
      .eq('session_id', state.sessionId)

    if (!allSwipes) return

    const tokens = [...new Set(allSwipes.map((s) => s.user_token))]
    if (tokens.length < 2) return

    const [t1, t2] = tokens
    const t1Yes = new Set(
      allSwipes.filter((s) => s.user_token === t1 && s.choice === 'yes').map((s) => s.restaurant_id)
    )
    const t2Yes = new Set(
      allSwipes.filter((s) => s.user_token === t2 && s.choice === 'yes').map((s) => s.restaurant_id)
    )

    const byId = Object.fromEntries(state.restaurants.map((r) => [r.id, r]))

    const matched = [...t1Yes].filter((id) => t2Yes.has(id)).map((id) => byId[id]).filter(Boolean)
    const onlyUser1 = [...t1Yes].filter((id) => !t2Yes.has(id)).map((id) => byId[id]).filter(Boolean)
    const onlyUser2 = [...t2Yes].filter((id) => !t1Yes.has(id)).map((id) => byId[id]).filter(Boolean)

    const myToken = userToken
    const myYes = myToken === t1 ? t1Yes : t2Yes
    const partnerYes = myToken === t1 ? t2Yes : t1Yes

    const myOnlyYes = [...myYes].filter((id) => !partnerYes.has(id)).map((id) => byId[id]).filter(Boolean)
    const partnerOnlyYes = [...partnerYes].filter((id) => !myYes.has(id)).map((id) => byId[id]).filter(Boolean)

    const matchResult: MatchResult = {
      matched,
      onlyUser1: myOnlyYes,
      onlyUser2: partnerOnlyYes,
    }

    set({
      matchResult,
      step: matched.length > 0 ? 'matcha' : 'matchb',
    })
  },

  // マッチリスト共有URLで開いた時：セッションを読み込んでマッチ計算
  loadSharedMatch: async () => {
    const state = get()
    if (!state.sessionId) return
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('restaurants')
        .eq('id', state.sessionId)
        .single()
      if (error || !data) throw new Error('セッションが見つかりませんでした')
      set({ restaurants: data.restaurants as Restaurant[] })
      await get().computeMatch()
    } catch {
      set({ step: 'error', errorMessage: 'マッチ結果の読み込みに失敗しました' })
    }
  },

  // 同一ユーザーが再度リンクを開いた時：自分のyes一覧を復元
  loadOwnSessionResult: async () => {
    const state = get()
    if (!state.sessionId) return
    const userToken = getUserToken()
    try {
      const [sessionRes, swipesRes, completionRes] = await Promise.all([
        supabase.from('sessions').select('restaurants').eq('id', state.sessionId).single(),
        supabase.from('swipes').select('restaurant_id, choice').eq('session_id', state.sessionId).eq('user_token', userToken),
        supabase.from('session_completion').select('user_token').eq('session_id', state.sessionId),
      ])
      if (!sessionRes.data) throw new Error('セッションが見つかりませんでした')
      const restaurants = sessionRes.data.restaurants as Restaurant[]
      const swipes: SwipeChoice[] = (swipesRes.data ?? []).map(s => ({
        restaurantId: s.restaurant_id,
        choice: s.choice as 'yes' | 'no',
      }))
      set({ restaurants, swipes })
      // 両者が完了済みならマッチ結果を表示
      if (completionRes.data && completionRes.data.length >= 2) {
        set({ partnerDone: true })
        await get().computeMatch()
      } else {
        set({ step: 'result' })
      }
    } catch {
      set({ step: 'error', errorMessage: 'データの読み込みに失敗しました' })
    }
  },
}))
