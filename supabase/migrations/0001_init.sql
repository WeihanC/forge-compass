-- Forge Compass · Migration 0001
-- 基础对话存储和用户画像

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  conversation_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'tool')),
  content JSONB NOT NULL,
  tokens_input INT,
  tokens_output INT,
  cost_usd NUMERIC(10, 6),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_user_time ON chat_messages(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_conv_time ON chat_messages(conversation_id, created_at);

CREATE TABLE IF NOT EXISTS user_context (
  user_id TEXT PRIMARY KEY,
  company_name TEXT,
  category TEXT,
  gmv_range TEXT,
  main_channels TEXT[],
  pain_points TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- updated_at 自动更新 trigger
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_user_context_timestamp
BEFORE UPDATE ON user_context
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
