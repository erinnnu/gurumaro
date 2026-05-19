-- ぐるまろ！ Database Schema

-- Sessions: stores restaurant list for a matching session
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  restaurants JSONB NOT NULL,
  filters JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '48 hours'
);

-- Enable Row Level Security
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sessions are publicly readable" ON sessions FOR SELECT USING (true);
CREATE POLICY "Sessions are publicly insertable" ON sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Sessions are publicly updatable" ON sessions FOR UPDATE USING (true);

-- Swipes: one row per user per restaurant in a session
CREATE TABLE IF NOT EXISTS swipes (
  session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  user_token TEXT NOT NULL,
  restaurant_id TEXT NOT NULL,
  choice TEXT NOT NULL CHECK (choice IN ('yes', 'no')),
  age TEXT,
  gender TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (session_id, user_token, restaurant_id)
);

ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Swipes are publicly readable" ON swipes FOR SELECT USING (true);
CREATE POLICY "Swipes are publicly insertable" ON swipes FOR INSERT WITH CHECK (true);
CREATE POLICY "Swipes are publicly updatable" ON swipes FOR UPDATE USING (true);

-- Session completion: tracks when each user finishes swiping
CREATE TABLE IF NOT EXISTS session_completion (
  session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  user_token TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (session_id, user_token)
);

ALTER TABLE session_completion ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Completion is publicly readable" ON session_completion FOR SELECT USING (true);
CREATE POLICY "Completion is publicly insertable" ON session_completion FOR INSERT WITH CHECK (true);
CREATE POLICY "Completion is publicly updatable" ON session_completion FOR UPDATE USING (true);

-- Index for efficient polling
CREATE INDEX IF NOT EXISTS idx_session_completion_session_id
  ON session_completion(session_id);

CREATE INDEX IF NOT EXISTS idx_swipes_session_id
  ON swipes(session_id);

-- Cleanup function: delete sessions older than 48 hours
CREATE OR REPLACE FUNCTION cleanup_old_sessions()
RETURNS void LANGUAGE sql AS $$
  DELETE FROM sessions WHERE expires_at < NOW();
$$;
