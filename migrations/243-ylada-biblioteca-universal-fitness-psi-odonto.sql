-- =====================================================
-- Biblioteca Universal: Fitness (6) + Psicologia (4) + Odontologia (6).
-- IDs: b1000055 a b1000070
-- =====================================================

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES
  -- FITNESS
  (
    'b1000055-0055-4000-8000-000000000055',
    'quiz_perfil_condicionamento',
    'diagnostico',
    '{"title": "Qual é o perfil do seu condicionamento físico?", "questions": [{"id": "q1", "text": "Quantas vezes você treina por semana?", "type": "single", "options": ["5 ou mais", "3 a 4", "1 a 2", "Não treino"]}, {"id": "q2", "text": "Subir escadas é fácil para você?", "type": "single", "options": ["Muito fácil", "Normal", "Cansativo", "Muito difícil"]}, {"id": "q3", "text": "Você percebe evolução no treino?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q4", "text": "Quanto dura seu treino?", "type": "single", "options": ["Mais de 1h", "40–60 min", "20–40 min", "Menos de 20 min"]}, {"id": "q5", "text": "Como está sua energia no treino?", "type": "single", "options": ["Muito alta", "Boa", "Média", "Baixa"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero melhorar meu condicionamento", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000056-0056-4000-8000-000000000056',
    'quiz_treino_funcionando',
    'diagnostico',
    '{"title": "Seu treino realmente está funcionando?", "questions": [{"id": "q1", "text": "Há quanto tempo segue o mesmo treino?", "type": "single", "options": ["Menos de 1 mês", "1–3 meses", "3–6 meses", "Mais de 6 meses"]}, {"id": "q2", "text": "Você percebe mudanças no corpo?", "type": "single", "options": ["Muitas", "Algumas", "Poucas", "Nenhuma"]}, {"id": "q3", "text": "Você ajusta o treino com frequência?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q4", "text": "Como está sua motivação?", "type": "single", "options": ["Muito alta", "Boa", "Média", "Baixa"]}, {"id": "q5", "text": "Seu treino tem orientação profissional?", "type": "single", "options": ["Sim", "Parcial", "Pouca", "Não"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero melhorar meus resultados", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000057-0057-4000-8000-000000000057',
    'quiz_corpo_evoluindo_ritmo',
    'diagnostico',
    '{"title": "Seu corpo está evoluindo no ritmo certo?", "questions": [{"id": "q1", "text": "Você ganha força nos treinos?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q2", "text": "Você sente estagnação?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q3", "text": "Você acompanha progresso?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q4", "text": "Você muda estímulos no treino?", "type": "single", "options": ["Frequentemente", "Às vezes", "Raramente", "Nunca"]}, {"id": "q5", "text": "Você acredita que poderia evoluir mais?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero evoluir no treino", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000058-0058-4000-8000-000000000058',
    'quiz_treinando_eficiente',
    'diagnostico',
    '{"title": "Você está treinando da forma mais eficiente?", "questions": [{"id": "q1", "text": "Você segue um plano de treino estruturado?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q2", "text": "Você acompanha evolução de cargas?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q3", "text": "Você sabe quais músculos está trabalhando?", "type": "single", "options": ["Sim", "Mais ou menos", "Pouco", "Não"]}, {"id": "q4", "text": "Você sente evolução nos treinos?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q5", "text": "Você já teve orientação profissional?", "type": "single", "options": ["Sim", "Algumas vezes", "Raramente", "Nunca"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero melhorar meu treino", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000059-0059-4000-8000-000000000059',
    'quiz_recuperacao_treinos',
    'diagnostico',
    '{"title": "Seu corpo está recuperando bem dos treinos?", "questions": [{"id": "q1", "text": "Você sente dores musculares frequentes?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q2", "text": "Quantas horas você dorme por noite?", "type": "single", "options": ["8 ou mais", "6 a 7", "5 a 6", "Menos de 5"]}, {"id": "q3", "text": "Você descansa entre treinos intensos?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q4", "text": "Você sente fadiga constante?", "type": "single", "options": ["Não", "Um pouco", "Sim", "Muito"]}, {"id": "q5", "text": "Sua alimentação apoia seus treinos?", "type": "single", "options": ["Muito", "Razoavelmente", "Pouco", "Nada"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero melhorar minha recuperação", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000060-0060-4000-8000-000000000060',
    'quiz_treinando_mais_deveria',
    'diagnostico',
    '{"title": "Você pode estar treinando mais do que deveria?", "questions": [{"id": "q1", "text": "Você treina quantos dias por semana?", "type": "single", "options": ["3 a 4", "5", "6", "7"]}, {"id": "q2", "text": "Você sente cansaço excessivo?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q3", "text": "Você tem dificuldade de recuperação?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q4", "text": "Você sente queda de desempenho?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q5", "text": "Você faz semanas de descanso?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero avaliar meu treino", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  -- PSICOLOGIA
  (
    'b1000061-0061-4000-8000-000000000061',
    'quiz_estresse_acima_normal',
    'diagnostico',
    '{"title": "Seu nível de estresse está acima do normal?", "questions": [{"id": "q1", "text": "Você se sente sobrecarregado?", "type": "single", "options": ["Raramente", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q2", "text": "Consegue relaxar após o trabalho?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q3", "text": "Como está seu sono?", "type": "single", "options": ["Excelente", "Bom", "Regular", "Ruim"]}, {"id": "q4", "text": "Sua mente desacelera à noite?", "type": "single", "options": ["Sim", "Às vezes", "Raramente", "Nunca"]}, {"id": "q5", "text": "O estresse afeta seu humor?", "type": "single", "options": ["Não", "Um pouco", "Bastante", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero entender meu estresse", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000062-0062-4000-8000-000000000062',
    'quiz_mente_acelerada',
    'diagnostico',
    '{"title": "Sua mente está sempre acelerada?", "questions": [{"id": "q1", "text": "Você pensa em muitas coisas ao mesmo tempo?", "type": "single", "options": ["Raramente", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q2", "text": "Você consegue focar facilmente?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q3", "text": "Sua mente continua ativa antes de dormir?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q4", "text": "Você sente dificuldade de relaxar?", "type": "single", "options": ["Não", "Um pouco", "Sim", "Muito"]}, {"id": "q5", "text": "Você gostaria de ter mais tranquilidade mental?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero melhorar meu equilíbrio mental", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000063-0063-4000-8000-000000000063',
    'quiz_sobrecarregado_emocional',
    'diagnostico',
    '{"title": "Você está emocionalmente sobrecarregado?", "questions": [{"id": "q1", "text": "Você sente que tem muitas responsabilidades?", "type": "single", "options": ["Raramente", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q2", "text": "Você se sente cansado mentalmente?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q3", "text": "Você tem tempo para descansar?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q4", "text": "Você sente pressão constante?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q5", "text": "Você gostaria de ter mais equilíbrio emocional?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero falar com um profissional", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000064-0064-4000-8000-000000000064',
    'quiz_consegue_relaxar',
    'diagnostico',
    '{"title": "Você consegue realmente relaxar?", "questions": [{"id": "q1", "text": "Você consegue desligar a mente facilmente?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q2", "text": "Você sente tensão no corpo?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q3", "text": "Você consegue aproveitar momentos de descanso?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q4", "text": "Você sente preocupação constante?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q5", "text": "Você gostaria de se sentir mais tranquilo?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero melhorar meu equilíbrio mental", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  -- ODONTOLOGIA
  (
    'b1000065-0065-4000-8000-000000000065',
    'quiz_saude_bucal_dia',
    'diagnostico',
    '{"title": "Sua saúde bucal está realmente em dia?", "questions": [{"id": "q1", "text": "Quantas vezes escova os dentes por dia?", "type": "single", "options": ["3 ou mais", "2", "1", "Menos"]}, {"id": "q2", "text": "Usa fio dental?", "type": "single", "options": ["Todos os dias", "Às vezes", "Raramente", "Nunca"]}, {"id": "q3", "text": "Vai ao dentista regularmente?", "type": "single", "options": ["A cada 6 meses", "1 vez por ano", "Raramente", "Nunca"]}, {"id": "q4", "text": "Sente sensibilidade dental?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q5", "text": "Como avalia seu sorriso?", "type": "single", "options": ["Muito saudável", "Saudável", "Poderia melhorar", "Precisa de cuidados"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero avaliar minha saúde bucal", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000066-0066-4000-8000-000000000066',
    'quiz_sensibilidade_dental',
    'diagnostico',
    '{"title": "Você tem sinais de sensibilidade dental?", "questions": [{"id": "q1", "text": "Você sente dor ao tomar algo gelado?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q2", "text": "Você sente desconforto ao comer alimentos doces?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q3", "text": "Escovar os dentes causa sensibilidade?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q4", "text": "Você já comentou sobre sensibilidade com um dentista?", "type": "single", "options": ["Sim", "Uma vez", "Não tenho certeza", "Nunca"]}, {"id": "q5", "text": "A sensibilidade interfere na sua alimentação?", "type": "single", "options": ["Nunca", "Um pouco", "Sim", "Bastante"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero avaliar minha sensibilidade", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000067-0067-4000-8000-000000000067',
    'quiz_sorriso_saudavel',
    'diagnostico',
    '{"title": "Seu sorriso poderia estar mais saudável?", "questions": [{"id": "q1", "text": "Você se sente confiante ao sorrir?", "type": "single", "options": ["Sempre", "Na maioria das vezes", "Às vezes", "Raramente"]}, {"id": "q2", "text": "Você percebe manchas ou amarelamento?", "type": "single", "options": ["Não", "Pouco", "Sim", "Bastante"]}, {"id": "q3", "text": "Você evita sorrir em fotos?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q4", "text": "Há quanto tempo você não faz limpeza profissional?", "type": "single", "options": ["Menos de 6 meses", "6–12 meses", "Mais de 1 ano", "Mais de 2 anos"]}, {"id": "q5", "text": "Você gostaria de melhorar seu sorriso?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero melhorar meu sorriso", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000068-0068-4000-8000-000000000068',
    'quiz_escovando_errado',
    'diagnostico',
    '{"title": "Você pode estar escovando os dentes da forma errada?", "questions": [{"id": "q1", "text": "Quanto tempo dura sua escovação?", "type": "single", "options": ["Mais de 2 minutos", "Cerca de 2 minutos", "Menos de 1 minuto", "Muito rápida"]}, {"id": "q2", "text": "Você escova a língua?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q3", "text": "Você usa fio dental?", "type": "single", "options": ["Todos os dias", "Algumas vezes", "Raramente", "Nunca"]}, {"id": "q4", "text": "Sua escova de dentes é trocada com frequência?", "type": "single", "options": ["A cada 3 meses", "A cada 6 meses", "Raramente", "Não sei"]}, {"id": "q5", "text": "Você já recebeu orientação de escovação correta?", "type": "single", "options": ["Sim", "Há muito tempo", "Não lembro", "Nunca"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero melhorar minha higiene bucal", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000069-0069-4000-8000-000000000069',
    'quiz_halito_indicando',
    'diagnostico',
    '{"title": "Seu hálito pode estar indicando algo?", "questions": [{"id": "q1", "text": "Você percebe gosto ruim na boca?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q2", "text": "Já comentaram sobre seu hálito?", "type": "single", "options": ["Nunca", "Uma vez", "Algumas vezes", "Muitas vezes"]}, {"id": "q3", "text": "Você sente boca seca com frequência?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q4", "text": "Você usa fio dental regularmente?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q5", "text": "Você sente melhora no hálito após escovar?", "type": "single", "options": ["Sempre", "Às vezes", "Pouco", "Quase nunca"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero avaliar meu hálito", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000070-0070-4000-8000-000000000070',
    'quiz_dentes_desgaste',
    'diagnostico',
    '{"title": "Seus dentes podem estar sofrendo desgaste?", "questions": [{"id": "q1", "text": "Você range ou aperta os dentes?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q2", "text": "Você sente dor na mandíbula?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q3", "text": "Seus dentes parecem mais curtos ou desgastados?", "type": "single", "options": ["Não", "Um pouco", "Sim", "Bastante"]}, {"id": "q4", "text": "Você acorda com tensão no rosto?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q5", "text": "Já foi avaliado por um dentista para isso?", "type": "single", "options": ["Sim", "Uma vez", "Não tenho certeza", "Nunca"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero avaliar meus dentes", "resultIntro": "Seu resultado:"}'::jsonb,
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
  ('quiz', ARRAY['fitness'], 'treino', 'habitos', 'Qual é o perfil do seu condicionamento físico?', 'Avalie seu nível de condicionamento e receba orientações.', 'Baixa resistência', 'Melhorar condicionamento', 'custom', 'b1000055-0055-4000-8000-000000000055', '{}', 130, true),
  ('quiz', ARRAY['fitness'], 'performance', 'habitos', 'Seu treino realmente está funcionando?', 'Identifique se seu treino está trazendo resultados.', 'Falta de resultado', 'Melhorar performance', 'custom', 'b1000056-0056-4000-8000-000000000056', '{}', 131, true),
  ('quiz', ARRAY['fitness'], 'treino', 'habitos', 'Seu corpo está evoluindo no ritmo certo?', 'Avalie fatores que podem estar limitando sua evolução.', 'Estagnação', 'Evoluir no treino', 'custom', 'b1000057-0057-4000-8000-000000000057', '{}', 132, true),
  ('quiz', ARRAY['fitness'], 'treino', 'habitos', 'Você está treinando da forma mais eficiente?', 'Identifique se sua estratégia de treino está adequada.', 'Treino ineficiente', 'Otimizar treino', 'custom', 'b1000058-0058-4000-8000-000000000058', '{}', 133, true),
  ('quiz', ARRAY['fitness'], 'recuperacao', 'habitos', 'Seu corpo está recuperando bem dos treinos?', 'Avalie sinais de recuperação inadequada.', 'Recuperação inadequada', 'Melhorar recuperação', 'custom', 'b1000059-0059-4000-8000-000000000059', '{}', 134, true),
  ('quiz', ARRAY['fitness'], 'treino', 'habitos', 'Você pode estar treinando mais do que deveria?', 'Identifique sinais de excesso de treino.', 'Excesso de treino', 'Equilíbrio no treino', 'custom', 'b1000060-0060-4000-8000-000000000060', '{}', 135, true),
  ('quiz', ARRAY['psychology'], 'estresse', 'mente', 'Seu nível de estresse está acima do normal?', 'Avalie sinais de estresse e receba orientações.', 'Estresse', 'Equilíbrio emocional', 'custom', 'b1000061-0061-4000-8000-000000000061', '{}', 140, true),
  ('quiz', ARRAY['psychology'], 'ansiedade', 'mente', 'Sua mente está sempre acelerada?', 'Identifique padrões de mente acelerada.', 'Ansiedade', 'Melhorar bem-estar emocional', 'custom', 'b1000062-0062-4000-8000-000000000062', '{}', 141, true),
  ('quiz', ARRAY['psychology'], 'emocoes', 'mente', 'Você está emocionalmente sobrecarregado?', 'Avalie sinais de sobrecarga emocional.', 'Sobrecarga emocional', 'Equilíbrio emocional', 'custom', 'b1000063-0063-4000-8000-000000000063', '{}', 142, true),
  ('quiz', ARRAY['psychology'], 'equilibrio_emocional', 'mente', 'Você consegue realmente relaxar?', 'Avalie sua capacidade de relaxamento mental.', 'Mente acelerada', 'Melhorar tranquilidade mental', 'custom', 'b1000064-0064-4000-8000-000000000064', '{}', 143, true),
  ('quiz', ARRAY['dentistry'], 'saude_bucal', 'habitos', 'Sua saúde bucal está realmente em dia?', 'Avalie sua rotina de cuidados com os dentes.', 'Higiene bucal inadequada', 'Melhorar saúde bucal', 'custom', 'b1000065-0065-4000-8000-000000000065', '{}', 150, true),
  ('quiz', ARRAY['dentistry'], 'sensibilidade', 'habitos', 'Você tem sinais de sensibilidade dental?', 'Identifique sinais de sensibilidade nos dentes.', 'Sensibilidade', 'Reduzir desconforto', 'custom', 'b1000066-0066-4000-8000-000000000066', '{}', 151, true),
  ('quiz', ARRAY['dentistry'], 'estetica_dental', 'habitos', 'Seu sorriso poderia estar mais saudável?', 'Avalie a saúde e estética do seu sorriso.', 'Estética dental', 'Melhorar sorriso', 'custom', 'b1000067-0067-4000-8000-000000000067', '{}', 152, true),
  ('quiz', ARRAY['dentistry'], 'higiene_oral', 'habitos', 'Você pode estar escovando os dentes da forma errada?', 'Identifique hábitos de escovação que podem ser ajustados.', 'Higiene bucal inadequada', 'Melhorar escovação', 'custom', 'b1000068-0068-4000-8000-000000000068', '{}', 153, true),
  ('quiz', ARRAY['dentistry'], 'halitose', 'habitos', 'Seu hálito pode estar indicando algo?', 'Avalie fatores relacionados ao mau hálito.', 'Halitose', 'Melhorar saúde bucal', 'custom', 'b1000069-0069-4000-8000-000000000069', '{}', 154, true),
  ('quiz', ARRAY['dentistry'], 'saude_bucal', 'habitos', 'Seus dentes podem estar sofrendo desgaste?', 'Identifique sinais de desgaste dental.', 'Desgaste dental', 'Prevenir desgaste', 'custom', 'b1000070-0070-4000-8000-000000000070', '{}', 155, true);
