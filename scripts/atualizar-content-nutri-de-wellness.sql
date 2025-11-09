-- ============================================
-- ATUALIZAR CONTENT DOS TEMPLATES NUTRI
-- Copiar content de Wellness quando disponível
-- ============================================

-- Este script atualiza o content dos templates Nutri
-- buscando correspondentes em Wellness

-- ============================================
-- 1. MAPEAMENTO DIRETO: Slug Nutri → Slug/Nome Wellness
-- ============================================

-- Calculadoras
UPDATE templates_nutrition n
SET 
  content = w.content,
  updated_at = NOW()
FROM templates_nutrition w
WHERE n.profession = 'nutri'
  AND n.language = 'pt'
  AND w.profession = 'wellness'
  AND w.language = 'pt'
  AND (
    -- Calculadora de IMC
    (n.slug = 'calculadora-imc' AND (w.slug LIKE '%imc%' OR LOWER(w.name) LIKE '%imc%'))
    OR
    -- Calculadora de Proteína
    (n.slug = 'calculadora-proteina' AND (w.slug LIKE '%proteina%' OR LOWER(w.name) LIKE '%proteína%' OR LOWER(w.name) LIKE '%proteina%'))
    OR
    -- Calculadora de Água
    (n.slug = 'calculadora-agua' AND (w.slug LIKE '%agua%' OR w.slug LIKE '%hidratacao%' OR LOWER(w.name) LIKE '%água%' OR LOWER(w.name) LIKE '%hidratação%'))
    OR
    -- Calculadora de Calorias
    (n.slug = 'calculadora-calorias' AND (w.slug LIKE '%caloria%' OR LOWER(w.name) LIKE '%caloria%'))
  );

-- Quizzes - Mapeamento direto
UPDATE templates_nutrition n
SET 
  content = w.content,
  updated_at = NOW()
FROM templates_nutrition w
WHERE n.profession = 'nutri'
  AND n.language = 'pt'
  AND w.profession = 'wellness'
  AND w.language = 'pt'
  AND (
    -- Quiz Interativo
    (n.slug = 'quiz-interativo' AND (w.slug LIKE '%interativo%' OR LOWER(w.name) LIKE '%interativo%'))
    OR
    -- Quiz de Bem-Estar
    (n.slug = 'quiz-bem-estar' AND (w.slug LIKE '%bem-estar%' OR LOWER(w.name) LIKE '%bem-estar%' OR LOWER(w.name) LIKE '%bem estar%'))
    OR
    -- Quiz de Perfil Nutricional
    (n.slug = 'quiz-perfil-nutricional' AND (LOWER(w.name) LIKE '%perfil nutricional%'))
    OR
    -- Quiz Detox
    (n.slug = 'quiz-detox' AND w.slug LIKE '%detox%' AND w.slug NOT LIKE '%checklist%')
    OR
    -- Quiz Energético
    (n.slug = 'quiz-energetico' AND (w.slug LIKE '%energetico%' OR LOWER(w.name) LIKE '%energético%'))
    OR
    -- Diagnóstico de Parasitose
    (n.slug = 'template-diagnostico-parasitose' AND (w.slug LIKE '%parasita%' OR LOWER(w.name) LIKE '%parasita%'))
    OR
    -- Diagnóstico de Eletrólitos
    (n.slug = 'diagnostico-eletritos' AND (w.slug LIKE '%eletrolito%' OR LOWER(w.name) LIKE '%eletrólito%'))
    OR
    -- Avaliação do Perfil Metabólico
    (n.slug = 'diagnostico-perfil-metabolico' AND (w.slug LIKE '%metabolico%' OR LOWER(w.name) LIKE '%metabólico%'))
    OR
    -- Diagnóstico de Sintomas Intestinais
    (n.slug = 'diagnostico-sintomas-intestinais' AND (w.slug LIKE '%intestina%' OR LOWER(w.name) LIKE '%intestina%'))
    OR
    -- Avaliação do Sono e Energia
    (n.slug = 'avaliacao-sono-energia' AND (w.slug LIKE '%sono%' OR LOWER(w.name) LIKE '%sono%'))
    OR
    -- Teste de Retenção de Líquidos
    (n.slug = 'teste-retencao-liquidos' AND (w.slug LIKE '%retencao%' OR LOWER(w.name) LIKE '%retenção%'))
    OR
    -- Avaliação de Fome Emocional
    (n.slug = 'avaliacao-fome-emocional' AND (w.slug LIKE '%fome-emocional%' OR LOWER(w.name) LIKE '%fome emocional%'))
    OR
    -- Diagnóstico do Tipo de Metabolismo
    (n.slug = 'diagnostico-tipo-metabolismo' AND (w.slug LIKE '%tipo-metabolismo%' OR LOWER(w.name) LIKE '%tipo de metabolismo%'))
    OR
    -- Disciplinado ou Emocional
    (n.slug = 'disciplinado-emocional' AND (w.slug LIKE '%disciplinado%' OR LOWER(w.name) LIKE '%disciplinado%'))
    OR
    -- Nutrido ou Alimentado
    (n.slug = 'nutrido-alimentado' AND (w.slug LIKE '%nutrido%' OR LOWER(w.name) LIKE '%nutrido%'))
    OR
    -- Perfil de Intestino
    (n.slug = 'perfil-intestino' AND (w.slug LIKE '%intestino%' OR LOWER(w.name) LIKE '%perfil de intestino%'))
    OR
    -- Avaliação de Sensibilidades
    (n.slug = 'avaliacao-sensibilidades' AND (w.slug LIKE '%sensibilidade%' OR LOWER(w.name) LIKE '%intolerância%'))
    OR
    -- Risco de Síndrome Metabólica
    (n.slug = 'avaliacao-sindrome-metabolica' AND (w.slug LIKE '%sindrome-metabolica%' OR LOWER(w.name) LIKE '%síndrome metabólica%'))
    OR
    -- Descubra seu Perfil de Bem-Estar
    (n.slug = 'descoberta-perfil-bem-estar' AND (w.slug LIKE '%perfil-bem-estar%' OR LOWER(w.name) LIKE '%perfil de bem-estar%'))
    OR
    -- Qual é o seu Tipo de Fome?
    (n.slug = 'quiz-tipo-fome' AND (w.slug LIKE '%tipo-fome%' OR LOWER(w.name) LIKE '%tipo de fome%'))
    OR
    -- Seu corpo está pedindo Detox?
    (n.slug = 'quiz-pedindo-detox' AND (w.slug LIKE '%pedindo-detox%' OR LOWER(w.name) LIKE '%pedindo detox%'))
    OR
    -- Você está se alimentando conforme sua rotina?
    (n.slug = 'avaliacao-rotina-alimentar' AND (w.slug LIKE '%rotina-alimentar%' OR LOWER(w.name) LIKE '%rotina alimentar%'))
    OR
    -- Pronto para Emagrecer com Saúde?
    (n.slug = 'pronto-emagrecer' AND (w.slug LIKE '%pronto-emagrecer%' OR LOWER(w.name) LIKE '%pronto para emagrecer%'))
    OR
    -- Você conhece o seu corpo?
    (n.slug = 'autoconhecimento-corporal' AND (w.slug LIKE '%autoconhecimento%' OR LOWER(w.name) LIKE '%conhece seu corpo%'))
  );

-- Checklists
UPDATE templates_nutrition n
SET 
  content = w.content,
  updated_at = NOW()
FROM templates_nutrition w
WHERE n.profession = 'nutri'
  AND n.language = 'pt'
  AND w.profession = 'wellness'
  AND w.language = 'pt'
  AND (
    -- Checklist Detox
    (n.slug = 'checklist-detox' AND (w.slug LIKE '%checklist-detox%' OR LOWER(w.name) LIKE '%checklist detox%'))
    OR
    -- Checklist Alimentar
    (n.slug = 'checklist-alimentar' AND (w.slug LIKE '%checklist-alimentar%' OR LOWER(w.name) LIKE '%checklist alimentar%'))
  );

-- ============================================
-- 2. VERIFICAR RESULTADO
-- ============================================
SELECT 
  name,
  slug,
  CASE 
    WHEN content::text LIKE '%template_type%' AND content::text NOT LIKE '%"fields": []%' AND content::text NOT LIKE '%"items": []%' THEN '✅ Content de Wellness'
    ELSE '⚠️ Content básico'
  END as status_content
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND updated_at >= NOW() - INTERVAL '5 minutes'
ORDER BY type, name;

-- ============================================
-- 3. CONTAR QUANTOS FORAM ATUALIZADOS
-- ============================================
SELECT 
  COUNT(*) as total_atualizados,
  COUNT(CASE WHEN content::text LIKE '%template_type%' AND content::text NOT LIKE '%"fields": []%' AND content::text NOT LIKE '%"items": []%' THEN 1 END) as com_content_wellness,
  COUNT(CASE WHEN content::text LIKE '%"fields": []%' OR content::text LIKE '%"items": []%' THEN 1 END) as com_content_basico
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND updated_at >= NOW() - INTERVAL '5 minutes';

