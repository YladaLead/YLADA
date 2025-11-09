-- ============================================
-- LISTAR APENAS QUIZZES NORMAIS (SEM DESAFIOS)
-- Para identificar qual dos 23 é o extra (esperado: 22)
-- ============================================

SELECT 
  ROW_NUMBER() OVER (ORDER BY name) as num,
  name as nome,
  slug,
  created_at,
  CASE 
    WHEN name = 'Quiz de Bem-Estar' THEN '✅ Esperado'
    WHEN name = 'Quiz Detox' THEN '✅ Esperado'
    WHEN name = 'Quiz Interativo' THEN '✅ Esperado'
    WHEN name = 'Quiz Energético' THEN '✅ Esperado'
    WHEN name = 'Quiz Perfil Nutricional' THEN '✅ Esperado'
    WHEN name = 'Quiz: Alimentação Saudável' THEN '✅ Esperado'
    WHEN name = 'Quiz: Potencial e Crescimento' THEN '✅ Esperado'
    WHEN name = 'Quiz: Ganhos e Prosperidade' THEN '✅ Esperado'
    WHEN name = 'Quiz: Propósito e Equilíbrio' THEN '✅ Esperado'
    WHEN name = 'Avaliação Inicial' THEN '✅ Esperado'
    WHEN name = 'Avaliação de Fome Emocional' THEN '✅ Esperado'
    WHEN name = 'Avaliação de Intolerâncias/Sensibilidades' THEN '✅ Esperado'
    WHEN name = 'Avaliação do Perfil Metabólico' THEN '✅ Esperado'
    WHEN name = 'Diagnóstico de Eletrólitos' THEN '✅ Esperado'
    WHEN name = 'Diagnóstico de Sintomas Intestinais' THEN '✅ Esperado'
    WHEN name = 'Pronto para Emagrecer com Saúde?' THEN '✅ Esperado'
    WHEN name = 'Qual é o seu Tipo de Fome?' THEN '✅ Esperado'
    WHEN name = 'Risco de Síndrome Metabólica' THEN '✅ Esperado'
    WHEN name = 'Teste de Retenção de Líquidos' THEN '✅ Esperado'
    WHEN name = 'Você conhece o seu corpo?' THEN '✅ Esperado'
    WHEN name = 'Você é mais disciplinado ou emocional com a comida?' THEN '✅ Esperado'
    WHEN name = 'Você está nutrido ou apenas alimentado?' THEN '✅ Esperado'
    WHEN name = 'Você está se alimentando conforme sua rotina?' THEN '✅ Esperado'
    ELSE '⚠️ EXTRA - Este quiz não está na lista esperada'
  END as status
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'quiz'
  AND name NOT LIKE '%Desafio%'
ORDER BY name;

-- RESUMO
SELECT 
  '📊 RESUMO' as info,
  COUNT(*) as total_quizzes_normais,
  COUNT(CASE WHEN name IN (
    'Quiz de Bem-Estar',
    'Quiz Detox',
    'Quiz Interativo',
    'Quiz Energético',
    'Quiz Perfil Nutricional',
    'Quiz: Alimentação Saudável',
    'Quiz: Potencial e Crescimento',
    'Quiz: Ganhos e Prosperidade',
    'Quiz: Propósito e Equilíbrio',
    'Avaliação Inicial',
    'Avaliação de Fome Emocional',
    'Avaliação de Intolerâncias/Sensibilidades',
    'Avaliação do Perfil Metabólico',
    'Diagnóstico de Eletrólitos',
    'Diagnóstico de Sintomas Intestinais',
    'Pronto para Emagrecer com Saúde?',
    'Qual é o seu Tipo de Fome?',
    'Risco de Síndrome Metabólica',
    'Teste de Retenção de Líquidos',
    'Você conhece o seu corpo?',
    'Você é mais disciplinado ou emocional com a comida?',
    'Você está nutrido ou apenas alimentado?',
    'Você está se alimentando conforme sua rotina?'
  ) THEN 1 END) as esperados,
  COUNT(CASE WHEN name NOT IN (
    'Quiz de Bem-Estar',
    'Quiz Detox',
    'Quiz Interativo',
    'Quiz Energético',
    'Quiz Perfil Nutricional',
    'Quiz: Alimentação Saudável',
    'Quiz: Potencial e Crescimento',
    'Quiz: Ganhos e Prosperidade',
    'Quiz: Propósito e Equilíbrio',
    'Avaliação Inicial',
    'Avaliação de Fome Emocional',
    'Avaliação de Intolerâncias/Sensibilidades',
    'Avaliação do Perfil Metabólico',
    'Diagnóstico de Eletrólitos',
    'Diagnóstico de Sintomas Intestinais',
    'Pronto para Emagrecer com Saúde?',
    'Qual é o seu Tipo de Fome?',
    'Risco de Síndrome Metabólica',
    'Teste de Retenção de Líquidos',
    'Você conhece o seu corpo?',
    'Você é mais disciplinado ou emocional com a comida?',
    'Você está nutrido ou apenas alimentado?',
    'Você está se alimentando conforme sua rotina?'
  ) THEN 1 END) as extras
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND type = 'quiz'
  AND name NOT LIKE '%Desafio%';


