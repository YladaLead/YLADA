-- =====================================================
-- MIGRATION 175: Corrigir Security Definer Views e RLS Coach
-- Data: Dezembro 2025
-- Descrição: 
--   1. Recria views com security_invoker explicitamente
--   2. Habilita RLS nas tabelas coach_client_*
--   3. Cria políticas RLS básicas
-- =====================================================

-- ============================================
-- PARTE 1: RECRIAR VIEWS COM SECURITY INVOKER
-- ============================================
-- Views devem usar privilégios do usuário que consulta, não do criador

-- 1. VIEW: vw_consultas_resumo
DROP VIEW IF EXISTS vw_consultas_resumo CASCADE;

CREATE VIEW vw_consultas_resumo 
WITH (security_invoker = true) AS
SELECT 
  a.user_id,
  COUNT(*) AS total_consultas,
  COUNT(*) FILTER (WHERE a.status = 'agendado') AS agendadas,
  COUNT(*) FILTER (WHERE a.status = 'confirmado') AS confirmadas,
  COUNT(*) FILTER (WHERE a.status = 'concluido') AS realizadas,
  COUNT(*) FILTER (WHERE a.status = 'cancelado') AS canceladas,
  COUNT(*) FILTER (WHERE a.appointment_type = 'consulta') AS tipo_consulta,
  COUNT(*) FILTER (WHERE a.appointment_type = 'retorno') AS tipo_retorno,
  COUNT(*) FILTER (WHERE a.appointment_type = 'avaliacao') AS tipo_avaliacao,
  COUNT(*) FILTER (WHERE a.appointment_type = 'acompanhamento') AS tipo_acompanhamento,
  ROUND(
    (COUNT(*) FILTER (WHERE a.status = 'concluido')::DECIMAL / 
     NULLIF(COUNT(*) FILTER (WHERE a.status IN ('agendado', 'confirmado', 'concluido')), 0)) * 100, 
    2
  ) AS taxa_comparecimento
FROM appointments a
GROUP BY a.user_id;

COMMENT ON VIEW vw_consultas_resumo IS 'Resumo de consultas por usuário - Usa security_invoker para respeitar RLS';

-- 2. VIEW: vw_formularios_respostas
DROP VIEW IF EXISTS vw_formularios_respostas CASCADE;

CREATE VIEW vw_formularios_respostas 
WITH (security_invoker = true) AS
SELECT 
  cf.id AS form_id,
  cf.name AS form_nome,
  cf.user_id,
  cf.form_type,
  COUNT(fr.id) AS total_respostas,
  COUNT(fr.id) FILTER (WHERE fr.client_id IS NOT NULL) AS respostas_com_cliente,
  COUNT(fr.id) FILTER (WHERE fr.client_id IS NULL) AS respostas_sem_cliente,
  MIN(fr.created_at) AS primeira_resposta,
  MAX(fr.created_at) AS ultima_resposta
FROM custom_forms cf
LEFT JOIN form_responses fr ON cf.id = fr.form_id
GROUP BY cf.id, cf.name, cf.user_id, cf.form_type;

COMMENT ON VIEW vw_formularios_respostas IS 'Resumo de formulários e respostas - Usa security_invoker para respeitar RLS';

-- 3. VIEW: vw_avaliacoes_resumo
DROP VIEW IF EXISTS vw_avaliacoes_resumo CASCADE;

CREATE VIEW vw_avaliacoes_resumo 
WITH (security_invoker = true) AS
SELECT 
  a.client_id,
  c.name AS cliente_nome,
  c.user_id,
  COUNT(*) AS total_avaliacoes,
  COUNT(*) FILTER (WHERE a.is_reevaluation = false) AS avaliacoes_iniciais,
  COUNT(*) FILTER (WHERE a.is_reevaluation = true) AS reavaliacoes,
  MIN(COALESCE(a.completed_at, a.created_at)) AS primeira_avaliacao,
  MAX(COALESCE(a.completed_at, a.created_at)) AS ultima_avaliacao
FROM assessments a
INNER JOIN clients c ON a.client_id = c.id
GROUP BY a.client_id, c.name, c.user_id;

COMMENT ON VIEW vw_avaliacoes_resumo IS 'Resumo de avaliações por cliente - Usa security_invoker para respeitar RLS';

-- 4. VIEW: vw_programas_adesao
DROP VIEW IF EXISTS vw_programas_adesao CASCADE;

CREATE VIEW vw_programas_adesao 
WITH (security_invoker = true) AS
SELECT 
  p.client_id,
  c.name AS cliente_nome,
  c.user_id,
  COUNT(*) AS total_programas,
  COUNT(*) FILTER (WHERE p.status = 'ativo') AS programas_ativos,
  AVG(p.adherence_percentage) AS adesao_media,
  MAX(p.adherence_percentage) AS adesao_maxima,
  MIN(p.adherence_percentage) AS adesao_minima
FROM programs p
INNER JOIN clients c ON p.client_id = c.id
GROUP BY p.client_id, c.name, c.user_id;

COMMENT ON VIEW vw_programas_adesao IS 'Resumo de programas e adesão - Usa security_invoker para respeitar RLS';

-- 5. VIEW: vw_evolucao_resumo
DROP VIEW IF EXISTS vw_evolucao_resumo CASCADE;

CREATE VIEW vw_evolucao_resumo 
WITH (security_invoker = true) AS
SELECT 
  ce.client_id,
  c.name AS cliente_nome,
  c.user_id,
  COUNT(*) AS total_registros,
  MIN(ce.measurement_date) AS primeira_medicao,
  MAX(ce.measurement_date) AS ultima_medicao,
  AVG(ce.weight) AS peso_medio,
  AVG(ce.bmi) AS imc_medio,
  AVG(ce.waist_circumference) AS cintura_media,
  AVG(ce.hip_circumference) AS quadril_medio,
  AVG(ce.body_fat_percentage) AS gordura_media,
  AVG(ce.muscle_mass) AS massa_muscular_media
FROM client_evolution ce
INNER JOIN clients c ON ce.client_id = c.id
GROUP BY ce.client_id, c.name, c.user_id;

COMMENT ON VIEW vw_evolucao_resumo IS 'Resumo de evolução física por cliente - Usa security_invoker para respeitar RLS';

-- ============================================
-- PARTE 2: HABILITAR RLS NAS TABELAS COACH
-- ============================================

-- 1. Habilitar RLS em coach_client_professional
ALTER TABLE coach_client_professional ENABLE ROW LEVEL SECURITY;

-- Política: Usuários só veem seus próprios registros
CREATE POLICY "Users can view own coach_client_professional"
  ON coach_client_professional
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Usuários só inserem para seus próprios clientes
CREATE POLICY "Users can insert own coach_client_professional"
  ON coach_client_professional
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuários só atualizam seus próprios registros
CREATE POLICY "Users can update own coach_client_professional"
  ON coach_client_professional
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuários só deletam seus próprios registros
CREATE POLICY "Users can delete own coach_client_professional"
  ON coach_client_professional
  FOR DELETE
  USING (auth.uid() = user_id);

-- 2. Habilitar RLS em coach_client_health
ALTER TABLE coach_client_health ENABLE ROW LEVEL SECURITY;

-- Política: Usuários só veem seus próprios registros
CREATE POLICY "Users can view own coach_client_health"
  ON coach_client_health
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Usuários só inserem para seus próprios clientes
CREATE POLICY "Users can insert own coach_client_health"
  ON coach_client_health
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuários só atualizam seus próprios registros
CREATE POLICY "Users can update own coach_client_health"
  ON coach_client_health
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuários só deletam seus próprios registros
CREATE POLICY "Users can delete own coach_client_health"
  ON coach_client_health
  FOR DELETE
  USING (auth.uid() = user_id);

-- 3. Habilitar RLS em coach_client_food_habits
ALTER TABLE coach_client_food_habits ENABLE ROW LEVEL SECURITY;

-- Política: Usuários só veem seus próprios registros
CREATE POLICY "Users can view own coach_client_food_habits"
  ON coach_client_food_habits
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Usuários só inserem para seus próprios clientes
CREATE POLICY "Users can insert own coach_client_food_habits"
  ON coach_client_food_habits
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuários só atualizam seus próprios registros
CREATE POLICY "Users can update own coach_client_food_habits"
  ON coach_client_food_habits
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuários só deletam seus próprios registros
CREATE POLICY "Users can delete own coach_client_food_habits"
  ON coach_client_food_habits
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- COMENTÁRIOS FINAIS
-- ============================================
COMMENT ON TABLE coach_client_professional IS 'Dados profissionais dos clientes - RLS habilitado';
COMMENT ON TABLE coach_client_health IS 'Dados de saúde dos clientes - RLS habilitado';
COMMENT ON TABLE coach_client_food_habits IS 'Hábitos alimentares dos clientes - RLS habilitado';

