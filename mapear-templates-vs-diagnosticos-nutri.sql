-- =====================================================
-- MAPEAR: TEMPLATES NUTRI vs DIAGNÓSTICOS NUTRI
-- Identificar correspondência entre Supabase e código
-- =====================================================

-- 1. LISTAR TODOS OS TEMPLATES NUTRI DO SUPABASE
SELECT 
    id,
    name,
    slug,
    type,
    profession,
    is_active,
    created_at
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND is_active = true
ORDER BY type, name;

-- 2. CONTAR TEMPLATES POR TIPO (NUTRI)
SELECT 
    type,
    COUNT(*) as total,
    STRING_AGG(name, ', ' ORDER BY name) as templates
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND is_active = true
GROUP BY type
ORDER BY type;

-- 3. LISTAR SLUGS DOS TEMPLATES NUTRI (para comparar com diagnósticos)
SELECT 
    slug,
    name,
    type
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND is_active = true
ORDER BY slug;

-- 4. VERIFICAR TEMPLATES COM SLUGS ESPECÍFICOS (mapear com diagnósticos)
-- Lista completa dos 29 templates oficiais Nutri (incluindo aliases com -nutri)

SELECT 
    slug,
    name,
    type,
    CASE 
        WHEN slug IN (
            -- Quizzes (5)
            'quiz-interativo', 'quiz-interativo-nutri',
            'quiz-bem-estar', 'quiz-bem-estar-nutri', 'descoberta-perfil-bem-estar', 'descubra-seu-perfil-de-bem-estar',
            'quiz-perfil-nutricional',
            'quiz-detox', 'quiz-detox-nutri',
            'quiz-energetico', 'quiz-energetico-nutri',
            -- Calculadoras (4)
            'calculadora-imc',
            'calculadora-proteina',
            'calculadora-agua',
            'calculadora-calorias',
            -- Checklists (2)
            'checklist-detox',
            'checklist-alimentar',
            -- Guias (3)
            'guia-hidratacao',
            'guia-nutraceutico',
            'guia-proteico',
            -- Desafios (2)
            'desafio-7-dias', 'template-desafio-7dias',
            'desafio-21-dias', 'desafio-21-dias-nutri', 'template-desafio-21dias',
            -- Avaliações (1)
            'avaliacao-inicial', 'avaliacao-inicial-nutri', 'template-avaliacao-inicial',
            -- Outros templates oficiais
            'avaliacao-intolerancia', 'avaliacao-intolerancia-nutri', 'quiz-intolerancia', 'intolerancia',
            'avaliacao-perfil-metabolico', 'avaliacao-perfil-metabolico-nutri', 'perfil-metabolico', 'quiz-perfil-metabolico',
            'avaliacao-sono-energia', 'quiz-sono-energia',
            'diagnostico-eletrolitos', 'diagnostico-eletrolitos-nutri', 'quiz-eletrolitos', 'eletrolitos', 'eletrólitos',
            'diagnostico-parasitose', 'template-diagnostico-parasitose',
            'diagnostico-sintomas-intestinais', 'diagnostico-sintomas-intestinais-nutri', 'quiz-sintomas-intestinais', 'sintomas-intestinais',
            'pronto-emagrecer', 'pronto-emagrecer-nutri', 'quiz-pronto-emagrecer',
            'tipo-fome', 'quiz-tipo-fome',
            'perfil-intestino', 'qual-e-seu-perfil-de-intestino',
            'quiz-alimentacao-saudavel', 'quiz-alimentacao-nutri', 'alimentacao-saudavel',
            'sindrome-metabolica', 'sindrome-metabolica-nutri', 'risco-sindrome-metabolica',
            'quiz-pedindo-detox', 'seu-corpo-esta-pedindo-detox',
            'retencao-liquidos', 'retencao-liquidos-nutri', 'teste-retencao-liquidos',
            'conhece-seu-corpo', 'conhece-seu-corpo-nutri', 'voce-conhece-seu-corpo', 'autoconhecimento-corporal',
            'disciplinado-emocional', 'disciplinado-emocional-nutri',
            'nutrido-vs-alimentado', 'nutrido-vs-alimentado-nutri', 'voce-nutrido-ou-apenas-alimentado',
            'alimentacao-rotina', 'alimentacao-rotina-nutri', 'avaliacao-rotina-alimentar', 'voce-esta-se-alimentando-conforme-sua-rotina',
            -- Planilhas/Tabelas (5)
            'tabela-comparativa',
            'tabela-substituicoes',
            'tabela-sintomas',
            'tabela-metas-semanais',
            'plano-alimentar-base',
            -- Outros (7)
            'mini-ebook',
            'cardapio-detox',
            'diario-alimentar',
            'formulario-recomendacao',
            'infografico-educativo',
            'planner-refeicoes',
            'rastreador-alimentar',
            'receitas', 'template-receitas',
            'simulador-resultados',
            'story-interativo', 'template-story-interativo'
        ) THEN '✅ TEM DIAGNÓSTICO'
        ELSE '❌ SEM DIAGNÓSTICO (verificar)'
    END as status_diagnostico
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND is_active = true
ORDER BY status_diagnostico, type, name;

-- 5. RESUMO: TEMPLATES COM/SEM DIAGNÓSTICOS (29 oficiais + aliases)
SELECT 
    CASE 
        WHEN slug IN (
            -- Quizzes (5)
            'quiz-interativo', 'quiz-interativo-nutri',
            'quiz-bem-estar', 'quiz-bem-estar-nutri', 'descoberta-perfil-bem-estar', 'descubra-seu-perfil-de-bem-estar',
            'quiz-perfil-nutricional',
            'quiz-detox', 'quiz-detox-nutri',
            'quiz-energetico', 'quiz-energetico-nutri',
            -- Calculadoras (4)
            'calculadora-imc',
            'calculadora-proteina',
            'calculadora-agua',
            'calculadora-calorias',
            -- Checklists (2)
            'checklist-detox',
            'checklist-alimentar',
            -- Guias (3)
            'guia-hidratacao',
            'guia-nutraceutico',
            'guia-proteico',
            -- Desafios (2)
            'desafio-7-dias', 'template-desafio-7dias',
            'desafio-21-dias', 'desafio-21-dias-nutri', 'template-desafio-21dias',
            -- Avaliações (1)
            'avaliacao-inicial', 'avaliacao-inicial-nutri', 'template-avaliacao-inicial',
            -- Outros templates oficiais
            'avaliacao-intolerancia', 'avaliacao-intolerancia-nutri', 'quiz-intolerancia', 'intolerancia',
            'avaliacao-perfil-metabolico', 'avaliacao-perfil-metabolico-nutri', 'perfil-metabolico', 'quiz-perfil-metabolico',
            'avaliacao-sono-energia', 'quiz-sono-energia',
            'diagnostico-eletrolitos', 'diagnostico-eletrolitos-nutri', 'quiz-eletrolitos', 'eletrolitos', 'eletrólitos',
            'diagnostico-parasitose', 'template-diagnostico-parasitose',
            'diagnostico-sintomas-intestinais', 'diagnostico-sintomas-intestinais-nutri', 'quiz-sintomas-intestinais', 'sintomas-intestinais',
            'pronto-emagrecer', 'pronto-emagrecer-nutri', 'quiz-pronto-emagrecer',
            'tipo-fome', 'quiz-tipo-fome',
            'perfil-intestino', 'qual-e-seu-perfil-de-intestino',
            'quiz-alimentacao-saudavel', 'quiz-alimentacao-nutri', 'alimentacao-saudavel',
            'sindrome-metabolica', 'sindrome-metabolica-nutri', 'risco-sindrome-metabolica',
            'quiz-pedindo-detox', 'seu-corpo-esta-pedindo-detox',
            'retencao-liquidos', 'retencao-liquidos-nutri', 'teste-retencao-liquidos',
            'conhece-seu-corpo', 'conhece-seu-corpo-nutri', 'voce-conhece-seu-corpo', 'autoconhecimento-corporal',
            'disciplinado-emocional', 'disciplinado-emocional-nutri',
            'nutrido-vs-alimentado', 'nutrido-vs-alimentado-nutri', 'voce-nutrido-ou-apenas-alimentado',
            'alimentacao-rotina', 'alimentacao-rotina-nutri', 'avaliacao-rotina-alimentar', 'voce-esta-se-alimentando-conforme-sua-rotina',
            -- Planilhas/Tabelas (5)
            'tabela-comparativa',
            'tabela-substituicoes',
            'tabela-sintomas',
            'tabela-metas-semanais',
            'plano-alimentar-base',
            -- Outros (7)
            'mini-ebook',
            'cardapio-detox',
            'diario-alimentar',
            'formulario-recomendacao',
            'infografico-educativo',
            'planner-refeicoes',
            'rastreador-alimentar',
            'receitas', 'template-receitas',
            'simulador-resultados',
            'story-interativo', 'template-story-interativo'
        ) THEN 'COM DIAGNÓSTICO'
        ELSE 'SEM DIAGNÓSTICO'
    END as status,
    COUNT(*) as total,
    STRING_AGG(name, ', ' ORDER BY name) as templates
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND is_active = true
GROUP BY status
ORDER BY status;

-- 6. IDENTIFICAR TEMPLATES EXTRAS (fora dos 29 oficiais) - Candidatos para desativação
SELECT 
    id,
    name,
    slug,
    type,
    is_active,
    created_at,
    CASE 
        WHEN slug IN (
            'quiz-interativo', 'quiz-interativo-nutri',
            'quiz-bem-estar', 'quiz-bem-estar-nutri', 'descoberta-perfil-bem-estar', 'descubra-seu-perfil-de-bem-estar',
            'quiz-perfil-nutricional',
            'quiz-detox', 'quiz-detox-nutri',
            'quiz-energetico', 'quiz-energetico-nutri',
            'calculadora-imc',
            'calculadora-proteina',
            'calculadora-agua',
            'calculadora-calorias',
            'checklist-detox',
            'checklist-alimentar',
            'guia-hidratacao',
            'guia-nutraceutico',
            'guia-proteico',
            'desafio-7-dias', 'template-desafio-7dias',
            'desafio-21-dias', 'desafio-21-dias-nutri', 'template-desafio-21dias',
            'avaliacao-inicial', 'avaliacao-inicial-nutri', 'template-avaliacao-inicial',
            'avaliacao-intolerancia', 'avaliacao-intolerancia-nutri', 'quiz-intolerancia', 'intolerancia',
            'avaliacao-perfil-metabolico', 'avaliacao-perfil-metabolico-nutri', 'perfil-metabolico', 'quiz-perfil-metabolico',
            'avaliacao-sono-energia', 'quiz-sono-energia',
            'diagnostico-eletrolitos', 'diagnostico-eletrolitos-nutri', 'quiz-eletrolitos', 'eletrolitos', 'eletrólitos',
            'diagnostico-parasitose', 'template-diagnostico-parasitose',
            'diagnostico-sintomas-intestinais', 'diagnostico-sintomas-intestinais-nutri', 'quiz-sintomas-intestinais', 'sintomas-intestinais',
            'pronto-emagrecer', 'pronto-emagrecer-nutri', 'quiz-pronto-emagrecer',
            'tipo-fome', 'quiz-tipo-fome',
            'perfil-intestino', 'qual-e-seu-perfil-de-intestino',
            'quiz-alimentacao-saudavel', 'quiz-alimentacao-nutri', 'alimentacao-saudavel',
            'sindrome-metabolica', 'sindrome-metabolica-nutri', 'risco-sindrome-metabolica',
            'quiz-pedindo-detox', 'seu-corpo-esta-pedindo-detox',
            'retencao-liquidos', 'retencao-liquidos-nutri', 'teste-retencao-liquidos',
            'conhece-seu-corpo', 'conhece-seu-corpo-nutri', 'voce-conhece-seu-corpo', 'autoconhecimento-corporal',
            'disciplinado-emocional', 'disciplinado-emocional-nutri',
            'nutrido-vs-alimentado', 'nutrido-vs-alimentado-nutri', 'voce-nutrido-ou-apenas-alimentado',
            'alimentacao-rotina', 'alimentacao-rotina-nutri', 'avaliacao-rotina-alimentar', 'voce-esta-se-alimentando-conforme-sua-rotina',
            'tabela-comparativa',
            'tabela-substituicoes',
            'tabela-sintomas',
            'tabela-metas-semanais',
            'plano-alimentar-base',
            'mini-ebook',
            'cardapio-detox',
            'diario-alimentar',
            'formulario-recomendacao',
            'infografico-educativo',
            'planner-refeicoes',
            'rastreador-alimentar',
            'receitas', 'template-receitas',
            'simulador-resultados',
            'story-interativo', 'template-story-interativo'
        ) THEN '✅ OFICIAL (manter)'
        ELSE '❌ EXTRA (pode desativar)'
    END as status
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND is_active = true
ORDER BY status, type, name;

-- 7. RESUMO: Contar templates extras
SELECT 
    CASE 
        WHEN slug IN (
            'quiz-interativo', 'quiz-interativo-nutri',
            'quiz-bem-estar', 'quiz-bem-estar-nutri', 'descoberta-perfil-bem-estar', 'descubra-seu-perfil-de-bem-estar',
            'quiz-perfil-nutricional',
            'quiz-detox', 'quiz-detox-nutri',
            'quiz-energetico', 'quiz-energetico-nutri',
            'calculadora-imc',
            'calculadora-proteina',
            'calculadora-agua',
            'calculadora-calorias',
            'checklist-detox',
            'checklist-alimentar',
            'guia-hidratacao',
            'guia-nutraceutico',
            'guia-proteico',
            'desafio-7-dias', 'template-desafio-7dias',
            'desafio-21-dias', 'desafio-21-dias-nutri', 'template-desafio-21dias',
            'avaliacao-inicial', 'avaliacao-inicial-nutri', 'template-avaliacao-inicial',
            'avaliacao-intolerancia', 'avaliacao-intolerancia-nutri', 'quiz-intolerancia', 'intolerancia',
            'avaliacao-perfil-metabolico', 'avaliacao-perfil-metabolico-nutri', 'perfil-metabolico', 'quiz-perfil-metabolico',
            'avaliacao-sono-energia', 'quiz-sono-energia',
            'diagnostico-eletrolitos', 'diagnostico-eletrolitos-nutri', 'quiz-eletrolitos', 'eletrolitos', 'eletrólitos',
            'diagnostico-parasitose', 'template-diagnostico-parasitose',
            'diagnostico-sintomas-intestinais', 'diagnostico-sintomas-intestinais-nutri', 'quiz-sintomas-intestinais', 'sintomas-intestinais',
            'pronto-emagrecer', 'pronto-emagrecer-nutri', 'quiz-pronto-emagrecer',
            'tipo-fome', 'quiz-tipo-fome',
            'perfil-intestino', 'qual-e-seu-perfil-de-intestino',
            'quiz-alimentacao-saudavel', 'quiz-alimentacao-nutri', 'alimentacao-saudavel',
            'sindrome-metabolica', 'sindrome-metabolica-nutri', 'risco-sindrome-metabolica',
            'quiz-pedindo-detox', 'seu-corpo-esta-pedindo-detox',
            'retencao-liquidos', 'retencao-liquidos-nutri', 'teste-retencao-liquidos',
            'conhece-seu-corpo', 'conhece-seu-corpo-nutri', 'voce-conhece-seu-corpo', 'autoconhecimento-corporal',
            'disciplinado-emocional', 'disciplinado-emocional-nutri',
            'nutrido-vs-alimentado', 'nutrido-vs-alimentado-nutri', 'voce-nutrido-ou-apenas-alimentado',
            'alimentacao-rotina', 'alimentacao-rotina-nutri', 'avaliacao-rotina-alimentar', 'voce-esta-se-alimentando-conforme-sua-rotina',
            'tabela-comparativa',
            'tabela-substituicoes',
            'tabela-sintomas',
            'tabela-metas-semanais',
            'plano-alimentar-base',
            'mini-ebook',
            'cardapio-detox',
            'diario-alimentar',
            'formulario-recomendacao',
            'infografico-educativo',
            'planner-refeicoes',
            'rastreador-alimentar',
            'receitas', 'template-receitas',
            'simulador-resultados',
            'story-interativo', 'template-story-interativo'
        ) THEN 'OFICIAL (29 templates)'
        ELSE 'EXTRA (pode desativar)'
    END as categoria,
    COUNT(*) as total
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND is_active = true
GROUP BY categoria
ORDER BY categoria;

