-- =====================================================
-- Biblioteca Universal: 12 quizzes ESTÉTICA.
-- IDs: b1000043 a b1000054
-- =====================================================

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES
  (
    'b1000043-0043-4000-8000-000000000043',
    'quiz_idade_real_pele',
    'diagnostico',
    '{"title": "Qual é a idade real da sua pele?", "questions": [{"id": "q1", "text": "Com que frequência você usa protetor solar?", "type": "single", "options": ["Todos os dias", "Alguns dias", "Raramente", "Nunca"]}, {"id": "q2", "text": "Como você descreveria a hidratação da sua pele?", "type": "single", "options": ["Muito hidratada", "Normal", "Um pouco ressecada", "Muito ressecada"]}, {"id": "q3", "text": "Você percebe linhas finas ou rugas?", "type": "single", "options": ["Não", "Poucas", "Algumas", "Muitas"]}, {"id": "q4", "text": "Como é sua rotina de cuidados com a pele?", "type": "single", "options": ["Completa diariamente", "Básica", "Irregular", "Quase não tenho"]}, {"id": "q5", "text": "Como sua pele reage após noites mal dormidas?", "type": "single", "options": ["Não muda", "Um pouco cansada", "Visivelmente cansada", "Muito marcada"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero avaliar minha pele", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000044-0044-4000-8000-000000000044',
    'quiz_cuidados_pele_certos',
    'diagnostico',
    '{"title": "Sua pele está recebendo os cuidados certos?", "questions": [{"id": "q1", "text": "Você sabe qual é seu tipo de pele?", "type": "single", "options": ["Sim", "Tenho ideia", "Não tenho certeza", "Não sei"]}, {"id": "q2", "text": "Quantas vezes por dia você limpa o rosto?", "type": "single", "options": ["Duas", "Uma", "Algumas vezes na semana", "Raramente"]}, {"id": "q3", "text": "Você usa hidratante facial?", "type": "single", "options": ["Todos os dias", "Às vezes", "Raramente", "Nunca"]}, {"id": "q4", "text": "Você já fez tratamento profissional de pele?", "type": "single", "options": ["Regularmente", "Algumas vezes", "Uma vez", "Nunca"]}, {"id": "q5", "text": "Você sente que sua pele poderia melhorar?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero cuidar melhor da minha pele", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000045-0045-4000-8000-000000000045',
    'quiz_rosto_cansado',
    'diagnostico',
    '{"title": "Seu rosto demonstra mais cansaço do que deveria?", "questions": [{"id": "q1", "text": "Você percebe olheiras com frequência?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q2", "text": "Como está sua qualidade de sono?", "type": "single", "options": ["Excelente", "Boa", "Regular", "Ruim"]}, {"id": "q3", "text": "Sua pele parece sem brilho?", "type": "single", "options": ["Não", "Um pouco", "Sim", "Bastante"]}, {"id": "q4", "text": "Já comentaram que você parece cansado(a)?", "type": "single", "options": ["Nunca", "Algumas vezes", "Frequentemente", "Muitas vezes"]}, {"id": "q5", "text": "Você gostaria de parecer mais descansado(a)?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero melhorar minha aparência", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000046-0046-4000-8000-000000000046',
    'quiz_causa_celulite',
    'diagnostico',
    '{"title": "O que pode estar causando sua celulite?", "questions": [{"id": "q1", "text": "Quantas vezes por semana você se exercita?", "type": "single", "options": ["5 ou mais", "3 a 4", "1 a 2", "Nunca"]}, {"id": "q2", "text": "Como está sua ingestão de água?", "type": "single", "options": ["Muito boa", "Boa", "Baixa", "Muito baixa"]}, {"id": "q3", "text": "Como você define sua alimentação?", "type": "single", "options": ["Equilibrada", "Razoável", "Irregular", "Desorganizada"]}, {"id": "q4", "text": "Você percebe retenção ou inchaço?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q5", "text": "Como está a aparência da celulite?", "type": "single", "options": ["Quase inexistente", "Leve", "Moderada", "Intensa"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero reduzir a celulite", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000047-0047-4000-8000-000000000047',
    'quiz_pele_envelhecendo_rapido',
    'diagnostico',
    '{"title": "Sua pele pode estar envelhecendo mais rápido?", "questions": [{"id": "q1", "text": "Você se expõe ao sol sem proteção?", "type": "single", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente"]}, {"id": "q2", "text": "Você hidrata a pele regularmente?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q3", "text": "Você percebe manchas na pele?", "type": "single", "options": ["Não", "Poucas", "Algumas", "Muitas"]}, {"id": "q4", "text": "Você fuma ou já fumou?", "type": "single", "options": ["Nunca", "Já fumei", "Às vezes", "Sim"]}, {"id": "q5", "text": "Como avalia sua pele hoje?", "type": "single", "options": ["Muito jovem", "Normal", "Um pouco envelhecida", "Mais envelhecida que deveria"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero prevenir o envelhecimento", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000048-0048-4000-8000-000000000048',
    'quiz_pele_hidratada',
    'diagnostico',
    '{"title": "Sua pele está realmente hidratada?", "questions": [{"id": "q1", "text": "Sua pele repuxa após lavar?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q2", "text": "Você usa hidratante?", "type": "single", "options": ["Todos os dias", "Às vezes", "Raramente", "Nunca"]}, {"id": "q3", "text": "Quantos copos de água você bebe por dia?", "type": "single", "options": ["8 ou mais", "5 a 7", "3 a 4", "Menos de 3"]}, {"id": "q4", "text": "Sua pele descama?", "type": "single", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente"]}, {"id": "q5", "text": "Como está a textura da pele?", "type": "single", "options": ["Muito macia", "Normal", "Áspera", "Muito áspera"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero melhorar minha pele", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000049-0049-4000-8000-000000000049',
    'quiz_tipo_pele_real',
    'diagnostico',
    '{"title": "Qual tipo de pele você realmente tem?", "questions": [{"id": "q1", "text": "Como sua pele fica algumas horas após lavar o rosto?", "type": "single", "options": ["Normal", "Oleosa", "Ressecada", "Misturada (oleosa em algumas áreas)"]}, {"id": "q2", "text": "Você percebe brilho excessivo ao longo do dia?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q3", "text": "Seus poros são visíveis?", "type": "single", "options": ["Quase não", "Um pouco", "Bastante", "Muito"]}, {"id": "q4", "text": "Sua pele costuma descamar?", "type": "single", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente"]}, {"id": "q5", "text": "Como sua pele reage a novos produtos?", "type": "single", "options": ["Muito bem", "Normal", "Às vezes irrita", "Irrita facilmente"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero entender minha pele", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000050-0050-4000-8000-000000000050',
    'quiz_sinais_flacidez',
    'diagnostico',
    '{"title": "Você tem sinais de flacidez que ainda não percebeu?", "questions": [{"id": "q1", "text": "Você percebe perda de firmeza no rosto?", "type": "single", "options": ["Não", "Um pouco", "Sim", "Bastante"]}, {"id": "q2", "text": "Sua pele parece menos firme que antes?", "type": "single", "options": ["Não", "Um pouco", "Sim", "Muito"]}, {"id": "q3", "text": "Você percebe mudança no contorno do rosto?", "type": "single", "options": ["Não", "Pouco", "Sim", "Bastante"]}, {"id": "q4", "text": "Sua pele demora para voltar ao normal ao ser pressionada?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q5", "text": "Você sente que a pele poderia estar mais firme?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero avaliar minha pele", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000051-0051-4000-8000-000000000051',
    'quiz_pele_protegida_envelhecimento',
    'diagnostico',
    '{"title": "Sua pele está protegida contra o envelhecimento?", "questions": [{"id": "q1", "text": "Você usa protetor solar diariamente?", "type": "single", "options": ["Sempre", "Quase sempre", "Às vezes", "Nunca"]}, {"id": "q2", "text": "Você reaplica protetor ao longo do dia?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q3", "text": "Você usa antioxidantes ou vitamina C?", "type": "single", "options": ["Sim", "Às vezes", "Raramente", "Nunca"]}, {"id": "q4", "text": "Você se expõe muito ao sol?", "type": "single", "options": ["Não", "Um pouco", "Bastante", "Muito"]}, {"id": "q5", "text": "Sua pele apresenta manchas?", "type": "single", "options": ["Não", "Poucas", "Algumas", "Muitas"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero proteger minha pele", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000052-0052-4000-8000-000000000052',
    'quiz_pele_jovem_velha',
    'diagnostico',
    '{"title": "Sua pele parece mais jovem ou mais velha que sua idade?", "questions": [{"id": "q1", "text": "Você percebe rugas ao sorrir ou falar?", "type": "single", "options": ["Não", "Poucas", "Algumas", "Muitas"]}, {"id": "q2", "text": "Sua pele parece cansada?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q3", "text": "Sua pele tem brilho saudável?", "type": "single", "options": ["Muito", "Médio", "Pouco", "Nenhum"]}, {"id": "q4", "text": "Você já recebeu comentários sobre aparência cansada?", "type": "single", "options": ["Nunca", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q5", "text": "Você gostaria de melhorar a aparência da pele?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero avaliar minha pele", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000053-0053-4000-8000-000000000053',
    'quiz_rotina_skincare_funciona',
    'diagnostico',
    '{"title": "Sua rotina de skincare realmente funciona?", "questions": [{"id": "q1", "text": "Quantos produtos você usa diariamente?", "type": "single", "options": ["5 ou mais", "3 a 4", "1 a 2", "Nenhum"]}, {"id": "q2", "text": "Você sente melhora com sua rotina?", "type": "single", "options": ["Sim", "Um pouco", "Pouco", "Nenhuma"]}, {"id": "q3", "text": "Você conhece seu tipo de pele?", "type": "single", "options": ["Sim", "Mais ou menos", "Pouco", "Não"]}, {"id": "q4", "text": "Você ajusta produtos conforme estação?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q5", "text": "Você já teve orientação profissional?", "type": "single", "options": ["Sim", "Algumas vezes", "Raramente", "Nunca"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero melhorar minha rotina de pele", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000054-0054-4000-8000-000000000054',
    'quiz_rosto_mais_idade',
    'diagnostico',
    '{"title": "Seu rosto demonstra mais idade que deveria?", "questions": [{"id": "q1", "text": "Você percebe rugas no espelho?", "type": "single", "options": ["Não", "Poucas", "Algumas", "Muitas"]}, {"id": "q2", "text": "Sua pele parece firme?", "type": "single", "options": ["Muito", "Normal", "Pouco", "Nada"]}, {"id": "q3", "text": "Você percebe manchas ou sinais solares?", "type": "single", "options": ["Não", "Poucas", "Algumas", "Muitas"]}, {"id": "q4", "text": "Sua pele tem brilho saudável?", "type": "single", "options": ["Sim", "Médio", "Pouco", "Não"]}, {"id": "q5", "text": "Você sente que sua pele poderia parecer mais jovem?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero avaliar minha pele", "resultIntro": "Seu resultado:"}'::jsonb,
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
  ('quiz', ARRAY['aesthetics'], 'pele', 'energia', 'Qual é a idade real da sua pele?', 'Avalie sinais de envelhecimento e receba orientações personalizadas.', 'Envelhecimento da pele', 'Rejuvenescimento', 'custom', 'b1000043-0043-4000-8000-000000000043', '{}', 110, true),
  ('quiz', ARRAY['aesthetics'], 'pele', 'habitos', 'Sua pele está recebendo os cuidados certos?', 'Identifique se sua rotina de cuidados está adequada ao seu tipo de pele.', 'Pele sem viço', 'Melhorar aparência', 'custom', 'b1000044-0044-4000-8000-000000000044', '{}', 111, true),
  ('quiz', ARRAY['aesthetics'], 'autoestima', 'energia', 'Seu rosto demonstra mais cansaço do que deveria?', 'Avalie fatores que podem estar contribuindo para aparência cansada.', 'Aparência cansada', 'Revitalizar aparência', 'custom', 'b1000045-0045-4000-8000-000000000045', '{}', 112, true),
  ('quiz', ARRAY['aesthetics'], 'celulite', 'metabolismo', 'O que pode estar causando sua celulite?', 'Identifique fatores que influenciam na aparência da celulite.', 'Celulite', 'Melhorar aparência da pele', 'custom', 'b1000046-0046-4000-8000-000000000046', '{}', 113, true),
  ('quiz', ARRAY['aesthetics'], 'rejuvenescimento', 'energia', 'Sua pele pode estar envelhecendo mais rápido?', 'Avalie hábitos que podem acelerar o envelhecimento.', 'Envelhecimento precoce', 'Prevenir envelhecimento', 'custom', 'b1000047-0047-4000-8000-000000000047', '{}', 114, true),
  ('quiz', ARRAY['aesthetics'], 'pele', 'habitos', 'Sua pele está realmente hidratada?', 'Identifique sinais de desidratação da pele.', 'Pele ressecada', 'Melhorar hidratação da pele', 'custom', 'b1000048-0048-4000-8000-000000000048', '{}', 115, true),
  ('quiz', ARRAY['aesthetics'], 'pele', 'habitos', 'Qual tipo de pele você realmente tem?', 'Descubra seu tipo de pele para cuidados adequados.', 'Cuidados inadequados', 'Entender tipo de pele', 'custom', 'b1000049-0049-4000-8000-000000000049', '{}', 116, true),
  ('quiz', ARRAY['aesthetics'], 'flacidez', 'metabolismo', 'Você tem sinais de flacidez que ainda não percebeu?', 'Identifique sinais iniciais de flacidez.', 'Flacidez', 'Melhorar firmeza da pele', 'custom', 'b1000050-0050-4000-8000-000000000050', '{}', 117, true),
  ('quiz', ARRAY['aesthetics'], 'rejuvenescimento', 'energia', 'Sua pele está protegida contra o envelhecimento?', 'Avalie se seus hábitos protegem a pele.', 'Envelhecimento precoce', 'Prevenir danos', 'custom', 'b1000051-0051-4000-8000-000000000051', '{}', 118, true),
  ('quiz', ARRAY['aesthetics'], 'rejuvenescimento', 'energia', 'Sua pele parece mais jovem ou mais velha que sua idade?', 'Avalie fatores que influenciam na aparência da pele.', 'Envelhecimento precoce', 'Rejuvenescimento', 'custom', 'b1000052-0052-4000-8000-000000000052', '{}', 119, true),
  ('quiz', ARRAY['aesthetics'], 'rotina_cuidados', 'habitos', 'Sua rotina de skincare realmente funciona?', 'Avalie se sua rotina está adequada ao seu tipo de pele.', 'Rotina ineficiente', 'Melhorar cuidados com a pele', 'custom', 'b1000053-0053-4000-8000-000000000053', '{}', 120, true),
  ('quiz', ARRAY['aesthetics'], 'rejuvenescimento', 'energia', 'Seu rosto demonstra mais idade que deveria?', 'Identifique sinais de envelhecimento facial.', 'Aparência envelhecida', 'Rejuvenescimento', 'custom', 'b1000054-0054-4000-8000-000000000054', '{}', 121, true);
