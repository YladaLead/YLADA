-- =====================================================
-- VERIFICAR FERRAMENTA "parasitose" DO USUÁRIO
-- =====================================================

-- PASSO 1: Ver todas as ferramentas do usuário portalmagra@gmail.com
SELECT 
    cut.id,
    cut.title,
    cut.slug,
    cut.template_slug,
    cut.status,
    cut.user_id,
    up.user_slug,
    up.email
FROM coach_user_templates cut
LEFT JOIN user_profiles up ON up.user_id = cut.user_id
WHERE cut.user_id = '2ed249bc-3f9f-448a-81dc-eda1d0a75043'
ORDER BY cut.created_at DESC;

-- PASSO 2: Verificar especificamente a ferramenta "parasitose"
SELECT 
    cut.id,
    cut.title,
    cut.slug,
    cut.template_slug,
    cut.status,
    cut.user_id,
    up.user_slug,
    up.email,
    CASE 
        WHEN cut.slug = 'parasitose' AND cut.status = 'active' THEN '✅ FERRAMENTA CORRETA'
        WHEN cut.slug = 'parasitose' AND cut.status != 'active' THEN '❌ Status incorreto: ' || cut.status
        WHEN cut.slug != 'parasitose' THEN '⚠️ Slug diferente: ' || cut.slug
        ELSE '⚠️ Verificar'
    END as diagnostico
FROM coach_user_templates cut
LEFT JOIN user_profiles up ON up.user_id = cut.user_id
WHERE cut.user_id = '2ed249bc-3f9f-448a-81dc-eda1d0a75043'
    AND (cut.slug ILIKE '%parasitose%' OR cut.title ILIKE '%parasitose%');

-- PASSO 3: Verificar se o template_slug existe nos templates disponíveis
-- Templates disponíveis no código:
-- 'calc-imc', 'calc-proteina', 'calc-hidratacao', 'calc-calorias',
-- 'quiz-ganhos', 'quiz-potencial', 'quiz-proposito', 'quiz-alimentacao',
-- 'quiz-wellness-profile', 'template-desafio-7dias', 'template-desafio-21dias',
-- 'guia-hidratacao', 'avaliacao-intolerancia', 'avaliacao-perfil-metabolico',
-- 'template-story', 'initial-assessment'

SELECT 
    cut.id,
    cut.title,
    cut.slug,
    cut.template_slug,
    CASE 
        WHEN cut.template_slug IN (
            'calc-imc', 'calc-proteina', 'calc-hidratacao', 'calc-calorias',
            'quiz-ganhos', 'quiz-potencial', 'quiz-proposito', 'quiz-alimentacao',
            'quiz-wellness-profile', 'template-desafio-7dias', 'template-desafio-21dias',
            'guia-hidratacao', 'avaliacao-intolerancia', 'avaliacao-perfil-metabolico',
            'template-story', 'initial-assessment'
        ) THEN '✅ Template válido'
        WHEN cut.template_slug = 'template-diagnostico-parasitose' THEN '❌ Template não implementado no código'
        ELSE '⚠️ Template desconhecido: ' || cut.template_slug
    END as status_template
FROM coach_user_templates cut
WHERE cut.user_id = '2ed249bc-3f9f-448a-81dc-eda1d0a75043'
    AND (cut.slug ILIKE '%parasitose%' OR cut.title ILIKE '%parasitose%');

