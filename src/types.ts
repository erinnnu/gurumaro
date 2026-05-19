export type Step =
  | 'top'
  | 'cuisine'
  | 'situation'
  | 'area'
  | 'mealtime'
  | 'budget'
  | 'aboutyou'
  | 'loading'
  | 'swipe'
  | 'matchc'
  | 'result'
  | 'waiting'
  | 'matcha'
  | 'matchb'
  | 'error'

export interface Restaurant {
  id: string
  name: string
  genre: string
  area: string
  budget: string
  desc: string
  photo: string
  url: string
}

export interface SwipeChoice {
  restaurantId: string
  choice: 'yes' | 'no'
}

export interface Filters {
  cuisines: string[]
  situations: string[]
  prefecture: string
  areas: string[]
  mealtime: string
  budgets: string[]
}

export interface Profile {
  age?: string
  gender?: string
}

export interface MatchResult {
  matched: Restaurant[]
  onlyUser1: Restaurant[]
  onlyUser2: Restaurant[]
}
