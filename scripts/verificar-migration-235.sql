-- =====================================================
-- Verificação da migration 235 (Bloco 2 Biblioteca Nutri)
-- Execute no Supabase SQL Editor para validar.
-- =====================================================

-- 1. Contar templates criados (b1000009 a b1000024 = 16)
SELECT COUNT(*) AS total_templates_bloco2
FROM ylada_link_templates
WHERE id::text LIKE 'b10000%'
  AND id >= 'b1000009-0009-4000-8000-000000000009'
  AND id <= 'b1000024-0024-4000-8000-000000000024';

-- 2. Listar os 16 templates do Bloco 2
SELECT name, type, 
       jsonb_array_length(schema_json->'questions') AS num_perguntas
FROM ylada_link_templates
WHERE id::text LIKE 'b10000%'
  AND id >= 'b1000009-0009-4000-8000-000000000009'
ORDER BY name;

-- 3. Contar itens da biblioteca com template_id do Bloco 2
SELECT COUNT(*) AS total_itens_bloco2
FROM ylada_biblioteca_itens
WHERE template_id IN (
  SELECT id FROM ylada_link_templates
  WHERE id::text LIKE 'b10000%'
    AND id >= 'b1000009-0009-4000-8000-000000000009'
);

-- 4. Total de itens na biblioteca (deve ser 27 = 11 originais + 16 novos)
SELECT COUNT(*) AS total_biblioteca
FROM ylada_biblioteca_itens
WHERE active = true;

-- 5. Exemplo: um item novo com template_id
SELECT titulo, tema, template_id, meta->>'nomenclatura' AS nomenclatura
FROM ylada_biblioteca_itens
WHERE template_id = 'b1000009-0009-4000-8000-000000000009';
