-- =====================================================
-- Sincroniza config_json de links de calculadora com os
-- templates atualizados (selects com opções legíveis).
-- Links criados antes da migration 236 tinham config antigo.
-- =====================================================

WITH templates AS (
  SELECT id, name, schema_json
  FROM ylada_link_templates
  WHERE type = 'calculator'
    AND id IN (
      'b1000025-0025-4000-8000-000000000025',
      'b1000026-0026-4000-8000-000000000026',
      'b1000027-0027-4000-8000-000000000027',
      'b1000028-0028-4000-8000-000000000028'
    )
)
UPDATE ylada_links l
SET config_json = (
  t.schema_json
  || jsonb_build_object(
    'title', COALESCE(NULLIF(TRIM(l.config_json->>'title'), ''), t.schema_json->>'title', t.name),
    'ctaText', COALESCE(NULLIF(TRIM(l.config_json->>'ctaText'), ''), t.schema_json->>'ctaDefault', 'Falar no WhatsApp')
  )
)
FROM templates t
WHERE l.template_id = t.id;
