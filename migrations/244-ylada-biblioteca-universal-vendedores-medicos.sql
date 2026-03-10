-- =====================================================
-- Biblioteca Universal: Vendedores de Suplementos (4) + Médicos/Bem-estar (5).
-- IDs: b1000071 a b1000079
-- =====================================================

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES
  -- VENDEDORES DE SUPLEMENTOS
  (
    'b1000071-0071-4000-8000-000000000071',
    'quiz_energia_diaria_vendedor',
    'diagnostico',
    '{"title": "Descubra seu nível de energia diária", "questions": [{"id": "q1", "text": "Como você se sente ao acordar pela manhã?", "type": "single", "options": ["Muito disposto", "Normal", "Um pouco cansado", "Muito cansado"]}, {"id": "q2", "text": "Você sente queda de energia durante o dia?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q3", "text": "Você precisa de café ou estimulantes para funcionar?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q4", "text": "Você sente dificuldade de manter foco e concentração?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q5", "text": "Você sente que poderia ter mais energia no dia a dia?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero melhorar minha energia", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000072-0072-4000-8000-000000000072',
    'quiz_metabolismo_ajuda_vendedor',
    'diagnostico',
    '{"title": "Seu metabolismo pode estar pedindo ajuda?", "questions": [{"id": "q1", "text": "Você ganha peso com facilidade?", "type": "single", "options": ["Não", "Um pouco", "Sim", "Muito"]}, {"id": "q2", "text": "Você sente dificuldade para perder peso?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q3", "text": "Você sente cansaço frequente?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q4", "text": "Você sente que seu corpo responde lentamente às mudanças?", "type": "single", "options": ["Não", "Um pouco", "Sim", "Muito"]}, {"id": "q5", "text": "Você sente que seu metabolismo poderia funcionar melhor?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero melhorar meu metabolismo", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000073-0073-4000-8000-000000000073',
    'quiz_nutrientes_corpo_vendedor',
    'diagnostico',
    '{"title": "Seu corpo está recebendo os nutrientes que precisa?", "questions": [{"id": "q1", "text": "Você consome frutas e vegetais diariamente?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q2", "text": "Sua alimentação é equilibrada?", "type": "single", "options": ["Muito equilibrada", "Boa", "Irregular", "Desorganizada"]}, {"id": "q3", "text": "Você sente falta de energia mesmo se alimentando?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q4", "text": "Você já considerou suplementar nutrientes?", "type": "single", "options": ["Sim", "Já pensei", "Pouco", "Nunca"]}, {"id": "q5", "text": "Você sente que sua alimentação poderia ser mais completa?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero melhorar minha nutrição", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000074-0074-4000-8000-000000000074',
    'quiz_corpo_pedindo_energia',
    'diagnostico',
    '{"title": "Seu corpo está pedindo mais energia?", "questions": [{"id": "q1", "text": "Você sente cansaço ao longo do dia?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q2", "text": "Você sente queda de rendimento à tarde?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q3", "text": "Você sente dificuldade para manter foco?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q4", "text": "Você sente que sua alimentação não sustenta seu dia?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q5", "text": "Você gostaria de melhorar sua disposição diária?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero aumentar minha energia", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  -- MÉDICOS / BEM-ESTAR
  (
    'b1000075-0075-4000-8000-000000000075',
    'quiz_energia_adequada_rotina',
    'diagnostico',
    '{"title": "Seu nível de energia é adequado para sua rotina?", "questions": [{"id": "q1", "text": "Você se sente disposto ao longo do dia?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q2", "text": "Você sente cansaço antes do final do dia?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q3", "text": "Você precisa de estimulantes para manter energia?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q4", "text": "Você sente queda de produtividade por cansaço?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q5", "text": "Você sente que poderia ter mais energia na rotina?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero melhorar minha disposição", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000076-0076-4000-8000-000000000076',
    'quiz_rotina_protegendo_saude',
    'diagnostico',
    '{"title": "Sua rotina está protegendo sua saúde futura?", "questions": [{"id": "q1", "text": "Você pratica atividade física regularmente?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q2", "text": "Sua alimentação é equilibrada?", "type": "single", "options": ["Muito", "Razoavelmente", "Pouco", "Nada"]}, {"id": "q3", "text": "Você dorme bem?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q4", "text": "Você faz exames preventivos?", "type": "single", "options": ["Regularmente", "Às vezes", "Raramente", "Nunca"]}, {"id": "q5", "text": "Você sente que cuida bem da sua saúde?", "type": "single", "options": ["Sim", "Em parte", "Pouco", "Não"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero avaliar minha saúde", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000077-0077-4000-8000-000000000077',
    'quiz_sinais_alerta_corpo',
    'diagnostico',
    '{"title": "Seu corpo está dando sinais de alerta?", "questions": [{"id": "q1", "text": "Você sente cansaço frequente?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q2", "text": "Você sente dores recorrentes?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q3", "text": "Você sente dificuldade de concentração?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q4", "text": "Você sente mudanças recentes no corpo?", "type": "single", "options": ["Não", "Pequenas", "Sim", "Muitas"]}, {"id": "q5", "text": "Você sente que deveria cuidar mais da saúde?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero avaliar minha saúde", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000078-0078-4000-8000-000000000078',
    'quiz_estilo_vida_envelhecendo',
    'diagnostico',
    '{"title": "Seu estilo de vida está envelhecendo seu corpo?", "questions": [{"id": "q1", "text": "Você dorme menos do que gostaria?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q2", "text": "Você sente estresse frequente?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q3", "text": "Você passa muitas horas sentado?", "type": "single", "options": ["Não", "Algumas", "Muitas", "Quase o dia todo"]}, {"id": "q4", "text": "Você pratica atividade física?", "type": "single", "options": ["Regularmente", "Às vezes", "Raramente", "Nunca"]}, {"id": "q5", "text": "Você sente que poderia ter hábitos mais saudáveis?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero melhorar meu estilo de vida", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000079-0079-4000-8000-000000000079',
    'quiz_estresse_afetando_saude',
    'diagnostico',
    '{"title": "Seu nível de estresse pode estar afetando sua saúde?", "questions": [{"id": "q1", "text": "Você sente tensão no dia a dia?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q2", "text": "Você tem dificuldade para relaxar?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q3", "text": "Seu sono é afetado pelo estresse?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q4", "text": "Você sente impacto do estresse na saúde física?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q5", "text": "Você gostaria de ter mais equilíbrio na rotina?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero melhorar minha saúde", "resultIntro": "Seu resultado:"}'::jsonb,
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

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, meta, sort_order, active)
VALUES
  ('quiz', ARRAY['nutrition_vendedor'], 'energia', 'energia', 'Descubra seu nível de energia diária', 'Avalie sua energia e receba orientações para melhorar a disposição.', 'Falta de energia', 'Melhorar disposição', 'custom', 'b1000071-0071-4000-8000-000000000071', '{}', 160, true),
  ('quiz', ARRAY['nutrition_vendedor'], 'metabolismo', 'metabolismo', 'Seu metabolismo pode estar pedindo ajuda?', 'Identifique sinais de metabolismo que pode ser otimizado.', 'Metabolismo lento', 'Melhorar metabolismo', 'custom', 'b1000072-0072-4000-8000-000000000072', '{}', 161, true),
  ('quiz', ARRAY['nutrition_vendedor'], 'intestino', 'digestao', 'Seu corpo está recebendo os nutrientes que precisa?', 'Avalie se sua alimentação está completa.', 'Deficiência nutricional', 'Melhorar nutrição', 'custom', 'b1000073-0073-4000-8000-000000000073', '{}', 162, true),
  ('quiz', ARRAY['nutrition_vendedor'], 'energia', 'energia', 'Seu corpo está pedindo mais energia?', 'Identifique padrões que podem contribuir para o cansaço.', 'Fadiga', 'Aumentar energia', 'custom', 'b1000074-0074-4000-8000-000000000074', '{}', 163, true),
  ('quiz', ARRAY['medicine'], 'vitalidade', 'energia', 'Seu nível de energia é adequado para sua rotina?', 'Avalie se sua energia acompanha as exigências do dia a dia.', 'Baixa energia', 'Melhorar disposição', 'custom', 'b1000075-0075-4000-8000-000000000075', '{}', 170, true),
  ('quiz', ARRAY['medicine'], 'qualidade_vida', 'habitos', 'Sua rotina está protegendo sua saúde futura?', 'Avalie se seus hábitos estão favorecendo a prevenção.', 'Hábitos prejudiciais', 'Prevenção', 'custom', 'b1000076-0076-4000-8000-000000000076', '{}', 171, true),
  ('quiz', ARRAY['medicine'], 'prevencao', 'habitos', 'Seu corpo está dando sinais de alerta?', 'Identifique sinais que merecem atenção.', 'Sinais ignorados', 'Prevenção', 'custom', 'b1000077-0077-4000-8000-000000000077', '{}', 172, true),
  ('quiz', ARRAY['medicine'], 'estilo_vida', 'habitos', 'Seu estilo de vida está envelhecendo seu corpo?', 'Avalie hábitos que podem acelerar o desgaste do organismo.', 'Hábitos prejudiciais', 'Melhorar qualidade de vida', 'custom', 'b1000078-0078-4000-8000-000000000078', '{}', 173, true),
  ('quiz', ARRAY['medicine'], 'estresse', 'mente', 'Seu nível de estresse pode estar afetando sua saúde?', 'Avalie o impacto do estresse na sua saúde.', 'Estresse', 'Melhorar equilíbrio', 'custom', 'b1000079-0079-4000-8000-000000000079', '{}', 174, true);
