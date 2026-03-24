-- =====================================================
-- Biblioteca Estética: Cabelo, Unhas, Sobrancelha, Maquiagem.
-- IDs: b1000055 a b1000058
-- =====================================================

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES
  (
    'b1000055-0055-4000-8000-000000000055',
    'quiz_cabelo_saudavel',
    'diagnostico',
    '{"title": "Seu cabelo está recebendo os cuidados certos?", "questions": [{"id": "q1", "text": "Você sabe qual é seu tipo de fio?", "type": "single", "options": ["Sim", "Tenho ideia", "Não tenho certeza", "Não sei"]}, {"id": "q2", "text": "Com que frequência você hidrata o cabelo?", "type": "single", "options": ["Semanalmente", "A cada 15 dias", "Mensalmente", "Raramente"]}, {"id": "q3", "text": "Você percebe queda de cabelo?", "type": "single", "options": ["Não", "Pouca", "Moderada", "Muita"]}, {"id": "q4", "text": "Seu couro cabeludo coça ou descama?", "type": "single", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente"]}, {"id": "q5", "text": "Você sente que seu cabelo poderia estar mais saudável?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero cuidar melhor do meu cabelo", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000056-0056-4000-8000-000000000056',
    'quiz_unhas_saudaveis',
    'diagnostico',
    '{"title": "Suas unhas estão fortes e saudáveis?", "questions": [{"id": "q1", "text": "Suas unhas quebram com facilidade?", "type": "single", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente"]}, {"id": "q2", "text": "Você cuida das cutículas?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q3", "text": "Suas unhas têm manchas ou ondulações?", "type": "single", "options": ["Não", "Poucas", "Algumas", "Muitas"]}, {"id": "q4", "text": "Você usa base ou fortalecedor?", "type": "single", "options": ["Sim", "Às vezes", "Raramente", "Nunca"]}, {"id": "q5", "text": "Você gostaria de unhas mais fortes e bonitas?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero cuidar das minhas unhas", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000057-0057-4000-8000-000000000057',
    'quiz_sobrancelha_formato',
    'diagnostico',
    '{"title": "Qual formato de sobrancelha combina com você?", "questions": [{"id": "q1", "text": "Você conhece o formato ideal para seu rosto?", "type": "single", "options": ["Sim", "Mais ou menos", "Não tenho certeza", "Não sei"]}, {"id": "q2", "text": "Com que frequência você faz a sobrancelha?", "type": "single", "options": ["Semanalmente", "Quinzenalmente", "Mensalmente", "Raramente"]}, {"id": "q3", "text": "Sua sobrancelha está simétrica?", "type": "single", "options": ["Sim", "Quase", "Não muito", "Não"]}, {"id": "q4", "text": "Você usa produtos para preencher ou definir?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q5", "text": "Você gostaria de valorizar seu rosto com a sobrancelha?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero avaliar minha sobrancelha", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000058-0058-4000-8000-000000000058',
    'quiz_maquiagem_tipo_pele',
    'diagnostico',
    '{"title": "Qual maquiagem valoriza seu tipo de pele?", "questions": [{"id": "q1", "text": "Você sabe qual é seu tipo de pele?", "type": "single", "options": ["Sim", "Tenho ideia", "Não tenho certeza", "Não sei"]}, {"id": "q2", "text": "Sua base dura o dia todo?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q3", "text": "Sua pele fica oleosa durante o dia?", "type": "single", "options": ["Nunca", "Pouco", "Moderado", "Muito"]}, {"id": "q4", "text": "Você usa primer ou preparador antes da maquiagem?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q5", "text": "Você gostaria de uma maquiagem que valorize sua pele?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero descobrir minha maquiagem ideal", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  schema_json = EXCLUDED.schema_json,
  allowed_vars_json = EXCLUDED.allowed_vars_json,
  version = EXCLUDED.version,
  active = EXCLUDED.active,
  updated_at = NOW();

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics'], 'cabelo', 'habitos', 'Seu cabelo está recebendo os cuidados certos?', 'Identifique se sua rotina está adequada ao seu tipo de fio.', 'Queda ou fraqueza', 'Cabelo saudável', 'custom', 'b1000055-0055-4000-8000-000000000055', 'diagnostico_risco', '{"num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 122, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE tema = 'cabelo' AND 'aesthetics' = ANY(segment_codes));

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics'], 'unhas', 'habitos', 'Suas unhas estão fortes e saudáveis?', 'Identifique sinais de fragilidade e receba orientações.', 'Unhas fracas', 'Unhas fortes e bonitas', 'custom', 'b1000056-0056-4000-8000-000000000056', 'diagnostico_risco', '{"num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 123, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE tema = 'unhas' AND 'aesthetics' = ANY(segment_codes));

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics'], 'sobrancelha', 'habitos', 'Qual formato de sobrancelha combina com você?', 'Descubra o formato que valoriza seu rosto.', 'Sobrancelha irregular', 'Sobrancelha definida', 'custom', 'b1000057-0057-4000-8000-000000000057', 'diagnostico_risco', '{"num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 124, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE tema = 'sobrancelha' AND 'aesthetics' = ANY(segment_codes));

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics'], 'maquiagem', 'habitos', 'Qual maquiagem valoriza seu tipo de pele?', 'Descubra produtos e técnicas para seu perfil.', 'Maquiagem inadequada', 'Maquiagem que valoriza', 'custom', 'b1000058-0058-4000-8000-000000000058', 'diagnostico_risco', '{"num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 125, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE tema = 'maquiagem' AND 'aesthetics' = ANY(segment_codes));
