-- ===========================================================
-- LIMPEZA CONTROLADA – TEMPLATES NUTRI (fora do catálogo de 29)
-- 
-- IMPORTANTE: Este script desativa apenas templates que NÃO estão
-- na lista oficial de 29 templates que aparecem na UI.
-- 
-- Lista oficial (por ID e slug):
-- 1. Qual é o seu Tipo de Fome? (quiz-tipo-fome)
-- 2. Quiz: Alimentação Saudável (quiz-alimentacao-nutri)
-- 3. Diagnóstico de Parasitose (template-diagnostico-parasitose)
-- 4. Você é mais disciplinado ou emocional? (disciplinado-emocional-nutri)
-- 5. Você está se alimentando conforme sua rotina? (alimentacao-rotina-nutri)
-- 6. Desafio 21 Dias (desafio-21-dias-nutri)
-- 7. Quiz de Bem-Estar (quiz-bem-estar-nutri)
-- 8. Quiz Detox (quiz-detox-nutri)
-- 9. Quiz Energético (quiz-energetico-nutri)
-- 10. Quiz Interativo (quiz-interativo-nutri)
-- 11. Avaliação Inicial (avaliacao-inicial-nutri)
-- 12. Pronto para Emagrecer com Saúde? (pronto-emagrecer-nutri)
-- 13. Avaliação de Intolerâncias/Sensibilidades (avaliacao-intolerancia-nutri)
-- 14. Avaliação do Perfil Metabólico (avaliacao-perfil-metabolico-nutri)
-- 15. Diagnóstico de Eletrólitos (diagnostico-eletrolitos-nutri)
-- 16. Diagnóstico de Sintomas Intestinais (diagnostico-sintomas-intestinais-nutri)
-- 17. Risco de Síndrome Metabólica (sindrome-metabolica-nutri)
-- 18. Teste de Retenção de Líquidos (retencao-liquidos-nutri)
-- 19. Você conhece o seu corpo? (conhece-seu-corpo-nutri)
-- 20. Você está nutrido ou apenas alimentado? (nutrido-vs-alimentado-nutri)
-- 
-- + 9 templates adicionais que aparecem na UI mas não estão nesta lista JSON
-- ===========================================================

BEGIN;

-- 1. BACKUP: Criar tabela de backup (execute apenas uma vez)
CREATE TABLE IF NOT EXISTS templates_nutrition_backup_limpeza_20240115 AS
SELECT *
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt';

-- 2. VERIFICAÇÃO: Listar o que será desativado ANTES de executar
-- Execute este SELECT primeiro para revisar
SELECT 
  id,
  name,
  slug,
  type,
  is_active,
  '⚠️ SERÁ DESATIVADO' as acao
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND id NOT IN (
    -- IDs dos 20 templates oficiais da lista JSON
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
  )
  AND COALESCE(slug, '') NOT IN (
    -- Slugs alternativos dos 29 templates oficiais (com e sem sufixo -nutri)
    'tipo-fome',
    'quiz-tipo-fome',
    'quiz-alimentacao-saudavel',
    'quiz-alimentacao-nutri',
    'template-diagnostico-parasitose',
    'diagnostico-parasitose',
    'disciplinado-emocional',
    'disciplinado-emocional-nutri',
    'alimentacao-rotina',
    'alimentacao-rotina-nutri',
    'desafio-21-dias',
    'desafio-21-dias-nutri',
    'quiz-bem-estar',
    'quiz-bem-estar-nutri',
    'quiz-detox',
    'quiz-detox-nutri',
    'quiz-energetico',
    'quiz-energetico-nutri',
    'quiz-interativo',
    'quiz-interativo-nutri',
    'avaliacao-inicial',
    'avaliacao-inicial-nutri',
    'pronto-emagrecer',
    'pronto-emagrecer-nutri',
    'avaliacao-intolerancia',
    'avaliacao-intolerancia-nutri',
    'avaliacao-perfil-metabolico',
    'avaliacao-perfil-metabolico-nutri',
    'diagnostico-eletrolitos',
    'diagnostico-eletrolitos-nutri',
    'diagnostico-sintomas-intestinais',
    'diagnostico-sintomas-intestinais-nutri',
    'sindrome-metabolica',
    'sindrome-metabolica-nutri',
    'retencao-liquidos',
    'retencao-liquidos-nutri',
    'conhece-seu-corpo',
    'conhece-seu-corpo-nutri',
    'nutrido-vs-alimentado',
    'nutrido-vs-alimentado-nutri',
    -- Slugs dos 9 templates adicionais que aparecem na UI mas não estão no JSON
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
ORDER BY name;

-- 3. DESATIVAÇÃO: Desativa apenas os templates que NÃO estão na lista oficial
-- ⚠️ Execute apenas após revisar o SELECT acima
UPDATE templates_nutrition
SET 
  is_active = false,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND id NOT IN (
    -- IDs dos 20 templates oficiais da lista JSON
    '22f927f1-7ad7-4dda-97b7-27d802897554',
    '772eb739-b32c-40da-976d-ead9ac9f3807',
    'fbc42995-147e-43de-bc71-8cb09c5a5d99',
    'a1cfa7e2-39c2-41c6-8e1e-3bba26281ded',
    '748c26c5-2759-4d4f-a294-90107bd7a656',
    '2e826e57-3ff2-4a95-a70e-dea3b14501a2',
    'c776bd50-9722-4fe0-8eda-624db0e0ac40',
    'ee882269-77c7-4387-a4d1-99ec413e4938',
    '5e2a0878-9227-4bf9-8f82-ee83c09c440d',
    '00ce61c6-0ca8-4f69-ac4e-0aa2d823698e',
    '7af48a74-c5d6-4e68-b931-dcd9d1f4967e',
    'a28a1bdd-a93f-4840-9793-59d7693973f8',
    'c0e8f448-3e13-4ce7-93bf-d9996f486940',
    '1b91f645-b877-4557-ad81-faf8be917d33',
    'eeb96d12-bdcd-4bb5-897c-51a75a476ced',
    '461c8818-bed6-4bc4-bc86-642d2ee7136b',
    '128d43ea-321b-4e15-b850-f7af2dd6683a',
    '27c66bf3-9fda-462d-8d67-bd14b8a48868',
    '46368854-8b1c-4469-881d-b314e896843f',
    '8b8cf83b-d452-48d5-9183-886f77268494'
  )
  AND COALESCE(slug, '') NOT IN (
    -- Slugs alternativos dos 29 templates oficiais
    'tipo-fome',
    'quiz-tipo-fome',
    'quiz-alimentacao-saudavel',
    'quiz-alimentacao-nutri',
    'template-diagnostico-parasitose',
    'diagnostico-parasitose',
    'disciplinado-emocional',
    'disciplinado-emocional-nutri',
    'alimentacao-rotina',
    'alimentacao-rotina-nutri',
    'desafio-21-dias',
    'desafio-21-dias-nutri',
    'quiz-bem-estar',
    'quiz-bem-estar-nutri',
    'quiz-detox',
    'quiz-detox-nutri',
    'quiz-energetico',
    'quiz-energetico-nutri',
    'quiz-interativo',
    'quiz-interativo-nutri',
    'avaliacao-inicial',
    'avaliacao-inicial-nutri',
    'pronto-emagrecer',
    'pronto-emagrecer-nutri',
    'avaliacao-intolerancia',
    'avaliacao-intolerancia-nutri',
    'avaliacao-perfil-metabolico',
    'avaliacao-perfil-metabolico-nutri',
    'diagnostico-eletrolitos',
    'diagnostico-eletrolitos-nutri',
    'diagnostico-sintomas-intestinais',
    'diagnostico-sintomas-intestinais-nutri',
    'sindrome-metabolica',
    'sindrome-metabolica-nutri',
    'retencao-liquidos',
    'retencao-liquidos-nutri',
    'conhece-seu-corpo',
    'conhece-seu-corpo-nutri',
    'nutrido-vs-alimentado',
    'nutrido-vs-alimentado-nutri',
    -- Slugs dos 9 templates adicionais que aparecem na UI
    'perfil-intestino',
    'quiz-pedindo-detox',
    'calculadora-agua',
    'calculadora-calorias',
    'calculadora-imc',
    'calculadora-proteina',
    'avaliacao-sono-energia',
    'descoberta-perfil-bem-estar',
    'quiz-perfil-nutricional'
  );

-- 4. VERIFICAÇÃO FINAL: Confirmar que apenas os 29 oficiais estão ativos
SELECT 
  COUNT(*) as total_ativos,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos_esperados
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt';

COMMIT;

-- ===========================================================
-- INSTRUÇÕES:
-- 1. Execute o SELECT do passo 2 primeiro e revise a lista
-- 2. Se estiver correto, execute o UPDATE do passo 3
-- 3. O COMMIT finaliza a transação
-- 4. O backup está em: templates_nutrition_backup_limpeza_20240115
-- ===========================================================

