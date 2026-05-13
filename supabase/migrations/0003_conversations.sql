-- Forge Compass · Migration 0003
-- conversations 表：存放对话元数据（AI 生成的标题等）
-- chat_messages.conversation_id 仍是真相，这里是额外的元数据层

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_user
  ON conversations(user_id, updated_at DESC);
