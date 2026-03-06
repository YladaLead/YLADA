-- =====================================================
-- Templates YLADA com conteúdo copiado da Nutri.
-- Nutri serve só como referência; nada aponta para Nutri.
-- source_type: custom, source_id: null nos itens da biblioteca.
-- Cada template tem schema_json completo (perguntas, opções, títulos).
-- =====================================================

-- UUIDs fixos para referência
-- b1000001 = quiz_energia, b1000002 = quiz_intestino, etc.
INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES
  (
    'b1000001-0001-4000-8000-000000000001',
    'quiz_energia',
    'diagnostico',
    '{
      "title": "Diagnóstico de Energia",
      "questions": [
        {"id": "q1", "text": "Como você descreveria sua energia ao longo do dia?", "type": "single", "options": ["Muito baixa, me sinto esgotado(a)", "Baixa, tenho picos e quedas", "Moderada, consigo me manter", "Alta, me sinto bem disposto(a)"]},
        {"id": "q2", "text": "Você sente que precisa de ajuda para melhorar sua energia?", "type": "single", "options": ["Sim, preciso muito de orientação profissional", "Sim, seria muito útil ter um acompanhamento", "Talvez, se for algo prático e eficaz", "Não, consigo resolver sozinho(a)"]},
        {"id": "q3", "text": "Como a falta de energia impacta sua rotina?", "type": "single", "options": ["Muito, atrapalha trabalho e vida pessoal", "Moderado, algumas atividades sofrem", "Pouco, mas gostaria de melhorar", "Quase não impacta"]},
        {"id": "q4", "text": "Você valoriza ter um plano personalizado para aumentar sua disposição?", "type": "single", "options": ["Muito, é essencial para meu bem-estar", "Bastante, acredito que faria diferença", "Moderadamente, se for algo eficaz", "Pouco, prefiro seguir padrões gerais"]},
        {"id": "q5", "text": "Qual seu principal objetivo em relação à energia?", "type": "single", "options": ["Entender melhor o que está acontecendo", "Saber por onde começar", "Falar com alguém que entende", "Só quero me informar"]}
      ],
      "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}],
      "ctaDefault": "Quero falar no WhatsApp",
      "resultIntro": "Seu resultado:"
    }'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000002-0002-4000-8000-000000000002',
    'quiz_intestino',
    'diagnostico',
    '{
      "title": "Diagnóstico de Intestino",
      "questions": [
        {"id": "q1", "text": "Você sente desconforto digestivo, gases, inchaço ou problemas intestinais frequentemente?", "type": "single", "options": ["Sim, tenho esses sintomas quase diariamente", "Sim, acontece várias vezes por semana", "Às vezes, mas não é constante", "Raramente ou nunca tenho esses problemas"]},
        {"id": "q2", "text": "Você sente que precisa de ajuda para melhorar sua saúde intestinal?", "type": "single", "options": ["Sim, preciso muito de orientação profissional", "Sim, seria muito útil ter um acompanhamento", "Talvez, se for algo prático e eficaz", "Não, consigo resolver sozinho(a)"]},
        {"id": "q3", "text": "Como a saúde intestinal impacta seu dia a dia?", "type": "single", "options": ["Muito, atrapalha bastante", "Moderado, às vezes incomoda", "Pouco, mas gostaria de melhorar", "Quase não impacta"]},
        {"id": "q4", "text": "Você valoriza ter um plano personalizado para sua saúde digestiva?", "type": "single", "options": ["Muito, é essencial para meu bem-estar", "Bastante, acredito que faria diferença", "Moderadamente, se for algo eficaz", "Pouco, prefiro seguir padrões gerais"]},
        {"id": "q5", "text": "Qual seu principal objetivo em relação ao intestino?", "type": "single", "options": ["Entender melhor o que está acontecendo", "Saber por onde começar", "Falar com alguém que entende", "Só quero me informar"]}
      ],
      "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}],
      "ctaDefault": "Quero falar no WhatsApp",
      "resultIntro": "Seu resultado:"
    }'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000003-0003-4000-8000-000000000003',
    'quiz_metabolismo',
    'diagnostico',
    '{
      "title": "Diagnóstico de Metabolismo",
      "questions": [
        {"id": "q1", "text": "Como você descreveria seu metabolismo?", "type": "single", "options": ["Muito lento, ganho peso facilmente", "Lento, tenho dificuldade para perder peso", "Moderado, equilibrado", "Rápido, queimo calorias facilmente"]},
        {"id": "q2", "text": "Você sente que precisa de ajuda para otimizar seu metabolismo?", "type": "single", "options": ["Sim, preciso muito de orientação profissional", "Sim, seria útil ter um acompanhamento", "Talvez, se for algo prático e personalizado", "Não, consigo otimizar sozinho(a)"]},
        {"id": "q3", "text": "Você valoriza ter um plano personalizado baseado no seu perfil metabólico?", "type": "single", "options": ["Muito, é essencial para resultados eficazes", "Bastante, acredito que faria diferença", "Moderadamente, se for algo prático", "Pouco, prefiro seguir padrões gerais"]},
        {"id": "q4", "text": "Como o metabolismo impacta seus objetivos de saúde?", "type": "single", "options": ["Muito, é o principal obstáculo", "Moderado, atrapalha algumas metas", "Pouco, mas gostaria de otimizar", "Quase não impacta"]},
        {"id": "q5", "text": "Qual seu principal objetivo em relação ao metabolismo?", "type": "single", "options": ["Entender melhor o que está acontecendo", "Saber por onde começar", "Falar com alguém que entende", "Só quero me informar"]}
      ],
      "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}],
      "ctaDefault": "Quero falar no WhatsApp",
      "resultIntro": "Seu resultado:"
    }'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000004-0004-4000-8000-000000000004',
    'quiz_inchaco',
    'diagnostico',
    '{
      "title": "Diagnóstico de Inchaço e Retenção",
      "questions": [
        {"id": "q1", "text": "Você sente que retém líquidos ou tem inchaço frequente?", "type": "single", "options": ["Sim, sinto muito inchaço e desconforto", "Sim, às vezes sinto retenção leve", "Às vezes, mas não sei se é retenção", "Não, não tenho esse problema"]},
        {"id": "q2", "text": "Você sente que precisa de ajuda profissional para identificar e tratar retenção de líquidos?", "type": "single", "options": ["Sim, preciso muito de orientação especializada", "Sim, seria muito útil ter um acompanhamento", "Talvez, se for algo prático e personalizado", "Não, consigo resolver sozinho(a)"]},
        {"id": "q3", "text": "Como o inchaço impacta seu dia a dia?", "type": "single", "options": ["Muito, atrapalha bastante", "Moderado, às vezes incomoda", "Pouco, mas gostaria de melhorar", "Quase não impacta"]},
        {"id": "q4", "text": "Você valoriza ter um plano personalizado para reduzir retenção?", "type": "single", "options": ["Muito, é essencial para meu bem-estar", "Bastante, acredito que faria diferença", "Moderadamente, se for algo eficaz", "Pouco, prefiro seguir padrões gerais"]},
        {"id": "q5", "text": "Qual seu principal objetivo em relação ao inchaço?", "type": "single", "options": ["Entender melhor o que está acontecendo", "Saber por onde começar", "Falar com alguém que entende", "Só quero me informar"]}
      ],
      "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}],
      "ctaDefault": "Quero falar no WhatsApp",
      "resultIntro": "Seu resultado:"
    }'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000005-0005-4000-8000-000000000005',
    'quiz_peso',
    'diagnostico',
    '{
      "title": "Diagnóstico de Peso e Emagrecimento",
      "questions": [
        {"id": "q1", "text": "Você está pronto(a) para começar uma jornada de emagrecimento saudável?", "type": "single", "options": ["Sim, estou muito motivado(a) e pronto(a) para começar", "Sim, mas preciso de orientação para começar", "Talvez, se tiver um acompanhamento adequado", "Ainda não, preciso de mais informações"]},
        {"id": "q2", "text": "Você sente que precisa de ajuda profissional para emagrecer com saúde?", "type": "single", "options": ["Sim, preciso muito de orientação especializada", "Sim, seria muito útil ter um acompanhamento", "Talvez, se for algo prático e personalizado", "Não, consigo fazer sozinho(a)"]},
        {"id": "q3", "text": "Quantos quilos você gostaria de perder?", "type": "single", "options": ["Menos de 5kg", "5–10kg", "10–20kg", "Mais de 20kg"]},
        {"id": "q4", "text": "Como o peso impacta seu dia a dia?", "type": "single", "options": ["Muito, atrapalha bastante", "Moderado, às vezes incomoda", "Pouco, mas quero mudar", "Quase não impacta"]},
        {"id": "q5", "text": "Qual seu principal objetivo?", "type": "single", "options": ["Entender melhor o que está acontecendo", "Saber por onde começar", "Falar com alguém que entende", "Só quero me informar"]}
      ],
      "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}],
      "ctaDefault": "Quero falar no WhatsApp",
      "resultIntro": "Seu resultado:"
    }'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000006-0006-4000-8000-000000000006',
    'quiz_estresse',
    'diagnostico',
    '{
      "title": "Diagnóstico de Estresse",
      "questions": [
        {"id": "q1", "text": "Como você descreveria seu nível de estresse?", "type": "single", "options": ["Muito alto, me sinto sobrecarregado(a)", "Alto, tenho dias difíceis", "Moderado, consigo lidar", "Baixo, me sinto equilibrado(a)"]},
        {"id": "q2", "text": "Você sente que precisa de ajuda para lidar com estresse e ansiedade?", "type": "single", "options": ["Sim, preciso muito de orientação", "Sim, seria útil ter um acompanhamento", "Talvez, se for algo prático", "Não, consigo lidar sozinho(a)"]},
        {"id": "q3", "text": "Como o estresse impacta sua rotina?", "type": "single", "options": ["Muito, atrapalha sono, trabalho e relações", "Moderado, algumas áreas sofrem", "Pouco, mas gostaria de melhorar", "Quase não impacta"]},
        {"id": "q4", "text": "Você valoriza ter estratégias personalizadas para equilíbrio emocional?", "type": "single", "options": ["Muito, é essencial para meu bem-estar", "Bastante, acredito que faria diferença", "Moderadamente, se for algo eficaz", "Pouco, prefiro seguir sozinho(a)"]},
        {"id": "q5", "text": "Qual seu principal objetivo em relação ao estresse?", "type": "single", "options": ["Entender melhor o que está acontecendo", "Saber por onde começar", "Falar com alguém que entende", "Só quero me informar"]}
      ],
      "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}],
      "ctaDefault": "Quero falar no WhatsApp",
      "resultIntro": "Seu resultado:"
    }'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000007-0007-4000-8000-000000000007',
    'quiz_sono',
    'diagnostico',
    '{
      "title": "Diagnóstico de Sono",
      "questions": [
        {"id": "q1", "text": "Como você avalia a qualidade do seu sono?", "type": "single", "options": ["Muito ruim, acordo cansado(a)", "Ruim, tenho dificuldade para dormir", "Regular, poderia ser melhor", "Boa, durmo bem na maioria das noites"]},
        {"id": "q2", "text": "Você sente que precisa de ajuda para melhorar seu sono?", "type": "single", "options": ["Sim, preciso muito de orientação", "Sim, seria útil ter um acompanhamento", "Talvez, se for algo prático", "Não, consigo resolver sozinho(a)"]},
        {"id": "q3", "text": "Como a qualidade do sono impacta seu dia?", "type": "single", "options": ["Muito, afeta energia e concentração", "Moderado, às vezes me atrapalha", "Pouco, mas gostaria de melhorar", "Quase não impacta"]},
        {"id": "q4", "text": "Você valoriza ter um plano personalizado para dormir melhor?", "type": "single", "options": ["Muito, é essencial para meu bem-estar", "Bastante, acredito que faria diferença", "Moderadamente, se for algo eficaz", "Pouco, prefiro seguir padrões gerais"]},
        {"id": "q5", "text": "Qual seu principal objetivo em relação ao sono?", "type": "single", "options": ["Entender melhor o que está acontecendo", "Saber por onde começar", "Falar com alguém que entende", "Só quero me informar"]}
      ],
      "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}],
      "ctaDefault": "Quero falar no WhatsApp",
      "resultIntro": "Seu resultado:"
    }'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000008-0008-4000-8000-000000000008',
    'quiz_vitalidade',
    'diagnostico',
    '{
      "title": "Diagnóstico de Vitalidade",
      "questions": [
        {"id": "q1", "text": "Como você avalia seu bem-estar geral?", "type": "single", "options": ["Ruim, sinto que preciso de mudanças", "Regular, poderia ser melhor", "Bom, mas quero otimizar", "Ótimo, me sinto bem"]},
        {"id": "q2", "text": "Você sente que precisa de ajuda para melhorar sua qualidade de vida?", "type": "single", "options": ["Sim, preciso muito de orientação", "Sim, seria útil ter um acompanhamento", "Talvez, se for algo prático", "Não, consigo sozinho(a)"]},
        {"id": "q3", "text": "O que mais importa para você hoje?", "type": "single", "options": ["Mais energia e disposição", "Melhor alimentação e hábitos", "Equilíbrio emocional", "Só quero me informar"]},
        {"id": "q4", "text": "Você valoriza ter um plano personalizado para sua saúde?", "type": "single", "options": ["Muito, é essencial", "Bastante, acredito que faria diferença", "Moderadamente, se for algo eficaz", "Pouco, prefiro seguir sozinho(a)"]},
        {"id": "q5", "text": "Qual seu principal objetivo?", "type": "single", "options": ["Entender melhor o que está acontecendo", "Saber por onde começar", "Falar com alguém que entende", "Só quero me informar"]}
      ],
      "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}],
      "ctaDefault": "Quero falar no WhatsApp",
      "resultIntro": "Seu resultado:"
    }'::jsonb,
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

-- Adicionar coluna template_id na biblioteca (referência ao template YLADA criado)
ALTER TABLE ylada_biblioteca_itens
  ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES ylada_link_templates(id) ON DELETE SET NULL;

COMMENT ON COLUMN ylada_biblioteca_itens.template_id IS 'Template YLADA com conteúdo (perguntas, etc.). Null = usa flow_id + getQuizByTema.';

-- Atualizar itens existentes com template_id (mapeamento tema → template)
UPDATE ylada_biblioteca_itens SET template_id = 'b1000001-0001-4000-8000-000000000001' WHERE tema = 'energia';
UPDATE ylada_biblioteca_itens SET template_id = 'b1000008-0008-4000-8000-000000000008' WHERE tema = 'vitalidade_geral';
UPDATE ylada_biblioteca_itens SET template_id = 'b1000003-0003-4000-8000-000000000003' WHERE tema = 'metabolismo';
UPDATE ylada_biblioteca_itens SET template_id = 'b1000004-0004-4000-8000-000000000004' WHERE tema = 'inchaço_retencao';
UPDATE ylada_biblioteca_itens SET template_id = 'b1000005-0005-4000-8000-000000000005' WHERE tema = 'peso_gordura';
UPDATE ylada_biblioteca_itens SET template_id = 'b1000002-0002-4000-8000-000000000002' WHERE tema = 'intestino';
UPDATE ylada_biblioteca_itens SET template_id = 'b1000006-0006-4000-8000-000000000006' WHERE tema = 'estresse';
UPDATE ylada_biblioteca_itens SET template_id = 'b1000006-0006-4000-8000-000000000006' WHERE tema = 'foco_concentracao';
UPDATE ylada_biblioteca_itens SET template_id = 'b1000007-0007-4000-8000-000000000007' WHERE tema = 'sono';
UPDATE ylada_biblioteca_itens SET template_id = 'b1000008-0008-4000-8000-000000000008' WHERE tema = 'alimentacao';
UPDATE ylada_biblioteca_itens SET template_id = 'b1000008-0008-4000-8000-000000000008' WHERE tema = 'rotina_saudavel';
