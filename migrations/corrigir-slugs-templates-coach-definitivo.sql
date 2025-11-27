-- =====================================================
-- CORRIGIR SLUGS: Templates Coach - CORREÇÃO DEFINITIVA
-- Este script corrige todos os slugs dos templates Coach
-- para os slugs esperados, removendo sufixos "-nutri" e
-- ajustando casos especiais
-- =====================================================

-- =====================================================
-- CORREÇÕES DE SLUGS
-- =====================================================

-- 1. Avaliação Inicial
UPDATE coach_templates_nutrition
SET slug = 'avaliacao-inicial'
WHERE id = 'ee44ead1-b086-413e-8144-48f1e7dc61c2'
  AND slug = 'avaliacao-inicial-nutri';

-- 2. Desafio 21 Dias
UPDATE coach_templates_nutrition
SET slug = 'template-desafio-21dias'
WHERE id = 'ddccdf92-3ba8-412a-8c79-e6a627620ed4'
  AND slug = 'desafio-21-dias';

-- 3. Diagnóstico de Parasitose
UPDATE coach_templates_nutrition
SET slug = 'diagnostico-parasitose'
WHERE id = '42ba1e7c-8020-40b7-b2ee-a7de68c007a0'
  AND slug = 'template-diagnostico-parasitose';

-- 4. Diagnóstico de Sintomas Intestinais
UPDATE coach_templates_nutrition
SET slug = 'diagnostico-sintomas-intestinais'
WHERE id = '3d14455f-83d1-4243-b4ae-1347622845ca'
  AND slug = 'diagnostico-sintomas-intestinais-nutri';

-- 5. Pronto para Emagrecer com Saúde?
UPDATE coach_templates_nutrition
SET slug = 'pronto-emagrecer'
WHERE id = '4bb2b5ca-2e48-48a8-be19-fdb3ac867e05'
  AND slug = 'pronto-emagrecer-nutri';

-- 6. Quiz de Bem-Estar
UPDATE coach_templates_nutrition
SET slug = 'quiz-bem-estar'
WHERE id = '40c0854e-5669-4116-9457-c5a38b09f3e9'
  AND slug = 'quiz-bem-estar-nutri';

-- 7. Quiz Detox
UPDATE coach_templates_nutrition
SET slug = 'quiz-detox'
WHERE id = 'c429eb3a-f997-4496-abf7-41e9f1180de2'
  AND slug = 'quiz-detox-nutri';

-- 8. Quiz Energético
UPDATE coach_templates_nutrition
SET slug = 'quiz-energetico'
WHERE id = 'f6e07d75-4a07-4017-9b89-df4c17ffbf52'
  AND slug = 'quiz-energetico-nutri';

-- 9. Quiz Interativo
UPDATE coach_templates_nutrition
SET slug = 'quiz-interativo'
WHERE id = '7e873bdd-7821-407b-a395-d38650535c6b'
  AND slug = 'template-story-interativo';

-- 10. Quiz: Alimentação Saudável
UPDATE coach_templates_nutrition
SET slug = 'quiz-alimentacao-saudavel'
WHERE id = 'e6b95a70-bca6-4f38-9361-56e2ee2045d4'
  AND slug = 'quiz-alimentacao';

-- 11. Risco de Síndrome Metabólica
UPDATE coach_templates_nutrition
SET slug = 'sindrome-metabolica'
WHERE id = '059e14f6-6adf-40f5-b088-feff1a8c97ac'
  AND slug = 'sindrome-metabolica-nutri';

-- 12. Teste de Retenção de Líquidos
UPDATE coach_templates_nutrition
SET slug = 'retencao-liquidos'
WHERE id = 'c61fff72-b65c-4bba-943a-eb921bd5cfaa'
  AND slug = 'retencao-liquidos-nutri';

-- 13. Você conhece o seu corpo?
UPDATE coach_templates_nutrition
SET slug = 'conhece-seu-corpo'
WHERE id = '6278889c-040d-4119-9604-95fc4112555c'
  AND slug = 'conhece-seu-corpo-nutri';

-- 14. Você é mais disciplinado ou emocional com a comida?
UPDATE coach_templates_nutrition
SET slug = 'disciplinado-emocional'
WHERE id = '40e26817-f949-4e91-b283-d8f719acb655'
  AND slug = 'disciplinado-emocional-nutri';

-- 15. Você está nutrido ou apenas alimentado?
UPDATE coach_templates_nutrition
SET slug = 'nutrido-vs-alimentado'
WHERE id = '1120ee69-c594-46e9-896c-287f6f1b101b'
  AND slug = 'nutrido-vs-alimentado-nutri';

-- 16. Você está se alimentando conforme sua rotina?
UPDATE coach_templates_nutrition
SET slug = 'alimentacao-rotina'
WHERE id = '530aa405-1d23-4543-887f-993fa12d3eb4'
  AND slug = 'alimentacao-rotina-nutri';

-- =====================================================
-- VERIFICAÇÃO PÓS-CORREÇÃO
-- =====================================================
SELECT 
  '✅ VERIFICAÇÃO PÓS-CORREÇÃO' as info,
  COUNT(*) FILTER (WHERE slug IN (
    'calc-hidratacao', 'calc-calorias', 'calc-imc', 'calc-proteina',
    'retencao-liquidos', 'conhece-seu-corpo', 'disciplinado-emocional',
    'nutrido-vs-alimentado', 'alimentacao-rotina', 'diagnostico-sintomas-intestinais',
    'pronto-emagrecer', 'tipo-fome', 'perfil-intestino', 'quiz-bem-estar',
    'quiz-perfil-nutricional', 'avaliacao-sono-energia', 'avaliacao-inicial',
    'template-desafio-21dias', 'diagnostico-eletrolitos', 'diagnostico-parasitose',
    'quiz-detox', 'quiz-energetico', 'quiz-interativo', 'quiz-alimentacao-saudavel',
    'sindrome-metabolica', 'quiz-pedindo-detox', 'avaliacao-intolerancia',
    'avaliacao-perfil-metabolico'
  )) as templates_com_slug_correto,
  COUNT(*) as total_templates_coach
FROM coach_templates_nutrition
WHERE is_active = true
  AND profession = 'coach'
  AND language = 'pt';

-- =====================================================
-- LISTAR TODOS OS TEMPLATES COM SLUGS CORRIGIDOS
-- =====================================================
SELECT 
  name as nome,
  slug,
  type as tipo,
  CASE 
    WHEN slug IN (
      'calc-hidratacao', 'calc-calorias', 'calc-imc', 'calc-proteina',
      'retencao-liquidos', 'conhece-seu-corpo', 'disciplinado-emocional',
      'nutrido-vs-alimentado', 'alimentacao-rotina', 'diagnostico-sintomas-intestinais',
      'pronto-emagrecer', 'tipo-fome', 'perfil-intestino', 'quiz-bem-estar',
      'quiz-perfil-nutricional', 'avaliacao-sono-energia', 'avaliacao-inicial',
      'template-desafio-21dias', 'diagnostico-eletrolitos', 'diagnostico-parasitose',
      'quiz-detox', 'quiz-energetico', 'quiz-interativo', 'quiz-alimentacao-saudavel',
      'sindrome-metabolica', 'quiz-pedindo-detox', 'avaliacao-intolerancia',
      'avaliacao-perfil-metabolico'
    ) THEN '✅ CORRETO'
    ELSE '⚠️ VERIFICAR'
  END as status
FROM coach_templates_nutrition
WHERE is_active = true
  AND profession = 'coach'
  AND language = 'pt'
ORDER BY 
  CASE 
    WHEN slug IN (
      'calc-hidratacao', 'calc-calorias', 'calc-imc', 'calc-proteina',
      'retencao-liquidos', 'conhece-seu-corpo', 'disciplinado-emocional',
      'nutrido-vs-alimentado', 'alimentacao-rotina', 'diagnostico-sintomas-intestinais',
      'pronto-emagrecer', 'tipo-fome', 'perfil-intestino', 'quiz-bem-estar',
      'quiz-perfil-nutricional', 'avaliacao-sono-energia', 'avaliacao-inicial',
      'template-desafio-21dias', 'diagnostico-eletrolitos', 'diagnostico-parasitose',
      'quiz-detox', 'quiz-energetico', 'quiz-interativo', 'quiz-alimentacao-saudavel',
      'sindrome-metabolica', 'quiz-pedindo-detox', 'avaliacao-intolerancia',
      'avaliacao-perfil-metabolico'
    ) THEN 0
    ELSE 1
  END,
  name;

