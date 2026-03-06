-- =====================================================
-- VERIFICAR: Vanessa Mariane Ribeiro da Silva (Wellness)
-- Data de entrada no trial de 3 dias
-- =====================================================

-- Busca por nome (permite variações como acentos, espaços extras)
SELECT
  up.nome_completo,
  up.email,
  up.perfil,
  up.created_at AS perfil_criado_em,
  s.id AS subscription_id,
  s.plan_type,
  s.status AS status_assinatura,
  s.current_period_start AS inicio_trial_3_dias,
  s.current_period_end AS fim_trial_3_dias,
  s.created_at AS assinatura_criada_em
FROM user_profiles up
LEFT JOIN subscriptions s ON s.user_id = up.user_id AND s.area = 'wellness'
WHERE up.perfil = 'wellness'
  AND (
    LOWER(TRIM(up.nome_completo)) ILIKE '%vanessa%mariane%ribeiro%silva%'
    OR LOWER(TRIM(up.nome_completo)) ILIKE '%vanessa mariane ribeiro da silva%'
    OR LOWER(TRIM(up.nome_completo)) = 'vanessa mariane ribeiro da silva'
  )
ORDER BY s.current_period_start DESC NULLS LAST;
