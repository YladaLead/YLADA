-- =====================================================
-- Pro Estética Corporal: 2 quizzes novos na biblioteca YLADA.
-- IDs templates: b1000119 (prontidão / protocolo), b1000120 (mapa de zonas).
-- Idempotente: ON CONFLICT nos templates; INSERT ... WHERE NOT EXISTS nos itens.
-- @see src/config/pro-estetica-corporal-biblioteca.ts (lista fechada)
-- =====================================================

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES
  (
    'b1000119-0119-4000-8000-000000000119',
    'quiz_prontidao_protocolo_corporal',
    'diagnostico',
    $json$
    {
      "title": "O que mais te impede de investir no seu corpo agora?",
      "questions": [
        {"id": "q1", "text": "O que mais segura você de começar um protocolo corporal?", "type": "single", "options": ["Tempo na rotina", "Investimento ou preço", "Medo de não funcionar", "Falta de prioridade", "Não sei por onde começar"]},
        {"id": "q2", "text": "Em quanto tempo você gostaria de ver uma mudança visível?", "type": "single", "options": ["Até 2 semanas", "Até 1 mês", "2 a 3 meses", "Sem pressa ou não sei"]},
        {"id": "q3", "text": "Você já fez tratamento corporal profissional antes?", "type": "single", "options": ["Nunca", "Sim, com resultado fraco", "Sim, funcionou bem", "Estou em tratamento"]},
        {"id": "q4", "text": "De 0 a 10, quanto você prioriza resolver isso nos próximos 30 dias?", "type": "single", "options": ["0 a 3 — baixa", "4 a 6 — média", "7 a 8 — alta", "9 a 10 — máxima"]},
        {"id": "q5", "text": "Hoje, o que seria uma vitória clara para você?", "type": "single", "options": ["Corpo mais leve ou menos inchado", "Contorno em abdômen, culote ou flancos", "Textura da pele (celulite ou flacidez)", "Encaixar melhor nas roupas", "Mais confiança no dia a dia"]}
      ],
      "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}],
      "ctaDefault": "Quero falar com um especialista",
      "resultIntro": "Seu resultado:"
    }
    $json$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000120-0120-4000-8000-000000000120',
    'quiz_mapa_zonas_corpo',
    'diagnostico',
    $json$
    {
      "title": "Quais zonas do seu corpo mais te incomodam hoje?",
      "questions": [
        {"id": "q1", "text": "Qual área você gostaria de priorizar primeiro?", "type": "single", "options": ["Abdômen", "Culote e coxas", "Flancos ou costas", "Braços", "Pernas inteiras", "Várias zonas ao mesmo tempo"]},
        {"id": "q2", "text": "Há quanto tempo isso te incomoda?", "type": "single", "options": ["Menos de 3 meses", "3 a 12 meses", "Mais de 1 ano", "Há muito tempo ou sempre"]},
        {"id": "q3", "text": "O incômodo é mais aparência, sensação (peso ou inchaço) ou os dois?", "type": "single", "options": ["Mais aparência", "Mais sensação física", "Os dois igualmente"]},
        {"id": "q4", "text": "Você pratica atividade física com regularidade?", "type": "single", "options": ["Não ou quase nunca", "1 a 2 vezes por semana", "3 vezes ou mais por semana"]},
        {"id": "q5", "text": "Se você pudesse mudar uma coisa já nas próximas semanas, qual seria?", "type": "single", "options": ["Menos inchaço", "Contorno mais definido", "Textura da pele (celulite ou flacidez)", "Vestir melhor as roupas que gosto", "Mais confiança no dia a dia"]}
      ],
      "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}],
      "ctaDefault": "Quero uma avaliação personalizada",
      "resultIntro": "Seu resultado:"
    }
    $json$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
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
SELECT 'quiz', ARRAY['aesthetics', 'nutrition', 'fitness'], 'habitos', 'habitos', 'O que mais te impede de investir no seu corpo agora?', 'Identifique travas (tempo, investimento, medo) e defina prioridade para o próximo passo.', 'Indecisão ou adiamento', 'Clarear o próximo passo', 'custom', 'b1000119-0119-4000-8000-000000000119'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_prontidao_protocolo_corporal", "num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 142, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000119-0119-4000-8000-000000000119');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics', 'nutrition', 'fitness'], 'peso_gordura', 'metabolismo', 'Quais zonas do seu corpo mais te incomodam hoje?', 'Mapeie zonas prioritárias para orientar protocolo e combinação de procedimentos.', 'Insatisfação com zonas do corpo', 'Definir prioridade de tratamento', 'custom', 'b1000120-0120-4000-8000-000000000120'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_mapa_zonas_corpo", "num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 143, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000120-0120-4000-8000-000000000120');
