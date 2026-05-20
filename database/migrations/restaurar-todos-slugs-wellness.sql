-- =====================================================
-- RESTAURAR E CORRIGIR TODOS OS SLUGS DOS TEMPLATES WELLNESS
-- =====================================================
-- Este script:
-- 1. Lista TODOS os templates Wellness (ativos e inativos)
-- 2. Gera slugs limpos para todos
-- 3. Garante que nenhum template seja perdido
-- =====================================================

-- 1. VERIFICAR TODOS OS TEMPLATES WELLNESS (ATIVOS E INATIVOS)
SELECT 
  '📊 ESTATÍSTICAS GERAIS' as info,
  COUNT(*) as total_templates,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inativos,
  COUNT(CASE WHEN slug IS NULL OR slug = '' THEN 1 END) as sem_slug,
  COUNT(CASE WHEN slug LIKE '-%' OR slug LIKE '%-' THEN 1 END) as slugs_malformados
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt';

-- 2. LISTAR TODOS OS TEMPLATES (PARA VER O QUE TEMOS)
SELECT 
  id,
  name,
  slug,
  type,
  is_active,
  CASE 
    WHEN slug IS NULL OR slug = '' THEN '❌ SEM SLUG'
    WHEN slug LIKE '-%' OR slug LIKE '%-' THEN '⚠️ SLUG MALFORMADO'
    ELSE '✅ OK'
  END as status_slug
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
ORDER BY is_active DESC, type, name;

-- 3. ATIVAR TODOS OS TEMPLATES QUE ESTÃO INATIVOS (se necessário)
-- Descomente a linha abaixo se quiser ativar todos:
-- UPDATE templates_nutrition SET is_active = true WHERE profession = 'wellness' AND language = 'pt' AND is_active = false;

-- 4. FUNÇÃO AUXILIAR PARA GERAR SLUG LIMPO
-- Remove acentos, espaços, caracteres especiais e normaliza
CREATE OR REPLACE FUNCTION gerar_slug_limpo(texto TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN TRIM(
    BOTH '-' FROM
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(
            REGEXP_REPLACE(
              REGEXP_REPLACE(
                REGEXP_REPLACE(
                  REGEXP_REPLACE(
                    REGEXP_REPLACE(
                      REGEXP_REPLACE(
                        REGEXP_REPLACE(
                          REGEXP_REPLACE(
                            REGEXP_REPLACE(
                              REGEXP_REPLACE(
                                LOWER(TRIM(texto)),
                                '[àáâãäå]', 'a', 'gi'
                              ),
                              '[èéêë]', 'e', 'gi'
                            ),
                            '[ìíîï]', 'i', 'gi'
                          ),
                          '[òóôõö]', 'o', 'gi'
                        ),
                        '[ùúûü]', 'u', 'gi'
                      ),
                      '[ç]', 'c', 'gi'
                    ),
                    '[ñ]', 'n', 'gi'
                  ),
                  '[ýÿ]', 'y', 'gi'
                ),
                '[^a-z0-9]+', '-', 'g'
              ),
              '^-+|-+$', '', 'g'
            ),
            '-+', '-', 'g'
          ),
          '^-|-$', '', 'g'
        ),
        '^[^a-z0-9]+|[^a-z0-9]+$', '', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- 5. CORRIGIR SLUGS MALFORMADOS (que começam ou terminam com hífen)
UPDATE templates_nutrition
SET slug = TRIM(BOTH '-' FROM slug)
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (slug LIKE '-%' OR slug LIKE '%-');

-- 6. GERAR SLUGS LIMPOS PARA TODOS OS TEMPLATES QUE NÃO TÊM OU TÊM SLUGS MALFORMADOS
UPDATE templates_nutrition
SET slug = gerar_slug_limpo(name)
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '' OR slug LIKE '-%' OR slug LIKE '%-');

-- 7. APLICAR PADRONIZAÇÃO ESPECÍFICA BASEADA NO NOME E TIPO
-- (Isso garante consistência mesmo se o nome mudar)

-- CALCULADORAS
UPDATE templates_nutrition
SET slug = 'calc-hidratacao'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'calculadora'
  AND (LOWER(name) LIKE '%água%' OR LOWER(name) LIKE '%agua%' OR LOWER(name) LIKE '%hidratação%' OR LOWER(name) LIKE '%hidratacao%' OR LOWER(name) LIKE '%hidrat%');

UPDATE templates_nutrition
SET slug = 'calc-imc'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'calculadora'
  AND (LOWER(name) LIKE '%imc%' OR LOWER(name) LIKE '%índice de massa corporal%' OR LOWER(name) LIKE '%indice de massa corporal%');

UPDATE templates_nutrition
SET slug = 'calc-proteina'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'calculadora'
  AND (LOWER(name) LIKE '%proteína%' OR LOWER(name) LIKE '%proteina%');

UPDATE templates_nutrition
SET slug = 'calc-composicao'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'calculadora'
  AND (LOWER(name) LIKE '%composição%' OR LOWER(name) LIKE '%composicao%' OR LOWER(name) LIKE '%corporal%');

UPDATE templates_nutrition
SET slug = 'calc-calorias'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'calculadora'
  AND (LOWER(name) LIKE '%caloria%' OR LOWER(name) LIKE '%calorie%' OR LOWER(name) LIKE '%energia%' OR LOWER(name) LIKE '%tmb%' OR LOWER(name) LIKE '%metabolismo%');

UPDATE templates_nutrition
SET slug = 'calc-macros'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'calculadora'
  AND (LOWER(name) LIKE '%macro%' OR LOWER(name) LIKE '%carboidrato%' OR LOWER(name) LIKE '%gordura%' OR LOWER(name) LIKE '%lipídio%');

UPDATE templates_nutrition
SET slug = 'calc-agua-corporal'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'calculadora'
  AND (LOWER(name) LIKE '%água corporal%' OR LOWER(name) LIKE '%agua corporal%' OR LOWER(name) LIKE '%água no corpo%');

-- QUIZZES
UPDATE templates_nutrition
SET slug = 'quiz-ganhos'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND (LOWER(name) LIKE '%ganhos%' AND LOWER(name) LIKE '%prosperidade%');

UPDATE templates_nutrition
SET slug = 'quiz-potencial'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND (LOWER(name) LIKE '%potencial%' AND (LOWER(name) LIKE '%crescimento%' OR LOWER(name) LIKE '%desenvolvimento%'));

UPDATE templates_nutrition
SET slug = 'quiz-proposito'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND (LOWER(name) LIKE '%propósito%' OR LOWER(name) LIKE '%proposito%' OR LOWER(name) LIKE '%missão%');

UPDATE templates_nutrition
SET slug = 'quiz-parasitas'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND LOWER(name) LIKE '%parasita%';

UPDATE templates_nutrition
SET slug = 'quiz-alimentacao-saudavel'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND (LOWER(name) LIKE '%alimentação saudável%' OR LOWER(name) LIKE '%alimentacao saudavel%' OR (LOWER(name) LIKE '%alimentação%' AND LOWER(name) LIKE '%saudável%'));

UPDATE templates_nutrition
SET slug = 'quiz-alimentacao'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND LOWER(name) LIKE '%alimentação%'
  AND slug != 'quiz-alimentacao-saudavel';

UPDATE templates_nutrition
SET slug = 'quiz-fome-emocional'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND (LOWER(name) LIKE '%fome emocional%' OR LOWER(name) LIKE '%fome%' AND LOWER(name) LIKE '%emocional%');

UPDATE templates_nutrition
SET slug = 'quiz-sono-energia'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND ((LOWER(name) LIKE '%sono%' AND LOWER(name) LIKE '%energia%') OR LOWER(name) LIKE '%sono e energia%' OR LOWER(name) LIKE '%avaliação do sono%');

UPDATE templates_nutrition
SET slug = 'quiz-interativo'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND (LOWER(name) LIKE '%quiz interativo%' OR LOWER(name) LIKE '%interativo%' AND LOWER(name) LIKE '%quiz%');

UPDATE templates_nutrition
SET slug = 'quiz-wellness-profile'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND (LOWER(name) LIKE '%perfil de bem-estar%' OR LOWER(name) LIKE '%wellness profile%' OR LOWER(name) LIKE '%descubra seu perfil%' OR LOWER(name) LIKE '%perfil wellness%');

UPDATE templates_nutrition
SET slug = 'quiz-perfil-nutricional'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND (LOWER(name) LIKE '%avaliação nutricional%' OR LOWER(name) LIKE '%avaliacao nutricional%' OR LOWER(name) LIKE '%nutrition assessment%');

UPDATE templates_nutrition
SET slug = 'quiz-avaliacao-inicial'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'quiz'
  AND (LOWER(name) LIKE '%avaliação inicial%' OR LOWER(name) LIKE '%avaliacao inicial%' OR LOWER(name) LIKE '%initial assessment%');

-- PLANILHAS
UPDATE templates_nutrition
SET slug = 'planilha-meal-planner'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'planilha'
  AND (LOWER(name) LIKE '%meal planner%' OR LOWER(name) LIKE '%planejador%' OR LOWER(name) LIKE '%cardápio%' OR LOWER(name) LIKE '%cardapio%' OR LOWER(name) LIKE '%refeições%');

UPDATE templates_nutrition
SET slug = 'planilha-diario-alimentar'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'planilha'
  AND ((LOWER(name) LIKE '%diário%' OR LOWER(name) LIKE '%diario%') AND (LOWER(name) LIKE '%alimentar%' OR LOWER(name) LIKE '%bem-estar%' OR LOWER(name) LIKE '%bem estar%'));

UPDATE templates_nutrition
SET slug = 'planilha-rastreador-alimentos'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'planilha'
  AND (LOWER(name) LIKE '%rastreador%' OR LOWER(name) LIKE '%tracker%' OR LOWER(name) LIKE '%rastrear%') AND (LOWER(name) LIKE '%alimento%' OR LOWER(name) LIKE '%comida%' OR LOWER(name) LIKE '%food%');

UPDATE templates_nutrition
SET slug = 'planilha-metas-semanais'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'planilha'
  AND ((LOWER(name) LIKE '%metas%' OR LOWER(name) LIKE '%objetivos%') AND (LOWER(name) LIKE '%semanal%' OR LOWER(name) LIKE '%semana%'));

UPDATE templates_nutrition
SET slug = 'planilha-tabela-bem-estar'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'planilha'
  AND ((LOWER(name) LIKE '%tabela%' OR LOWER(name) LIKE '%tabela%') AND (LOWER(name) LIKE '%bem-estar%' OR LOWER(name) LIKE '%bem estar%' OR LOWER(name) LIKE '%wellness%'));

UPDATE templates_nutrition
SET slug = 'guia-hidratacao'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'planilha'
  AND LOWER(name) LIKE '%guia%' AND (LOWER(name) LIKE '%hidratação%' OR LOWER(name) LIKE '%hidratacao%' OR LOWER(name) LIKE '%água%' OR LOWER(name) LIKE '%agua%');

UPDATE templates_nutrition
SET slug = 'template-desafio-21dias'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'planilha'
  AND LOWER(name) LIKE '%desafio%' AND (LOWER(name) LIKE '%21%' OR LOWER(name) LIKE '%vinte e um%' OR LOWER(name) LIKE '%vinte e um dias%');

UPDATE templates_nutrition
SET slug = 'template-desafio-7dias'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'planilha'
  AND LOWER(name) LIKE '%desafio%' AND (LOWER(name) LIKE '%7%' OR LOWER(name) LIKE '%sete%' OR LOWER(name) LIKE '%sete dias%');

UPDATE templates_nutrition
SET slug = 'cardapio-detox'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'planilha'
  AND (LOWER(name) LIKE '%cardápio%' OR LOWER(name) LIKE '%cardapio%') AND LOWER(name) LIKE '%detox%';

UPDATE templates_nutrition
SET slug = 'template-receitas'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'planilha'
  AND (LOWER(name) LIKE '%receita%' OR LOWER(name) LIKE '%recipe%');

UPDATE templates_nutrition
SET slug = 'infografico-educativo'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'planilha'
  AND (LOWER(name) LIKE '%infográfico%' OR LOWER(name) LIKE '%infografico%' OR LOWER(name) LIKE '%infographic%');

UPDATE templates_nutrition
SET slug = 'checklist-detox'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'planilha'
  AND LOWER(name) LIKE '%checklist%' AND LOWER(name) LIKE '%detox%';

UPDATE templates_nutrition
SET slug = 'checklist-alimentar'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'planilha'
  AND LOWER(name) LIKE '%checklist%' AND (LOWER(name) LIKE '%alimentar%' OR LOWER(name) LIKE '%alimento%');

UPDATE templates_nutrition
SET slug = 'template-avaliacao-inicial'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'planilha'
  AND (LOWER(name) LIKE '%avaliação inicial%' OR LOWER(name) LIKE '%avaliacao inicial%' OR LOWER(name) LIKE '%initial assessment%');

UPDATE templates_nutrition
SET slug = 'template-story-interativo'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND type = 'planilha'
  AND (LOWER(name) LIKE '%story interativo%' OR LOWER(name) LIKE '%interactive story%' OR LOWER(name) LIKE '%história interativa%');

UPDATE templates_nutrition
SET slug = 'formulario-recomendacao'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (LOWER(name) LIKE '%formulário%' OR LOWER(name) LIKE '%formulario%') AND LOWER(name) LIKE '%recomenda%';

-- EBOOKS/GUIAS
UPDATE templates_nutrition
SET slug = 'ebook-guia-completo'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (LOWER(name) LIKE '%ebook%' OR LOWER(name) LIKE '%e-book%' OR LOWER(name) LIKE '%guia completo%' OR LOWER(name) LIKE '%guia%' AND LOWER(name) LIKE '%completo%');

UPDATE templates_nutrition
SET slug = 'mini-guia'
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (LOWER(name) LIKE '%mini guia%' OR LOWER(name) LIKE '%mini-guia%' OR LOWER(name) LIKE '%guia rápido%' OR LOWER(name) LIKE '%guia rapido%');

-- 8. GARANTIR QUE TODOS OS TEMPLATES TENHAM SLUG (fallback final)
UPDATE templates_nutrition
SET slug = gerar_slug_limpo(name)
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '');

-- 9. VERIFICAÇÃO FINAL
SELECT 
  '✅ RESULTADO FINAL' as status,
  COUNT(*) as total_templates,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inativos,
  COUNT(CASE WHEN slug IS NULL OR slug = '' THEN 1 END) as sem_slug,
  COUNT(CASE WHEN slug LIKE '-%' OR slug LIKE '%-' THEN 1 END) as slugs_malformados
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt';

-- 10. LISTAR TODOS OS TEMPLATES COM SLUGS CORRIGIDOS
SELECT 
  id,
  name,
  slug,
  type,
  is_active,
  CASE 
    WHEN slug IS NULL OR slug = '' THEN '❌ SEM SLUG'
    WHEN slug LIKE '-%' OR slug LIKE '%-' THEN '⚠️ SLUG MALFORMADO'
    ELSE '✅ OK'
  END as status_slug
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
ORDER BY is_active DESC, type, name;

-- 11. CONTAGEM POR TIPO
SELECT 
  type,
  COUNT(*) as total,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inativos
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
GROUP BY type
ORDER BY type;

-- 12. LIMPAR FUNÇÃO AUXILIAR (opcional, se não quiser manter)
-- DROP FUNCTION IF EXISTS gerar_slug_limpo(TEXT);

