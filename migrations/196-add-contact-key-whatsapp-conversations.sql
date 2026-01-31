-- =====================================================
-- Adiciona contact_key (telefone normalizado) para garantir memória por pessoa
-- Objetivo: evitar duplicação de conversas quando o webhook chega com variações de phone (com/sem 55, com/sem 9, etc.)
-- =====================================================

-- 1) Adicionar coluna (idempotente)
ALTER TABLE whatsapp_conversations
  ADD COLUMN IF NOT EXISTS contact_key VARCHAR(20);

-- 2) Backfill a partir de phone atual (normalização simples: só dígitos, prefixo 55 quando necessário)
-- Observação: regra do "9" por DDD é tratada no código (geração de candidatos). Aqui é apenas baseline.
UPDATE whatsapp_conversations
SET contact_key = CASE
  WHEN contact_key IS NOT NULL AND length(trim(contact_key)) > 0 THEN contact_key
  ELSE
    CASE
      WHEN length(regexp_replace(phone, '\D', '', 'g')) IN (10, 11)
        THEN '55' || regexp_replace(phone, '\D', '', 'g')
      ELSE regexp_replace(phone, '\D', '', 'g')
    END
END
WHERE contact_key IS NULL OR length(trim(contact_key)) = 0;

-- 3) Índices para busca rápida
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_contact_key
  ON whatsapp_conversations(contact_key);

-- 3.5) Resolver duplicados existentes antes do índice único
-- Mantém apenas 1 linha por (instance_id, contact_key) e remove a chave das duplicadas
-- para permitir a criação do índice único sem quebrar.
WITH ranked AS (
  SELECT
    id,
    instance_id,
    contact_key,
    ROW_NUMBER() OVER (
      PARTITION BY instance_id, contact_key
      ORDER BY COALESCE(last_message_at, created_at) DESC, id DESC
    ) AS rn
  FROM whatsapp_conversations
  WHERE contact_key IS NOT NULL AND length(trim(contact_key)) > 0
)
UPDATE whatsapp_conversations wc
SET contact_key = NULL
FROM ranked r
WHERE wc.id = r.id
  AND r.rn > 1;

-- 4) Unicidade por instância + pessoa (evita 2 conversas para o mesmo contato)
-- (Partial index para não travar linhas antigas sem chave válida.)
CREATE UNIQUE INDEX IF NOT EXISTS uniq_whatsapp_conversations_instance_contact_key
  ON whatsapp_conversations(instance_id, contact_key)
  WHERE contact_key IS NOT NULL AND length(trim(contact_key)) > 0;

