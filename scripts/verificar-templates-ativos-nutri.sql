-- ===========================================================
-- VERIFICAÇÃO: Templates Nutri Ativos vs Esperados
-- ===========================================================

-- 1. Listar TODOS os templates Nutri ativos atualmente
SELECT 
  '✅ ATIVOS ATUALMENTE' as status,
  id,
  name,
  slug,
  type,
  is_active
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND is_active = true
ORDER BY name;

-- 2. Listar os 29 templates oficiais e verificar se estão ativos
SELECT 
  CASE 
    WHEN tn.is_active = true THEN '✅ ATIVO'
    WHEN tn.id IS NOT NULL THEN '❌ DESATIVADO'
    ELSE '⚠️ NÃO ENCONTRADO'
  END as status,
  COALESCE(tn.name, 'NÃO ENCONTRADO') as name,
  COALESCE(tn.slug, 'N/A') as slug,
  COALESCE(tn.id::text, 'N/A') as id
FROM (
  VALUES
    ('22f927f1-7ad7-4dda-97b7-27d802897554', 'Qual é o seu Tipo de Fome?', 'quiz-tipo-fome'),
    ('772eb739-b32c-40da-976d-ead9ac9f3807', 'Quiz: Alimentação Saudável', 'quiz-alimentacao-nutri'),
    ('fbc42995-147e-43de-bc71-8cb09c5a5d99', 'Diagnóstico de Parasitose', 'template-diagnostico-parasitose'),
    ('a1cfa7e2-39c2-41c6-8e1e-3bba26281ded', 'Você é mais disciplinado ou emocional com a comida?', 'disciplinado-emocional-nutri'),
    ('748c26c5-2759-4d4f-a294-90107bd7a656', 'Você está se alimentando conforme sua rotina?', 'alimentacao-rotina-nutri'),
    ('2e826e57-3ff2-4a95-a70e-dea3b14501a2', 'Desafio 21 Dias', 'desafio-21-dias-nutri'),
    ('c776bd50-9722-4fe0-8eda-624db0e0ac40', 'Quiz de Bem-Estar', 'quiz-bem-estar-nutri'),
    ('ee882269-77c7-4387-a4d1-99ec413e4938', 'Quiz Detox', 'quiz-detox-nutri'),
    ('5e2a0878-9227-4bf9-8f82-ee83c09c440d', 'Quiz Energético', 'quiz-energetico-nutri'),
    ('00ce61c6-0ca8-4f69-ac4e-0aa2d823698e', 'Quiz Interativo', 'quiz-interativo-nutri'),
    ('7af48a74-c5d6-4e68-b931-dcd9d1f4967e', 'Avaliação Inicial', 'avaliacao-inicial-nutri'),
    ('a28a1bdd-a93f-4840-9793-59d7693973f8', 'Pronto para Emagrecer com Saúde?', 'pronto-emagrecer-nutri'),
    ('c0e8f448-3e13-4ce7-93bf-d9996f486940', 'Avaliação de Intolerâncias/Sensibilidades', 'avaliacao-intolerancia-nutri'),
    ('1b91f645-b877-4557-ad81-faf8be917d33', 'Avaliação do Perfil Metabólico', 'avaliacao-perfil-metabolico-nutri'),
    ('eeb96d12-bdcd-4bb5-897c-51a75a476ced', 'Diagnóstico de Eletrólitos', 'diagnostico-eletrolitos-nutri'),
    ('461c8818-bed6-4bc4-bc86-642d2ee7136b', 'Diagnóstico de Sintomas Intestinais', 'diagnostico-sintomas-intestinais-nutri'),
    ('128d43ea-321b-4e15-b850-f7af2dd6683a', 'Risco de Síndrome Metabólica', 'sindrome-metabolica-nutri'),
    ('27c66bf3-9fda-462d-8d67-bd14b8a48868', 'Teste de Retenção de Líquidos', 'retencao-liquidos-nutri'),
    ('46368854-8b1c-4469-881d-b314e896843f', 'Você conhece o seu corpo?', 'conhece-seu-corpo-nutri'),
    ('8b8cf83b-d452-48d5-9183-886f77268494', 'Você está nutrido ou apenas alimentado?', 'nutrido-vs-alimentado-nutri')
) AS oficial(id, name, slug)
LEFT JOIN templates_nutrition tn ON tn.id::text = oficial.id
ORDER BY status, name;

-- 3. Contagem final
SELECT 
  COUNT(*) as total_templates_nutri,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos_atual,
  29 as ativos_esperados,
  COUNT(CASE WHEN is_active = true THEN 1 END) - 29 as diferenca
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt';

