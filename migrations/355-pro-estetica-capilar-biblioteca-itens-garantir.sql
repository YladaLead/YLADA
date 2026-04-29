-- Pro Estética Capilar: garante templates (FK) + 5 itens na biblioteca (b1000103–107).
-- Ordem: `ylada_link_templates` primeiro — `ylada_biblioteca_itens.template_id` referencia essa tabela.
-- Idempotente: ON CONFLICT nos templates; INSERT biblioteca WHERE NOT EXISTS (igual critério da 284).
-- Conteúdo dos 5 quizzes cabelo: extraído de migrations/284-ylada-biblioteca-estetica-expansao-quizzes.sql

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES
  (
    'b1000103-0103-4000-8000-000000000103',
    'quiz_cabelo_queda',
    'diagnostico',
    '{"title": "O que pode estar causando sua queda de cabelo?", "questions": [{"id": "q1", "text": "Quanto tempo você percebe a queda?", "type": "single", "options": ["Menos de 1 mês", "1 a 3 meses", "3 a 6 meses", "Mais de 6 meses"]}, {"id": "q2", "text": "Quantos fios você perde ao dia (aprox.)?", "type": "single", "options": ["Poucos (até 50)", "Moderado (50-100)", "Muito (100-150)", "Excessivo (mais de 150)"]}, {"id": "q3", "text": "Você passou por estresse ou mudança recente?", "type": "single", "options": ["Não", "Pouco", "Moderado", "Muito"]}, {"id": "q4", "text": "Sua alimentação é equilibrada?", "type": "single", "options": ["Sim", "Razoável", "Irregular", "Não"]}, {"id": "q5", "text": "Você usa fontes de calor (secador, chapinha) com frequência?", "type": "single", "options": ["Raramente", "Às vezes", "Frequentemente", "Todo dia"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero avaliar minha queda capilar", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000104-0104-4000-8000-000000000104',
    'quiz_cabelo_tipo_fio',
    'diagnostico',
    '{"title": "Qual é o verdadeiro tipo do seu fio?", "questions": [{"id": "q1", "text": "Seu cabelo tem formato natural definido?", "type": "single", "options": ["Sim, bem cacheado/ondulado", "Ondulado leve", "Quase liso", "Totalmente liso"]}, {"id": "q2", "text": "Qual a espessura dos fios?", "type": "single", "options": ["Fios finos", "Média", "Grossos", "Misto (fina na raiz, grossa nas pontas)"]}, {"id": "q3", "text": "Seu cabelo tem tendência a frizz?", "type": "single", "options": ["Não", "Pouco", "Moderado", "Muito"]}, {"id": "q4", "text": "Quanto tempo leva para secar naturalmente?", "type": "single", "options": ["Muito rápido", "Normal", "Demora um pouco", "Muito lento"]}, {"id": "q5", "text": "Seu cabelo absorve hidratantes com facilidade?", "type": "single", "options": ["Sim, demora para ficar pesado", "Às vezes", "Fica pesado fácil", "Muito oleoso"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero conhecer meu tipo de fio", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000105-0105-4000-8000-000000000105',
    'quiz_couro_cabeludo',
    'diagnostico',
    '{"title": "Seu couro cabeludo está saudável?", "questions": [{"id": "q1", "text": "Seu couro cabeludo coça com frequência?", "type": "single", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente"]}, {"id": "q2", "text": "Você percebe caspa ou descamação?", "type": "single", "options": ["Não", "Pouca", "Moderada", "Muita"]}, {"id": "q3", "text": "Seu couro cabeludo fica oleoso rapidamente?", "type": "single", "options": ["Não", "No 3º dia ou mais", "No 2º dia", "No mesmo dia"]}, {"id": "q4", "text": "Você usa produtos específicos para o couro cabeludo?", "type": "single", "options": ["Sim, regularmente", "Às vezes", "Raramente", "Nunca"]}, {"id": "q5", "text": "Você sente desconforto ou sensibilidade?", "type": "single", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero cuidar do meu couro cabeludo", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000106-0106-4000-8000-000000000106',
    'quiz_cabelo_hidratacao',
    'diagnostico',
    '{"title": "Seu cabelo está realmente hidratado?", "questions": [{"id": "q1", "text": "Com que frequência você faz hidratação?", "type": "single", "options": ["Semanalmente", "A cada 15 dias", "Mensalmente", "Raramente"]}, {"id": "q2", "text": "Seu cabelo está poroso ou emborrachado?", "type": "single", "options": ["Não", "Pouco", "Moderado", "Muito"]}, {"id": "q3", "text": "As pontas estão ressecadas ou duplas?", "type": "single", "options": ["Não", "Pouco", "Moderado", "Muito"]}, {"id": "q4", "text": "Seu cabelo tem brilho?", "type": "single", "options": ["Muito", "Normal", "Pouco", "Sem brilho"]}, {"id": "q5", "text": "Você usa leave-in ou produto de finalização?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero hidratar melhor meu cabelo", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000107-0107-4000-8000-000000000107',
    'quiz_cabelo_tintura',
    'diagnostico',
    '{"title": "Sua tintura está prejudicando seus fios?", "questions": [{"id": "q1", "text": "Com que frequência você tinge o cabelo?", "type": "single", "options": ["Raramente", "A cada 2-3 meses", "Mensalmente", "A cada 2-3 semanas"]}, {"id": "q2", "text": "Você usa produtos específicos para cabelo tingido?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q3", "text": "Seu cabelo desbota rapidamente?", "type": "single", "options": ["Não", "Pouco", "Moderado", "Muito"]}, {"id": "q4", "text": "Os fios estão quebradiços ou opacos?", "type": "single", "options": ["Não", "Pouco", "Moderado", "Muito"]}, {"id": "q5", "text": "Você faz reconstrução ou cronograma capilar?", "type": "single", "options": ["Sim, regularmente", "Às vezes", "Raramente", "Nunca"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero preservar minha cor e saúde capilar", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  )
-- Não sobrescrever schema_json (ex.: intros da migração 353) se o template já existir.
ON CONFLICT (id) DO NOTHING;

-- Itens da vitrine (após FK satisfeita)
INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics'], 'cabelo', 'habitos', 'O que pode estar causando sua queda de cabelo?', 'Identifique fatores que podem estar afetando seus fios e receba orientações.', 'Queda capilar', 'Reduzir queda e fortalecer', 'custom', 'b1000103-0103-4000-8000-000000000103'::uuid, 'diagnostico_risco', '{"num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 126, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000103-0103-4000-8000-000000000103');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics'], 'cabelo', 'habitos', 'Qual é o verdadeiro tipo do seu fio?', 'Descubra seu tipo de cabelo para escolher os cuidados certos.', 'Cuidados inadequados', 'Conhecer tipo de fio', 'custom', 'b1000104-0104-4000-8000-000000000104'::uuid, 'diagnostico_risco', '{"num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 127, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000104-0104-4000-8000-000000000104');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics'], 'cabelo', 'habitos', 'Seu couro cabeludo está saudável?', 'Avalie sinais de desequilíbrio e receba orientações especializadas.', 'Couro cabeludo irritado', 'Couro cabeludo saudável', 'custom', 'b1000105-0105-4000-8000-000000000105'::uuid, 'diagnostico_risco', '{"num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 128, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000105-0105-4000-8000-000000000105');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics'], 'cabelo', 'habitos', 'Seu cabelo está realmente hidratado?', 'Identifique sinais de desidratação e saiba como hidratar corretamente.', 'Cabelo ressecado', 'Cabelo hidratado e com brilho', 'custom', 'b1000106-0106-4000-8000-000000000106'::uuid, 'diagnostico_risco', '{"num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 129, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000106-0106-4000-8000-000000000106');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics'], 'cabelo', 'habitos', 'Sua tintura está prejudicando seus fios?', 'Avalie o impacto da coloração e como preservar a saúde capilar.', 'Cabelo danificado por tintura', 'Preservar cor e saúde', 'custom', 'b1000107-0107-4000-8000-000000000107'::uuid, 'diagnostico_risco', '{"num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 130, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000107-0107-4000-8000-000000000107');
