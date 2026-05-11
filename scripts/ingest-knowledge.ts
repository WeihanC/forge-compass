/**
 * 灌入 docs/knowledge-sources/ 的 markdown 文档到 Supabase knowledge 表
 * 用法：npm run ingest
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import matter from 'gray-matter';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// 加载 .env.local（tsx 不自动加载）
function loadEnv() {
  try {
    const raw = readFileSync(join(process.cwd(), '.env.local'), 'utf-8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx < 0) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (key && !process.env[key]) process.env[key] = val;
    }
  } catch {}
}
loadEnv();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CHUNK_SIZE = 1200; // 约 300 tokens
const KNOWLEDGE_DIR = join(process.cwd(), 'docs', 'knowledge-sources');

// 把文本分成约 CHUNK_SIZE 字符的段落
function chunkText(text: string): string[] {
  const paragraphs = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const chunks: string[] = [];
  let current = '';

  for (const para of paragraphs) {
    if (current.length + para.length + 2 > CHUNK_SIZE && current.length > 0) {
      chunks.push(current.trim());
      current = para;
    } else {
      current = current ? current + '\n\n' + para : para;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

// 递归找所有 .md 文件
function findMarkdownFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...findMarkdownFiles(full));
    } else if (entry.endsWith('.md')) {
      files.push(full);
    }
  }
  return files;
}

async function embedBatch(texts: string[]): Promise<number[][]> {
  const res = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: texts,
  });
  return res.data.map((d) => d.embedding);
}

async function ingestFile(filePath: string) {
  const raw = readFileSync(filePath, 'utf-8');
  const { data: fm, content } = matter(raw);

  const sourceUrl: string = fm.source_url || '';
  const sourceType: string = fm.source_type || 'general';
  const title: string = fm.title || relative(KNOWLEDGE_DIR, filePath);
  const language: string = fm.language || 'zh';

  if (!sourceUrl) {
    console.warn(`  ⚠ 跳过（缺 source_url frontmatter）：${relative(KNOWLEDGE_DIR, filePath)}`);
    return;
  }

  const chunks = chunkText(content);
  if (chunks.length === 0) {
    console.warn(`  ⚠ 空文件：${relative(KNOWLEDGE_DIR, filePath)}`);
    return;
  }

  // 删除该 source_url 的旧数据，避免重复
  const { error: delErr } = await supabase.from('knowledge').delete().eq('source_url', sourceUrl);
  if (delErr) console.warn(`  删除旧数据失败：${delErr.message}`);

  // 批量 embed（最多 20 条/次）
  const BATCH = 20;
  let inserted = 0;
  for (let i = 0; i < chunks.length; i += BATCH) {
    const batch = chunks.slice(i, i + BATCH);
    const embeddings = await embedBatch(batch);
    const rows = batch.map((chunk, j) => ({
      source_url: sourceUrl,
      source_type: sourceType,
      title,
      chunk,
      chunk_index: i + j,          // 对应表里的 UNIQUE(source_url, chunk_index)
      embedding: JSON.stringify(embeddings[j]),
      language,
      metadata: { file: relative(KNOWLEDGE_DIR, filePath) },
    }));
    const { error } = await supabase.from('knowledge').upsert(rows, {
      onConflict: 'source_url,chunk_index',  // 幂等 re-ingest
    });
    if (error) throw new Error(`插入失败：${error.message}`);
    inserted += batch.length;
  }

  console.log(`  ✓ ${relative(KNOWLEDGE_DIR, filePath)} — ${chunks.length} 个 chunk`);
}

async function main() {
  console.log('🔍 扫描 docs/knowledge-sources/ …');
  const files = findMarkdownFiles(KNOWLEDGE_DIR);
  console.log(`找到 ${files.length} 个文件\n`);

  for (const file of files) {
    console.log(`处理：${relative(KNOWLEDGE_DIR, file)}`);
    try {
      await ingestFile(file);
    } catch (err) {
      console.error(`  ✗ 失败：${err}`);
    }
  }
  console.log('\n✅ 灌入完成');
}

main().catch((e) => { console.error(e); process.exit(1); });
