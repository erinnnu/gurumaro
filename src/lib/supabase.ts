import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// Lazy init — returns null if env vars are not configured
let _client: SupabaseClient | null = null
export function getSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null
  if (!_client) _client = createClient(supabaseUrl, supabaseAnonKey)
  return _client
}

// Kept for convenience in store (null-safe wrapper)
export const supabase = {
  from: (table: string) => {
    const client = getSupabase()
    if (!client) {
      // Return a no-op object so the app doesn't crash without Supabase
      const noop = {
        select: () => noop,
        eq: () => noop,
        upsert: () => Promise.resolve({ data: null, error: null }),
        single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      }
      return noop as unknown as ReturnType<SupabaseClient['from']>
    }
    return client.from(table)
  },
}

// Generate a short random token for session sharing
export function generateToken(length = 8): string {
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789'
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map(b => chars[b % chars.length])
    .join('')
}

// Get or create a persistent user token stored in sessionStorage
export function getUserToken(): string {
  const key = 'gurumaro_user_token'
  let token = sessionStorage.getItem(key)
  if (!token) {
    token = generateToken(16)
    sessionStorage.setItem(key, token)
  }
  return token
}
