-- =====================================================
-- Verificar duplicatas em ylada_biblioteca_itens
-- Execute no Supabase SQL Editor.
-- Duplicata = mesmo (titulo, tipo, template_id)
-- =====================================================

-- 1. Itens agrupados por chave (titulo + tipo + template_id)
WITH chaves AS (
  SELECT
    titulo,
    tipo,
    COALESCE(template_id::text, 'null') AS template_id,
    COUNT(*) AS qtd,
    array_agg(id ORDER BY created_at) AS ids
  FROM ylada_biblioteca_itens
  WHERE active = true
  GROUP BY titulo, tipo, template_id
)
SELECT
  titulo,
  tipo,
  template_id,
  qtd AS duplicatas,
  ids
FROM chaves
WHERE qtd > 1
ORDER BY qtd DESC;

-- 2. Total de itens e total de grupos com duplicata
SELECT
  (SELECT COUNT(*) FROM ylada_biblioteca_itens WHERE active = true) AS total_itens,
  (SELECT COUNT(*) FROM (
    SELECT titulo, tipo, template_id
    FROM ylada_biblioteca_itens
    WHERE active = true
    GROUP BY titulo, tipo, template_id
    HAVING COUNT(*) > 1
  ) x) AS grupos_com_duplicata;
