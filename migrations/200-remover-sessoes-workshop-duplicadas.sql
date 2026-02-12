-- Remove sessões duplicadas da agenda do workshop (mesma área + mesmo horário).
-- Mantém uma sessão por (area, starts_at ao minuto) e redireciona conversas para ela.

-- 1) Atualizar conversas que apontam para sessão duplicada para apontar para a sessão que vamos manter
WITH dups AS (
  SELECT
    id,
    first_value(id) OVER (PARTITION BY area, date_trunc('minute', starts_at) ORDER BY id) AS keep_id
  FROM whatsapp_workshop_sessions
),
to_remove AS (
  SELECT id, keep_id FROM dups WHERE id != keep_id
)
UPDATE whatsapp_conversations c
SET context = jsonb_set(
  COALESCE(context, '{}'::jsonb) - 'workshop_session_id',
  '{workshop_session_id}',
  to_jsonb(t.keep_id::text)
)
FROM to_remove t
WHERE c.area = 'nutri'
  AND c.context IS NOT NULL
  AND c.context->>'workshop_session_id' = t.id::text;

-- 2) Remover sessões duplicadas (mantém a de menor id por grupo)
WITH dups AS (
  SELECT
    id,
    first_value(id) OVER (PARTITION BY area, date_trunc('minute', starts_at) ORDER BY id) AS keep_id
  FROM whatsapp_workshop_sessions
),
to_remove AS (
  SELECT id FROM dups WHERE id != keep_id
)
DELETE FROM whatsapp_workshop_sessions
WHERE id IN (SELECT id FROM to_remove);
