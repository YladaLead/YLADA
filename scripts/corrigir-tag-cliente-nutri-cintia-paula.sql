-- =====================================================
-- Corrigir: adicionar tag cliente_nutri às conversas da
-- Cintia/Cynthia, Paula e Gláucia (área nutri) que já
-- pagaram ou foram consideradas alunas (ex.: 15 dias grátis).
--
-- Motivo: inscrição foi detectada/ajustada depois do
-- webhook; a tag cliente_nutri é o que faz a pessoa
-- aparecer no funil como "Cliente" e a Carol tratar como aluna.
-- =====================================================

-- 1) Ver quais conversas seriam afetadas (dry-run)
SELECT
  id,
  phone,
  name,
  context->>'customer_name' AS customer_name,
  context->'tags' AS tags_atual
FROM whatsapp_conversations
WHERE area = 'nutri'
  AND (
    name ILIKE '%Cintia%' OR name ILIKE '%Cynthia%'
    OR name ILIKE '%Paula%'
    OR name ILIKE '%Gláucia%' OR name ILIKE '%Glaucia%'
    OR (context->>'customer_name') ILIKE '%Cintia%'
    OR (context->>'customer_name') ILIKE '%Cynthia%'
    OR (context->>'customer_name') ILIKE '%Paula%'
    OR (context->>'customer_name') ILIKE '%Gláucia%'
    OR (context->>'customer_name') ILIKE '%Glaucia%'
  )
  AND NOT (COALESCE(context->'tags', '[]'::jsonb) @> '["cliente_nutri"]'::jsonb);

-- 2) Atualizar: adicionar 'cliente_nutri' ao array de tags (sem duplicar)
UPDATE whatsapp_conversations
SET context = jsonb_set(
  COALESCE(context, '{}'::jsonb),
  '{tags}',
  (
    SELECT COALESCE(
      (
        SELECT jsonb_agg(elem ORDER BY elem)
        FROM (
          SELECT DISTINCT jsonb_array_elements_text(
            COALESCE(context->'tags', '[]'::jsonb) || '["cliente_nutri"]'::jsonb
          ) AS elem
        ) s
      ),
      '["cliente_nutri"]'::jsonb
    )
  )
)
WHERE area = 'nutri'
  AND (
    name ILIKE '%Cintia%' OR name ILIKE '%Cynthia%'
    OR name ILIKE '%Paula%'
    OR name ILIKE '%Gláucia%' OR name ILIKE '%Glaucia%'
    OR (context->>'customer_name') ILIKE '%Cintia%'
    OR (context->>'customer_name') ILIKE '%Cynthia%'
    OR (context->>'customer_name') ILIKE '%Paula%'
    OR (context->>'customer_name') ILIKE '%Gláucia%'
    OR (context->>'customer_name') ILIKE '%Glaucia%'
  )
  AND NOT (COALESCE(context->'tags', '[]'::jsonb) @> '["cliente_nutri"]'::jsonb);

-- 3) Conferir resultado (rodar após o UPDATE)
-- SELECT id, name, context->'tags' AS tags
-- FROM whatsapp_conversations
-- WHERE area = 'nutri'
--   AND (name ILIKE '%Cintia%' OR name ILIKE '%Cynthia%' OR name ILIKE '%Paula%' OR name ILIKE '%Gláucia%' OR name ILIKE '%Glaucia%');
