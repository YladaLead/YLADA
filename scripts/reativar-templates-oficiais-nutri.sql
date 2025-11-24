-- ===========================================================
-- CORREÇÃO: Reativar os 29 Templates Oficiais Nutri
-- 
-- Este script reativa todos os 29 templates oficiais que
-- aparecem na UI, garantindo que nenhum template oficial
-- fique desativado.
-- ===========================================================

BEGIN;

-- 1. REATIVAR pelos IDs dos 20 templates da lista JSON
UPDATE templates_nutrition
SET 
  is_active = true,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND id IN (
    '22f927f1-7ad7-4dda-97b7-27d802897554', -- tipo-fome
    '772eb739-b32c-40da-976d-ead9ac9f3807', -- alimentacao-saudavel
    'fbc42995-147e-43de-bc71-8cb09c5a5d99', -- diagnostico-parasitose
    'a1cfa7e2-39c2-41c6-8e1e-3bba26281ded', -- disciplinado-emocional
    '748c26c5-2759-4d4f-a294-90107bd7a656', -- alimentacao-rotina
    '2e826e57-3ff2-4a95-a70e-dea3b14501a2', -- desafio-21-dias
    'c776bd50-9722-4fe0-8eda-624db0e0ac40', -- quiz-bem-estar
    'ee882269-77c7-4387-a4d1-99ec413e4938', -- quiz-detox
    '5e2a0878-9227-4bf9-8f82-ee83c09c440d', -- quiz-energetico
    '00ce61c6-0ca8-4f69-ac4e-0aa2d823698e', -- quiz-interativo
    '7af48a74-c5d6-4e68-b931-dcd9d1f4967e', -- avaliacao-inicial
    'a28a1bdd-a93f-4840-9793-59d7693973f8', -- pronto-emagrecer
    'c0e8f448-3e13-4ce7-93bf-d9996f486940', -- avaliacao-intolerancia
    '1b91f645-b877-4557-ad81-faf8be917d33', -- avaliacao-perfil-metabolico
    'eeb96d12-bdcd-4bb5-897c-51a75a476ced', -- diagnostico-eletrolitos
    '461c8818-bed6-4bc4-bc86-642d2ee7136b', -- diagnostico-sintomas-intestinais
    '128d43ea-321b-4e15-b850-f7af2dd6683a', -- sindrome-metabolica
    '27c66bf3-9fda-462d-8d67-bd14b8a48868', -- retencao-liquidos
    '46368854-8b1c-4469-881d-b314e896843f', -- conhece-seu-corpo
    '8b8cf83b-d452-48d5-9183-886f77268494'  -- nutrido-vs-alimentado
  );

-- 2. REATIVAR pelos slugs dos 9 templates adicionais que aparecem na UI
-- (estes podem não ter IDs na lista JSON, então usamos slugs)
UPDATE templates_nutrition
SET 
  is_active = true,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND (
    slug IN (
      'perfil-intestino',
      'quiz-pedindo-detox',
      'calculadora-agua',
      'calculadora-calorias',
      'calculadora-imc',
      'calculadora-proteina',
      'avaliacao-sono-energia',
      'descoberta-perfil-bem-estar',
      'quiz-perfil-nutricional'
    )
    OR slug LIKE '%perfil-intestino%'
    OR slug LIKE '%quiz-pedindo-detox%'
    OR slug LIKE '%calculadora-agua%'
    OR slug LIKE '%calculadora-calorias%'
    OR slug LIKE '%calculadora-imc%'
    OR slug LIKE '%calculadora-proteina%'
    OR slug LIKE '%avaliacao-sono-energia%'
    OR slug LIKE '%descoberta-perfil-bem-estar%'
    OR slug LIKE '%quiz-perfil-nutricional%'
  );

-- 3. VERIFICAÇÃO FINAL: Confirmar que todos os 29 estão ativos
SELECT 
  COUNT(*) as total_templates_nutri,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos_apos_correcao,
  29 as ativos_esperados,
  CASE 
    WHEN COUNT(CASE WHEN is_active = true THEN 1 END) = 29 THEN '✅ CORRETO'
    ELSE '⚠️ AINDA FALTAM TEMPLATES'
  END as status
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt';

-- 4. Listar todos os templates ativos para confirmação visual
SELECT 
  name,
  slug,
  type,
  is_active
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND is_active = true
ORDER BY name;

COMMIT;

-- ===========================================================
-- INSTRUÇÕES:
-- 1. Execute este script completo no SQL Editor do Supabase
-- 2. O COMMIT finaliza a transação
-- 3. Verifique o resultado do passo 3 (deve mostrar 29 ativos)
-- 4. O passo 4 lista todos os templates ativos para você revisar
-- ===========================================================

