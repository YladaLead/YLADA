-- =====================================================
-- RESTAURAR TODOS OS 52 TEMPLATES WELLNESS ORIGINAIS
-- =====================================================
-- Este script:
-- 1. Executa a migração original dos 52 templates
-- 2. Aplica slugs limpos para todos
-- 3. Garante que nenhum template seja perdido
-- =====================================================

-- PRIMEIRO: Executar o arquivo migrar-38-templates-wellness.sql completo
-- (Este arquivo contém todos os 52 templates originais)

-- SEGUNDO: Aplicar slugs limpos após a migração
-- Garantir que a coluna slug existe
ALTER TABLE templates_nutrition 
ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

-- Função auxiliar para gerar slug limpo
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

-- Gerar slugs limpos para todos os templates Wellness
UPDATE templates_nutrition
SET slug = gerar_slug_limpo(name)
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (slug IS NULL OR slug = '' OR slug LIKE '-%' OR slug LIKE '%-');

-- Aplicar padronização específica de slugs
-- Calculadoras
UPDATE templates_nutrition
SET slug = 'calc-imc'
WHERE profession = 'wellness' AND language = 'pt' AND name = 'Calculadora de IMC';

UPDATE templates_nutrition
SET slug = 'calc-proteina'
WHERE profession = 'wellness' AND language = 'pt' AND name = 'Calculadora de Proteína';

UPDATE templates_nutrition
SET slug = 'calc-hidratacao'
WHERE profession = 'wellness' AND language = 'pt' AND name = 'Calculadora de Água';

UPDATE templates_nutrition
SET slug = 'calc-calorias'
WHERE profession = 'wellness' AND language = 'pt' AND name = 'Calculadora de Calorias';

-- Quizzes principais
UPDATE templates_nutrition
SET slug = 'quiz-perfil-nutricional'
WHERE profession = 'wellness' AND language = 'pt' AND name = 'Quiz de Perfil Nutricional';

UPDATE templates_nutrition
SET slug = 'quiz-perfil-bem-estar'
WHERE profession = 'wellness' AND language = 'pt' AND name = 'Quiz: Perfil de Bem-Estar';

UPDATE templates_nutrition
SET slug = 'quiz-alimentacao-saudavel'
WHERE profession = 'wellness' AND language = 'pt' AND name = 'Quiz: Alimentação Saudável';

UPDATE templates_nutrition
SET slug = 'quiz-ganhos'
WHERE profession = 'wellness' AND language = 'pt' AND name = 'Quiz: Ganhos e Prosperidade';

UPDATE templates_nutrition
SET slug = 'quiz-potencial'
WHERE profession = 'wellness' AND language = 'pt' AND name = 'Quiz: Potencial e Crescimento';

UPDATE templates_nutrition
SET slug = 'quiz-proposito'
WHERE profession = 'wellness' AND language = 'pt' AND name = 'Quiz: Propósito e Equilíbrio';

UPDATE templates_nutrition
SET slug = 'quiz-parasitas'
WHERE profession = 'wellness' AND language = 'pt' AND name = 'Quiz: Diagnóstico de Parasitas';

UPDATE templates_nutrition
SET slug = 'quiz-interativo'
WHERE profession = 'wellness' AND language = 'pt' AND name = 'Quiz Interativo';

UPDATE templates_nutrition
SET slug = 'quiz-sono-energia'
WHERE profession = 'wellness' AND language = 'pt' AND name = 'Avaliação do Sono e Energia';

UPDATE templates_nutrition
SET slug = 'quiz-fome-emocional'
WHERE profession = 'wellness' AND language = 'pt' AND name = 'Avaliação de Fome Emocional';

-- Planilhas principais
UPDATE templates_nutrition
SET slug = 'planilha-diario-alimentar'
WHERE profession = 'wellness' AND language = 'pt' AND name = 'Diário Alimentar';

UPDATE templates_nutrition
SET slug = 'planilha-rastreador-alimentos'
WHERE profession = 'wellness' AND language = 'pt' AND name = 'Rastreador de Alimentos';

UPDATE templates_nutrition
SET slug = 'planilha-tabela-bem-estar'
WHERE profession = 'wellness' AND language = 'pt' AND name = 'Tabela Bem-Estar Diário';

UPDATE templates_nutrition
SET slug = 'guia-hidratacao'
WHERE profession = 'wellness' AND language = 'pt' AND name = 'Guia de Hidratação';

UPDATE templates_nutrition
SET slug = 'planilha-metas-semanais'
WHERE profession = 'wellness' AND language = 'pt' AND name = 'Metas Semanais';

UPDATE templates_nutrition
SET slug = 'template-desafio-21dias'
WHERE profession = 'wellness' AND language = 'pt' AND name = 'Desafio 21 Dias';

UPDATE templates_nutrition
SET slug = 'template-desafio-7dias'
WHERE profession = 'wellness' AND language = 'pt' AND name = 'Desafio 7 Dias';

UPDATE templates_nutrition
SET slug = 'cardapio-detox'
WHERE profession = 'wellness' AND language = 'pt' AND name = 'Cardápio Detox';

UPDATE templates_nutrition
SET slug = 'template-receitas'
WHERE profession = 'wellness' AND language = 'pt' AND name = 'Receitas Saudáveis';

UPDATE templates_nutrition
SET slug = 'infografico-educativo'
WHERE profession = 'wellness' AND language = 'pt' AND name = 'Infográfico';

UPDATE templates_nutrition
SET slug = 'planilha-meal-planner'
WHERE profession = 'wellness' AND language = 'pt' AND name = 'Planejador Semanal';

UPDATE templates_nutrition
SET slug = 'checklist-detox'
WHERE profession = 'wellness' AND language = 'pt' AND name = 'Checklist Detox';

UPDATE templates_nutrition
SET slug = 'checklist-alimentar'
WHERE profession = 'wellness' AND language = 'pt' AND name = 'Checklist Alimentar';

-- Verificação final
SELECT 
  '✅ RESULTADO FINAL' as status,
  COUNT(*) as total_templates,
  COUNT(CASE WHEN is_active = true THEN 1 END) as ativos,
  COUNT(CASE WHEN slug IS NULL OR slug = '' THEN 1 END) as sem_slug,
  COUNT(CASE WHEN slug LIKE '-%' OR slug LIKE '%-' THEN 1 END) as slugs_malformados
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt';

-- Listar todos os templates restaurados
SELECT 
  name as nome,
  slug,
  type as tipo,
  is_active as ativo
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
ORDER BY type, name;

-- Limpar função auxiliar (opcional)
-- DROP FUNCTION IF EXISTS gerar_slug_limpo(TEXT);

