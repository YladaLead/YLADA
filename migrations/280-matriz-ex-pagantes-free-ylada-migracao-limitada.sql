-- =====================================================
-- Migração: ex-pagantes da matriz YLADA → free area ylada (MIGRAÇÃO, não cortesia)
-- =====================================================
-- Objetivo
--   • Perfis da matriz (nutri, coach, med, psi, ylada, vendas…): NÃO inclui Wellness.
--   • Só quem JÁ TEVE assinatura mensal ou anual em algum momento (era pagante).
--   • Não cria linha se ainda tem mensal/anual ATIVO (vigente).
--   • Não cria linha se já tem free area ylada ATIVO (vigente).
--   • Insere plan_type = free, area = ylada, prazo LIMITADO (current_period_end).
--   • stripe_subscription_id com prefixo free_mig_ → alinhado ao admin (tipo migração, não cortesia).
--
-- Pré-requisitos
--   • Rodar antes migrations/278-subscriptions-area-ylada-matriz.sql (area ylada na CHECK).
--   • plan_type 'free' permitido (add-free-to-plan-type.sql ou equivalente).
--
-- Como usar (Supabase SQL Editor)
--   1) Rode só o bloco "PRÉVIA" e confira contagem / amostra.
--   2) Ajuste dias_validade (CTE config) se quiser outro prazo (máx. lógico no app: 3650 dias).
--   3) Rode o bloco "INSERT" uma vez.
--
-- Observação sobre "free limitado"
--   O limite principal aqui é o TEMPO (current_period_end). A coluna features não é
--   preenchida neste script: vale o DEFAULT da tabela no seu projeto (muitas bases usam
--   ["completo"]). Se quiser restringir módulos, acrescente `features` no INSERT com o JSON
--   desejado (sem "completo", se for o caso).
-- =====================================================

-- ========== CONFIG (edite aqui) ==========
-- Prazo do free matriz a partir de NOW() (intervalo PostgreSQL)
-- Ex.: '3650 days' (~10 anos, teto usual no admin) | '365 days' | '1825 days'
-- =====================================================

-- ========== PRÉVIA (somente leitura) ==========
WITH
config AS (
  SELECT INTERVAL '3650 days' AS validade_free_ylada
),
perfis_matriz_ylada AS (
  SELECT unnest(
    ARRAY[
      'nutri', 'coach', 'nutra', 'med', 'psi', 'psicanalise',
      'odonto', 'estetica', 'fitness', 'perfumaria', 'ylada', 'seller'
    ]::text[]
  ) AS perfil
),
base_matriz AS (
  SELECT up.user_id
  FROM user_profiles up
  WHERE up.perfil IN (SELECT perfil FROM perfis_matriz_ylada)
),
ja_foi_pagante AS (
  SELECT DISTINCT s.user_id
  FROM subscriptions s
  WHERE s.plan_type IN ('monthly', 'annual')
),
tem_pago_ativo AS (
  SELECT DISTINCT s.user_id
  FROM subscriptions s
  WHERE s.plan_type IN ('monthly', 'annual')
    AND s.status = 'active'
    AND s.current_period_end IS NOT NULL
    AND s.current_period_end > NOW()
),
tem_free_ylada_ativo AS (
  SELECT DISTINCT s.user_id
  FROM subscriptions s
  WHERE s.area = 'ylada'
    AND s.plan_type = 'free'
    AND s.status = 'active'
    AND s.current_period_end IS NOT NULL
    AND s.current_period_end > NOW()
),
elegiveis AS (
  SELECT bm.user_id
  FROM base_matriz bm
  INNER JOIN ja_foi_pagante jp ON jp.user_id = bm.user_id
  WHERE bm.user_id NOT IN (SELECT user_id FROM tem_pago_ativo)
    AND bm.user_id NOT IN (SELECT user_id FROM tem_free_ylada_ativo)
)
SELECT
  (SELECT COUNT(*)::bigint FROM elegiveis) AS total_elegiveis,
  (SELECT COUNT(*)::bigint FROM base_matriz) AS total_perfis_matriz,
  (SELECT COUNT(*)::bigint FROM ja_foi_pagante) AS total_ja_tiveram_mensal_ou_anual_em_algum_momento;

-- Amostra de user_ids (opcional)
-- SELECT user_id FROM elegiveis ORDER BY user_id LIMIT 50;


-- ========== INSERT (rode após conferir a prévia) ==========
-- Descomente o bloco abaixo ou execute-o separadamente.

/*
WITH
config AS (
  SELECT INTERVAL '3650 days' AS validade_free_ylada
),
perfis_matriz_ylada AS (
  SELECT unnest(
    ARRAY[
      'nutri', 'coach', 'nutra', 'med', 'psi', 'psicanalise',
      'odonto', 'estetica', 'fitness', 'perfumaria', 'ylada', 'seller'
    ]::text[]
  ) AS perfil
),
base_matriz AS (
  SELECT up.user_id
  FROM user_profiles up
  WHERE up.perfil IN (SELECT perfil FROM perfis_matriz_ylada)
),
ja_foi_pagante AS (
  SELECT DISTINCT s.user_id
  FROM subscriptions s
  WHERE s.plan_type IN ('monthly', 'annual')
),
tem_pago_ativo AS (
  SELECT DISTINCT s.user_id
  FROM subscriptions s
  WHERE s.plan_type IN ('monthly', 'annual')
    AND s.status = 'active'
    AND s.current_period_end IS NOT NULL
    AND s.current_period_end > NOW()
),
tem_free_ylada_ativo AS (
  SELECT DISTINCT s.user_id
  FROM subscriptions s
  WHERE s.area = 'ylada'
    AND s.plan_type = 'free'
    AND s.status = 'active'
    AND s.current_period_end IS NOT NULL
    AND s.current_period_end > NOW()
),
elegiveis AS (
  SELECT bm.user_id
  FROM base_matriz bm
  INNER JOIN ja_foi_pagante jp ON jp.user_id = bm.user_id
  WHERE bm.user_id NOT IN (SELECT user_id FROM tem_pago_ativo)
    AND bm.user_id NOT IN (SELECT user_id FROM tem_free_ylada_ativo)
)
INSERT INTO subscriptions (
  user_id,
  area,
  plan_type,
  status,
  current_period_start,
  current_period_end,
  stripe_account,
  stripe_subscription_id,
  stripe_customer_id,
  stripe_price_id,
  amount,
  currency,
  created_at,
  updated_at
)
SELECT
  e.user_id,
  'ylada'::text,
  'free'::text,
  'active'::text,
  NOW(),
  (NOW() + c.validade_free_ylada)::timestamptz,
  'br'::text,
  'free_mig_' || e.user_id::text || '_ylada_' || (FLOOR(EXTRACT(EPOCH FROM clock_timestamp()) * 1000))::bigint::text
    || '_' || REPLACE(gen_random_uuid()::text, '-', ''),
  'free_' || e.user_id::text,
  'free'::text,
  0::numeric,
  'brl'::text,
  NOW(),
  NOW()
FROM elegiveis e
CROSS JOIN config c
RETURNING
  id,
  user_id,
  area,
  plan_type,
  current_period_end,
  stripe_subscription_id;
*/
