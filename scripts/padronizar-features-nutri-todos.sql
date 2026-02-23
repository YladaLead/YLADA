-- =====================================================
-- PADRONIZAR ACESSO NUTRI: todos os clientes
-- Atualiza TODAS as assinaturas ativas da área Nutri que
-- têm features vazias ou null para features = ['ferramentas', 'cursos'].
-- Assim todos os clientes Nutri passam a ter o mesmo padrão de acesso.
-- =====================================================
-- Executar uma vez no Supabase (SQL Editor).
-- =====================================================

-- 1) Atualizar assinaturas ativas Nutri com features vazias ou null
UPDATE subscriptions
SET
  features = '["ferramentas", "cursos"]'::jsonb,
  updated_at = NOW()
WHERE
  area = 'nutri'
  AND status = 'active'
  AND current_period_end > NOW()
  AND (features IS NULL OR features = '[]'::jsonb OR jsonb_array_length(COALESCE(features, '[]'::jsonb)) = 0);

-- 2) Opcional: garantir que qualquer assinatura Nutri ativa tenha pelo menos ferramentas e cursos
--    (complementa se vier algo como só ['cursos'] — união com ferramentas e cursos)
-- Descomente o bloco abaixo se quiser forçar sempre os dois:
/*
UPDATE subscriptions s
SET
  features = (
    SELECT jsonb_agg(DISTINCT elem ORDER BY elem)
    FROM jsonb_array_elements_text(s.features || '["ferramentas", "cursos"]'::jsonb) AS elem
  ),
  updated_at = NOW()
WHERE
  s.area = 'nutri'
  AND s.status = 'active'
  AND s.current_period_end > NOW()
  AND (
    NOT (s.features ? 'ferramentas' AND s.features ? 'cursos')
  );
*/

-- Contar quantas foram atualizadas (rodar após o UPDATE)
-- SELECT COUNT(*) FROM subscriptions WHERE area = 'nutri' AND status = 'active' AND current_period_end > NOW();
