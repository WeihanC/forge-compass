-- Forge Compass · Migration 0002
-- 知识库（pgvector）

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url TEXT NOT NULL,
  source_type TEXT NOT NULL,        -- 'fda' | 'chewy' | 'amazon' | 'tiktok' | 'state_reg' | 'market' | 'tariff'
  title TEXT NOT NULL,
  chunk TEXT NOT NULL,
  chunk_index INT NOT NULL DEFAULT 0,
  embedding VECTOR(1536),            -- OpenAI text-embedding-3-small
  language TEXT DEFAULT 'mixed',    -- 'en' | 'zh' | 'mixed'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(source_url, chunk_index)   -- idempotent re-ingest
);

-- HNSW 索引（pgvector 0.7+）
CREATE INDEX IF NOT EXISTS knowledge_embedding_idx
ON knowledge USING hnsw (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS knowledge_source_type_idx ON knowledge(source_type);

-- 相似度搜索 RPC
CREATE OR REPLACE FUNCTION match_knowledge(
  query_embedding VECTOR(1536),
  match_count INT DEFAULT 5,
  filter_source_type TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  source_url TEXT,
  source_type TEXT,
  title TEXT,
  chunk TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    k.id,
    k.source_url,
    k.source_type,
    k.title,
    k.chunk,
    k.metadata,
    1 - (k.embedding <=> query_embedding) AS similarity
  FROM knowledge k
  WHERE filter_source_type IS NULL OR k.source_type = filter_source_type
  ORDER BY k.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
