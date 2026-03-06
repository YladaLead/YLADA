-- =====================================================
-- Bloco 4: Checklists, Guias e Desafios da biblioteca Nutri.
-- type: diagnostico, schema com questions, results (igual aos quizzes).
-- Cada item encaixa em segmentos nutrition, fitness, medicine.
-- =====================================================

-- b1000029 = checklist_alimentar, b1000030 = checklist_detox
-- b1000031 = guia_nutraceutico, b1000032 = guia_proteico
-- b1000033 = desafio_7_dias, b1000034 = desafio_21_dias
INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES
  (
    'b1000029-0029-4000-8000-000000000029',
    'checklist_alimentar',
    'diagnostico',
    '{
      "title": "Checklist Alimentar",
      "questions": [
        {"id": "q1", "text": "Quantas refeições você faz por dia?", "type": "single", "options": ["5-6 refeições pequenas", "3-4 refeições principais", "1-2 refeições por dia"]},
        {"id": "q2", "text": "Quantos vegetais você consome por dia?", "type": "single", "options": ["5+ porções de vegetais", "3-4 porções de vegetais", "Menos de 3 porções de vegetais"]},
        {"id": "q3", "text": "Quantas frutas você consome por dia?", "type": "single", "options": ["3+ porções de frutas", "1-2 porções de frutas", "Raramente como frutas"]},
        {"id": "q4", "text": "Com que frequência você come alimentos processados?", "type": "single", "options": ["Raramente como processados", "Às vezes como processados", "Frequentemente como processados"]},
        {"id": "q5", "text": "Como está sua hidratação?", "type": "single", "options": ["Bebo 2-3L de água por dia", "Bebo 1-2L de água por dia", "Bebo menos de 1L de água por dia"]}
      ],
      "results": [
        {"id": "r1", "minScore": 0, "headline": "Sua alimentação está equilibrada", "description": "Mantenha o padrão e considere otimizações estratégicas. Avaliações periódicas ajudam a potencializar a saúde a longo prazo."},
        {"id": "r2", "minScore": 4, "headline": "Sua alimentação está moderada", "description": "Alguns hábitos podem ser otimizados. Ajustes guiados por um profissional podem maximizar resultados e melhorar sua saúde."},
        {"id": "r3", "minScore": 8, "headline": "Sua alimentação precisa de correção", "description": "Hábitos alimentares inadequados podem afetar sua saúde. Busque avaliação profissional para corrigir deficiências de forma segura."}
      ],
      "ctaDefault": "Quero falar no WhatsApp",
      "resultIntro": "Seu resultado:"
    }'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000030-0030-4000-8000-000000000030',
    'checklist_detox',
    'diagnostico',
    '{
      "title": "Checklist Detox",
      "questions": [
        {"id": "q1", "text": "Você se sente cansado mesmo após dormir bem?", "type": "single", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
        {"id": "q2", "text": "Você tem dificuldade para perder peso mesmo com dieta?", "type": "single", "options": ["Não tenho dificuldade", "Raramente", "Às vezes", "Frequentemente", "Sempre tenho dificuldade"]},
        {"id": "q3", "text": "Você tem problemas digestivos frequentes (constipação, gases)?", "type": "single", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
        {"id": "q4", "text": "Você nota sinais de inchaço ou retenção de líquidos?", "type": "single", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
        {"id": "q5", "text": "Você consome alimentos processados ou vive em ambiente poluído?", "type": "single", "options": ["Muito pouco", "Ocasionalmente", "Moderadamente", "Frequentemente", "Muito frequentemente"]}
      ],
      "results": [
        {"id": "r1", "minScore": 0, "headline": "Baixa carga de toxinas", "description": "Boa alimentação e estilo de vida saudável mantêm toxinas controladas. Estratégias preventivas ajudam a preservar essa condição ideal."},
        {"id": "r2", "minScore": 10, "headline": "Sinais de acúmulo moderado de toxinas", "description": "Exposição ambiental e alimentação podem estar aumentando toxinas. Protocolos detox personalizados podem reduzir a carga. Busque orientação profissional."},
        {"id": "r3", "minScore": 18, "headline": "Alta carga de toxinas", "description": "Seu organismo precisa de cuidado. Procure avaliação profissional para um plano seguro e individualizado de detox."}
      ],
      "ctaDefault": "Quero falar no WhatsApp",
      "resultIntro": "Seu resultado:"
    }'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000031-0031-4000-8000-000000000031',
    'guia_nutraceutico',
    'diagnostico',
    '{
      "title": "Guia Nutracêutico",
      "questions": [
        {"id": "q1", "text": "Qual seu nível de interesse em nutracêuticos e suplementos?", "type": "single", "options": ["Baixo, não sei bem o que são", "Moderado, gostaria de entender melhor", "Alto, já uso ou quero começar"]},
        {"id": "q2", "text": "Você já usa algum suplemento ou nutracêutico?", "type": "single", "options": ["Não uso", "Uso ocasionalmente", "Uso regularmente"]},
        {"id": "q3", "text": "O que mais te interessa em nutracêuticos?", "type": "single", "options": ["Prevenção e saúde geral", "Energia e performance", "Suporte específico (intestino, sono, etc.)"]},
        {"id": "q4", "text": "Você prefere orientação personalizada para suplementação?", "type": "single", "options": ["Sim, é essencial para mim", "Seria muito útil", "Prefiro pesquisar sozinho"]},
        {"id": "q5", "text": "Você está aberto(a) a uma avaliação para identificar suas necessidades?", "type": "single", "options": ["Sim, quero muito", "Talvez, se for prático", "Não no momento"]}
      ],
      "results": [
        {"id": "r1", "minScore": 0, "headline": "Seu interesse em nutracêuticos está começando", "description": "Comece aprendendo sobre nutracêuticos básicos. Uma avaliação nutricional identifica quais são mais adequados para você."},
        {"id": "r2", "minScore": 4, "headline": "Seu interesse está moderado", "description": "Aprofunde o uso de nutracêuticos específicos. Uma avaliação identifica quais direcionados podem potencializar seus resultados."},
        {"id": "r3", "minScore": 8, "headline": "Excelente interesse em nutracêuticos!", "description": "Mantenha o padrão e evolua para estratégias de precisão. Uma avaliação identifica oportunidades de otimização para você."}
      ],
      "ctaDefault": "Quero falar no WhatsApp",
      "resultIntro": "Seu resultado:"
    }'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000032-0032-4000-8000-000000000032',
    'guia_proteico',
    'diagnostico',
    '{
      "title": "Guia Proteico",
      "questions": [
        {"id": "q1", "text": "Quantas fontes de proteína você consome por dia?", "type": "single", "options": ["1-2 porções", "3-4 porções", "5+ porções"]},
        {"id": "q2", "text": "Você distribui proteína ao longo do dia?", "type": "single", "options": ["Não, como mais à noite", "Parcialmente", "Sim, em todas as refeições"]},
        {"id": "q3", "text": "Qual seu principal objetivo com proteína?", "type": "single", "options": ["Manter saúde geral", "Perder peso mantendo massa", "Ganhar massa muscular"]},
        {"id": "q4", "text": "Você pratica atividade física regular?", "type": "single", "options": ["Pouco ou não", "2-3x por semana", "4+ vezes por semana"]},
        {"id": "q5", "text": "Você gostaria de um plano proteico personalizado?", "type": "single", "options": ["Sim, preciso de orientação", "Seria útil", "Já tenho uma rotina"]}
      ],
      "results": [
        {"id": "r1", "minScore": 0, "headline": "Seu consumo de proteína está abaixo do recomendado", "description": "Aumente proteínas nas refeições principais. Uma avaliação nutricional cria um plano que distribui proteína de forma estratégica."},
        {"id": "r2", "minScore": 4, "headline": "Seu consumo de proteína está adequado", "description": "Mantenha o padrão e otimize timing das refeições. Uma análise identifica oportunidades de melhoria na distribuição."},
        {"id": "r3", "minScore": 8, "headline": "Excelente consumo de proteína!", "description": "Ideal para atletas e pessoas ativas. Continue e otimize absorção e timing em períodos de maior demanda."}
      ],
      "ctaDefault": "Quero falar no WhatsApp",
      "resultIntro": "Seu resultado:"
    }'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000033-0033-4000-8000-000000000033',
    'desafio_7_dias',
    'diagnostico',
    '{
      "title": "Desafio 7 Dias",
      "questions": [
        {"id": "q1", "text": "Você está pronto(a) para resultados rápidos e visíveis?", "type": "single", "options": ["Sim, quero começar agora", "Sim, mas preciso de orientação", "Ainda estou avaliando"]},
        {"id": "q2", "text": "Quanto tempo você pode dedicar por dia a mudanças?", "type": "single", "options": ["5-10 minutos", "15-30 minutos", "Mais de 30 minutos"]},
        {"id": "q3", "text": "Você prefere acompanhamento personalizado?", "type": "single", "options": ["Sim, é essencial", "Seria muito útil", "Prefiro fazer sozinho"]},
        {"id": "q4", "text": "Qual seu principal objetivo com o desafio?", "type": "single", "options": ["Perder peso rápido", "Melhorar energia e disposição", "Criar hábitos saudáveis"]},
        {"id": "q5", "text": "Você está disposto(a) a se inscrever e começar hoje?", "type": "single", "options": ["Sim, quero começar!", "Talvez na próxima semana", "Ainda não"]}
      ],
      "results": [
        {"id": "r1", "minScore": 0, "headline": "Você está pronto para o Desafio 7 Dias!", "description": "Desafios com acompanhamento personalizado têm 70% mais sucesso. Inscreva-se e comece sua transformação hoje com suporte completo."},
        {"id": "r2", "minScore": 4, "headline": "Sua motivação mostra que você está pronto", "description": "Pessoas com alta motivação e plano estruturado têm 3x mais chances de sucesso. O Desafio 7 Dias oferece exatamente isso."},
        {"id": "r3", "minScore": 8, "headline": "O Desafio 7 Dias foi feito para você", "description": "78% das pessoas falham por falta de estrutura. Com acompanhamento personalizado, você terá suporte em cada etapa dos 7 dias."}
      ],
      "ctaDefault": "Quero me inscrever no Desafio",
      "resultIntro": "Seu resultado:"
    }'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000034-0034-4000-8000-000000000034',
    'desafio_21_dias',
    'diagnostico',
    '{
      "title": "Desafio 21 Dias",
      "questions": [
        {"id": "q1", "text": "Você está pronto(a) para uma transformação em 21 dias?", "type": "single", "options": ["Sim, quero começar agora", "Sim, mas preciso de estrutura", "Ainda estou pensando"]},
        {"id": "q2", "text": "Você acredita que 21 dias podem formar novos hábitos?", "type": "single", "options": ["Sim, totalmente", "Acredito que ajuda", "Não tenho certeza"]},
        {"id": "q3", "text": "Você prefere acompanhamento ao longo da jornada?", "type": "single", "options": ["Sim, é essencial", "Seria muito útil", "Prefiro autonomia"]},
        {"id": "q4", "text": "Qual sua principal meta com o desafio?", "type": "single", "options": ["Criar hábitos duradouros", "Perder peso e melhorar saúde", "Aumentar energia e disposição"]},
        {"id": "q5", "text": "Você está disposto(a) a se comprometer por 21 dias?", "type": "single", "options": ["Sim, estou comprometido(a)!", "Posso tentar", "Ainda não sei"]}
      ],
      "results": [
        {"id": "r1", "minScore": 0, "headline": "Você está pronto para o Desafio 21 Dias!", "description": "São necessários 21 dias para formar hábitos duradouros. Com acompanhamento personalizado, você terá suporte em cada etapa."},
        {"id": "r2", "minScore": 4, "headline": "Sua motivação mostra que você está pronto", "description": "Pessoas com alta motivação e plano estruturado têm 3x mais chances de sucesso. O Desafio 21 Dias oferece exatamente isso."},
        {"id": "r3", "minScore": 8, "headline": "O Desafio 21 Dias foi feito para você", "description": "78% das pessoas falham por falta de estrutura. Com um profissional ao seu lado, você terá suporte completo em cada etapa."}
      ],
      "ctaDefault": "Quero me inscrever no Desafio",
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

-- Biblioteca: checklists, guias e desafios (tipo quiz = aparecem na aba Quizzes)
-- Requer coluna template_id em ylada_biblioteca_itens (migration 234)
INSERT INTO ylada_biblioteca_itens (
  tipo,
  segment_codes,
  tema,
  pilar,
  titulo,
  description,
  source_type,
  source_id,
  template_id,
  flow_id,
  architecture,
  meta,
  sort_order,
  active
) VALUES
  ('quiz', ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'], 'alimentacao', 'habitos', 'Checklist Alimentar', 'Avalie seus hábitos alimentares e receba orientações personalizadas para melhorar sua rotina.', 'custom', NULL, 'b1000029-0029-4000-8000-000000000029', NULL, NULL, '{"nomenclatura": "checklist_alimentar"}'::jsonb, 80, true),
  ('quiz', ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'], 'inchaço_retencao', 'metabolismo', 'Checklist Detox', 'Identifique sinais de sobrecarga tóxica e receba orientações para um processo de detox eficaz.', 'custom', NULL, 'b1000030-0030-4000-8000-000000000030', NULL, NULL, '{"nomenclatura": "checklist_detox"}'::jsonb, 81, true),
  ('quiz', ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'], 'metabolismo', 'metabolismo', 'Guia Nutracêutico', 'Descubra seu perfil de interesse em nutracêuticos e suplementos com orientações personalizadas.', 'custom', NULL, 'b1000031-0031-4000-8000-000000000031', NULL, NULL, '{"nomenclatura": "guia_nutraceutico"}'::jsonb, 82, true),
  ('quiz', ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'], 'alimentacao', 'metabolismo', 'Guia Proteico', 'Avalie seu consumo de proteína e receba orientações para otimizar sua ingestão diária.', 'custom', NULL, 'b1000032-0032-4000-8000-000000000032', NULL, NULL, '{"nomenclatura": "guia_proteico"}'::jsonb, 83, true),
  ('quiz', ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'], 'peso_gordura', 'habitos', 'Desafio 7 Dias', 'Resultados rápidos e visíveis em uma semana. Avalie se você está pronto e inscreva-se.', 'custom', NULL, 'b1000033-0033-4000-8000-000000000033', NULL, NULL, '{"nomenclatura": "desafio_7_dias"}'::jsonb, 84, true),
  ('quiz', ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'], 'peso_gordura', 'habitos', 'Desafio 21 Dias', 'Transformação completa em 21 dias. Forme hábitos duradouros com acompanhamento personalizado.', 'custom', NULL, 'b1000034-0034-4000-8000-000000000034', NULL, NULL, '{"nomenclatura": "desafio_21_dias"}'::jsonb, 85, true);
