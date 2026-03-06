-- =====================================================
-- Remove duplicatas em ylada_biblioteca_itens.
-- Mantém 1 registro por (titulo, tipo, template_id), o de menor created_at.
-- =====================================================

DELETE FROM ylada_biblioteca_itens
WHERE id IN (
  SELECT id FROM (
    SELECT id,
      ROW_NUMBER() OVER (
        PARTITION BY titulo, tipo, COALESCE(template_id::text, 'null')
        ORDER BY created_at ASC, id ASC
      ) AS rn
    FROM ylada_biblioteca_itens
    WHERE active = true
  ) sub
  WHERE rn > 1
);
