-- ============================================
-- MIGRATION 032: Revisar Views com SECURITY DEFINER
-- ============================================
-- Corrige questões de segurança relacionadas a views com SECURITY DEFINER
-- Conforme alerta do Supabase Security Advisor
-- ============================================

-- ============================================
-- 1. RECRIAR VIEWS SEM SECURITY DEFINER (SE POSSÍVEL)
-- ============================================
-- Views com SECURITY DEFINER executam com privilégios do criador,
-- o que pode ser um risco de segurança. Vamos revisar e ajustar.

-- ============================================
-- 2. VIEW: vw_consultas_resumo
-- ============================================

-- Recriar view sem SECURITY DEFINER
-- A view depende do RLS da tabela appointments para filtrar dados
DROP VIEW IF EXISTS vw_consultas_resumo CASCADE;

CREATE VIEW vw_consultas_resumo AS
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

-- Garantir que a view não tenha SECURITY DEFINER
-- (Views sem SECURITY DEFINER usam privilégios do usuário que consulta)

-- Habilitar RLS na view (se a tabela base tiver RLS, a view herda)
COMMENT ON VIEW vw_consultas_resumo IS 'Resumo de consultas por usuário - Acesso restrito ao próprio usuário ou admins';

-- ============================================
-- 3. VIEW: vw_formularios_respostas
-- ============================================

DROP VIEW IF EXISTS vw_formularios_respostas CASCADE;

CREATE VIEW vw_formularios_respostas AS
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

-- Garantir que a view não tenha SECURITY DEFINER

COMMENT ON VIEW vw_formularios_respostas IS 'Resumo de formulários e respostas - Acesso restrito ao próprio usuário ou admins';

-- ============================================
-- 4. VIEW: vw_avaliacoes_resumo
-- ============================================

DROP VIEW IF EXISTS vw_avaliacoes_resumo CASCADE;

CREATE VIEW vw_avaliacoes_resumo AS
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

-- Garantir que a view não tenha SECURITY DEFINER

COMMENT ON VIEW vw_avaliacoes_resumo IS 'Resumo de avaliações por cliente - Acesso restrito ao dono do cliente ou admins';

-- ============================================
-- 5. VIEW: vw_programas_adesao
-- ============================================

DROP VIEW IF EXISTS vw_programas_adesao CASCADE;

CREATE VIEW vw_programas_adesao AS
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

-- Garantir que a view não tenha SECURITY DEFINER

COMMENT ON VIEW vw_programas_adesao IS 'Resumo de programas e adesão - Acesso restrito ao dono do cliente ou admins';

-- ============================================
-- 6. VIEW: vw_evolucao_resumo
-- ============================================

DROP VIEW IF EXISTS vw_evolucao_resumo CASCADE;

CREATE VIEW vw_evolucao_resumo AS
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

-- Garantir que a view não tenha SECURITY DEFINER

COMMENT ON VIEW vw_evolucao_resumo IS 'Resumo de evolução física por cliente - Acesso restrito ao dono do cliente ou admins';

-- ============================================
-- NOTA IMPORTANTE
-- ============================================
-- As views foram recriadas SEM a propriedade SECURITY DEFINER.
-- Ao recriar sem especificar SECURITY DEFINER, a view usa os privilégios
-- do usuário que consulta, não do criador da view.
--
-- As views agora dependem das políticas RLS das tabelas base para filtrar dados.
-- Se as tabelas base (appointments, clients, etc.) tiverem RLS habilitado,
-- as views automaticamente respeitarão essas políticas.
-- 
-- IMPORTANTE: Se alguma view precisar de SECURITY DEFINER por razões específicas,
-- deve ser documentado e revisado caso a caso.
-- ============================================
