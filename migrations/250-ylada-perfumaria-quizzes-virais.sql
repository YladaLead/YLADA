-- =====================================================
-- Quizzes PERFUMARIA virais — fluxos prioritários + PERFUME_USAGE.
-- architecture=PERFUME_PROFILE, segment_code=perfumaria.
-- q3 = ambiente de uso → perfume_usage (dia_a_dia, trabalho, encontros, eventos)
-- IDs: b1000091 a b1000102 (12 quizzes)
-- =====================================================

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES
  -- 1. Qual fragrância combina com sua personalidade? (mais viral)
  (
    'b1000091-0091-4000-8000-000000000091',
    'quiz_fragrancia_personalidade',
    'diagnostico',
    '{"title": "Qual fragrância combina com sua personalidade?", "questions": [{"id": "q1", "text": "Você se considera mais:", "type": "single", "options": ["Intensa", "Elegante", "Alegre", "Discreta"]}, {"id": "q2", "text": "Você prefere perfumes:", "type": "single", "options": ["Doces", "Florais", "Cítricos", "Amadeirados"]}, {"id": "q3", "text": "Em qual ambiente você usa mais perfume?", "type": "single", "options": ["Trabalho", "Eventos", "Dia a dia", "Encontros"]}, {"id": "q4", "text": "Seu estilo é mais:", "type": "single", "options": ["Clássico", "Moderno", "Natural", "Marcante"]}, {"id": "q5", "text": "Você quer transmitir mais:", "type": "single", "options": ["Confiança", "Elegância", "Sedução", "Leveza"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu perfil de fragrância", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero descobrir qual perfume combina mais comigo", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  -- 2. Sua presença é suave ou marcante? (ultra viral)
  (
    'b1000092-0092-4000-8000-000000000092',
    'quiz_presenca_suave_marcante',
    'diagnostico',
    '{"title": "Sua presença é suave ou marcante?", "questions": [{"id": "q1", "text": "Como as pessoas costumam te descrever?", "type": "single", "options": ["Discreto", "Elegante", "Marcante", "Intenso"]}, {"id": "q2", "text": "Você prefere fragrâncias:", "type": "single", "options": ["Suaves", "Médias", "Marcantes", "Intensas"]}, {"id": "q3", "text": "Onde você mais usa perfume?", "type": "single", "options": ["Trabalho", "Eventos", "Dia a dia", "Encontros"]}, {"id": "q4", "text": "Você gosta de chamar atenção?", "type": "single", "options": ["Não", "Um pouco", "Sim", "Muito"]}, {"id": "q5", "text": "Seu estilo pessoal é mais:", "type": "single", "options": ["Minimalista", "Equilibrado", "Expressivo", "Ousado"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu perfil de presença", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero descobrir meu perfil de fragrância", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  -- 3. Descubra sua família olfativa ideal
  (
    'b1000093-0093-4000-8000-000000000093',
    'quiz_familia_olfativa',
    'diagnostico',
    '{"title": "Descubra sua família olfativa ideal", "questions": [{"id": "q1", "text": "Qual tipo de cheiro você mais gosta?", "type": "single", "options": ["Floral", "Amadeirado", "Cítrico", "Oriental"]}, {"id": "q2", "text": "Você prefere fragrâncias:", "type": "single", "options": ["Leves e frescas", "Doces (gourmand)", "Quentes e intensas", "Clássicas"]}, {"id": "q3", "text": "Em qual ocasião você mais usa perfume?", "type": "single", "options": ["Trabalho", "Eventos", "Dia a dia", "Encontros"]}, {"id": "q4", "text": "Qual ambiente você mais frequenta?", "type": "single", "options": ["Escritório", "Social", "Casa", "Balada/Noite"]}, {"id": "q5", "text": "Sua pele é mais:", "type": "single", "options": ["Seca", "Normal", "Oleosa", "Mista"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Sua família olfativa", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero receber sugestões de fragrâncias", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  -- 4. Seu perfume está combinando com sua fase de vida?
  (
    'b1000094-0094-4000-8000-000000000094',
    'quiz_perfume_fase_vida',
    'diagnostico',
    '{"title": "Seu perfume está combinando com sua fase de vida?", "questions": [{"id": "q1", "text": "Você quer sentir mais:", "type": "single", "options": ["Energia", "Leveza", "Poder", "Romantismo"]}, {"id": "q2", "text": "Sua rotina hoje está mais:", "type": "single", "options": ["Corrida", "Social", "Familiar", "Profissional"]}, {"id": "q3", "text": "Onde você mais usa perfume?", "type": "single", "options": ["Trabalho", "Eventos", "Dia a dia", "Encontros"]}, {"id": "q4", "text": "Você está em um momento de:", "type": "single", "options": ["Renovação", "Estabilidade", "Crescimento", "Reflexão"]}, {"id": "q5", "text": "Que energia você quer transmitir?", "type": "single", "options": ["Frescor", "Conforto", "Presença", "Sedução"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu perfil para esta fase", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero fragrâncias para meu momento", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  -- 5. Seu perfume revela sua energia
  (
    'b1000095-0095-4000-8000-000000000095',
    'quiz_perfume_revela_energia',
    'diagnostico',
    '{"title": "Seu perfume revela sua energia", "questions": [{"id": "q1", "text": "Você quer transmitir mais:", "type": "single", "options": ["Confiança", "Elegância", "Sedução", "Leveza"]}, {"id": "q2", "text": "Seu estilo é mais:", "type": "single", "options": ["Clássico", "Moderno", "Natural", "Marcante"]}, {"id": "q3", "text": "Em qual ambiente você usa mais perfume?", "type": "single", "options": ["Trabalho", "Eventos", "Dia a dia", "Encontros"]}, {"id": "q4", "text": "Como você se sente ao usar perfume?", "type": "single", "options": ["Mais confiante", "Mais elegante", "Mais sensual", "Mais leve"]}, {"id": "q5", "text": "Você prefere perfumes:", "type": "single", "options": ["Florais", "Amadeirados", "Cítricos", "Orientais"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Sua energia em fragrância", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero descobrir minha energia olfativa", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  -- 6. Seu estilo de perfume é mais dia ou noite?
  (
    'b1000096-0096-4000-8000-000000000096',
    'quiz_perfume_dia_noite',
    'diagnostico',
    '{"title": "Seu estilo de perfume é mais dia ou noite?", "questions": [{"id": "q1", "text": "Quando você mais usa perfume?", "type": "single", "options": ["Manhã", "Tarde", "Noite", "O dia todo"]}, {"id": "q2", "text": "Você prefere fragrâncias:", "type": "single", "options": ["Suaves", "Médias", "Marcantes", "Intensas"]}, {"id": "q3", "text": "Seu ambiente principal é:", "type": "single", "options": ["Trabalho", "Social", "Encontros", "Lazer"]}, {"id": "q4", "text": "Para ocasiões especiais você prefere:", "type": "single", "options": ["Leve", "Equilibrado", "Marcante", "Intenso"]}, {"id": "q5", "text": "Sua personalidade é mais:", "type": "single", "options": ["Discreta", "Equilibrada", "Expressiva", "Intensa"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu perfil dia/noite", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero montar minha coleção", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  -- 7. Qual perfume combina com seu estilo pessoal
  (
    'b1000097-0097-4000-8000-000000000097',
    'quiz_perfume_estilo_pessoal',
    'diagnostico',
    '{"title": "Qual perfume combina com seu estilo pessoal?", "questions": [{"id": "q1", "text": "Seu estilo é mais:", "type": "single", "options": ["Clássico", "Sofisticado", "Natural", "Sensual"]}, {"id": "q2", "text": "Você prefere fragrâncias:", "type": "single", "options": ["Florais", "Amadeiradas", "Cítricas", "Orientais"]}, {"id": "q3", "text": "Onde você mais usa perfume?", "type": "single", "options": ["Trabalho", "Eventos", "Dia a dia", "Encontros"]}, {"id": "q4", "text": "Você se considera:", "type": "single", "options": ["Discreto", "Elegante", "Marcante", "Intenso"]}, {"id": "q5", "text": "Perfume para você é:", "type": "single", "options": ["Detalhe", "Complemento", "Expressão", "Assinatura"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu perfil de fragrância", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero fragrância que me represente", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  -- 8. Descubra seu perfil de fragrância (genérico viral)
  (
    'b1000098-0098-4000-8000-000000000098',
    'quiz_descubra_perfil_fragrancia',
    'diagnostico',
    '{"title": "Descubra seu perfil de fragrância", "questions": [{"id": "q1", "text": "Como você se descreve?", "type": "single", "options": ["Intenso", "Elegante", "Alegre", "Discreto"]}, {"id": "q2", "text": "Qual família olfativa te atrai?", "type": "single", "options": ["Floral", "Amadeirado", "Cítrico", "Oriental"]}, {"id": "q3", "text": "Em qual ambiente você usa mais perfume?", "type": "single", "options": ["Trabalho", "Eventos", "Dia a dia", "Encontros"]}, {"id": "q4", "text": "Você quer transmitir:", "type": "single", "options": ["Confiança", "Elegância", "Sedução", "Leveza"]}, {"id": "q5", "text": "Sua presença é mais:", "type": "single", "options": ["Suave", "Elegante", "Marcante", "Intensa"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu perfil de fragrância", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero descobrir meu perfume ideal", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  -- 9. Qual perfume combina com você?
  (
    'b1000099-0099-4000-8000-000000000099',
    'quiz_qual_perfume_combina',
    'diagnostico',
    '{"title": "Qual perfume combina com você?", "questions": [{"id": "q1", "text": "Você se considera:", "type": "single", "options": ["Clássico", "Moderno", "Natural", "Ousado"]}, {"id": "q2", "text": "Prefere perfumes:", "type": "single", "options": ["Doces", "Florais", "Cítricos", "Amadeirados"]}, {"id": "q3", "text": "Onde você mais usa perfume?", "type": "single", "options": ["Trabalho", "Eventos", "Dia a dia", "Encontros"]}, {"id": "q4", "text": "Sua energia é mais:", "type": "single", "options": ["Suave", "Equilibrada", "Vibrante", "Intensa"]}, {"id": "q5", "text": "Você gosta de:", "type": "single", "options": ["Discretude", "Elegância", "Presença", "Impacto"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu perfume ideal", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero receber sugestões", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  -- 10. Seu estilo olfativo
  (
    'b1000100-0100-4000-8000-000000000100',
    'quiz_estilo_olfativo',
    'diagnostico',
    '{"title": "Seu estilo olfativo", "questions": [{"id": "q1", "text": "Qual tipo de fragrância te atrai?", "type": "single", "options": ["Floral", "Amadeirado", "Cítrico", "Gourmand"]}, {"id": "q2", "text": "Você prefere intensidade:", "type": "single", "options": ["Leve", "Média", "Marcante", "Intensa"]}, {"id": "q3", "text": "Em qual ocasião você usa mais perfume?", "type": "single", "options": ["Trabalho", "Eventos", "Dia a dia", "Encontros"]}, {"id": "q4", "text": "Seu estilo pessoal:", "type": "single", "options": ["Minimalista", "Clássico", "Moderno", "Ousado"]}, {"id": "q5", "text": "Você quer que seu perfume:", "type": "single", "options": ["Passe despercebido", "Complemente", "Destaque", "Defina"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu estilo olfativo", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero descobrir minha assinatura olfativa", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  -- 11. Teste rápido de perfume
  (
    'b1000101-0101-4000-8000-000000000101',
    'quiz_teste_rapido_perfume',
    'diagnostico',
    '{"title": "Teste rápido de perfume", "questions": [{"id": "q1", "text": "Você prefere:", "type": "single", "options": ["Leveza", "Elegância", "Presença", "Intensidade"]}, {"id": "q2", "text": "Família olfativa preferida:", "type": "single", "options": ["Floral", "Amadeirado", "Cítrico", "Oriental"]}, {"id": "q3", "text": "Onde você usa perfume?", "type": "single", "options": ["Trabalho", "Eventos", "Dia a dia", "Encontros"]}, {"id": "q4", "text": "Sua personalidade:", "type": "single", "options": ["Discreta", "Elegante", "Marcante", "Intensa"]}, {"id": "q5", "text": "Você busca:", "type": "single", "options": ["Conforto", "Sofisticação", "Sedução", "Energia"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero meu perfil de fragrância", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  -- 12. Seu perfume ideal
  (
    'b1000102-0102-4000-8000-000000000102',
    'quiz_seu_perfume_ideal',
    'diagnostico',
    '{"title": "Seu perfume ideal", "questions": [{"id": "q1", "text": "Como você quer ser percebido(a)?", "type": "single", "options": ["Discreto", "Elegante", "Marcante", "Intenso"]}, {"id": "q2", "text": "Qual fragrância te atrai?", "type": "single", "options": ["Floral", "Amadeirado", "Cítrico", "Oriental"]}, {"id": "q3", "text": "Principal uso do perfume:", "type": "single", "options": ["Trabalho", "Eventos", "Dia a dia", "Encontros"]}, {"id": "q4", "text": "Seu estilo:", "type": "single", "options": ["Natural", "Clássico", "Moderno", "Sensual"]}, {"id": "q5", "text": "Você transmite:", "type": "single", "options": ["Leveza", "Elegância", "Confiança", "Sedução"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu perfume ideal", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero sugestões personalizadas", "resultIntro": "Seu resultado:"}'::jsonb,
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

-- Inserir itens na biblioteca com meta para PERFUME_PROFILE
INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, meta, sort_order, active)
VALUES
  ('quiz', ARRAY['perfumaria'], 'personalidade_fragrancia', 'habitos', 'Qual fragrância combina com sua personalidade?', 'Descubra fragrâncias que refletem quem você é. O mais viral.', 'Não sabe qual perfume combina comigo', 'Expressar personalidade através de fragrâncias', 'custom', 'b1000091-0091-4000-8000-000000000091', '{"architecture":"PERFUME_PROFILE","segment_code":"perfumaria"}'::jsonb, 170, true),
  ('quiz', ARRAY['perfumaria'], 'personalidade_fragrancia', 'habitos', 'Sua presença é suave ou marcante?', 'Teste rápido e viral. Descubra seu perfil de presença.', 'Não sabe qual perfume combina comigo', 'Encontrar perfume ideal para mim', 'custom', 'b1000092-0092-4000-8000-000000000092', '{"architecture":"PERFUME_PROFILE","segment_code":"perfumaria"}'::jsonb, 171, true),
  ('quiz', ARRAY['perfumaria'], 'familia_olfativa', 'habitos', 'Descubra sua família olfativa ideal', 'Fluxo educativo. Florais, amadeirados, cítricos, orientais.', 'Confusão entre tantas opções', 'Encontrar perfume ideal para mim', 'custom', 'b1000093-0093-4000-8000-000000000093', '{"architecture":"PERFUME_PROFILE","segment_code":"perfumaria"}'::jsonb, 172, true),
  ('quiz', ARRAY['perfumaria'], 'personalidade_fragrancia', 'habitos', 'Seu perfume está combinando com sua fase de vida?', 'Forte emocionalmente. Perfumes para seu momento.', 'Não sabe qual perfume combina comigo', 'Perfume para ocasiões especiais', 'custom', 'b1000094-0094-4000-8000-000000000094', '{"architecture":"PERFUME_PROFILE","segment_code":"perfumaria"}'::jsonb, 173, true),
  ('quiz', ARRAY['perfumaria'], 'personalidade_fragrancia', 'habitos', 'Seu perfume revela sua energia', 'Fluxo emocional. Qual energia você transmite?', 'Não sabe qual perfume combina comigo', 'Expressar personalidade através de fragrâncias', 'custom', 'b1000095-0095-4000-8000-000000000095', '{"architecture":"PERFUME_PROFILE","segment_code":"perfumaria"}'::jsonb, 174, true),
  ('quiz', ARRAY['perfumaria'], 'ocasiao_uso', 'habitos', 'Seu estilo de perfume é mais dia ou noite?', 'Muito bom para vendas. Perfumes por ocasião.', 'Não sei qual ocasião usar cada fragrância', 'Criar coleção de fragrâncias', 'custom', 'b1000096-0096-4000-8000-000000000096', '{"architecture":"PERFUME_PROFILE","segment_code":"perfumaria"}'::jsonb, 175, true),
  ('quiz', ARRAY['perfumaria'], 'personalidade_fragrancia', 'habitos', 'Qual perfume combina com seu estilo pessoal?', 'Clássico, sofisticado, natural ou sensual.', 'Não sabe qual perfume combina comigo', 'Expressar personalidade através de fragrâncias', 'custom', 'b1000097-0097-4000-8000-000000000097', '{"architecture":"PERFUME_PROFILE","segment_code":"perfumaria"}'::jsonb, 176, true),
  ('quiz', ARRAY['perfumaria'], 'perfume_assinatura', 'habitos', 'Descubra seu perfil de fragrância', 'Quiz viral. Descubra qual perfume combina com você.', 'Não tenho um perfume assinatura', 'Encontrar perfume ideal para mim', 'custom', 'b1000098-0098-4000-8000-000000000098', '{"architecture":"PERFUME_PROFILE","segment_code":"perfumaria"}'::jsonb, 177, true),
  ('quiz', ARRAY['perfumaria'], 'preferencias_olfativas', 'habitos', 'Qual perfume combina com você?', 'Descubra seu perfume ideal em poucas perguntas.', 'Não sabe qual perfume combina comigo', 'Encontrar perfume ideal para mim', 'custom', 'b1000099-0099-4000-8000-000000000099', '{"architecture":"PERFUME_PROFILE","segment_code":"perfumaria"}'::jsonb, 178, true),
  ('quiz', ARRAY['perfumaria'], 'familia_olfativa', 'habitos', 'Seu estilo olfativo', 'Descubra sua assinatura olfativa.', 'Confusão entre tantas opções', 'Expressar personalidade através de fragrâncias', 'custom', 'b1000100-0100-4000-8000-000000000100', '{"architecture":"PERFUME_PROFILE","segment_code":"perfumaria"}'::jsonb, 179, true),
  ('quiz', ARRAY['perfumaria'], 'preferencias_olfativas', 'habitos', 'Teste rápido de perfume', 'Perguntas rápidas. Resultado na hora.', 'Confusão entre tantas opções', 'Encontrar perfume ideal para mim', 'custom', 'b1000101-0101-4000-8000-000000000101', '{"architecture":"PERFUME_PROFILE","segment_code":"perfumaria"}'::jsonb, 180, true),
  ('quiz', ARRAY['perfumaria'], 'perfume_assinatura', 'habitos', 'Seu perfume ideal', 'Receba sugestões personalizadas para seu perfil.', 'Não tenho um perfume assinatura', 'Encontrar perfume ideal para mim', 'custom', 'b1000102-0102-4000-8000-000000000102', '{"architecture":"PERFUME_PROFILE","segment_code":"perfumaria"}'::jsonb, 181, true);
