-- Memória de conversa (curto prazo) para o Noel: últimas mensagens por usuário
-- Usado para montar Layer 4 (contexto). Recomendação: últimas 5–10 mensagens
-- Ver: docs/YLADA-ARQUITETURA-COMPLETA.md

CREATE TABLE IF NOT EXISTS noel_conversation_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_role TEXT NOT NULL CHECK (message_role IN ('user', 'assistant')),
  message_content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_noel_conversation_memory_user_created ON noel_conversation_memory(user_id, created_at DESC);

COMMENT ON TABLE noel_conversation_memory IS 'Últimas mensagens por usuário para contexto do Noel (Memory Layer). Manter poucas por usuário (ex.: 10).';
