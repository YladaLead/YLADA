-- =====================================================
-- VIEWS PARA RELATÓRIOS DE GESTÃO
-- =====================================================
-- Estas views facilitam consultas de relatórios e melhoram performance

-- View: Resumo de Evolução Física por Cliente
CREATE OR REPLACE VIEW vw_evolucao_resumo AS
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

-- View: Resumo de Consultas
CREATE OR REPLACE VIEW vw_consultas_resumo AS
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

-- View: Resumo de Avaliações
CREATE OR REPLACE VIEW vw_avaliacoes_resumo AS
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

-- View: Resumo de Programas e Adesão
CREATE OR REPLACE VIEW vw_programas_adesao AS
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

-- View: Resumo de Formulários e Respostas
CREATE OR REPLACE VIEW vw_formularios_respostas AS
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

-- Índices adicionais para melhorar performance dos relatórios
CREATE INDEX IF NOT EXISTS idx_client_evolution_measurement_date ON client_evolution(measurement_date);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_type ON appointments(appointment_type);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at);
CREATE INDEX IF NOT EXISTS idx_assessments_completed_at ON assessments(completed_at);
CREATE INDEX IF NOT EXISTS idx_assessments_is_reevaluation ON assessments(is_reevaluation);
CREATE INDEX IF NOT EXISTS idx_programs_status ON programs(status);
CREATE INDEX IF NOT EXISTS idx_form_responses_created_at ON form_responses(created_at);
CREATE INDEX IF NOT EXISTS idx_form_responses_client_id ON form_responses(client_id) WHERE client_id IS NOT NULL;

