-- =====================================================
-- CRIAR TEMPLATES FALTANTES COACH
-- =====================================================
-- Este script cria os 8 templates que ainda estão faltando:
-- - calc-composicao
-- - diagnostico-sintomas-intestinais
-- - guia-hidratacao
-- - quiz-ganhos
-- - quiz-potencial
-- - quiz-proposito
-- - template-desafio-21dias
-- - template-desafio-7dias

-- =====================================================
-- PASSO 1: TENTAR COPIAR DA TABELA ORIGEM
-- =====================================================

-- 1. Calculadora de Composição Corporal
INSERT INTO coach_templates_nutrition (
  name, type, language, profession, is_active, slug,
  title, description, content, specialization, objective, cta_text, whatsapp_message
)
SELECT 
  COALESCE(t.name, 'Calculadora de Composição Corporal'),
  'calculadora',
  'pt',
  'coach',
  true,
  'calc-composicao',
  COALESCE(t.title, 'Calculadora de Composição Corporal'),
  COALESCE(t.description, 'Calcule sua composição corporal e percentual de gordura'),
  COALESCE(t.content, '{"template_type": "calculator", "fields": ["peso", "altura", "idade", "genero", "circunferencias"]}'::jsonb),
  t.specialization,
  t.objective,
  t.cta_text,
  t.whatsapp_message
FROM templates_nutrition t
WHERE (LOWER(t.name) LIKE '%composição%' OR LOWER(t.name) LIKE '%composicao%' OR LOWER(t.name) LIKE '%corporal%')
  AND t.type = 'calculadora'
  AND t.is_active = true
  AND t.language = 'pt'
  AND (t.profession = 'nutri' OR t.profession IS NULL OR t.profession = '' OR t.profession = 'wellness')
  AND NOT EXISTS (
    SELECT 1 FROM coach_templates_nutrition c WHERE c.slug = 'calc-composicao'
  )
LIMIT 1;

-- 2. Diagnóstico de Sintomas Intestinais
INSERT INTO coach_templates_nutrition (
  name, type, language, profession, is_active, slug,
  title, description, content, specialization, objective, cta_text, whatsapp_message
)
SELECT 
  COALESCE(t.name, 'Diagnóstico de Sintomas Intestinais'),
  'diagnostico',
  'pt',
  'coach',
  true,
  'diagnostico-sintomas-intestinais',
  COALESCE(t.title, 'Diagnóstico de Sintomas Intestinais'),
  COALESCE(t.description, 'Avalie seus sintomas intestinais e digestivos'),
  COALESCE(t.content, '{"template_type": "diagnostic", "fields": ["sintomas", "frequencia", "duracao"]}'::jsonb),
  t.specialization,
  t.objective,
  t.cta_text,
  t.whatsapp_message
FROM templates_nutrition t
WHERE (LOWER(t.name) LIKE '%sintoma%' AND (LOWER(t.name) LIKE '%intestinal%' OR LOWER(t.name) LIKE '%digestivo%'))
  AND t.is_active = true
  AND t.language = 'pt'
  AND (t.profession = 'nutri' OR t.profession IS NULL OR t.profession = '' OR t.profession = 'wellness')
  AND NOT EXISTS (
    SELECT 1 FROM coach_templates_nutrition c WHERE c.slug = 'diagnostico-sintomas-intestinais'
  )
LIMIT 1;

-- 3. Guia de Hidratação
INSERT INTO coach_templates_nutrition (
  name, type, language, profession, is_active, slug,
  title, description, content, specialization, objective, cta_text, whatsapp_message
)
SELECT 
  COALESCE(t.name, 'Guia de Hidratação'),
  'conteudo',
  'pt',
  'coach',
  true,
  'guia-hidratacao',
  COALESCE(t.title, 'Guia de Hidratação'),
  COALESCE(t.description, 'Aprenda sobre a importância da hidratação e como manter-se hidratado'),
  COALESCE(t.content, '{"template_type": "guide", "sections": ["importancia", "quantidade", "dicas"]}'::jsonb),
  t.specialization,
  t.objective,
  t.cta_text,
  t.whatsapp_message
FROM templates_nutrition t
WHERE (LOWER(t.name) LIKE '%guia%' AND (LOWER(t.name) LIKE '%hidratação%' OR LOWER(t.name) LIKE '%hidratacao%' OR LOWER(t.name) LIKE '%água%'))
  AND t.is_active = true
  AND t.language = 'pt'
  AND (t.profession = 'nutri' OR t.profession IS NULL OR t.profession = '' OR t.profession = 'wellness')
  AND NOT EXISTS (
    SELECT 1 FROM coach_templates_nutrition c WHERE c.slug = 'guia-hidratacao'
  )
LIMIT 1;

-- 4. Quiz Ganhos e Prosperidade
INSERT INTO coach_templates_nutrition (
  name, type, language, profession, is_active, slug,
  title, description, content, specialization, objective, cta_text, whatsapp_message
)
SELECT 
  COALESCE(t.name, 'Quiz: Ganhos e Prosperidade'),
  'quiz',
  'pt',
  'coach',
  true,
  'quiz-ganhos',
  COALESCE(t.title, 'Quiz: Ganhos e Prosperidade'),
  COALESCE(t.description, 'Descubra seu potencial para ganhos e prosperidade'),
  COALESCE(t.content, '{"template_type": "quiz", "questions": []}'::jsonb),
  t.specialization,
  t.objective,
  t.cta_text,
  t.whatsapp_message
FROM templates_nutrition t
WHERE (LOWER(t.name) LIKE '%ganhos%' OR LOWER(t.name) LIKE '%prosperidade%')
  AND t.type = 'quiz'
  AND t.is_active = true
  AND t.language = 'pt'
  AND (t.profession = 'nutri' OR t.profession IS NULL OR t.profession = '' OR t.profession = 'wellness')
  AND NOT EXISTS (
    SELECT 1 FROM coach_templates_nutrition c WHERE c.slug = 'quiz-ganhos'
  )
LIMIT 1;

-- 5. Quiz Potencial e Crescimento
INSERT INTO coach_templates_nutrition (
  name, type, language, profession, is_active, slug,
  title, description, content, specialization, objective, cta_text, whatsapp_message
)
SELECT 
  COALESCE(t.name, 'Quiz: Potencial e Crescimento'),
  'quiz',
  'pt',
  'coach',
  true,
  'quiz-potencial',
  COALESCE(t.title, 'Quiz: Potencial e Crescimento'),
  COALESCE(t.description, 'Descubra seu potencial de crescimento'),
  COALESCE(t.content, '{"template_type": "quiz", "questions": []}'::jsonb),
  t.specialization,
  t.objective,
  t.cta_text,
  t.whatsapp_message
FROM templates_nutrition t
WHERE (LOWER(t.name) LIKE '%potencial%' OR LOWER(t.name) LIKE '%crescimento%')
  AND t.type = 'quiz'
  AND t.is_active = true
  AND t.language = 'pt'
  AND (t.profession = 'nutri' OR t.profession IS NULL OR t.profession = '' OR t.profession = 'wellness')
  AND NOT EXISTS (
    SELECT 1 FROM coach_templates_nutrition c WHERE c.slug = 'quiz-potencial'
  )
LIMIT 1;

-- 6. Quiz Propósito e Equilíbrio
INSERT INTO coach_templates_nutrition (
  name, type, language, profession, is_active, slug,
  title, description, content, specialization, objective, cta_text, whatsapp_message
)
SELECT 
  COALESCE(t.name, 'Quiz: Propósito e Equilíbrio'),
  'quiz',
  'pt',
  'coach',
  true,
  'quiz-proposito',
  COALESCE(t.title, 'Quiz: Propósito e Equilíbrio'),
  COALESCE(t.description, 'Descubra seu propósito e encontre equilíbrio'),
  COALESCE(t.content, '{"template_type": "quiz", "questions": []}'::jsonb),
  t.specialization,
  t.objective,
  t.cta_text,
  t.whatsapp_message
FROM templates_nutrition t
WHERE (LOWER(t.name) LIKE '%propósito%' OR LOWER(t.name) LIKE '%proposito%' OR LOWER(t.name) LIKE '%equilíbrio%' OR LOWER(t.name) LIKE '%equilibrio%')
  AND t.type = 'quiz'
  AND t.is_active = true
  AND t.language = 'pt'
  AND (t.profession = 'nutri' OR t.profession IS NULL OR t.profession = '' OR t.profession = 'wellness')
  AND NOT EXISTS (
    SELECT 1 FROM coach_templates_nutrition c WHERE c.slug = 'quiz-proposito'
  )
LIMIT 1;

-- 7. Desafio 21 Dias
INSERT INTO coach_templates_nutrition (
  name, type, language, profession, is_active, slug,
  title, description, content, specialization, objective, cta_text, whatsapp_message
)
SELECT 
  COALESCE(t.name, 'Desafio 21 Dias'),
  'checklist',
  'pt',
  'coach',
  true,
  'template-desafio-21dias',
  COALESCE(t.title, 'Desafio 21 Dias'),
  COALESCE(t.description, 'Complete o desafio de 21 dias para transformar seus hábitos'),
  COALESCE(t.content, '{"template_type": "challenge", "duration": 21, "days": []}'::jsonb),
  t.specialization,
  t.objective,
  t.cta_text,
  t.whatsapp_message
FROM templates_nutrition t
WHERE (LOWER(t.name) LIKE '%21 dias%' OR LOWER(t.name) LIKE '%21dias%' OR LOWER(t.name) LIKE '%desafio 21%')
  AND t.is_active = true
  AND t.language = 'pt'
  AND (t.profession = 'nutri' OR t.profession IS NULL OR t.profession = '' OR t.profession = 'wellness')
  AND NOT EXISTS (
    SELECT 1 FROM coach_templates_nutrition c WHERE c.slug = 'template-desafio-21dias'
  )
LIMIT 1;

-- 8. Desafio 7 Dias
INSERT INTO coach_templates_nutrition (
  name, type, language, profession, is_active, slug,
  title, description, content, specialization, objective, cta_text, whatsapp_message
)
SELECT 
  COALESCE(t.name, 'Desafio 7 Dias'),
  'checklist',
  'pt',
  'coach',
  true,
  'template-desafio-7dias',
  COALESCE(t.title, 'Desafio 7 Dias'),
  COALESCE(t.description, 'Complete o desafio de 7 dias para iniciar sua transformação'),
  COALESCE(t.content, '{"template_type": "challenge", "duration": 7, "days": []}'::jsonb),
  t.specialization,
  t.objective,
  t.cta_text,
  t.whatsapp_message
FROM templates_nutrition t
WHERE (LOWER(t.name) LIKE '%7 dias%' OR LOWER(t.name) LIKE '%7dias%' OR LOWER(t.name) LIKE '%desafio 7%')
  AND t.is_active = true
  AND t.language = 'pt'
  AND (t.profession = 'nutri' OR t.profession IS NULL OR t.profession = '' OR t.profession = 'wellness')
  AND NOT EXISTS (
    SELECT 1 FROM coach_templates_nutrition c WHERE c.slug = 'template-desafio-7dias'
  )
LIMIT 1;

-- =====================================================
-- PASSO 2: CRIAR COM ESTRUTURA BÁSICA SE AINDA NÃO EXISTIREM
-- =====================================================

-- 1. Calculadora de Composição Corporal
INSERT INTO coach_templates_nutrition (
  name, type, language, profession, is_active, slug,
  title, description, content, specialization, objective
)
SELECT 
  'Calculadora de Composição Corporal',
  'calculadora',
  'pt',
  'coach',
  true,
  'calc-composicao',
  'Calculadora de Composição Corporal',
  'Calcule sua composição corporal, percentual de gordura e massa magra',
  '{"template_type": "calculator", "fields": [{"name": "peso", "label": "Peso (kg)", "type": "number"}, {"name": "altura", "label": "Altura (cm)", "type": "number"}, {"name": "idade", "label": "Idade", "type": "number"}, {"name": "genero", "label": "Gênero", "type": "select", "options": ["Masculino", "Feminino"]}, {"name": "circunferencia_cintura", "label": "Circunferência da Cintura (cm)", "type": "number"}]}'::jsonb,
  'avaliacao',
  'capturar-leads'
WHERE NOT EXISTS (
  SELECT 1 FROM coach_templates_nutrition WHERE slug = 'calc-composicao'
);

-- 2. Diagnóstico de Sintomas Intestinais
INSERT INTO coach_templates_nutrition (
  name, type, language, profession, is_active, slug,
  title, description, content, specialization, objective
)
SELECT 
  'Diagnóstico de Sintomas Intestinais',
  'diagnostico',
  'pt',
  'coach',
  true,
  'diagnostico-sintomas-intestinais',
  'Diagnóstico de Sintomas Intestinais',
  'Avalie seus sintomas intestinais e digestivos para identificar possíveis desequilíbrios',
  '{"template_type": "diagnostic", "fields": [{"name": "sintomas", "label": "Quais sintomas você apresenta?", "type": "multiselect", "options": ["Inchaço", "Gases", "Constipação", "Diarreia", "Dor abdominal", "Azia", "Refluxo", "Náusea"]}, {"name": "frequencia", "label": "Com que frequência?", "type": "select", "options": ["Diariamente", "Algumas vezes por semana", "Raramente"]}, {"name": "duracao", "label": "Há quanto tempo?", "type": "select", "options": ["Menos de 1 mês", "1-3 meses", "Mais de 3 meses"]}]}'::jsonb,
  'clinica',
  'capturar-leads'
WHERE NOT EXISTS (
  SELECT 1 FROM coach_templates_nutrition WHERE slug = 'diagnostico-sintomas-intestinais'
);

-- 3. Guia de Hidratação
INSERT INTO coach_templates_nutrition (
  name, type, language, profession, is_active, slug,
  title, description, content, specialization, objective
)
SELECT 
  'Guia de Hidratação',
  'conteudo',
  'pt',
  'coach',
  true,
  'guia-hidratacao',
  'Guia de Hidratação',
  'Aprenda sobre a importância da hidratação, quanta água você precisa e dicas práticas para manter-se hidratado',
  '{"template_type": "guide", "sections": [{"title": "Importância da Hidratação", "content": "A água é essencial para todas as funções do organismo"}, {"title": "Quanta Água Você Precisa?", "content": "A recomendação geral é de 35ml por kg de peso corporal"}, {"title": "Dicas Práticas", "content": "Beba água ao acordar, antes das refeições e durante exercícios"}]}'::jsonb,
  'educacao',
  'capturar-leads'
WHERE NOT EXISTS (
  SELECT 1 FROM coach_templates_nutrition WHERE slug = 'guia-hidratacao'
);

-- 4. Quiz Ganhos e Prosperidade
INSERT INTO coach_templates_nutrition (
  name, type, language, profession, is_active, slug,
  title, description, content, specialization, objective
)
SELECT 
  'Quiz: Ganhos e Prosperidade',
  'quiz',
  'pt',
  'coach',
  true,
  'quiz-ganhos',
  'Quiz: Ganhos e Prosperidade',
  'Descubra seu potencial para ganhos e prosperidade através deste quiz interativo',
  '{"template_type": "quiz", "questions": [{"question": "Como você se sente em relação aos seus ganhos atuais?", "type": "multiple_choice", "options": ["Satisfeito", "Quero melhorar", "Insatisfeito"]}, {"question": "O que mais te motiva?", "type": "multiple_choice", "options": ["Crescimento pessoal", "Estabilidade financeira", "Realização profissional"]}]}'::jsonb,
  'desenvolvimento',
  'capturar-leads'
WHERE NOT EXISTS (
  SELECT 1 FROM coach_templates_nutrition WHERE slug = 'quiz-ganhos'
);

-- 5. Quiz Potencial e Crescimento
INSERT INTO coach_templates_nutrition (
  name, type, language, profession, is_active, slug,
  title, description, content, specialization, objective
)
SELECT 
  'Quiz: Potencial e Crescimento',
  'quiz',
  'pt',
  'coach',
  true,
  'quiz-potencial',
  'Quiz: Potencial e Crescimento',
  'Descubra seu potencial de crescimento pessoal e profissional',
  '{"template_type": "quiz", "questions": [{"question": "Como você avalia seu potencial atual?", "type": "multiple_choice", "options": ["Alto", "Médio", "Baixo"]}, {"question": "O que você busca para crescer?", "type": "multiple_choice", "options": ["Conhecimento", "Oportunidades", "Mentoria"]}]}'::jsonb,
  'desenvolvimento',
  'capturar-leads'
WHERE NOT EXISTS (
  SELECT 1 FROM coach_templates_nutrition WHERE slug = 'quiz-potencial'
);

-- 6. Quiz Propósito e Equilíbrio
INSERT INTO coach_templates_nutrition (
  name, type, language, profession, is_active, slug,
  title, description, content, specialization, objective
)
SELECT 
  'Quiz: Propósito e Equilíbrio',
  'quiz',
  'pt',
  'coach',
  true,
  'quiz-proposito',
  'Quiz: Propósito e Equilíbrio',
  'Descubra seu propósito de vida e encontre o equilíbrio que você busca',
  '{"template_type": "quiz", "questions": [{"question": "Você sente que tem um propósito claro?", "type": "multiple_choice", "options": ["Sim, muito claro", "Parcialmente", "Não, ainda estou buscando"]}, {"question": "Como você busca equilíbrio?", "type": "multiple_choice", "options": ["Trabalho e vida pessoal", "Saúde e bem-estar", "Todas as áreas"]}]}'::jsonb,
  'desenvolvimento',
  'capturar-leads'
WHERE NOT EXISTS (
  SELECT 1 FROM coach_templates_nutrition WHERE slug = 'quiz-proposito'
);

-- 7. Desafio 21 Dias
INSERT INTO coach_templates_nutrition (
  name, type, language, profession, is_active, slug,
  title, description, content, specialization, objective
)
SELECT 
  'Desafio 21 Dias',
  'checklist',
  'pt',
  'coach',
  true,
  'template-desafio-21dias',
  'Desafio 21 Dias',
  'Complete o desafio de 21 dias para transformar seus hábitos e alcançar seus objetivos',
  '{"template_type": "challenge", "duration": 21, "days": [{"day": 1, "tasks": []}, {"day": 2, "tasks": []}, {"day": 3, "tasks": []}]}'::jsonb,
  'transformacao',
  'capturar-leads'
WHERE NOT EXISTS (
  SELECT 1 FROM coach_templates_nutrition WHERE slug = 'template-desafio-21dias'
);

-- 8. Desafio 7 Dias
INSERT INTO coach_templates_nutrition (
  name, type, language, profession, is_active, slug,
  title, description, content, specialization, objective
)
SELECT 
  'Desafio 7 Dias',
  'checklist',
  'pt',
  'coach',
  true,
  'template-desafio-7dias',
  'Desafio 7 Dias',
  'Complete o desafio de 7 dias para iniciar sua transformação e criar novos hábitos',
  '{"template_type": "challenge", "duration": 7, "days": [{"day": 1, "tasks": []}, {"day": 2, "tasks": []}, {"day": 3, "tasks": []}]}'::jsonb,
  'transformacao',
  'capturar-leads'
WHERE NOT EXISTS (
  SELECT 1 FROM coach_templates_nutrition WHERE slug = 'template-desafio-7dias'
);

-- =====================================================
-- PASSO 3: VERIFICAÇÃO FINAL
-- =====================================================

SELECT 
  name,
  slug,
  type,
  is_active,
  profession,
  language,
  CASE 
    WHEN slug IS NULL THEN '❌ SEM SLUG'
    WHEN is_active = false THEN '⚠️ INATIVO'
    WHEN profession != 'coach' THEN '⚠️ PROFESSION DIFERENTE'
    WHEN language != 'pt' THEN '⚠️ LANGUAGE DIFERENTE'
    ELSE '✅ OK'
  END as status
FROM coach_templates_nutrition
WHERE slug IN (
  'calc-composicao',
  'diagnostico-sintomas-intestinais',
  'guia-hidratacao',
  'quiz-ganhos',
  'quiz-potencial',
  'quiz-proposito',
  'template-desafio-21dias',
  'template-desafio-7dias'
)
ORDER BY slug;

-- Verificar se ainda há templates faltantes
WITH templates_essenciais AS (
  SELECT unnest(ARRAY[
    'calc-composicao',
    'diagnostico-sintomas-intestinais',
    'guia-hidratacao',
    'quiz-ganhos',
    'quiz-potencial',
    'quiz-proposito',
    'template-desafio-21dias',
    'template-desafio-7dias'
  ]) as slug_esperado
)
SELECT 
  te.slug_esperado as template_faltante,
  '❌ FALTANDO' as status
FROM templates_essenciais te
WHERE NOT EXISTS (
  SELECT 1 FROM coach_templates_nutrition c
  WHERE c.slug = te.slug_esperado
    AND c.is_active = true
)
ORDER BY te.slug_esperado;

-- Resumo
DO $$
DECLARE
  total_criados INTEGER;
  faltantes INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_criados
  FROM coach_templates_nutrition
  WHERE slug IN (
    'calc-composicao',
    'diagnostico-sintomas-intestinais',
    'guia-hidratacao',
    'quiz-ganhos',
    'quiz-potencial',
    'quiz-proposito',
    'template-desafio-21dias',
    'template-desafio-7dias'
  )
  AND is_active = true;
  
  SELECT COUNT(*) INTO faltantes
  FROM (
    SELECT unnest(ARRAY[
      'calc-composicao',
      'diagnostico-sintomas-intestinais',
      'guia-hidratacao',
      'quiz-ganhos',
      'quiz-potencial',
      'quiz-proposito',
      'template-desafio-21dias',
      'template-desafio-7dias'
    ]) as slug_esperado
  ) te
  WHERE NOT EXISTS (
    SELECT 1 FROM coach_templates_nutrition c
    WHERE c.slug = te.slug_esperado AND c.is_active = true
  );
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'RESUMO - TEMPLATES FALTANTES';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Templates criados/verificados: %', total_criados;
  RAISE NOTICE 'Templates ainda faltantes: %', faltantes;
  
  IF faltantes = 0 THEN
    RAISE NOTICE '✅ SUCESSO: Todos os 8 templates foram criados!';
  ELSE
    RAISE NOTICE '⚠️ ATENÇÃO: Ainda faltam % templates', faltantes;
  END IF;
END $$;

