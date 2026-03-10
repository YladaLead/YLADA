-- =====================================================
-- Biblioteca Universal: 8 quizzes NUTRIÇÃO.
-- Templates + itens biblioteca. Sem pontuação, diagnóstico via YLADA.
-- IDs: b1000035 a b1000042
-- =====================================================

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES
  (
    'b1000035-0035-4000-8000-000000000035',
    'quiz_metabolismo_lento',
    'diagnostico',
    '{"title": "Descubra se seu metabolismo está lento", "questions": [{"id": "q1", "text": "Você sente dificuldade para perder peso?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q2", "text": "Você sente cansaço mesmo após dormir bem?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q3", "text": "Você ganha peso com facilidade?", "type": "single", "options": ["Não", "Um pouco", "Sim", "Muito"]}, {"id": "q4", "text": "Você sente fome frequente ao longo do dia?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q5", "text": "Você sente dificuldade em manter energia durante o dia?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero entender como melhorar meu metabolismo", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000036-0036-4000-8000-000000000036',
    'quiz_intestino_funcionando',
    'diagnostico',
    '{"title": "Seu intestino está funcionando bem?", "questions": [{"id": "q1", "text": "Com que frequência você vai ao banheiro?", "type": "single", "options": ["Todos os dias", "Quase todos os dias", "Algumas vezes por semana", "Raramente"]}, {"id": "q2", "text": "Você sente inchaço abdominal?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q3", "text": "Você sente desconforto digestivo após refeições?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q4", "text": "Sua digestão costuma ser tranquila?", "type": "single", "options": ["Sempre", "Na maioria das vezes", "Às vezes", "Raramente"]}, {"id": "q5", "text": "Você sente que seu intestino poderia funcionar melhor?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero melhorar meu intestino", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000037-0037-4000-8000-000000000037',
    'quiz_bloqueio_emagrecimento',
    'diagnostico',
    '{"title": "Qual é o verdadeiro bloqueio do seu emagrecimento?", "questions": [{"id": "q1", "text": "Você já tentou várias dietas?", "type": "single", "options": ["Nunca", "Algumas vezes", "Muitas vezes", "Inúmeras vezes"]}, {"id": "q2", "text": "Você sente dificuldade em manter uma rotina alimentar?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q3", "text": "Você sente fome fora de hora?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q4", "text": "Seu peso costuma oscilar?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q5", "text": "Você sente que algo está bloqueando seus resultados?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero descobrir meu bloqueio", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000038-0038-4000-8000-000000000038',
    'quiz_retencao_liquido',
    'diagnostico',
    '{"title": "Seu corpo está acumulando retenção de líquido?", "questions": [{"id": "q1", "text": "Você percebe inchaço ao longo do dia?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q2", "text": "Seus anéis ou roupas ficam apertados em alguns dias?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q3", "text": "Você sente pernas pesadas ou inchadas?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q4", "text": "Você bebe bastante água diariamente?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q5", "text": "Você sente que seu corpo retém líquidos facilmente?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero reduzir meu inchaço", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000039-0039-4000-8000-000000000039',
    'quiz_energia_alimentar',
    'diagnostico',
    '{"title": "Descubra seu nível de energia alimentar", "questions": [{"id": "q1", "text": "Você sente queda de energia após refeições?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q2", "text": "Você precisa de café ou estimulantes para manter energia?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q3", "text": "Você sente sono após o almoço?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q4", "text": "Sua alimentação te deixa disposto durante o dia?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q5", "text": "Você sente que poderia ter mais energia com ajustes na alimentação?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero melhorar minha energia", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000040-0040-4000-8000-000000000040',
    'quiz_corpo_inflamado',
    'diagnostico',
    '{"title": "Seu corpo pode estar inflamado?", "questions": [{"id": "q1", "text": "Você sente inchaço frequente?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q2", "text": "Você sente fadiga sem motivo claro?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q3", "text": "Você sente dores no corpo com frequência?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q4", "text": "Sua alimentação inclui muitos alimentos ultraprocessados?", "type": "single", "options": ["Não", "Poucos", "Alguns", "Muitos"]}, {"id": "q5", "text": "Você sente que seu corpo poderia estar mais leve?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero entender minha inflamação", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000041-0041-4000-8000-000000000041',
    'quiz_rotina_alimentar',
    'diagnostico',
    '{"title": "Sua rotina alimentar ajuda ou atrapalha seu corpo?", "questions": [{"id": "q1", "text": "Você costuma pular refeições?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q2", "text": "Sua alimentação tem horários regulares?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q3", "text": "Você consome frutas e vegetais diariamente?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q4", "text": "Você come por ansiedade ou emoção?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q5", "text": "Você acredita que sua alimentação poderia melhorar?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero ajustar minha alimentação", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000042-0042-4000-8000-000000000042',
    'quiz_comendo_certo',
    'diagnostico',
    '{"title": "Você está comendo certo para seu corpo?", "questions": [{"id": "q1", "text": "Você conhece suas necessidades nutricionais?", "type": "single", "options": ["Sim", "Um pouco", "Pouco", "Não"]}, {"id": "q2", "text": "Você sente desconforto após algumas refeições?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q3", "text": "Você sente energia estável durante o dia?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q4", "text": "Você sente fome logo após comer?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q5", "text": "Você acredita que sua alimentação é ideal para você?", "type": "single", "options": ["Sim", "Talvez", "Provavelmente não", "Não"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero orientação alimentar", "resultIntro": "Seu resultado:"}'::jsonb,
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

-- Itens biblioteca Nutrição
INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, meta, sort_order, active)
VALUES
  ('quiz', ARRAY['nutrition', 'nutrition_vendedor', 'medicine'], 'metabolismo', 'metabolismo', 'Descubra se seu metabolismo está lento', 'Avalie sinais que podem indicar metabolismo desacelerado e receba orientação personalizada.', 'Dificuldade de emagrecer', 'Acelerar metabolismo', 'custom', 'b1000035-0035-4000-8000-000000000035', '{}', 100, true),
  ('quiz', ARRAY['nutrition', 'nutrition_vendedor', 'medicine'], 'intestino', 'digestao', 'Seu intestino está funcionando bem?', 'Identifique sinais de funcionamento intestinal e receba orientações para melhorar.', 'Intestino irregular', 'Melhorar digestão', 'custom', 'b1000036-0036-4000-8000-000000000036', '{}', 101, true),
  ('quiz', ARRAY['nutrition', 'nutrition_vendedor', 'medicine'], 'peso_gordura', 'metabolismo', 'Qual é o verdadeiro bloqueio do seu emagrecimento?', 'Descubra possíveis bloqueios na rotina alimentar que podem estar interferindo nos resultados.', 'Não conseguir emagrecer', 'Perder peso', 'custom', 'b1000037-0037-4000-8000-000000000037', '{}', 102, true),
  ('quiz', ARRAY['nutrition', 'nutrition_vendedor', 'medicine'], 'inchaço_retencao', 'metabolismo', 'Seu corpo está acumulando retenção de líquido?', 'Avalie sinais de retenção e receba orientações para desinchar.', 'Inchaço', 'Desinchar', 'custom', 'b1000038-0038-4000-8000-000000000038', '{}', 103, true),
  ('quiz', ARRAY['nutrition', 'nutrition_vendedor', 'medicine'], 'energia', 'energia', 'Descubra seu nível de energia alimentar', 'Avalie como sua alimentação influencia sua energia diária.', 'Cansaço', 'Ter mais disposição', 'custom', 'b1000039-0039-4000-8000-000000000039', '{}', 104, true),
  ('quiz', ARRAY['nutrition', 'nutrition_vendedor', 'medicine'], 'metabolismo', 'metabolismo', 'Seu corpo pode estar inflamado?', 'Identifique hábitos que podem favorecer processos inflamatórios.', 'Inflamação alimentar', 'Reduzir inflamação', 'custom', 'b1000040-0040-4000-8000-000000000040', '{}', 105, true),
  ('quiz', ARRAY['nutrition', 'nutrition_vendedor', 'medicine'], 'rotina_saudavel', 'habitos', 'Sua rotina alimentar ajuda ou atrapalha seu corpo?', 'Avalie se sua rotina alimentar está influenciando sua disposição e peso.', 'Alimentação desorganizada', 'Melhorar rotina alimentar', 'custom', 'b1000041-0041-4000-8000-000000000041', '{}', 106, true),
  ('quiz', ARRAY['nutrition', 'nutrition_vendedor', 'medicine'], 'alimentacao', 'habitos', 'Você está comendo certo para seu corpo?', 'Avalie se sua alimentação está adequada às suas necessidades.', 'Alimentação inadequada', 'Melhorar alimentação', 'custom', 'b1000042-0042-4000-8000-000000000042', '{}', 107, true);
