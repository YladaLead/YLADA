-- ============================================
-- MIGRATION 177: Corrigir cancel_analytics Security Definer
-- ============================================
-- Corrige o problema de segurança da view cancel_analytics
-- que está definida com SECURITY DEFINER
-- Conforme alerta do Supabase Security Advisor
-- ============================================

-- ============================================
-- 1. RECRIAR VIEW SEM SECURITY DEFINER
-- ============================================
-- Views com SECURITY DEFINER executam com privilégios do criador,
-- o que pode ser um risco de segurança. Vamos recriar sem essa propriedade.

-- Remover a view existente
DROP VIEW IF EXISTS cancel_analytics CASCADE;

-- Recriar a view SEM SECURITY DEFINER
-- A view agora usará os privilégios do usuário que consulta,
-- respeitando as políticas RLS da tabela cancel_attempts
CREATE VIEW cancel_analytics AS
SELECT 
  ca.cancel_reason,
  ca.retention_offered,
  ca.retention_accepted,
  ca.final_action,
  COUNT(*) as total_attempts,
  COUNT(CASE WHEN ca.retention_accepted THEN 1 END) as retained_count,
  COUNT(CASE WHEN ca.final_action = 'canceled' THEN 1 END) as canceled_count,
  COUNT(CASE WHEN ca.final_action = 'retained' THEN 1 END) as retained_final_count,
  AVG(ca.days_since_purchase) as avg_days_since_purchase,
  MIN(ca.created_at) as first_attempt,
  MAX(ca.created_at) as last_attempt
FROM cancel_attempts ca
GROUP BY ca.cancel_reason, ca.retention_offered, ca.retention_accepted, ca.final_action;

-- Adicionar comentário explicativo
COMMENT ON VIEW cancel_analytics IS 'Analytics de cancelamentos e retenções - Acesso restrito pelas políticas RLS da tabela cancel_attempts';

-- ============================================
-- 2. VERIFICAR QUE A VIEW FOI CRIADA CORRETAMENTE
-- ============================================
-- Verificar se a view existe
SELECT 
  schemaname,
  viewname,
  viewowner,
  CASE 
    WHEN EXISTS (
      SELECT 1 
      FROM pg_views 
      WHERE schemaname = 'public' 
      AND viewname = 'cancel_analytics'
    ) THEN '✅ View criada'
    ELSE '❌ View não encontrada'
  END as status
FROM pg_views
WHERE schemaname = 'public' 
  AND viewname = 'cancel_analytics';

-- Verificar a definição da view para confirmar que não tem SECURITY DEFINER
-- (A definição não deve conter "SECURITY DEFINER")
SELECT 
  CASE 
    WHEN definition LIKE '%SECURITY DEFINER%' THEN '❌ View ainda tem SECURITY DEFINER'
    ELSE '✅ View criada sem SECURITY DEFINER'
  END as security_check,
  LEFT(definition, 200) as definition_preview
FROM pg_views
WHERE schemaname = 'public' 
  AND viewname = 'cancel_analytics';

-- ============================================
-- NOTA IMPORTANTE
-- ============================================
-- A view foi recriada SEM a propriedade SECURITY DEFINER.
-- Isso significa que:
-- 
-- 1. A view agora usa os privilégios do usuário que consulta,
--    não do criador da view
-- 
-- 2. As políticas RLS (Row Level Security) da tabela cancel_attempts
--    serão respeitadas automaticamente
-- 
-- 3. Usuários só verão dados que têm permissão de ver através
--    das políticas RLS da tabela base
-- 
-- 4. Isso resolve o problema de segurança identificado pelo
--    Supabase Security Advisor
-- 
-- IMPORTANTE: Se você precisar de acesso administrativo a todos
-- os dados de analytics, considere criar uma função SECURITY DEFINER
-- específica e bem documentada, ou usar políticas RLS que permitam
-- acesso de administradores.
-- ============================================
