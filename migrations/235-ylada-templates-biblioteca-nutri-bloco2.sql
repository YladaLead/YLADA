-- =====================================================
-- Bloco 2: Templates YLADA com conteúdo copiado da Nutri.
-- Quizzes restantes: alimentação saudável, síndrome metabólica, etc.
-- source_type: custom, source_id: null nos itens da biblioteca.
-- =====================================================

-- b1000009 = quiz_alimentacao_saudavel, b1000010 = quiz_sindrome_metabolica, etc.
INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES
  (
    'b1000009-0009-4000-8000-000000000009',
    'quiz_alimentacao_saudavel',
    'diagnostico',
    '{
      "title": "Quiz Alimentação Saudável",
      "questions": [
        {"id": "q1", "text": "Você sente que precisa melhorar seus hábitos alimentares?", "type": "single", "options": ["Sim, preciso muito melhorar minha alimentação", "Sim, gostaria de ter uma alimentação mais saudável", "Talvez, se for algo prático e eficaz", "Não, minha alimentação já está boa"]},
        {"id": "q2", "text": "Você sente que precisa de ajuda profissional para criar uma alimentação saudável?", "type": "single", "options": ["Sim, preciso muito de orientação especializada", "Sim, seria muito útil ter um acompanhamento", "Talvez, se for algo prático e personalizado", "Não, consigo fazer sozinho(a)"]},
        {"id": "q3", "text": "Você valoriza ter um plano alimentar personalizado e saudável?", "type": "single", "options": ["Muito, é essencial para minha saúde", "Bastante, acredito que faria diferença", "Moderadamente, se for algo eficaz", "Pouco, prefiro seguir padrões gerais"]},
        {"id": "q4", "text": "Você acredita que produtos de qualidade podem ajudar na sua alimentação saudável?", "type": "single", "options": ["Sim, faria toda diferença e melhoraria muito", "Sim, acredito que seria muito útil", "Talvez, se for algo comprovado e eficaz", "Não, não vejo necessidade"]},
        {"id": "q5", "text": "Você está aberto(a) para ter um acompanhamento especializado em alimentação saudável?", "type": "single", "options": ["Sim, é exatamente o que preciso!", "Sim, seria muito útil ter um acompanhamento", "Talvez, se for alguém experiente e confiável", "Não, prefiro fazer sozinho(a)"]}
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
    'b1000010-0010-4000-8000-000000000010',
    'quiz_sindrome_metabolica',
    'diagnostico',
    '{
      "title": "Risco de Síndrome Metabólica",
      "questions": [
        {"id": "q1", "text": "Você está preocupado(a) com seu risco de desenvolver síndrome metabólica?", "type": "single", "options": ["Sim, estou muito preocupado(a) com isso", "Sim, gostaria de entender melhor meu risco", "Talvez, se for algo que possa me ajudar", "Não, não me preocupo com isso"]},
        {"id": "q2", "text": "Você sente que precisa de ajuda profissional para prevenir síndrome metabólica?", "type": "single", "options": ["Sim, preciso muito de orientação especializada", "Sim, seria muito útil ter um acompanhamento", "Talvez, se for algo prático e personalizado", "Não, consigo prevenir sozinho(a)"]},
        {"id": "q3", "text": "Você valoriza ter um plano preventivo personalizado para reduzir riscos?", "type": "single", "options": ["Muito, é essencial para minha saúde", "Bastante, acredito que faria diferença", "Moderadamente, se for algo eficaz", "Pouco, prefiro seguir padrões gerais"]},
        {"id": "q4", "text": "Você acredita que produtos e estratégias preventivas podem reduzir seu risco?", "type": "single", "options": ["Sim, faria toda diferença e melhoraria muito", "Sim, acredito que seria muito útil", "Talvez, se for algo comprovado e eficaz", "Não, não vejo necessidade"]},
        {"id": "q5", "text": "Você está aberto(a) para ter um acompanhamento especializado em prevenção metabólica?", "type": "single", "options": ["Sim, é exatamente o que preciso!", "Sim, seria muito útil ter um acompanhamento", "Talvez, se for alguém experiente e confiável", "Não, prefiro fazer sozinho(a)"]}
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
    'b1000011-0011-4000-8000-000000000011',
    'quiz_pronto_emagrecer',
    'diagnostico',
    '{
      "title": "Pronto para Emagrecer?",
      "questions": [
        {"id": "q1", "text": "Você está pronto(a) para começar uma jornada de emagrecimento saudável?", "type": "single", "options": ["Sim, estou muito motivado(a) e pronto(a) para começar", "Sim, mas preciso de orientação para começar", "Talvez, se tiver um acompanhamento adequado", "Ainda não, preciso de mais informações"]},
        {"id": "q2", "text": "Você sente que precisa de ajuda profissional para emagrecer com saúde?", "type": "single", "options": ["Sim, preciso muito de orientação especializada", "Sim, seria muito útil ter um acompanhamento", "Talvez, se for algo prático e personalizado", "Não, consigo fazer sozinho(a)"]},
        {"id": "q3", "text": "Você valoriza ter um plano personalizado para emagrecimento saudável?", "type": "single", "options": ["Muito, é essencial para ter resultados duradouros", "Bastante, acredito que faria diferença", "Moderadamente, se for algo eficaz", "Pouco, prefiro seguir padrões gerais"]},
        {"id": "q4", "text": "Você acredita que produtos de qualidade e acompanhamento podem acelerar seu emagrecimento?", "type": "single", "options": ["Sim, absolutamente! É o que estou procurando", "Sim, acredito que pode fazer diferença", "Talvez, se for algo comprovado e eficaz", "Não, não vejo necessidade"]},
        {"id": "q5", "text": "Você está aberto(a) para ter um mentor que te guie em sua jornada de emagrecimento?", "type": "single", "options": ["Sim, é exatamente o que preciso!", "Sim, seria muito útil ter um mentor", "Talvez, se for alguém experiente e confiável", "Não, prefiro seguir sozinho(a)"]}
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
    'b1000012-0012-4000-8000-000000000012',
    'quiz_conhece_corpo',
    'diagnostico',
    '{
      "title": "Você conhece o seu corpo?",
      "questions": [
        {"id": "q1", "text": "Você sente que conhece bem seu corpo e como ele funciona?", "type": "single", "options": ["Não, preciso muito entender melhor meu corpo", "Parcialmente, mas quero conhecer mais", "Bastante, mas sempre há o que aprender", "Sim, conheço muito bem meu corpo"]},
        {"id": "q2", "text": "Você sente que precisa de ajuda profissional para entender melhor seu corpo?", "type": "single", "options": ["Sim, preciso muito de orientação especializada", "Sim, seria muito útil ter um acompanhamento", "Talvez, se for algo prático e personalizado", "Não, consigo entender sozinho(a)"]},
        {"id": "q3", "text": "Você valoriza ter um conhecimento profundo sobre seu corpo e saúde?", "type": "single", "options": ["Muito, é essencial para meu bem-estar", "Bastante, acredito que faria diferença", "Moderadamente, se for algo útil", "Pouco, prefiro ir no automático"]},
        {"id": "q4", "text": "Você acredita que produtos e estratégias personalizadas podem ajudar você a conhecer melhor seu corpo?", "type": "single", "options": ["Sim, faria toda diferença e melhoraria muito", "Sim, acredito que seria muito útil", "Talvez, se for algo comprovado e eficaz", "Não, não vejo necessidade"]},
        {"id": "q5", "text": "Você está aberto(a) para ter um acompanhamento especializado para conhecer melhor seu corpo?", "type": "single", "options": ["Sim, é exatamente o que preciso!", "Sim, seria muito útil ter um acompanhamento", "Talvez, se for alguém experiente e confiável", "Não, prefiro descobrir sozinho(a)"]}
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
    'b1000013-0013-4000-8000-000000000013',
    'quiz_tipo_fome',
    'diagnostico',
    '{
      "title": "Qual é o seu Tipo de Fome?",
      "questions": [
        {"id": "q1", "text": "Você sente que precisa entender melhor seu tipo de fome para controlar melhor sua alimentação?", "type": "single", "options": ["Sim, preciso muito entender meu padrão de fome", "Sim, seria muito útil ter essa informação", "Talvez, se for algo prático e útil", "Não, não vejo necessidade"]},
        {"id": "q2", "text": "Você sente que precisa de ajuda para identificar se sua fome é física ou emocional?", "type": "single", "options": ["Sim, preciso muito de orientação profissional", "Sim, seria muito útil ter um acompanhamento", "Talvez, se for algo prático e personalizado", "Não, consigo identificar sozinho(a)"]},
        {"id": "q3", "text": "Você valoriza ter estratégias personalizadas baseadas no seu tipo de fome?", "type": "single", "options": ["Muito, é essencial para controlar minha alimentação", "Bastante, acredito que faria diferença", "Moderadamente, se for algo eficaz", "Pouco, prefiro seguir padrões gerais"]},
        {"id": "q4", "text": "Você acredita que produtos e estratégias específicas para seu tipo de fome podem ajudar?", "type": "single", "options": ["Sim, faria toda diferença e melhoraria muito", "Sim, acredito que seria muito útil", "Talvez, se for algo comprovado e eficaz", "Não, não vejo necessidade"]},
        {"id": "q5", "text": "Você está aberto(a) para ter um acompanhamento especializado em controle de fome?", "type": "single", "options": ["Sim, é exatamente o que preciso!", "Sim, seria muito útil ter um acompanhamento", "Talvez, se for alguém experiente e confiável", "Não, prefiro fazer sozinho(a)"]}
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
    'b1000014-0014-4000-8000-000000000014',
    'quiz_nutrido_vs_alimentado',
    'diagnostico',
    '{
      "title": "Você está nutrido ou apenas alimentado?",
      "questions": [
        {"id": "q1", "text": "Você sente que está apenas alimentado ou realmente nutrido?", "type": "single", "options": ["Apenas alimentado, não sinto que estou nutrido adequadamente", "Parcialmente nutrido, mas preciso melhorar", "Bastante nutrido, mas posso otimizar", "Sim, me sinto muito bem nutrido"]},
        {"id": "q2", "text": "Você sente que precisa de ajuda profissional para entender a diferença entre se alimentar e se nutrir?", "type": "single", "options": ["Sim, preciso muito de orientação especializada", "Sim, seria muito útil ter um acompanhamento", "Talvez, se for algo prático e personalizado", "Não, consigo entender sozinho(a)"]},
        {"id": "q3", "text": "Você valoriza ter um plano personalizado para garantir nutrição adequada?", "type": "single", "options": ["Muito, é essencial para minha saúde", "Bastante, acredito que faria diferença", "Moderadamente, se for algo eficaz", "Pouco, prefiro seguir padrões gerais"]},
        {"id": "q4", "text": "Você acredita que produtos e estratégias específicas podem ajudar você a estar nutrido e não apenas alimentado?", "type": "single", "options": ["Sim, faria toda diferença e melhoraria muito", "Sim, acredito que seria muito útil", "Talvez, se for algo comprovado e eficaz", "Não, não vejo necessidade"]},
        {"id": "q5", "text": "Você está aberto(a) para ter um acompanhamento especializado em nutrição adequada?", "type": "single", "options": ["Sim, é exatamente o que preciso!", "Sim, seria muito útil ter um acompanhamento", "Talvez, se for alguém experiente e confiável", "Não, prefiro fazer sozinho(a)"]}
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
    'b1000015-0015-4000-8000-000000000015',
    'quiz_eletrolitos',
    'diagnostico',
    '{
      "title": "Diagnóstico de Eletrólitos",
      "questions": [
        {"id": "q1", "text": "Você sente cãibras musculares, fadiga ou desequilíbrio com frequência?", "type": "single", "options": ["Sim, tenho esses sintomas frequentemente", "Sim, às vezes sinto esses problemas", "Raramente, mas já aconteceu", "Não, não tenho esses sintomas"]},
        {"id": "q2", "text": "Você sente que precisa de ajuda para equilibrar seus eletrólitos?", "type": "single", "options": ["Sim, preciso muito de orientação profissional", "Sim, seria útil ter um acompanhamento", "Talvez, se for algo prático e eficaz", "Não, consigo equilibrar sozinho(a)"]},
        {"id": "q3", "text": "Você valoriza produtos que ajudam a manter o equilíbrio eletrolítico?", "type": "single", "options": ["Muito, é essencial para meu bem-estar", "Bastante, procuro opções adequadas", "Moderadamente, se for algo eficaz", "Pouco, não me preocupo muito"]},
        {"id": "q4", "text": "Você acredita que um plano personalizado pode melhorar seu equilíbrio eletrolítico?", "type": "single", "options": ["Sim, faria toda diferença e melhoraria muito", "Sim, acredito que seria muito útil", "Talvez, se for algo comprovado e eficaz", "Não, não vejo necessidade"]},
        {"id": "q5", "text": "Você está aberto(a) para ter um acompanhamento especializado em hidratação e eletrólitos?", "type": "single", "options": ["Sim, é exatamente o que preciso!", "Sim, seria muito útil ter um acompanhamento", "Talvez, se for alguém experiente e confiável", "Não, prefiro fazer sozinho(a)"]}
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
    'b1000016-0016-4000-8000-000000000016',
    'quiz_alimentacao_rotina',
    'diagnostico',
    '{
      "title": "Você está se alimentando conforme sua rotina?",
      "questions": [
        {"id": "q1", "text": "Você sente que está se alimentando conforme sua rotina e necessidades?", "type": "single", "options": ["Não, minha alimentação não está adequada à minha rotina", "Parcialmente, mas preciso melhorar", "Bastante, mas posso otimizar", "Sim, me alimento muito bem conforme minha rotina"]},
        {"id": "q2", "text": "Você sente que precisa de ajuda profissional para adequar sua alimentação à sua rotina?", "type": "single", "options": ["Sim, preciso muito de orientação especializada", "Sim, seria muito útil ter um acompanhamento", "Talvez, se for algo prático e personalizado", "Não, consigo adequar sozinho(a)"]},
        {"id": "q3", "text": "Você valoriza ter um plano alimentar personalizado para sua rotina?", "type": "single", "options": ["Muito, é essencial para minha saúde", "Bastante, acredito que faria diferença", "Moderadamente, se for algo eficaz", "Pouco, prefiro seguir padrões gerais"]},
        {"id": "q4", "text": "Você acredita que produtos e estratégias específicas podem ajudar você a se alimentar melhor conforme sua rotina?", "type": "single", "options": ["Sim, faria toda diferença e melhoraria muito", "Sim, acredito que seria muito útil", "Talvez, se for algo comprovado e eficaz", "Não, não vejo necessidade"]},
        {"id": "q5", "text": "Você está aberto(a) para ter um acompanhamento especializado em alimentação conforme rotina?", "type": "single", "options": ["Sim, é exatamente o que preciso!", "Sim, seria muito útil ter um acompanhamento", "Talvez, se for alguém experiente e confiável", "Não, prefiro fazer sozinho(a)"]}
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
    'b1000017-0017-4000-8000-000000000017',
    'quiz_intolerancia',
    'diagnostico',
    '{
      "title": "Avaliação de Intolerâncias",
      "questions": [
        {"id": "q1", "text": "Você sente desconforto digestivo após consumir certos alimentos?", "type": "single", "options": ["Sempre, me sinto muito mal", "Frequentemente, tenho vários desconfortos", "Às vezes, depende do alimento", "Raramente ou nunca sinto desconforto"]},
        {"id": "q2", "text": "Você já percebeu que alguns alimentos causam inchaço, gases ou dores abdominais?", "type": "single", "options": ["Sim, tenho esses sintomas regularmente", "Sim, acontece com alguns alimentos específicos", "Às vezes, mas não sei identificar o que causa", "Não, não tenho esses sintomas"]},
        {"id": "q3", "text": "Você sente que precisa de ajuda para identificar alimentos que te fazem mal?", "type": "single", "options": ["Sim, preciso muito de orientação profissional", "Sim, seria útil ter um acompanhamento", "Talvez, se for algo prático e personalizado", "Não, consigo identificar sozinho(a)"]},
        {"id": "q4", "text": "Você valoriza produtos alimentares que sejam seguros e adequados para seu organismo?", "type": "single", "options": ["Muito, é essencial para minha saúde", "Bastante, procuro opções adequadas", "Moderadamente, mas não priorizo", "Pouco, não me preocupo muito"]},
        {"id": "q5", "text": "Você sente que ter um plano alimentar personalizado faria diferença na sua qualidade de vida?", "type": "single", "options": ["Sim, faria toda diferença e melhoraria muito", "Sim, acredito que seria muito útil", "Talvez, se for algo prático e eficaz", "Não, não vejo necessidade"]}
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
    'b1000018-0018-4000-8000-000000000018',
    'quiz_avaliacao_inicial',
    'diagnostico',
    '{
      "title": "Avaliação Inicial",
      "questions": [
        {"id": "q1", "text": "Você está pronto(a) para começar uma transformação na sua saúde e bem-estar?", "type": "single", "options": ["Sim, estou muito motivado(a) e pronto(a) para começar", "Sim, mas preciso de orientação para começar", "Talvez, se tiver um acompanhamento adequado", "Ainda não, preciso de mais informações"]},
        {"id": "q2", "text": "Você sente que precisa de ajuda profissional para alcançar seus objetivos?", "type": "single", "options": ["Sim, preciso muito de orientação especializada", "Sim, seria muito útil ter um acompanhamento", "Talvez, se for algo prático e personalizado", "Não, consigo fazer sozinho(a)"]},
        {"id": "q3", "text": "Você valoriza ter um plano personalizado baseado no seu perfil e objetivos?", "type": "single", "options": ["Muito, é essencial para ter resultados", "Bastante, acredito que faria diferença", "Moderadamente, se for algo eficaz", "Pouco, prefiro seguir padrões gerais"]},
        {"id": "q4", "text": "Você acredita que produtos de qualidade e acompanhamento podem acelerar seus resultados?", "type": "single", "options": ["Sim, absolutamente! É o que estou procurando", "Sim, acredito que pode fazer diferença", "Talvez, se for algo comprovado e eficaz", "Não, não vejo necessidade"]},
        {"id": "q5", "text": "Você está aberto(a) para ter um mentor que te guie em sua jornada de transformação?", "type": "single", "options": ["Sim, é exatamente o que preciso!", "Sim, seria muito útil ter um mentor", "Talvez, se for alguém experiente e confiável", "Não, prefiro seguir sozinho(a)"]}
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
    'b1000019-0019-4000-8000-000000000019',
    'quiz_perfil_bem_estar',
    'diagnostico',
    '{
      "title": "Descubra seu Perfil de Bem-Estar",
      "questions": [
        {"id": "q1", "text": "Como você avalia seu nível de energia?", "type": "single", "options": ["Baixo, sinto cansaço constante", "Médio, tenho altos e baixos", "Alto, me sinto energizado", "Muito alto, super produtivo"]},
        {"id": "q2", "text": "Frequência de atividades físicas?", "type": "single", "options": ["Nunca ou raramente", "1x por semana", "2-3x por semana", "4x ou mais por semana"]},
        {"id": "q3", "text": "Como você lida com o estresse?", "type": "single", "options": ["Mal, estresse me afeta muito", "Moderadamente, tenho dificuldades", "Bem, consigo lidar na maioria das vezes", "Excelente, gerencio muito bem"]},
        {"id": "q4", "text": "Como você avalia sua qualidade de sono?", "type": "single", "options": ["Ruim, não durmo bem", "Moderada, às vezes acordado cansado", "Boa, durmo bem", "Excelente, descanso profundamente"]}
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
    'b1000020-0020-4000-8000-000000000020',
    'quiz_parasitose',
    'diagnostico',
    '{
      "title": "Diagnóstico de Parasitose",
      "questions": [
        {"id": "q1", "text": "Você sente sintomas como dor abdominal, náusea, diarreia ou desconforto digestivo?", "type": "single", "options": ["Sim, tenho esses sintomas frequentemente", "Sim, acontece várias vezes por semana", "Às vezes, mas não é constante", "Raramente ou nunca tenho esses sintomas"]},
        {"id": "q2", "text": "Você já teve contato com água ou alimentos que podem estar contaminados?", "type": "single", "options": ["Sim, frequentemente tenho esse tipo de exposição", "Sim, às vezes posso ter tido contato", "Talvez, mas não tenho certeza", "Não, sempre tomo cuidado com isso"]},
        {"id": "q3", "text": "Você sente que precisa de ajuda para identificar e tratar possíveis parasitoses?", "type": "single", "options": ["Sim, preciso muito de orientação profissional", "Sim, seria muito útil ter um diagnóstico", "Talvez, se for algo prático e eficaz", "Não, consigo resolver sozinho(a)"]},
        {"id": "q4", "text": "Você valoriza um protocolo direcionado para tratar parasitoses de forma segura?", "type": "single", "options": ["Muito, é essencial para minha saúde", "Bastante, procuro opções adequadas", "Moderadamente, se for algo eficaz", "Pouco, não me preocupo muito"]},
        {"id": "q5", "text": "Você está aberto(a) para ter um acompanhamento especializado em diagnóstico de parasitose?", "type": "single", "options": ["Sim, é exatamente o que preciso!", "Sim, seria muito útil ter um acompanhamento", "Talvez, se for alguém experiente e confiável", "Não, prefiro fazer sozinho(a)"]}
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
    'b1000021-0021-4000-8000-000000000021',
    'quiz_perfil_metabolico',
    'diagnostico',
    '{
      "title": "Avaliação do Perfil Metabólico",
      "questions": [
        {"id": "q1", "text": "Como você descreveria seu metabolismo?", "type": "single", "options": ["Muito lento, ganho peso facilmente", "Lento, tenho dificuldade para perder peso", "Moderado, equilibrado", "Rápido, queimo calorias facilmente"]},
        {"id": "q2", "text": "Você sente que precisa de ajuda para otimizar seu metabolismo?", "type": "single", "options": ["Sim, preciso muito de orientação profissional", "Sim, seria útil ter um acompanhamento", "Talvez, se for algo prático e personalizado", "Não, consigo otimizar sozinho(a)"]},
        {"id": "q3", "text": "Você valoriza ter um plano personalizado baseado no seu perfil metabólico?", "type": "single", "options": ["Muito, é essencial para resultados eficazes", "Bastante, acredito que faria diferença", "Moderadamente, se for algo prático", "Pouco, prefiro seguir padrões gerais"]},
        {"id": "q4", "text": "Você sente que produtos específicos para seu metabolismo ajudariam seus resultados?", "type": "single", "options": ["Sim, faria toda diferença e aceleraria resultados", "Sim, acredito que seria muito útil", "Talvez, se for algo comprovado e eficaz", "Não, não vejo necessidade"]},
        {"id": "q5", "text": "Você acredita que um acompanhamento especializado pode transformar seu metabolismo?", "type": "single", "options": ["Sim, absolutamente! Estou pronto(a) para mudanças", "Sim, acredito que pode fazer diferença", "Talvez, se for algo estruturado e eficaz", "Não, acho que não é necessário"]}
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
    'b1000022-0022-4000-8000-000000000022',
    'quiz_detox',
    'diagnostico',
    '{
      "title": "Seu corpo está pedindo Detox?",
      "questions": [
        {"id": "q1", "text": "Você se sente cansado mesmo após dormir bem?", "type": "single", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
        {"id": "q2", "text": "Tem dificuldade para perder peso mesmo com dieta?", "type": "single", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
        {"id": "q3", "text": "Consome alimentos processados com frequência?", "type": "single", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
        {"id": "q4", "text": "Nota sinais de inchaço ou retenção de líquidos?", "type": "single", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]},
        {"id": "q5", "text": "Você está frequentemente exposto a produtos químicos (limpeza, cosméticos) ou ambientes poluídos (trânsito, indústria)?", "type": "single", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]}
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
    'b1000023-0023-4000-8000-000000000023',
    'quiz_disciplinado_emocional',
    'diagnostico',
    '{
      "title": "Você é mais disciplinado ou emocional com a comida?",
      "questions": [
        {"id": "q1", "text": "Você come mais por fome física ou por impulso/emoção?", "type": "single", "options": ["Sempre por fome física", "Maioria das vezes por fome física", "Mistura dos dois", "Muitas vezes por impulso ou emoção"]},
        {"id": "q2", "text": "Em dias de estresse, você tende a comer mais ou menos?", "type": "single", "options": ["Como menos ou igual", "Como um pouco mais", "Como bem mais", "Como muito mais, perco o controle"]},
        {"id": "q3", "text": "Você planeja suas refeições com antecedência?", "type": "single", "options": ["Sempre, tenho rotina definida", "Frequentemente", "Às vezes", "Raramente ou nunca"]},
        {"id": "q4", "text": "Quando sai do planejamento, como reage?", "type": "single", "options": ["Mantenho o foco e ajusto", "Fico um pouco desanimado(a)", "Desisto do dia e como o que quiser", "Entro em ciclo de culpa e exagero"]},
        {"id": "q5", "text": "Você consegue diferenciar fome física de vontade de comer?", "type": "single", "options": ["Sim, quase sempre", "Na maioria das vezes", "Às vezes tenho dúvida", "Não, costumo confundir"]}
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
    'b1000024-0024-4000-8000-000000000024',
    'quiz_perfil_nutricional',
    'diagnostico',
    '{
      "title": "Quiz de Perfil Nutricional",
      "questions": [
        {"id": "q1", "text": "Você sente que absorve bem os nutrientes dos alimentos?", "type": "single", "options": ["Não, tenho digestão lenta e cansaço", "Parcialmente, às vezes sinto que não aproveito bem", "Sim, na maioria das vezes", "Sim, me sinto bem nutrido(a)"]},
        {"id": "q2", "text": "Você sente desconforto digestivo após as refeições?", "type": "single", "options": ["Frequentemente", "Às vezes", "Raramente", "Quase nunca"]},
        {"id": "q3", "text": "Você valoriza entender seu perfil de absorção nutricional?", "type": "single", "options": ["Muito, é essencial para minha saúde", "Bastante, acredito que faria diferença", "Moderadamente", "Pouco"]},
        {"id": "q4", "text": "Você acredita que estratégias personalizadas podem melhorar sua absorção?", "type": "single", "options": ["Sim, faria toda diferença", "Sim, acredito que ajudaria", "Talvez", "Não vejo necessidade"]},
        {"id": "q5", "text": "Você está aberto(a) para um acompanhamento especializado em nutrição e digestão?", "type": "single", "options": ["Sim, é exatamente o que preciso!", "Sim, seria muito útil", "Talvez", "Não, prefiro sozinho(a)"]}
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

-- Inserir itens na biblioteca (ylada_biblioteca_itens)
-- Requer que a tabela exista (migration 232) e que template_id exista (migration 234)
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
  ('quiz', ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'], 'alimentacao', 'habitos', 'Quiz Alimentação Saudável', 'Quiz para avaliar hábitos alimentares e necessidade de orientação. O diagnóstico se adapta ao perfil do profissional.', 'custom', NULL, 'b1000009-0009-4000-8000-000000000009', 'diagnostico_risco', 'RISK_DIAGNOSIS', '{"nomenclatura": "quiz_alimentacao_saudavel"}'::jsonb, 53, true),
  ('quiz', ARRAY['nutrition', 'nutrition_vendedor', 'medicine'], 'metabolismo', 'metabolismo', 'Risco de Síndrome Metabólica', 'Quiz para avaliar risco de síndrome metabólica. O diagnóstico se adapta ao perfil do profissional.', 'custom', NULL, 'b1000010-0010-4000-8000-000000000010', 'diagnostico_risco', 'RISK_DIAGNOSIS', '{"nomenclatura": "quiz_sindrome_metabolica"}'::jsonb, 54, true),
  ('quiz', ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'], 'peso_gordura', 'metabolismo', 'Pronto para Emagrecer?', 'Quiz para avaliar prontidão para emagrecimento. O diagnóstico se adapta ao perfil do profissional.', 'custom', NULL, 'b1000011-0011-4000-8000-000000000011', 'diagnostico_risco', 'RISK_DIAGNOSIS', '{"nomenclatura": "quiz_pronto_emagrecer"}'::jsonb, 55, true),
  ('quiz', ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'], 'vitalidade_geral', 'habitos', 'Você conhece o seu corpo?', 'Quiz para avaliar consciência corporal. O diagnóstico se adapta ao perfil do profissional.', 'custom', NULL, 'b1000012-0012-4000-8000-000000000012', 'diagnostico_risco', 'RISK_DIAGNOSIS', '{"nomenclatura": "quiz_conhece_corpo"}'::jsonb, 56, true),
  ('quiz', ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'], 'alimentacao', 'habitos', 'Qual é o seu Tipo de Fome?', 'Quiz para identificar fome física vs emocional. O diagnóstico se adapta ao perfil do profissional.', 'custom', NULL, 'b1000013-0013-4000-8000-000000000013', 'diagnostico_risco', 'RISK_DIAGNOSIS', '{"nomenclatura": "quiz_tipo_fome"}'::jsonb, 57, true),
  ('quiz', ARRAY['nutrition', 'nutrition_vendedor', 'medicine'], 'alimentacao', 'digestao', 'Você está nutrido ou apenas alimentado?', 'Quiz para avaliar qualidade nutricional. O diagnóstico se adapta ao perfil do profissional.', 'custom', NULL, 'b1000014-0014-4000-8000-000000000014', 'diagnostico_risco', 'RISK_DIAGNOSIS', '{"nomenclatura": "quiz_nutrido_vs_alimentado"}'::jsonb, 58, true),
  ('quiz', ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'], 'hidratacao', 'habitos', 'Diagnóstico de Eletrólitos', 'Quiz para avaliar equilíbrio eletrolítico. O diagnóstico se adapta ao perfil do profissional.', 'custom', NULL, 'b1000015-0015-4000-8000-000000000015', 'diagnostico_risco', 'RISK_DIAGNOSIS', '{"nomenclatura": "quiz_eletrolitos"}'::jsonb, 59, true),
  ('quiz', ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'], 'rotina_saudavel', 'habitos', 'Você está se alimentando conforme sua rotina?', 'Quiz para avaliar adequação alimentar à rotina. O diagnóstico se adapta ao perfil do profissional.', 'custom', NULL, 'b1000016-0016-4000-8000-000000000016', 'diagnostico_risco', 'RISK_DIAGNOSIS', '{"nomenclatura": "quiz_alimentacao_rotina"}'::jsonb, 60, true),
  ('quiz', ARRAY['nutrition', 'nutrition_vendedor', 'medicine'], 'intestino', 'digestao', 'Avaliação de Intolerâncias', 'Quiz para avaliar possíveis intolerâncias alimentares. O diagnóstico se adapta ao perfil do profissional.', 'custom', NULL, 'b1000017-0017-4000-8000-000000000017', 'diagnostico_risco', 'RISK_DIAGNOSIS', '{"nomenclatura": "quiz_intolerancia"}'::jsonb, 61, true),
  ('quiz', ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'], 'vitalidade_geral', 'habitos', 'Avaliação Inicial', 'Quiz para avaliar prontidão para transformação em saúde. O diagnóstico se adapta ao perfil do profissional.', 'custom', NULL, 'b1000018-0018-4000-8000-000000000018', 'diagnostico_risco', 'RISK_DIAGNOSIS', '{"nomenclatura": "quiz_avaliacao_inicial"}'::jsonb, 62, true),
  ('quiz', ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'], 'vitalidade_geral', 'energia', 'Descubra seu Perfil de Bem-Estar', 'Quiz para avaliar energia, atividade, estresse e sono. O diagnóstico se adapta ao perfil do profissional.', 'custom', NULL, 'b1000019-0019-4000-8000-000000000019', 'diagnostico_risco', 'RISK_DIAGNOSIS', '{"nomenclatura": "quiz_perfil_bem_estar"}'::jsonb, 63, true),
  ('quiz', ARRAY['nutrition', 'nutrition_vendedor', 'medicine'], 'intestino', 'digestao', 'Diagnóstico de Parasitose', 'Quiz para avaliar possíveis parasitoses. O diagnóstico se adapta ao perfil do profissional.', 'custom', NULL, 'b1000020-0020-4000-8000-000000000020', 'diagnostico_risco', 'RISK_DIAGNOSIS', '{"nomenclatura": "quiz_parasitose"}'::jsonb, 64, true),
  ('quiz', ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'], 'metabolismo', 'metabolismo', 'Avaliação do Perfil Metabólico', 'Quiz para avaliar perfil metabólico detalhado. O diagnóstico se adapta ao perfil do profissional.', 'custom', NULL, 'b1000021-0021-4000-8000-000000000021', 'diagnostico_risco', 'RISK_DIAGNOSIS', '{"nomenclatura": "quiz_perfil_metabolico"}'::jsonb, 65, true),
  ('quiz', ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'], 'vitalidade_geral', 'metabolismo', 'Seu corpo está pedindo Detox?', 'Quiz para avaliar sinais de sobrecarga tóxica. O diagnóstico se adapta ao perfil do profissional.', 'custom', NULL, 'b1000022-0022-4000-8000-000000000022', 'diagnostico_risco', 'RISK_DIAGNOSIS', '{"nomenclatura": "quiz_detox"}'::jsonb, 66, true),
  ('quiz', ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'psychology', 'fitness'], 'alimentacao', 'mente', 'Você é mais disciplinado ou emocional com a comida?', 'Quiz para identificar perfil comportamental alimentar. O diagnóstico se adapta ao perfil do profissional.', 'custom', NULL, 'b1000023-0023-4000-8000-000000000023', 'diagnostico_risco', 'RISK_DIAGNOSIS', '{"nomenclatura": "quiz_disciplinado_emocional"}'::jsonb, 67, true),
  ('quiz', ARRAY['nutrition', 'nutrition_vendedor', 'medicine'], 'intestino', 'digestao', 'Quiz de Perfil Nutricional', 'Quiz para avaliar absorção e perfil nutricional. O diagnóstico se adapta ao perfil do profissional.', 'custom', NULL, 'b1000024-0024-4000-8000-000000000024', 'diagnostico_risco', 'RISK_DIAGNOSIS', '{"nomenclatura": "quiz_perfil_nutricional"}'::jsonb, 68, true)
;
