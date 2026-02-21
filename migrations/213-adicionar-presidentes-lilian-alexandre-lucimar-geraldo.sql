-- ============================================
-- Adicionar presidentes (casais): Lilian e Alexandre, Lucimar e Geraldo
-- Área admin/presidentes (lista no trial Wellness)
-- ============================================

INSERT INTO presidentes_autorizados (nome_completo, status, created_at, updated_at)
SELECT nome, 'ativo', NOW(), NOW()
FROM (VALUES
  ('Lilian e Alexandre'),
  ('Lucimar e Geraldo')
) AS novos_presidentes(nome)
WHERE NOT EXISTS (
  SELECT 1 FROM presidentes_autorizados
  WHERE LOWER(TRIM(nome_completo)) = LOWER(TRIM(novos_presidentes.nome))
);
