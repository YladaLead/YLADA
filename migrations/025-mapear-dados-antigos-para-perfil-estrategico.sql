-- =====================================================
-- MAPEAR DADOS ANTIGOS PARA PERFIL ESTRATÉGICO
-- Migração 025: Migrar dados existentes para novos campos
-- =====================================================

BEGIN;

-- =====================================================
-- MAPEAMENTO DE DADOS ANTIGOS → NOVOS CAMPOS
-- =====================================================

-- 1. Mapear objetivo_principal → tipo_trabalho
UPDATE wellness_noel_profile
SET tipo_trabalho = CASE
  WHEN objetivo_principal IN ('funcional', 'usar_recomendar') THEN 'bebidas_funcionais'
  WHEN objetivo_principal IN ('fechado', 'plano_presidente') THEN 'produtos_fechados'
  WHEN objetivo_principal = 'carteira' THEN 'cliente_que_indica'
  ELSE NULL
END
WHERE tipo_trabalho IS NULL 
  AND objetivo_principal IS NOT NULL;

-- 2. Mapear objetivo_principal → foco_trabalho
UPDATE wellness_noel_profile
SET foco_trabalho = CASE
  WHEN objetivo_principal IN ('renda_extra', 'usar_recomendar') THEN 'renda_extra'
  WHEN objetivo_principal IN ('plano_presidente', 'carteira') THEN 'plano_carreira'
  WHEN objetivo_principal IN ('funcional', 'fechado') THEN 'ambos'
  ELSE NULL
END
WHERE foco_trabalho IS NULL 
  AND objetivo_principal IS NOT NULL;

-- 3. Mapear trabalha_com → ganhos_prioritarios
UPDATE wellness_noel_profile
SET ganhos_prioritarios = CASE
  WHEN trabalha_com = 'funcional' THEN 'vendas'
  WHEN trabalha_com = 'fechado' THEN 'vendas'
  WHEN trabalha_com = 'ambos' THEN 'ambos'
  ELSE NULL
END
WHERE ganhos_prioritarios IS NULL 
  AND trabalha_com IS NOT NULL;

-- 4. Mapear experiencia_herbalife → nivel_herbalife
UPDATE wellness_noel_profile
SET nivel_herbalife = CASE
  WHEN experiencia_herbalife IN ('nenhuma', 'ja_vendi', 'sim_regularmente', 'ja_vendi_tempo', 'nunca_vendi') THEN 'novo_distribuidor'
  WHEN experiencia_herbalife = 'supervisor' THEN 'supervisor'
  WHEN experiencia_herbalife = 'get_plus' THEN 'equipe_expansao_global'
  ELSE NULL
END
WHERE nivel_herbalife IS NULL 
  AND experiencia_herbalife IS NOT NULL;

-- 5. Mapear tempo_disponivel → carga_horaria_diaria
UPDATE wellness_noel_profile
SET carga_horaria_diaria = CASE
  WHEN tempo_disponivel IN ('5min', '15min', '15_minutos') THEN '1_hora'
  WHEN tempo_disponivel IN ('30min', '30_minutos', '1h', '1_hora') THEN '1_a_2_horas'
  WHEN tempo_disponivel = '1h_plus' THEN '2_a_4_horas'
  WHEN tempo_disponivel = 'mais_1_hora' THEN 'mais_4_horas'
  ELSE NULL
END
WHERE carga_horaria_diaria IS NULL 
  AND tempo_disponivel IS NOT NULL;

-- 6. Definir dias_por_semana padrão baseado em carga_horaria
-- Se tem mais tempo, provavelmente trabalha mais dias
UPDATE wellness_noel_profile
SET dias_por_semana = CASE
  WHEN carga_horaria_diaria = '1_hora' THEN '1_a_2_dias'
  WHEN carga_horaria_diaria = '1_a_2_horas' THEN '3_a_4_dias'
  WHEN carga_horaria_diaria IN ('2_a_4_horas', 'mais_4_horas') THEN '5_a_6_dias'
  ELSE '3_a_4_dias' -- Padrão conservador
END
WHERE dias_por_semana IS NULL;

-- 7. Se já tem meta_financeira, manter (já está no campo certo)

-- =====================================================
-- VERIFICAÇÃO E RELATÓRIO
-- =====================================================

-- Ver quantos perfis foram migrados
SELECT 
  COUNT(*) as total_perfis,
  COUNT(tipo_trabalho) as com_tipo_trabalho,
  COUNT(foco_trabalho) as com_foco_trabalho,
  COUNT(ganhos_prioritarios) as com_ganhos_prioritarios,
  COUNT(nivel_herbalife) as com_nivel_herbalife,
  COUNT(carga_horaria_diaria) as com_carga_horaria,
  COUNT(dias_por_semana) as com_dias_semana,
  COUNT(meta_financeira) as com_meta_financeira
FROM wellness_noel_profile
WHERE onboarding_completo = true;

-- =====================================================
-- NOTA IMPORTANTE
-- =====================================================
-- Esta migração mapeia dados antigos para novos campos.
-- Usuários antigos terão seus dados migrados automaticamente.
-- Novos usuários preencherão os novos campos diretamente.
-- 
-- Campos antigos (objetivo_principal, tempo_disponivel, etc) 
-- continuam existindo para compatibilidade, mas os novos campos
-- são priorizados pelo sistema.
-- =====================================================

COMMIT;
